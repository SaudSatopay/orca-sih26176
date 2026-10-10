"""Know when NOT to decide: the data-sufficiency safety gate.

Before ORCA tells a fisher to go, it checks that the evidence behind the answer
is present and fresh. The mentor's brief names four scenarios that must pass
from a clean start; they are the `test_scenario_*` functions below:

    1. healthy      every critical input fresh   -> the existing verdict, GO
    2. stale        the wave forecast is 4 h old -> CAUTION, degraded confidence
    3. unavailable  the marine feed is silent    -> INSUFFICIENT DATA, nothing invented
    4. recovery     the feed comes back          -> GO again, no restart

and one law that must hold under all of them: no data problem can lower an
official-warning safety floor.

    python -m pytest backend/tests/test_safety_gate.py -v
"""
from __future__ import annotations

from datetime import timedelta

import pytest

from app import config
from app.data import demo_store, feeds
from app.data.feeds import FeedStatus
from app.services import data_health


def now():
    """The frozen test clock (conftest pins `now_ist` to 1 Oct 2026, 14:00 IST)."""
    return demo_store.now_ist()


def _feed(age_s=None, *, available=True, error=None, note=None, feed="marine"):
    seen = None if age_s is None else now() - timedelta(seconds=age_s)
    return FeedStatus(feed, "DEMO", available, seen, error, note)


# ---- thresholds and critical inputs live in one configurable place ----------

def test_every_input_has_a_policy_and_the_critical_four_are_marked():
    assert set(config.DATA_HEALTH.inputs) == {"wave", "wind", "warnings", "position",
                                              "rain", "current"}
    assert config.DATA_HEALTH.critical_inputs() == ["wave", "wind", "warnings", "position"]
    wave = config.DATA_HEALTH.inputs["wave"]
    assert (wave.fresh_s, wave.max_age_s, wave.feed) == (3 * 3600, 6 * 3600, "marine")
    assert config.DATA_HEALTH.inputs["warnings"].fresh_s == 3600
    assert config.DATA_HEALTH.inputs["position"].fresh_s is None  # bundled, static


def test_a_freshness_limit_can_be_set_from_the_environment(monkeypatch):
    monkeypatch.setenv("ORCA_FRESH_WAVE_S", "7200")
    monkeypatch.setenv("ORCA_MAXAGE_WAVE_S", "not-a-number")
    cfg = config.DataHealthConfig()
    assert cfg.inputs["wave"].fresh_s == 7200
    assert cfg.inputs["wave"].max_age_s == 6 * 3600  # a bad value keeps the default


# ---- the four deterministic data drills -------------------------------------

def test_the_four_drills_exist_and_unknown_names_are_refused():
    assert list(feeds.DRILLS) == ["healthy", "stale", "unavailable", "recovery"]
    assert feeds.active_drill() == "healthy"
    with pytest.raises(ValueError):
        feeds.set_drill("chaos")
    assert feeds.active_drill() == "healthy"


def test_drills_set_only_the_marine_feeds_age_or_absence():
    feeds.set_drill("healthy")
    assert feeds.demo_feed("marine", now()).observed_at == now() - timedelta(minutes=18)
    feeds.set_drill("stale")
    assert feeds.demo_feed("marine", now()).observed_at == now() - timedelta(hours=4, minutes=10)
    feeds.set_drill("unavailable")
    silent = feeds.demo_feed("marine", now())
    assert (silent.available, silent.observed_at, silent.error) == (False, None, "no_response")
    feeds.set_drill("recovery")
    back = feeds.demo_feed("marine", now())
    assert back.available and back.note == "reconnected"
    # weather and warnings stay healthy in every drill: one cause at a time
    for name in feeds.DRILLS:
        feeds.set_drill(name)
        assert feeds.demo_feed("weather", now()).available
        assert feeds.demo_feed("warnings", now()).available


# ---- the data-health check ---------------------------------------------------

