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
