"""Everything printed next to a number is in the reader's language.

The written answer was translated first (test_answer_text.py). This file
covers the rest of a response: the risk factors and the reason under each,
the safety floors that fired, official warnings, geofence messages, courses,
evidence values and the crew trace. Two properties matter:

  * English is the engine's original wording, character for character;
  * the language chooses words only. Every number is identical in en, hi, mr.
"""
from __future__ import annotations

import re

import pytest

from app.agents import cyclone_agent, gis_agent, risk_agent
from app.schemas import Location
from app.services import i18n, risk_engine

DANGER = "Can I go fishing tomorrow at 6 AM near Mumbai?"
CYCLONE = "Is there a cyclone near Paradip? Can I go fishing?"
ROUTE = "Give me the safest route to the nearest fishing zone near Mumbai"
PFZ = "Show me the nearest potential fishing zones near Kochi"
SCENARIOS = [DANGER, CYCLONE, ROUTE, PFZ]

# Latin-script tokens that may stay in Hindi and Marathi: agencies and other
# proper nouns, the time zone, and the units written on every chart.
ALLOWED_LATIN = {"ORCA", "IMD", "INCOIS", "MOSDAC", "ISRO", "OpenStreetMap", "Open-Meteo",
                 "Marine", "PFZ", "IST", "km", "m", "h", "s", "kmph", "mg", "C", "DEMO", "LIVE"}


def latin_words(text: str) -> set:
    return set(re.findall(r"[A-Za-z][A-Za-z\-]*", text or ""))


def assert_translated(text: str, where: str) -> None:
    leftover = latin_words(text) - ALLOWED_LATIN
    assert not leftover, f"{where}: untranslated {sorted(leftover)} in {text!r}"


def assert_devanagari(text: str, where: str) -> None:
    assert i18n.DEVANAGARI.search(text or ""), f"{where}: no Devanagari in {text!r}"


# ---- English stays exactly as the engine always wrote it --------------------

def test_english_wording_is_unchanged(ask):
    r = ask(DANGER)
    assert r.language == "en"
    by_key = {f.key: f for f in r.risk.factors}
    assert by_key["wave"].label == "Wave height"
    assert by_key["wave"].detail == "Wave height 1.9 m"
    assert by_key["wind"].label == "Wind"
    assert by_key["wind"].detail == "Wind 29 km/h"
    assert by_key["cyclone"].label == "Official warnings"
    assert by_key["cyclone"].detail == "Fishermen advised not to venture into the sea"
    assert by_key["gis"].detail == "0 km offshore, restricted zone 7.9 km away"
    assert r.risk.overrides == ["IMD fishermen warning active — advisory overrides model output"]
    assert r.alerts[0]["headline"] == "Fishermen advised not to venture into the sea"

    # A fresh session: the route question must not inherit 06:00 from above.
    route = ask(ROUTE, session_id="english-wording-route")
    assert [o.name for o in route.routes] == ["Safest route", "Direct route"]
    assert route.routes[0].notes == "Avoids all restricted areas."
    assert route.routes[1].notes.startswith("Shortest track, but it passes through: ")
    summaries = {tr.agent: tr.summary for tr in route.trace}
    assert summaries["explanation"] == "answer composed"
    assert summaries["route"] == "36.4 km recommended"
    assert summaries["risk"] == "28/100 MODERATE"


def test_every_floor_reads_the_same_in_english():
    calm = dict(wave_height_m=0.5, wave_period_s=6.0, wind_speed_kmh=8.0,
                rain_probability_pct=5.0, lightning=False, visibility_km=12.0,
                sea_state_label="calm", current_speed_ms=0.2, alerts=[],
                distance_from_shore_km=2.0, nearest_zone_km=None, inside_zone=False,
                sources=[])
    wave = risk_engine.assess(**dict(calm, wave_height_m=4.6))
    assert wave.overrides == ["Wave height 4.6 m exceeds the 4.0 m small-craft danger threshold"]
    wind = risk_engine.assess(**dict(calm, wind_speed_kmh=70.0))
    assert wind.overrides == ["Wind 70 km/h at or above gale force"]
    zone = risk_engine.assess(**dict(calm, inside_zone=True))
    assert zone.overrides == ["Position falls inside a restricted maritime zone"]
    severe = risk_engine.assess(**dict(calm, alerts=[{
        "type": "cyclone_warning", "severity": "severe", "official": True,
        "headline": "Severe Cyclonic Storm", "source": "IMD"}]))
    assert severe.overrides == ["Official severe warning in force (IMD) — overrides model output"]


# ---- the language chooses words, never numbers ------------------------------