@pytest.mark.parametrize("age_s,status,usable", [
    (0, "FRESH", True),
    (3 * 3600, "FRESH", True),          # at the limit is still fresh
    (3 * 3600 + 1, "STALE", True),      # past it: stale, still usable with caution
    (6 * 3600, "STALE", True),
    (6 * 3600 + 1, "STALE", False),     # past the maximum age: unusable
])
def test_age_is_judged_against_the_inputs_limits(age_s, status, usable):
    h = data_health.check("wave", _feed(age_s), now())
    assert (h.status, h.usable, h.age_seconds, h.critical, h.available) == (
        status, usable, age_s, True, True)
    assert (h.freshness_limit_seconds, h.max_age_seconds) == (3 * 3600, 6 * 3600)
    assert h.observed_at == (now() - timedelta(seconds=age_s)).isoformat(timespec="seconds")


def test_a_feed_that_did_not_answer_is_missing_and_unusable():
    h = data_health.check("wave", _feed(available=False, error="no_response"), now())
    assert (h.status, h.available, h.usable, h.observed_at, h.age_seconds) == (
        "MISSING", False, False, None, None)
    assert "did not respond" in h.detail


def test_a_provider_error_is_reported_as_error():
    h = data_health.check("wave", _feed(available=False, error="provider_error"), now())
    assert (h.status, h.usable) == ("ERROR", False)


def test_a_reading_without_a_timestamp_cannot_be_shown_to_be_fresh():
    h = data_health.check("wave", FeedStatus("marine", "DEMO", True, None), now())
    assert (h.status, h.usable) == ("STALE", False)


def test_a_timestamp_from_the_future_is_not_trusted():
    future = FeedStatus("marine", "DEMO", True, now() + timedelta(hours=2))
    h = data_health.check("wave", future, now())
    assert (h.status, h.usable) == ("ERROR", False)
    # a few minutes of clock skew is tolerated
    skew = FeedStatus("marine", "DEMO", True, now() + timedelta(minutes=3))
    assert data_health.check("wave", skew, now()).status == "FRESH"


def test_the_bundled_chart_layer_is_static_and_fresh():
    h = data_health.check("position", feeds.chart_feed(), now())
    assert (h.status, h.usable, h.freshness_limit_seconds, h.age_seconds) == (
        "FRESH", True, None, None)


def test_a_live_stand_in_counts_as_missing():
    standin = FeedStatus("marine", "DEMO", True, now(), None, "standin")
    h = data_health.check("wave", standin, now(), mode="LIVE")
    assert (h.status, h.usable) == ("MISSING", False)


def test_complete_accounts_for_every_input_and_fills_the_absent_ones():
    got = data_health.complete([data_health.check("wave", _feed(60), now())])
    assert [h.input for h in got] == ["wave", "wind", "warnings", "position", "rain", "current"]
    assert {h.input: h.status for h in got if h.input != "wave"} == dict.fromkeys(
        ["wind", "warnings", "position", "rain", "current"], "MISSING")
    assert all(not h.usable for h in got if h.input != "wave")


def test_ages_print_the_same_numbers_in_every_language():
    texts = {lang: data_health.age_text(4 * 3600 + 600, lang) for lang in ("en", "hi", "mr")}
    assert texts["en"] == "4 h 10 min"
    for lang, text in texts.items():
        assert "4" in text and "10" in text, lang


# ---- the agents report the health of what they delivered --------------------

from app.agents import cyclone_agent, gis_agent, ocean_agent, weather_agent  # noqa: E402
from app.schemas import Location  # noqa: E402

GOA = Location(name="Panaji (Goa)", latitude=15.49, longitude=73.82, state="Goa")


def test_a_healthy_ocean_reading_is_unchanged_and_fresh():
    r = ocean_agent.run(GOA, now())
    assert r.data["wave_height_m"] is not None and r.unavailable == []
    assert {h.input: h.status for h in r.health} == {"wave": "FRESH", "current": "FRESH"}
    assert r.health[0].age_seconds == 18 * 60


def test_a_marine_outage_invents_no_wave_height():
    feeds.set_drill("unavailable")
    r = ocean_agent.run(GOA, now())
    assert r.ok, "the agent itself still reports — it just has no reading"
    for key in ("wave_height_m", "wave_period_s", "sea_state", "sst_c", "current_speed_ms"):
        assert r.data[key] is None, key
    assert r.unavailable, "the trace marks the agent degraded"
    assert {h.input: h.status for h in r.health} == {"wave": "MISSING", "current": "MISSING"}


