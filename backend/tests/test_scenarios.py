"""The five rehearsed scenarios and the numbers the demo is built on.

PRODUCT.md, "Must never break": Goa 9 LOW, Mumbai 06:00 70 HIGH,
Paradip 92 EXTREME. Mumbai 12:00 (37 MODERATE) is the follow-up that shows
the conversation keeps its context.
"""
from __future__ import annotations

from app.data.geo import route_zone_conflicts

MUMBAI_6AM_MR = "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?"
NOON_FOLLOW_UP_MR = "दुपारी १२ वाजता काय?"


def test_safe_scenario_goa_is_9_low(ask):
    r = ask("Is it safe to go fishing tomorrow morning near Goa?")
    assert r.intent.location_text == "Panaji (Goa)"
    assert (r.risk.score, r.risk.category) == (9, "LOW")
    assert r.risk.go is True
    assert r.risk.official_warning is False
    assert r.risk.overrides == []
    assert r.mode == "DEMO"


def test_dangerous_scenario_mumbai_6am_is_70_high(ask):
    r = ask(MUMBAI_6AM_MR)
    assert r.language == "mr"
    assert r.intent.location_text == "Mumbai"
    assert r.intent.time == "06:00"
    assert (r.risk.score, r.risk.category) == (70, "HIGH")
    assert r.risk.official_warning is True
    assert r.risk.go is False
    # Asked in Marathi, so the floor that fired is named in Marathi
    # (test_reader_language.py pins the English wording).
    assert any("मच्छीमार इशारा" in o for o in r.risk.overrides)
    assert r.risk.window == "11:00"


def test_follow_up_mumbai_noon_is_37_moderate_and_keeps_context(ask):
    first = ask(MUMBAI_6AM_MR)
    second = ask(NOON_FOLLOW_UP_MR)
    assert second.intent.location_text == "Mumbai"
    assert second.intent.time == "12:00"
    assert (second.risk.score, second.risk.category) == (37, "MODERATE")
    assert second.risk.score < first.risk.score
    assert second.risk.official_warning is False


def test_cyclone_scenario_paradip_is_92_extreme(ask):
    r = ask("Is there a cyclone near Paradip? Can I go fishing?")
    assert r.intent.location_text == "Paradip"
    assert (r.risk.score, r.risk.category) == (92, "EXTREME")
    assert r.risk.official_warning is True
    assert r.risk.go is False
    assert any("severe warning" in o for o in r.risk.overrides)
    assert r.alerts, "the cyclone alert itself must be returned for the chart"


def test_pfz_scenario_kochi_returns_ranked_grounds_outside_restricted_areas(ask):
    r = ask("Show me the nearest potential fishing zones near Kochi")
    assert r.intent.intent == "find_pfz"
    assert r.intent.location_text == "Kochi"
    assert [z.rank for z in r.pfz] == [1, 2, 3]
    for z in r.pfz:
        assert route_zone_conflicts([(z.latitude, z.longitude)] * 2) == []
        assert 0.0 < z.confidence <= 1.0
    assert "pfz" in [t.agent for t in r.trace]


def test_route_scenario_recommends_a_track_that_avoids_restricted_zones(ask):
    r = ask("Give me the safest route to the nearest fishing zone near Mumbai")
    assert r.intent.intent == "route"
    assert r.pfz and r.routes

    recommended = [o for o in r.routes if o.recommended]
    assert len(recommended) == 1
    safest = recommended[0]
    assert safest.kind == "safest"
    legs = [(leg.latitude, leg.longitude) for leg in safest.legs]
    assert route_zone_conflicts(legs) == []

    # The straight line is shorter, cuts the restricted areas, and is never
    # the one ORCA recommends.
    direct = next(o for o in r.routes if o.kind == "shortest")
    direct_legs = [(leg.latitude, leg.longitude) for leg in direct.legs]
    assert route_zone_conflicts(direct_legs), "demo relies on the direct track being blocked"
    assert direct.distance_km < safest.distance_km
    assert direct.recommended is False
    assert direct.risk_category == "EXTREME"


def test_every_answer_runs_the_explanation_agent_last(ask):
    r = ask("Is it safe near Goa tomorrow morning?")
    agents = [t.agent for t in r.trace]
    assert agents[0] == "intent"
    assert agents[-1] == "explanation"
    assert {"weather", "ocean", "cyclone", "gis", "risk"} <= set(agents)
    assert all(t.status == "ok" for t in r.trace)
