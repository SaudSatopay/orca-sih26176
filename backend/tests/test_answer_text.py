"""The written answer must agree with the chart and be fully translated (U4)."""
from __future__ import annotations

import re

import pytest

PFZ_ASK = "Show me the nearest potential fishing zones near Kochi"
DANGER_ASK = "मी उद्या सकाळी ६ वाजता मासेमारीला जाऊ शकतो का?"   # as in /api/scenarios
ROUTE_ASK = "Give me the safest route to the nearest fishing zone"

# English fragments that used to leak into Hindi and Marathi answers.
ENGLISH_LEAKS = [
    "ORCA demo dataset", "SIMULATED", "not official data",
    "ORCA geospatial layer", "OpenStreetMap derived",
    "deg C", "Updated", "confidence", "chlorophyll", "SST",
    "Demo / simulated", "Sources",
]
# Latin-script tokens that may stay: proper nouns, the time zone and units.
ALLOWED_LATIN = {"ORCA", "IMD", "INCOIS", "MOSDAC", "ISRO", "OpenStreetMap", "Open-Meteo",
                 "Marine", "PFZ", "IST", "km", "m", "h", "mg", "C"}
COMPASS = re.compile(r"\b(?:N|S|E|W|NE|NW|SE|SW|NNE|ENE|ESE|SSE|SSW|WSW|WNW|NNW)\b")

SIMULATED_MARK = {"en": "SIMULATED", "hi": "नकली", "mr": "नमुना"}
NOT_OFFICIAL_MARK = {"en": "not official", "hi": "आधिकारिक नहीं", "mr": "अधिकृत नाही"}


def latin_words(text: str) -> set:
    return set(re.findall(r"[A-Za-z][A-Za-z\-]*", text))


def assert_no_english(answer: str) -> None:
    for phrase in ENGLISH_LEAKS:
        assert phrase not in answer, f"English fragment {phrase!r} in: {answer}"
    assert not COMPASS.search(answer), f"compass abbreviation in: {answer}"
    leftover = latin_words(answer) - ALLOWED_LATIN
    assert not leftover, f"untranslated words {sorted(leftover)} in: {answer}"


# ---- (a) the chance of fish in the answer is the chart's number ------------

def _percentages(answer: str):
    return [int(p) for p in re.findall(r"(\d+)%", answer)]


def test_pfz_answer_shows_the_fishing_services_chance_for_ground_1(ask, client):
    r = ask(PFZ_ASK)
    top = r.pfz[0]
    assert top.rank == 1

    loc = r.intent.location
    areas = client.get("/api/fishing", params={"lat": loc.latitude, "lon": loc.longitude}).json()["areas"]
    same_ground = next(a for a in areas
                       if (a["latitude"], a["longitude"]) == (top.latitude, top.longitude))
    assert same_ground["rank"] == 1, "ground 1 in the answer is ground 1 on the chart"

    chance = same_ground["probability"]
    assert chance > 0
    assert round(top.confidence * 100) == chance
    assert f"{chance}%" in r.answer
    assert "0%" not in re.sub(r"\d0%", "", r.answer), "the old 'confidence 0%' is gone"
    assert _percentages(r.answer) == [chance]


def test_every_ground_in_a_chat_answer_carries_the_charts_chance(ask, client):
    r = ask(PFZ_ASK)
    loc = r.intent.location
    areas = client.get("/api/fishing", params={"lat": loc.latitude, "lon": loc.longitude}).json()["areas"]
    by_position = {(a["latitude"], a["longitude"]): a["probability"] for a in areas}
    for z in r.pfz:
        assert round(z.confidence * 100) == by_position[(z.latitude, z.longitude)]


def test_route_answer_also_carries_a_real_chance(ask):
    r = ask(ROUTE_ASK, location_name="Mumbai")
    assert r.pfz[0].confidence > 0
    assert f"{round(r.pfz[0].confidence * 100)}%" in r.answer


def test_scoring_the_chance_did_not_move_any_rehearsed_number(ask, session_id):
    # Separate sessions: a follow-up would otherwise inherit "tomorrow 06:00".
    goa = ask("Is it safe to go fishing tomorrow morning near Goa?", session_id=session_id + "-goa")
    assert goa.risk.score == 9
    assert ask(PFZ_ASK, session_id=session_id + "-pfz").risk.score == 36
    route = ask(ROUTE_ASK, location_name="Mumbai", session_id=session_id + "-route")
    assert route.risk.score == 28
    assert next(o for o in route.routes if o.recommended).distance_km == 37.3


# ---- (b) Hindi and Marathi answers contain no English sentence -------------

@pytest.mark.parametrize("lang", ["mr", "hi"])
def test_dangerous_answer_has_no_english(ask, lang):
    r = ask(DANGER_ASK, location_name="Mumbai", language=lang)
    assert r.language == lang
    assert (r.risk.score, r.risk.category) == (70, "HIGH")
    assert_no_english(r.answer)


@pytest.mark.parametrize("lang", ["mr", "hi"])
@pytest.mark.parametrize("message,place", [(PFZ_ASK, "Kochi"), (ROUTE_ASK, "Mumbai"),
                                           ("Is there a cyclone near Paradip?", "Paradip")])
def test_other_scenarios_have_no_english_either(ask, lang, message, place):
    r = ask(message, location_name=place, language=lang)
    assert_no_english(r.answer)


@pytest.mark.parametrize("lang", ["en", "hi", "mr"])
def test_simulated_data_warning_is_unmistakable_in_every_language(ask, lang):
    r = ask(DANGER_ASK, location_name="Mumbai", language=lang)
    assert SIMULATED_MARK[lang] in r.answer
    assert NOT_OFFICIAL_MARK[lang] in r.answer
    # ...and it is said twice: on the source line and as the closing sentence.
    from app.services.i18n import t
    assert t("demo_mode", lang) in r.answer
    assert r.disclaimer == t("disclaimer", lang)


@pytest.mark.parametrize("lang", ["hi", "mr"])
def test_evidence_sources_are_labelled_in_the_answer_language(ask, lang):
    r = ask(DANGER_ASK, location_name="Mumbai", language=lang)
    sources = {e.source for e in r.evidence}
    assert sources
    for source in sources:
        assert "SIMULATED" not in source and "derived" not in source
        assert not (latin_words(source) - ALLOWED_LATIN), source
    demo_rows = [e for e in r.evidence if e.label == "Wave height"]
    assert SIMULATED_MARK[lang] in demo_rows[0].source


def test_english_answer_keeps_its_wording(ask):
    r = ask(DANGER_ASK, location_name="Mumbai", language="en")
    assert "ORCA demo dataset — SIMULATED, not official data" in r.answer
    assert "ORCA geospatial layer (OpenStreetMap derived)" in r.answer
    assert "Updated 02 Oct 2026, 06:00 IST" in r.answer


def test_evidence_labels_stay_stable_for_the_frontend(ask):
    # ConditionsStrip looks rows up by these English keys.
    labels = {e.label for e in ask(DANGER_ASK, location_name="Mumbai", language="mr").evidence}
    assert {"Wave height", "Wind", "Sea state", "Rain probability", "Visibility",
            "Sea surface temperature"} <= labels