def test_every_safety_agent_reports_its_inputs():
    reported = {h.input for a in (weather_agent.run(GOA, now()), ocean_agent.run(GOA, now()),
                                  cyclone_agent.run(GOA, now()), gis_agent.run(GOA, now()))
                for h in a.health}
    assert reported == {"wave", "wind", "warnings", "position", "rain", "current"}


def test_agents_write_the_health_in_the_readers_language():
    h = ocean_agent.run(GOA, now(), "mr").health[0]
    assert h.label == "लाटांची उंची" and "मिनिटे" in h.detail


# ---- the gate's table: deterministic, small, explicit ------------------------

import re  # noqa: E402

from app.schemas import RiskAssessment  # noqa: E402
from app.services import safety_gate  # noqa: E402

GOA_Q = "Is it safe to go fishing tomorrow morning near Goa?"
MUMBAI_6AM = "Can I go fishing tomorrow at 6 AM near Mumbai?"
PARADIP = "Is there a cyclone near Paradip? Can I go fishing?"


def _risk(go=True):
    return RiskAssessment(score=9 if go else 70, category="LOW" if go else "HIGH",
                          factors=[], go=go, official_warning=not go)


def _health(**status_by_input):
    """A full, healthy set of records, with some inputs forced to a status."""
    records = [data_health.check(k, _feed(60), now()) for k in ("wave", "wind", "warnings",
                                                                  "rain", "current")]
    records.append(data_health.check("position", feeds.chart_feed(), now()))
    out = []
    for h in data_health.complete(records):
        status = status_by_input.get(h.input)
        if status:
            h = h.model_copy(update={"status": status, "usable": status in ("FRESH", "STALE"),
                                     "age_seconds": 4 * 3600 + 600 if status == "STALE"
                                     else h.age_seconds})
        out.append(h)
    return out


@pytest.mark.parametrize("go,forced,state,confidence", [
    (True, {}, "GO", "normal"),
    (True, {"wave": "STALE"}, "CAUTION", "degraded"),
    (True, {"wave": "MISSING"}, "INSUFFICIENT_DATA", "insufficient"),
    (True, {"warnings": "MISSING"}, "INSUFFICIENT_DATA", "insufficient"),
    (True, {"wind": "ERROR"}, "INSUFFICIENT_DATA", "insufficient"),
    (True, {"wave": "STALE", "wind": "MISSING"}, "INSUFFICIENT_DATA", "insufficient"),
    (True, {"rain": "MISSING", "current": "MISSING"}, "GO", "normal"),  # supporting only
    (False, {}, "NO_GO", "normal"),
    (False, {"wave": "MISSING"}, "NO_GO", "insufficient"),
    (False, {"wind": "STALE"}, "NO_GO", "degraded"),
])
def test_the_gate_table(go, forced, state, confidence):
    d = safety_gate.decide(_risk(go), _health(**forced), now())
    assert (d.state, d.confidence, d.risk_go) == (state, confidence, go)


def test_go_needs_every_critical_input_fresh():
    for key in config.DATA_HEALTH.critical_inputs():
        for status in ("STALE", "MISSING", "ERROR"):
            d = safety_gate.decide(_risk(True), _health(**{key: status}), now())
            assert d.state != "GO", (key, status)


def test_an_unreported_critical_input_blocks_like_a_missing_one():
    only_wave = [data_health.check("wave", _feed(60), now())]
    d = safety_gate.decide(_risk(True), only_wave, now())
    assert d.state == "INSUFFICIENT_DATA"
    assert d.blocking_inputs == ["wind", "warnings", "position"]


def test_no_risk_result_is_insufficient_never_go():
    d = safety_gate.decide(None, _health(), now())
    assert (d.state, d.risk_go) == ("INSUFFICIENT_DATA", None)


def test_the_gate_never_touches_the_risk_assessment():
    risk = _risk(True)
    before = risk.model_dump()
    safety_gate.decide(risk, _health(wave="MISSING"), now())
    assert risk.model_dump() == before


# ---- the four required scenarios ------------------------------------------------

def test_scenario_1_healthy_data_keeps_the_existing_verdict(ask):
    r = ask(GOA_Q)
    assert (r.risk.score, r.risk.category, r.risk.go) == (9, "LOW", True)
    assert (r.decision.state, r.decision.confidence) == ("GO", "normal")
    assert r.decision.blocking_inputs == [] and r.decision.stale_inputs == []
    assert len(r.data_health) == 6 and all(h.status == "FRESH" for h in r.data_health)
    labels = [e.label for e in r.evidence]
    assert "Safety gate" in labels and "Freshness · Wave height" in labels
    assert r.answer.startswith("Conditions look safe. Risk score: 9/100.")