@pytest.mark.parametrize("question", SCENARIOS)
def test_numbers_are_identical_in_every_language(ask, question):
    en = ask(question, language="en")
    for lang in ("hi", "mr"):
        other = ask(question, language=lang)
        assert other.language == lang
        assert (other.risk.score, other.risk.category) == (en.risk.score, en.risk.category)
        assert other.risk.go == en.risk.go
        assert other.risk.official_warning == en.risk.official_warning
        assert other.risk.window == en.risk.window
        assert len(other.risk.overrides) == len(en.risk.overrides)
        assert ([(f.key, f.factor, f.weight, f.contribution) for f in other.risk.factors]
                == [(f.key, f.factor, f.weight, f.contribution) for f in en.risk.factors])
        assert ([(z.rank, z.latitude, z.longitude, z.confidence) for z in other.pfz]
                == [(z.rank, z.latitude, z.longitude, z.confidence) for z in en.pfz])
        assert ([(o.kind, o.distance_km, o.eta_minutes, o.risk_score, o.recommended)
                 for o in other.routes]
                == [(o.kind, o.distance_km, o.eta_minutes, o.risk_score, o.recommended)
                    for o in en.routes])
        assert ([(a["type"], a["severity"], a["official"]) for a in other.alerts]
                == [(a["type"], a["severity"], a["official"]) for a in en.alerts])
        assert ([(g.zone_type, g.distance_km, g.inside, g.severity) for g in other.geofence]
                == [(g.zone_type, g.distance_km, g.inside, g.severity) for g in en.geofence])


def test_assess_ignores_language_when_scoring():
    kwargs = dict(wave_height_m=2.4, wave_period_s=7.0, wind_speed_kmh=33.0,
                  rain_probability_pct=60.0, lightning=True, visibility_km=4.0,
                  sea_state_label="rough", current_speed_ms=0.9,
                  alerts=[{"type": "fishermen_warning", "severity": "moderate", "official": True,
                           "headline": "Fishermen advised not to venture into the sea",
                           "source": "IMD"}],
                  distance_from_shore_km=18.0, nearest_zone_km=6.0, inside_zone=False,
                  sources=[])
    en = risk_engine.assess(**kwargs)
    for lang in ("hi", "mr"):
        other = risk_engine.assess(lang=lang, **kwargs)
        assert other.score == en.score
        assert other.category == en.category
        assert [f.contribution for f in other.factors] == [f.contribution for f in en.factors]


# ---- nothing English is left beside the numbers -----------------------------

@pytest.mark.parametrize("lang", ["hi", "mr"])
@pytest.mark.parametrize("question", SCENARIOS)
def test_the_working_is_in_the_readers_language(ask, question, lang):
    r = ask(question, language=lang)

    for f in r.risk.factors:
        assert_devanagari(f.label, f"factor {f.key} label")
        assert_translated(f.label, f"factor {f.key} label")
        assert_translated(f.detail, f"factor {f.key} detail")
    for o in r.risk.overrides:
        assert_devanagari(o, "override")
        assert_translated(o, "override")
    for a in r.alerts:
        assert_devanagari(a["headline"], "alert headline")
        assert_translated(a["headline"], "alert headline")
        assert_translated(a["detail"], "alert detail")
        assert_translated(a.get("disclaimer", ""), "alert disclaimer")
    for g in r.geofence:
        assert_devanagari(g.message, "geofence message")
        assert_translated(g.message, "geofence message")
        assert_translated(g.zone_name, "geofence zone name")
    for o in r.routes:
        assert_devanagari(o.name, "route name")
        assert_translated(o.name, "route name")
        assert_translated(o.notes, "route notes")
    for e in r.evidence:
        assert_translated(e.value, f"evidence {e.label!r} value")
    for tr in r.trace:
        if tr.agent == "intent":
            continue  # a readback of the parser's code names
        assert_translated(tr.summary, f"trace {tr.agent}")


def test_the_marathi_danger_answer_names_the_floor_and_the_warning(ask):
    r = ask("मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?")
    assert r.language == "mr"
    assert r.risk.overrides == ["IMD चा मच्छीमार इशारा सक्रिय — सूचना मॉडेलच्या निकालापेक्षा वरचढ"]
    by_key = {f.key: f for f in r.risk.factors}
    assert by_key["wave"].detail == "लाटांची उंची 1.9 m"
    assert by_key["wind"].detail == "वारा 29 km/h"
    assert by_key["cyclone"].detail == "मच्छीमारांनी समुद्रात जाऊ नये असा सल्ला"
    assert r.alerts[0]["headline"] == "मच्छीमारांनी समुद्रात जाऊ नये असा सल्ला"
    # The simulated-data warning travels with the alert in the same language.
    assert "नमुना" in r.alerts[0]["disclaimer"]


