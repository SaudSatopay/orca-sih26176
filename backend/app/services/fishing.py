"""Fishing probability model.

Answers the question a fisher actually asks — *where am I likely to catch
something, when should I go, and how long should I stay* — rather than only
"is it safe".

The score is a transparent product of five documented factors:

  chlorophyll   plankton -> forage fish -> catch. The strongest single signal
                in INCOIS PFZ methodology.
  SST band      most Indian coastal target species concentrate in a
                temperature band; distance from that band reduces likelihood.
  front         a sharp SST change against the surrounding water marks a
                convergence line where bait accumulates.
  sea state     rough water both scatters shoals and stops small craft from
                working gear effectively.
  time of day   dawn and dusk feeding peaks are the best-established pattern
                in small-scale fisheries.

We are explicit that this is a LIKELIHOOD, never a promise. The same caveat is
repeated in every user-facing string.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Sequence, Tuple

# --- factor curves --------------------------------------------------------
CHL_CURVE = [(0.0, 0.03), (0.3, 0.14), (0.6, 0.30), (1.0, 0.48),
             (1.5, 0.68), (2.0, 0.84), (3.0, 1.0)]
SST_OPTIMAL = (26.5, 29.0)     # deg C — broad coastal band
SST_TOLERANCE = 3.0            # deg C beyond the band before the factor floors
WAVE_WORKABLE = 1.2            # m — comfortable working sea for a small boat
WAVE_UNWORKABLE = 3.0          # m — gear cannot be worked safely

# Crepuscular feeding: two peaks, dawn and dusk.
TIME_OF_DAY = {
    0: 0.55, 1: 0.50, 2: 0.50, 3: 0.60, 4: 0.78, 5: 0.95,
    6: 1.00, 7: 0.96, 8: 0.86, 9: 0.74, 10: 0.66, 11: 0.60,
    12: 0.56, 13: 0.56, 14: 0.60, 15: 0.68, 16: 0.80, 17: 0.93,
    18: 0.98, 19: 0.90, 20: 0.78, 21: 0.68, 22: 0.62, 23: 0.58,
}

WEIGHTS = {"chlorophyll": 0.34, "sst": 0.20, "front": 0.16,
           "sea_state": 0.18, "time_of_day": 0.12}


def _curve(value: Optional[float], points: Sequence[Tuple[float, float]], default=0.3) -> float:
    if value is None:
        return default
    if value <= points[0][0]:
        return points[0][1]
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if value <= x1:
            return y0 + (y1 - y0) * (value - x0) / ((x1 - x0) or 1e-9)
    return points[-1][1]


def _sst_factor(sst: Optional[float]) -> float:
    if sst is None:
        return 0.4
    lo, hi = SST_OPTIMAL
    if lo <= sst <= hi:
        return 1.0
    drift = (lo - sst) if sst < lo else (sst - hi)
    return max(0.15, 1.0 - (drift / SST_TOLERANCE) * 0.85)


def _sea_state_factor(wave_m: Optional[float]) -> float:
    if wave_m is None:
        return 0.5
    if wave_m <= WAVE_WORKABLE:
        return 1.0
    if wave_m >= WAVE_UNWORKABLE:
        return 0.12
    span = WAVE_UNWORKABLE - WAVE_WORKABLE
    return max(0.12, 1.0 - 0.88 * (wave_m - WAVE_WORKABLE) / span)


def _front_factor(zone_sst: Optional[float], ambient_sst: Optional[float]) -> float:
    """Sharper thermal contrast -> stronger convergence line.

    Discriminating on purpose: a ground sitting on flat, featureless water is a
    materially worse bet than one on a 1 degree front, and the ranking must show
    that rather than putting every candidate in the same band.
    """
    if zone_sst is None or ambient_sst is None:
        return 0.35
    delta = abs(zone_sst - ambient_sst)
    return min(1.0, 0.10 + delta * 0.80)


def time_of_day_factor(hour: int) -> float:
    return TIME_OF_DAY.get(int(hour) % 24, 0.6)


def probability(*, chlorophyll: Optional[float], sst: Optional[float],
                ambient_sst: Optional[float], wave_m: Optional[float],
                hour: int) -> Dict:
    """Return the 0-100 likelihood plus the factor breakdown behind it."""
    factors = {
        "chlorophyll": _curve(chlorophyll, CHL_CURVE),
        "sst": _sst_factor(sst),
        "front": _front_factor(sst, ambient_sst),
        "sea_state": _sea_state_factor(wave_m),
        "time_of_day": time_of_day_factor(hour),
    }
    score = sum(WEIGHTS[k] * v for k, v in factors.items())
    return {
        "probability": round(min(100.0, max(0.0, score * 100))),
        "factors": {k: round(v, 3) for k, v in factors.items()},
        "weights": WEIGHTS,
    }


def value_score(probability_pct: int, distance_km: float) -> float:
    """What the ground is actually worth *to this fisher*, from here.

    `probability` is the pure catch likelihood and stays untouched — it is a
    statement about the water. Ranking, though, has to account for the run:
    equal odds 30 km out and 90 km out are not an equal proposition when you
    are burning diesel and daylight to get there.
    """
    discount = 1.0 - min(0.5, (distance_km / 100.0) * 0.5)
    return round(probability_pct * discount, 1)


def rating(prob: int) -> str:
    if prob >= 70:
        return "very_good"
    if prob >= 55:
        return "good"
    if prob >= 40:
        return "fair"
    return "poor"


def best_hours(*, chlorophyll: Optional[float], sst: Optional[float],
               ambient_sst: Optional[float], wave_by_hour: Dict[int, float],
               allowed_hours: Sequence[int]) -> List[Tuple[int, int]]:
    """Hours (from `allowed_hours`) ranked by likelihood, as (hour, prob)."""
    scored = []
    for h in allowed_hours:
        p = probability(chlorophyll=chlorophyll, sst=sst, ambient_sst=ambient_sst,
                        wave_m=wave_by_hour.get(h), hour=h)["probability"]
        scored.append((h, p))
    return sorted(scored, key=lambda x: x[1], reverse=True)


def contiguous_window(hours: Sequence[int]) -> Optional[Tuple[int, int]]:
    """Longest run of consecutive hours in a sorted list."""
    if not hours:
        return None
    best = (hours[0], hours[0])
    start = prev = hours[0]
    for h in hours[1:]:
        if h == prev + 1:
            prev = h
        else:
            if prev - start > best[1] - best[0]:
                best = (start, prev)
            start = prev = h
    if prev - start > best[1] - best[0]:
        best = (start, prev)
    return best


def recommend_duration(*, probability_pct: int, distance_km: float,
                       travel_minutes: int, safe_window_hours: float) -> Dict:
    """How long to work the ground, given the odds and the time available.

    Reasoning we can defend out loud:
      * a better ground is worth more time on station;
      * a longer run out eats the day, so the trip has to justify the fuel;
      * we never recommend staying past the safe weather window.
    """
    if probability_pct >= 70:
        base = 4.0
    elif probability_pct >= 55:
        base = 3.0
    elif probability_pct >= 40:
        base = 2.0
    else:
        base = 1.5

    # A long steam deserves a longer stay, or the fuel is wasted.
    if distance_km > 60:
        base += 1.0
    elif distance_km > 35:
        base += 0.5

    round_trip_h = (travel_minutes * 2) / 60.0
    available = max(0.0, safe_window_hours - round_trip_h)
    stay = max(0.0, min(base, available))

    return {
        "recommended_hours": round(stay * 2) / 2,          # nearest half hour
        "travel_each_way_minutes": travel_minutes,
        "round_trip_hours": round(round_trip_h, 1),
        "total_trip_hours": round(stay + round_trip_h, 1),
        "safe_window_hours": round(safe_window_hours, 1),
        "limited_by_weather": stay < base,
        "feasible": stay >= 1.0,
    }


def day_label(offset: int) -> str:
    return {0: "today", 1: "tomorrow", 2: "day after tomorrow"}.get(offset, f"day +{offset}")


def date_for(offset: int, base: datetime) -> str:
    return (base + timedelta(days=offset)).date().isoformat()