def test_scenario_2_stale_marine_data_is_not_presented_as_fresh(ask):
    feeds.set_drill("stale")
    r = ask(GOA_Q)
    assert (r.decision.state, r.decision.confidence) == ("CAUTION", "degraded")
    assert r.decision.stale_inputs == ["wave"]
    assert r.risk.score == 9                     # the same sea, the same number
    assert any("4 h 10 min" in reason for reason in r.decision.reasons)
    assert r.answer.startswith("Caution")
    wave = next(h for h in r.data_health if h.input == "wave")
    assert (wave.status, wave.age_seconds, wave.usable) == ("STALE", 4 * 3600 + 600, True)


def test_scenario_3_missing_marine_data_fails_safe_and_invents_nothing(ask):
    feeds.set_drill("unavailable")
    r = ask(GOA_Q)
    assert (r.decision.state, r.decision.confidence) == ("INSUFFICIENT_DATA", "insufficient")
    assert r.decision.blocking_inputs == ["wave"]
    labels = [e.label for e in r.evidence]
    assert "Wave height" not in labels, "no wave reading may be invented"
    assert "Risk score" not in r.answer
    assert "official advisory" in r.answer.lower()
    assert next(t for t in r.trace if t.agent == "ocean").status == "degraded"
    wave = next(h for h in r.data_health if h.input == "wave")
    assert (wave.status, wave.available, wave.observed_at) == ("MISSING", False, None)


def test_scenario_4_recovery_returns_to_normal_without_a_restart(ask):
    feeds.set_drill("unavailable")
    assert ask(GOA_Q).decision.state == "INSUFFICIENT_DATA"
    feeds.set_drill("recovery")                  # same process, same chat session
    r = ask(GOA_Q)
    assert (r.decision.state, r.decision.confidence) == ("GO", "normal")
    assert (r.risk.score, r.risk.category) == (9, "LOW")
    assert any("reconnected" in reason for reason in r.decision.reasons)


# ---- the law: no data problem can lower an official-warning floor ---------------

@pytest.mark.parametrize("drill", list(feeds.DRILLS))
@pytest.mark.parametrize("question,score,category", [
    (MUMBAI_6AM, 70, "HIGH"), (PARADIP, 92, "EXTREME")])
def test_official_warning_floors_hold_under_every_drill(ask, drill, question, score, category):
    feeds.set_drill(drill)
    r = ask(question)
    assert (r.risk.score, r.risk.category) == (score, category)
    assert r.risk.official_warning and r.risk.overrides
    assert r.decision.state == "NO_GO"


# ---- every word of the gate in the reader's language -----------------------------

ALLOWED = {"ORCA", "IMD", "INCOIS", "MOSDAC", "ISRO", "OpenStreetMap", "Open-Meteo",
           "Marine", "PFZ", "IST", "km", "m", "h", "s", "mg", "C"}


@pytest.mark.parametrize("lang", ["hi", "mr"])
@pytest.mark.parametrize("drill", list(feeds.DRILLS))
def test_the_gate_speaks_the_readers_language(ask, lang, drill):
    feeds.set_drill(drill)
    r = ask(GOA_Q, language=lang)
    texts = [r.decision.headline, *r.decision.reasons, r.answer,
             *(e.value for e in r.evidence), *(e.source for e in r.evidence),
             *(h.label for h in r.data_health), *(h.detail for h in r.data_health)]
    for text in texts:
        leftover = set(re.findall(r"[A-Za-z][A-Za-z\-]*", text)) - ALLOWED
        assert not leftover, f"{drill}/{lang}: untranslated {sorted(leftover)} in {text!r}"


# ---- Today's outlook follows the gate --------------------------------------------

from types import SimpleNamespace  # noqa: E402

import httpx  # noqa: E402

from app.data import live_client  # noqa: E402
from app.services import plain_language  # noqa: E402

GOA_SEA = {"lat": 15.40, "lon": 73.70}


@pytest.mark.parametrize("drill,state", [("healthy", "GO"), ("stale", "CAUTION"),
                                         ("unavailable", "INSUFFICIENT_DATA"),
                                         ("recovery", "GO")])