def test_an_unknown_warning_is_shown_as_the_agency_wrote_it():
    assert i18n.alert_text("Tsunami watch — stay off the beach", "mr") == \
        "Tsunami watch — stay off the beach"
    alert = {"type": "tsunami", "severity": "severe", "official": True,
             "headline": "Tsunami watch — stay off the beach", "detail": "Move inland."}
    assert i18n.localise_alert(alert, "hi")["headline"] == alert["headline"]


def test_localising_an_alert_never_touches_what_the_engine_reads():
    loc = Location(name="Paradip", latitude=20.26, longitude=86.67, state="Odisha")
    from app.data.demo_store import now_ist
    en = cyclone_agent.run(loc, now_ist()).data
    mr = cyclone_agent.run(loc, now_ist(), "mr").data
    assert mr["official_warning_active"] == en["official_warning_active"]
    assert mr["highest_severity"] == en["highest_severity"]
    assert [a.get("storm") for a in mr["alerts"]] == [a.get("storm") for a in en["alerts"]]
    assert [a["source"] for a in mr["alerts"]] == [a["source"] for a in en["alerts"]]
    assert mr["headline"] != en["headline"]


def test_gis_keeps_the_charts_own_zone_name_for_matching():
    loc = Location(name="Mumbai", latitude=18.95, longitude=72.80, state="Maharashtra")
    from app.data.demo_store import now_ist
    en = gis_agent.run(loc, now_ist()).data
    hi = gis_agent.run(loc, now_ist(), "hi").data
    assert hi["nearest_zone_name"] == en["nearest_zone_name"]
    assert hi["zones_nearby"] == en["zones_nearby"]
    assert hi["nearest_zone_km"] == en["nearest_zone_km"]


# ---- the endpoints that take ?lang= -----------------------------------------

def test_authority_board_translates_headlines_not_figures(client):
    en = client.get("/api/authority/dashboard").json()
    mr = client.get("/api/authority/dashboard", params={"lang": "mr"}).json()
    assert mr["summary"] == en["summary"]
    figures = ["name", "risk_score", "risk_category", "official_warning",
               "wave_height_m", "wind_speed_kmh"]
    assert ([[row[k] for k in figures] for row in mr["locations"]]
            == [[row[k] for k in figures] for row in en["locations"]])
    warned = [row for row in mr["locations"] if row["headline"]]
    assert warned, "the demo coast always carries at least one warning"
    for row in warned:
        assert_devanagari(row["headline"], f"{row['name']} headline")
        assert_translated(row["headline"], f"{row['name']} headline")


@pytest.mark.parametrize("lang", ["hi", "mr"])
def test_position_check_speaks_the_readers_language(client, lang):
    # In open water, on land, and next to the Mumbai approach channel.
    for lat, lon in [(18.60, 72.20), (19.30, 73.20), (18.92, 72.78)]:
        en = client.get("/api/position", params={"lat": lat, "lon": lon}).json()
        other = client.get("/api/position", params={"lat": lat, "lon": lon, "lang": lang}).json()
        assert other["status"] == en["status"]
        assert other["nearest_zone_km"] == en["nearest_zone_km"]
        assert other["inside_restricted_zone"] == en["inside_restricted_zone"]
        assert_devanagari(other["headline"], "position headline")
        assert_translated(other["headline"], "position headline")


def test_risk_endpoint_takes_a_language(client):
    en = client.get("/api/risk", params={"lat": 18.95, "lon": 72.80}).json()["risk"]
    hi = client.get("/api/risk", params={"lat": 18.95, "lon": 72.80, "lang": "hi"}).json()["risk"]
    assert hi["score"] == en["score"]
    assert [f["contribution"] for f in hi["factors"]] == [f["contribution"] for f in en["factors"]]
    for f in hi["factors"]:
        assert_translated(f["label"], "risk endpoint label")
        assert_translated(f["detail"], "risk endpoint detail")


def test_an_unsupported_language_reads_as_english(client):
    en = client.get("/api/position", params={"lat": 18.60, "lon": 72.20}).json()
    odd = client.get("/api/position", params={"lat": 18.60, "lon": 72.20, "lang": "xx"}).json()
    assert odd["headline"] == en["headline"]
    assert i18n.coerce_language("xx") == "en"
    assert i18n.coerce_language(None) == "en"


def test_risk_agent_defaults_to_english():
    loc = Location(name="Mumbai", latitude=18.95, longitude=72.80, state="Maharashtra")
    from app.data.demo_store import now_ist
    res = risk_agent.run(loc, now_ist(), weather={"wind_speed_kmh": 20}, ocean={"wave_height_m": 1.0},
                         cyclone={}, gis={}, sources=[], mode="DEMO")
    labels = {f["key"]: f["label"] for f in res.data["factors"]}
    assert labels["wave"] == "Wave height"
