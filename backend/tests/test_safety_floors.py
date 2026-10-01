"""The deterministic safety floors.

A floor can only RAISE a score. No weighted model output can talk the system
down from an official warning, and a floor never caps a score that the model
already put higher.
"""
from __future__ import annotations

import itertools

import pytest

from app.config import RISK
from app.services import risk_engine

CALM = dict(
    wave_height_m=0.4, wave_period_s=8.0, wind_speed_kmh=8.0,
    rain_probability_pct=5.0, lightning=False, visibility_km=14.0,
    sea_state_label="calm", current_speed_ms=0.2, alerts=[],
    distance_from_shore_km=2.0, nearest_zone_km=None, inside_zone=False,
    sources=["DEMO"],
)
VIOLENT = dict(CALM, wave_height_m=6.5, wind_speed_kmh=110.0, rain_probability_pct=95.0,
               lightning=True, visibility_km=1.0, sea_state_label="phenomenal",
               current_speed_ms=2.4, distance_from_shore_km=90.0)

SEVERE = {"type": "cyclone", "severity": "severe", "official": True,
          "headline": "Severe Cyclonic Storm", "source": "IMD"}
FISHERMEN = {"type": "fishermen_warning", "severity": "moderate", "official": True,
             "headline": "Fishermen advised not to venture into the sea", "source": "IMD"}


def assess(base=CALM, **overrides):
    return risk_engine.assess(**dict(base, **overrides))


def weighted_sum(assessment) -> float:
    return sum(f.contribution for f in assessment.factors)


def test_floor_values_are_the_documented_ones():
    assert RISK.severe_warning_floor == 92
    assert RISK.fishermen_warning_floor == 70
    assert RISK.restricted_zone_floor == 60
    assert abs(sum(RISK.weights.values()) - 1.0) < 1e-9


def test_calm_sea_with_no_warning_has_no_override():
    a = assess()
    assert a.category == "LOW"
    assert a.overrides == []
    assert a.score == round(weighted_sum(a))
    assert a.go is True


def test_official_severe_warning_forces_at_least_92_on_a_calm_sea():
    a = assess(alerts=[SEVERE])
    assert weighted_sum(a) < 92, "the model alone would not get there"
    assert a.score >= 92
    assert a.category == "EXTREME"
    assert a.official_warning is True
    assert a.go is False
    assert any("severe warning" in o for o in a.overrides)


def test_imd_fishermen_warning_floor_is_70():
    a = assess(alerts=[FISHERMEN])
    assert weighted_sum(a) < 70
    assert a.score == 70
    assert a.category == "HIGH"
    assert a.go is False
    assert any("fishermen warning" in o for o in a.overrides)


def test_position_inside_a_restricted_zone_floor_is_60():
    a = assess(inside_zone=True, nearest_zone_km=0.0)
    assert weighted_sum(a) < 60
    assert a.score == 60
    assert a.category == "HIGH"
    assert any("restricted" in o for o in a.overrides)


def test_small_craft_wave_and_gale_floors_apply():
    assert assess(wave_height_m=RISK.wave_danger_m).score >= RISK.wave_danger_floor
    assert assess(wind_speed_kmh=RISK.wind_danger_kmh).score >= RISK.wind_danger_floor


def test_a_floor_never_lowers_a_score_the_model_put_higher():
    without = assess(VIOLENT)
    with_fishermen = assess(VIOLENT, alerts=[FISHERMEN])
    with_zone = assess(VIOLENT, inside_zone=True, nearest_zone_km=0.0)
    with_severe = assess(VIOLENT, alerts=[SEVERE])
    assert without.score > 70
    assert with_fishermen.score >= without.score
    assert with_zone.score >= without.score
    assert with_severe.score >= max(without.score, 92)
    # 70 and 60 are floors, not caps.
    assert with_fishermen.score > 70
    assert with_zone.score > 60


def test_an_unofficial_alert_does_not_trigger_the_official_floors():
    rumour = dict(SEVERE, official=False)
    a = assess(alerts=[rumour])
    assert a.official_warning is False
    assert not a.overrides
    assert a.score == round(weighted_sum(a))


GRID = list(itertools.product(
    [0.3, 1.4, 2.6, 4.5],          # wave m
    [5.0, 28.0, 70.0],             # wind km/h
    [[], [FISHERMEN], [SEVERE]],   # alerts
    [False, True],                 # inside a restricted zone
))


@pytest.mark.parametrize("wave,wind,alerts,inside", GRID)
def test_final_score_is_never_below_the_weighted_model(wave, wind, alerts, inside):
    a = assess(wave_height_m=wave, wind_speed_kmh=wind, alerts=alerts,
               inside_zone=inside, nearest_zone_km=0.0 if inside else None)
    model = min(100.0, weighted_sum(a))
    assert a.score >= round(model) - 1  # contributions are rounded to 0.1 each
    assert 0 <= a.score <= 100
    if not a.overrides:
        assert abs(a.score - model) <= 1
    if alerts == [SEVERE]:
        assert a.score >= 92
    if alerts == [FISHERMEN]:
        assert a.score >= 70
    if inside:
        assert a.score >= 60
    if a.official_warning:
        assert a.go is False