def test_today_outlook_carries_the_gate(client, drill, state):
    feeds.set_drill(drill)
    j = client.get("/api/fishing", params=GOA_SEA).json()
    assert j["decision"]["state"] == state
    assert [h["input"] for h in j["data_health"]] == ["wave", "wind", "warnings", "position",
                                                      "rain", "current"]
    if state in ("CAUTION", "INSUFFICIENT_DATA"):
        # the spoken plan's first sentence is the gate's, in place of "You can go today."
        assert j["advice"][0] == plain_language.gate_line(state, "en")
    else:
        assert j["advice"][0] == "You can go today."


def test_today_keeps_its_advice_line_count_when_only_the_age_changes(client):
    healthy = client.get("/api/fishing", params=GOA_SEA).json()["advice"]
    feeds.set_drill("stale")
    stale = client.get("/api/fishing", params=GOA_SEA).json()["advice"]
    assert len(stale) == len(healthy), "todayModel.splitAdvice cuts the list by count"
    assert stale[1:] == healthy[1:]


@pytest.mark.parametrize("lang", ["hi", "mr"])
def test_todays_gate_line_is_translated(client, lang):
    feeds.set_drill("unavailable")
    j = client.get("/api/fishing", params={**GOA_SEA, "lang": lang}).json()
    line = j["advice"][0]
    assert line == plain_language.gate_line("INSUFFICIENT_DATA", lang)
    assert not set(re.findall(r"[A-Za-z][A-Za-z\-]*", line)) - ALLOWED


# ---- the config API and the drill switch -----------------------------------------

def test_config_shows_the_freshness_limits_and_the_drill(client):
    j = client.get("/api/config").json()
    assert j["data_health"]["wave"] == {"label": "Wave height", "feed": "marine",
                                        "critical": True, "fresh_s": 10800, "max_age_s": 21600}
    assert j["data_health"]["position"]["fresh_s"] is None
    assert j["drill"] == "healthy"


def test_the_drill_switch_works_at_runtime_and_refuses_nonsense(client):
    r = client.post("/api/config/data-health", json={"drill": "stale"})
    assert r.status_code == 200 and r.json()["drill"] == "stale"
    assert feeds.active_drill() == "stale"
    got = client.get("/api/config/data-health").json()
    assert got["drill"] == "stale" and got["drills"] == list(feeds.DRILLS)
    assert client.post("/api/config/data-health", json={"drill": "chaos"}).status_code == 400
    assert feeds.active_drill() == "stale", "a refused switch changes nothing"


@pytest.mark.parametrize("method,path,params", [
    ("get", "/api/fishing", GOA_SEA),
    ("get", "/api/risk", GOA_SEA),
    ("get", "/api/risk/timeline", GOA_SEA),
    ("get", "/api/forecast", GOA_SEA),
    ("get", "/api/position", GOA_SEA),
    ("get", "/api/alerts", GOA_SEA),
    ("get", "/api/authority/dashboard", {}),
    ("get", "/api/map/pfz", GOA_SEA),
    ("post", "/api/routes", {"start_lat": 15.40, "start_lon": 73.70,
                             "dest_lat": 15.20, "dest_lon": 73.40}),
])
def test_every_endpoint_survives_a_marine_outage(client, method, path, params):
    feeds.set_drill("unavailable")
    if method == "get":
        r = client.get(path, params=params)
    else:
        r = client.post(path, json=params)
    assert r.status_code == 200, r.text[:300]


# ---- LIVE mode recovers by itself -------------------------------------------------

class _FakeProvider:
    """Open-Meteo stand-in: down until `up` is set, then three days of calm sea."""

    def __init__(self):
        self.up = False
        self.calls = 0

    def get(self, url, params=None):
        self.calls += 1
        if not self.up:
            raise httpx.ConnectError("no route to host")
        days = ("2026-10-01", "2026-10-02", "2026-10-03")
        hours = [f"{d}T{h:02d}:00" for d in days for h in range(24)]
        n = len(hours)
        if "marine" in url:
            hourly = {"time": hours, "wave_height": [0.7] * n, "wave_period": [8.0] * n,
                      "sea_surface_temperature": [28.5] * n}
        else:
            hourly = {"time": hours, "temperature_2m": [29.0] * n, "wind_speed_10m": [12.0] * n,
                      "wind_direction_10m": [270.0] * n,
                      "precipitation_probability": [5.0] * n, "visibility": [15000.0] * n}
        return SimpleNamespace(raise_for_status=lambda: None, json=lambda: {"hourly": hourly})


