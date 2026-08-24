"""LIVE data clients.

VERIFIED 24 Aug 2026 against the real endpoints (HTTP 200, field names and
units below are copied from actual responses):

  * https://marine-api.open-meteo.com/v1/marine
        hourly = wave_height (m), wave_period (s), sea_surface_temperature (degC)
  * https://api.open-meteo.com/v1/forecast
        hourly = temperature_2m (degC), wind_speed_10m (km/h),
                 wind_direction_10m (deg), precipitation_probability (%),
                 visibility (m)

Both are public and keyless.

ON INCOIS / IMD / MOSDAC — the honest position we state in Q&A:
these agencies publish advisories through portals and bulletins, not through an
open, documented public JSON API that a hackathon team can key into. ORCA is
therefore built with a provider interface: Open-Meteo Marine is the open live
provider today, and INCOIS/IMD/MOSDAC slot in behind the same interface via a
data-sharing arrangement or bulletin parser without touching agent code.
We never label Open-Meteo output as INCOIS or IMD data.
"""
from __future__ import annotations

from datetime import datetime
from typing import Dict, Optional

import httpx

from ..config import LIVE_TIMEOUT_SECONDS

MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"


def _pick_hour_index(times: list, target: datetime) -> int:
    """Index of the hourly slot closest to `target` (times are local ISO strings)."""
    stamp = target.strftime("%Y-%m-%dT%H:00")
    if stamp in times:
        return times.index(stamp)
    # fall back to the same hour on the first available day
    hour_suffix = target.strftime("T%H:00")
    for i, t in enumerate(times):
        if t.endswith(hour_suffix):
            return i
    return 0


def fetch_marine(lat: float, lon: float, when: datetime) -> Optional[Dict]:
    """Wave height / period / SST. Returns None on any failure."""
    try:
        r = httpx.get(
            MARINE_URL,
            params={
                "latitude": lat,
                "longitude": lon,
                "hourly": "wave_height,wave_period,sea_surface_temperature",
                "forecast_days": 3,
                "timezone": "Asia/Kolkata",
            },
            timeout=LIVE_TIMEOUT_SECONDS,
        )
        r.raise_for_status()
        h = r.json().get("hourly") or {}
        times = h.get("time") or []
        if not times:
            return None
        i = _pick_hour_index(times, when)

        def at(key: str):
            series = h.get(key) or []
            return series[i] if i < len(series) else None

        return {
            "wave_height_m": at("wave_height"),
            "wave_period_s": at("wave_period"),
            "sst_c": at("sea_surface_temperature"),
            "valid_time": times[i],
            "provider": "Open-Meteo Marine",
        }
    except Exception:
        return None


def fetch_weather(lat: float, lon: float, when: datetime) -> Optional[Dict]:
    """Wind / rain probability / visibility / temperature. None on failure."""
    try:
        r = httpx.get(
            FORECAST_URL,
            params={
                "latitude": lat,
                "longitude": lon,
                "hourly": ("temperature_2m,wind_speed_10m,wind_direction_10m,"
                           "precipitation_probability,visibility"),
                "forecast_days": 3,
                "timezone": "Asia/Kolkata",
                "wind_speed_unit": "kmh",
            },
            timeout=LIVE_TIMEOUT_SECONDS,
        )
        r.raise_for_status()
        h = r.json().get("hourly") or {}
        times = h.get("time") or []
        if not times:
            return None
        i = _pick_hour_index(times, when)

        def at(key: str):
            series = h.get(key) or []
            return series[i] if i < len(series) else None

        visibility_m = at("visibility")
        return {
            "temperature_c": at("temperature_2m"),
            "wind_speed_kmh": at("wind_speed_10m"),
            "wind_direction_deg": at("wind_direction_10m"),
            "rain_probability_pct": at("precipitation_probability"),
            "visibility_km": round(visibility_m / 1000.0, 1) if visibility_m is not None else None,
            "valid_time": times[i],
            "provider": "Open-Meteo",
        }
    except Exception:
        return None