def test_live_outage_recovers_by_itself_after_the_failure_cache_expires(monkeypatch, ask):
    provider, clock = _FakeProvider(), {"t": 1000.0}
    monkeypatch.setattr(live_client, "_http", lambda: provider)
    monkeypatch.setattr(live_client, "time", SimpleNamespace(monotonic=lambda: clock["t"]))
    live_client.clear_cache()
    config.set_data_mode("LIVE")
    try:
        down = ask(GOA_Q)
        assert down.decision.state == "INSUFFICIENT_DATA"
        assert set(down.decision.blocking_inputs) == {"wave", "wind", "warnings"}

        provider.up = True                      # the provider is back ...
        assert ask(GOA_Q).decision.state == "INSUFFICIENT_DATA"   # ... failure cached 60 s

        clock["t"] += live_client.CACHE_TTL_FAIL + 1               # ... then retried
        back = ask(GOA_Q)
        assert back.mode == "LIVE"
        assert next(h for h in back.data_health if h.input == "wave").status == "FRESH"
        assert "wave" not in back.decision.blocking_inputs, "the sea readings are back"
        # ... and the honest LIVE answer still withholds a go: there is no
        # official warnings feed in LIVE mode (no open IMD / INCOIS API), and an
        # unchecked warning is never read as "no warning".
        assert (back.decision.state, back.decision.blocking_inputs) == (
            "INSUFFICIENT_DATA", ["warnings"])
        assert any("no official warnings feed" in x for x in back.decision.reasons)
    finally:
        live_client.clear_cache()


@pytest.mark.parametrize("question", [MUMBAI_6AM, PARADIP])
def test_live_mode_never_shows_a_scripted_warning(monkeypatch, ask, question):
    # A calm live sea where the rehearsed dataset scripts an IMD warning
    # (Mumbai 06:00) or a cyclone (Paradip): LIVE must show neither.
    provider = _FakeProvider()
    provider.up = True
    monkeypatch.setattr(live_client, "_http", lambda: provider)
    live_client.clear_cache()
    config.set_data_mode("LIVE")
    try:
        r = ask(question)
        assert r.alerts == [] and r.risk.official_warning is False
        assert r.risk.score < 70, "no floor from a warning nobody issued"
        assert r.risk.window is None, "no scripted 'improves after 11:00'"
        warnings = next(h for h in r.data_health if h.input == "warnings")
        assert (warnings.status, warnings.available) == ("MISSING", False)
        assert "no official warnings feed" in warnings.detail
        assert r.decision.state == "INSUFFICIENT_DATA"
        cyclone = next(f for f in r.risk.factors if f.key == "cyclone")
        assert "No official warnings feed connected" in cyclone.detail
        assert "none" not in r.answer.split("Sources")[0]
    finally:
        live_client.clear_cache()


# ---- the authority board: the same gate for every landing centre --------------------

def test_the_authority_board_is_clean_when_the_evidence_is(client):
    j = client.get("/api/authority/dashboard").json()
    assert j["decision"] is None, "nothing to flag on fresh evidence"
    assert {row["gate"] for row in j["locations"]} <= {"GO", "NO_GO"}
    assert {row["evidence"] for row in j["locations"]} == {"fresh"}


@pytest.mark.parametrize("drill,state", [("stale", "CAUTION"), ("unavailable", "INSUFFICIENT_DATA")])
def test_the_authority_board_flags_weak_evidence_without_touching_a_score(client, drill, state):
    healthy = {r["name"]: r for r in client.get("/api/authority/dashboard").json()["locations"]}
    feeds.set_drill(drill)
    j = client.get("/api/authority/dashboard").json()
    assert j["decision"]["state"] == state
    assert j["decision"]["blocking_inputs"] or j["decision"]["stale_inputs"]
    assert len(j["data_health"]) == 6
    for row in j["locations"]:
        before = healthy[row["name"]]
        if before["official_warning"]:
            # A warned centre stays NO-GO and never drops below its warning
            # floor. A missing wave reading can lower the model's own share of
            # the score (the engine assumes a mid hazard for an unknown value),
            # which is why such a row is marked: its evidence is not complete.
            assert row["gate"] == "NO_GO"
            assert row["risk_score"] >= 70 and row["risk_category"] in ("HIGH", "EXTREME")
            assert row["evidence"] == ("missing" if state == "INSUFFICIENT_DATA" else "stale")
        else:
            assert row["gate"] == state
        if row["name"] == "Paradip":
            assert (row["risk_score"], row["gate"]) == (92, "NO_GO")
    assert j["summary"]["evidence_flagged"] == sum(
        1 for r in j["locations"] if r["gate"] in ("CAUTION", "INSUFFICIENT_DATA"))


# ---- a request may carry its own drill (stateless, serverless-safe) ------------------

def test_a_question_can_carry_its_own_drill_without_touching_the_servers(ask):
    r = ask(GOA_Q, drill="stale")
    assert (r.decision.state, r.decision.drill) == ("CAUTION", "stale")
    assert feeds.active_drill() == "healthy", "the server-wide drill is left alone"
    assert ask(GOA_Q).decision.state == "GO"


def test_todays_outlook_can_carry_its_own_drill(client):
    j = client.get("/api/fishing", params={**GOA_SEA, "drill": "unavailable"}).json()
    assert j["decision"]["state"] == "INSUFFICIENT_DATA"
    assert client.get("/api/config/data-health").json()["drill"] == "healthy"
    board = client.get("/api/authority/dashboard", params={"drill": "stale"}).json()
    assert board["decision"]["state"] == "CAUTION"


def test_an_unknown_per_request_drill_is_refused(client):
    assert client.get("/api/fishing", params={**GOA_SEA, "drill": "chaos"}).status_code == 422
    r = client.post("/api/chat", json={"message": GOA_Q, "drill": "chaos"})
    assert r.status_code == 422


def test_the_per_request_drill_reaches_the_parallel_agents(ask):
    # the specialists run in a thread pool; the drill must travel with them
    r = ask(GOA_Q, drill="unavailable")
    wave = next(h for h in r.data_health if h.input == "wave")
    assert wave.status == "MISSING"



# ---- review fixes: nothing plans a trip on a withheld verdict ----------------------

def test_today_plans_no_trip_when_the_gate_withholds(client):
    feeds.set_drill("unavailable")
    j = client.get("/api/fishing", params=GOA_SEA).json()
    assert j["decision"]["state"] == "INSUFFICIENT_DATA"
    assert (j["areas"], j["routes"], j["forecast"], j["hourly_ranking"]) == ([], [], [], [])
    assert (j["duration"], j["economics"], j["best_window"]) == (None, None, None)
    spoken = " ".join(j["advice"])
    for planning in ("Areas", "best time", "Stay there", "Tomorrow", "calmer", "rougher"):
        assert planning not in spoken, planning


def test_a_withheld_answer_offers_no_course_and_no_grounds(ask):
    feeds.set_drill("unavailable")
    r = ask("Give me the safest route to the nearest fishing zone near Goa")
    assert r.decision.state == "INSUFFICIENT_DATA"
    assert (r.pfz, r.routes) == ([], [])
    risk_row = next(t for t in r.trace if t.agent == "risk")
    assert risk_row.summary == "score withheld — evidence incomplete"


def test_a_warned_centre_with_a_missing_reading_says_the_risk_may_be_higher(ask):
    healthy = ask("Can I go fishing near Digha?")
    feeds.set_drill("unavailable")
    r = ask("Can I go fishing near Digha?", session_id="digha-down")
    assert r.decision.state == "NO_GO" and healthy.decision.state == "NO_GO"
    assert r.risk.score >= 70, "the warning floor holds"
    assert r.risk.score <= healthy.risk.score
    assert any("may be higher than shown" in x for x in r.decision.reasons)
    assert not any("cannot weaken" in x for x in r.decision.reasons)


def test_a_no_go_on_stale_readings_says_so_plainly():
    d = safety_gate.decide(_risk(False), _health(wind="STALE"), now())
    assert d.state == "NO_GO"
    assert any("out of date" in x for x in d.reasons)


def test_no_risk_result_reports_incomplete_evidence_not_stale_data():
    d = safety_gate.decide(None, _health(), now())
    assert (d.state, d.confidence) == ("INSUFFICIENT_DATA", "insufficient")
    assert d.reasons == ["The risk engine returned no result."]


def test_one_minute_is_singular_in_marathi():
    assert data_health.age_text(60, "mr") == "1 मिनिट"
    assert data_health.age_text(120, "mr") == "2 मिनिटे"
    assert data_health.age_text(60, "en") == "1 min"


def test_a_request_pins_one_drill_for_its_whole_answer(ask):
    # the server-wide drill is read once at the start of the request
    feeds.set_drill("stale")
    r = ask(GOA_Q)
    assert r.decision.drill == "stale" and r.decision.state == "CAUTION"


# ---- the safest course never runs over land -----------------------------------------

from app.services.route_optimizer import plan_routes, route_crosses_land  # noqa: E402


@pytest.mark.parametrize("origin,dest", [
    ((9.85, 76.10), (7.70, 77.60)),     # off Kochi to south of Kanyakumari (reported)
    ((21.70, 72.30), (20.65, 70.95)),   # Bhavnagar to Diu, across Saurashtra (reported)
    ((18.922, 72.835), (18.826, 72.558)),  # Mumbai harbour to area 1 (rehearsed)
])
def test_the_recommended_course_never_crosses_land(origin, dest):
    options = plan_routes(origin, dest, wave_m=1.2, wind_kmh=18)
    recommended = [o for o in options if o.recommended]
    assert len(recommended) == 1
    legs = [(l.latitude, l.longitude) for l in recommended[0].legs]
    assert not route_crosses_land(legs)
    for o in options:  # a straight line over land is labelled, never offered as a course
        if route_crosses_land([(l.latitude, l.longitude) for l in o.legs]):
            assert not o.recommended and o.penalties.get("over_land") == 1.0


# ---- know when not to decide: a place it does not know, a day it cannot see -------------

@pytest.mark.parametrize("question,place", [
    ("Can I go fishing near Malvan tomorrow?", "Malvan"),
    ("Is it safe to go out from Mangaluru today?", "Mangaluru"),
    ("मी उद्या मालवणजवळ मासेमारीला जाऊ शकतो का?", "मालवण"),
])
def test_a_place_orca_does_not_know_is_never_answered_for_mumbai(ask, question, place):
    r = ask(question)
    assert r.decision.state == "INSUFFICIENT_DATA"
    assert r.decision.blocking_inputs == ["place"]
    assert r.risk is None, "no score for a place that was never read"
    assert place in r.answer
    assert "Mumbai" not in r.answer and "मुंबई" not in r.answer


@pytest.mark.parametrize("question,days", [
    ("Is it safe to go fishing near Goa in 5 days?", 5),
    ("Can I fish near Goa next week?", 7),
    ("मी ५ दिवसांनी गोव्याजवळ मासेमारीला जाऊ शकतो का?", 5),
    ("क्या मैं अगले हफ्ते गोवा के पास मछली पकड़ सकता हूँ?", 7),
])
def test_a_day_beyond_the_forecast_is_said_out_loud(ask, question, days):
    r = ask(question)
    assert r.decision.state == "INSUFFICIENT_DATA"
    assert r.decision.blocking_inputs == ["horizon"]
    assert r.risk is None, "today's sea is not the answer for a day it cannot see"
    assert "3" in r.answer and str(days) in r.answer


def test_no_place_named_is_answered_for_the_default_harbour_and_says_so(ask):
    r = ask("Can I go fishing tomorrow morning?")
    assert r.intent.location_text == "Mumbai"
    assert "default harbour" in r.answer


@pytest.mark.parametrize("question", [
    "Is it safe to go fishing tomorrow morning near Goa?",   # a known place
    "Can I go fishing near the coast at 6 AM tomorrow?",     # no place, ordinary words
    "Answer in Marathi: is it safe near Goa?",               # a language, not a place
    "Is it safe near Goa the day after tomorrow?",           # inside the 3 days
])
def test_ordinary_questions_are_not_mistaken_for_unknown_places_or_far_days(ask, question):
    r = ask(question)
    assert r.decision.blocking_inputs in ([], ["wave"]) or r.decision.state != "INSUFFICIENT_DATA"
    assert r.risk is not None
