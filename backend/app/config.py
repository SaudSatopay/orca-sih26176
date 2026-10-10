"""ORCA configuration — data mode, risk weights, thresholds.

Everything a judge might question ("why these weights?", "is this data real?")
is centralised here so it can be shown on screen and defended in Q&A.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Dict, List, Optional


# --------------------------------------------------------------------------
# Data mode
# --------------------------------------------------------------------------
# LIVE : call public marine/weather APIs, fall back to cache/demo on failure.
# DEMO : serve only cached, clearly-labelled scenario data. Stage-safe.
#
# Default is DEMO so a laptop with no internet still runs the full pipeline.
DATA_MODE = os.getenv("ORCA_DATA_MODE", "DEMO").upper()

# Runtime-switchable copy so the mode can be flipped from the UI mid-demo
# ("watch — I'll switch it to live government-adjacent data now") without a
# restart. Always read through get_data_mode(); never trust the constant above.
_RUNTIME = {"data_mode": DATA_MODE}


def get_data_mode() -> str:
    return _RUNTIME["data_mode"]


def set_data_mode(mode: str) -> str:
    mode = (mode or "").strip().upper()
    if mode not in ("LIVE", "DEMO"):
        raise ValueError("mode must be LIVE or DEMO")
    _RUNTIME["data_mode"] = mode
    return mode

# Seconds before a live API call is abandoned in favour of cache/demo data.
LIVE_TIMEOUT_SECONDS = float(os.getenv("ORCA_LIVE_TIMEOUT", "4.0"))

# Optional LLM layer — reserved, NOT wired in this build: nothing reads these
# settings. ORCA runs fully without one (rule-based intent + template
# explanations), and an LLM would only ever rephrase — never compute a score.
LLM_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
LLM_MODEL = os.getenv("ORCA_LLM_MODEL", "claude-sonnet-5")
LLM_ENABLED = bool(LLM_API_KEY) and os.getenv("ORCA_USE_LLM", "1") != "0"


# --------------------------------------------------------------------------
# Risk engine
# --------------------------------------------------------------------------
@dataclass(frozen=True)
class RiskConfig:
    """Weighted-factor risk model.

    IMPORTANT (and we say this out loud in the pitch): these weights are an
    engineering starting point informed by small-boat safety guidance, NOT a
    peer-reviewed maritime standard. They are configurable and every factor's
    contribution is shown to the user. Deterministic overrides below cannot be
    out-voted by the weighted score.
    """

    weights: Dict[str, float] = field(
        default_factory=lambda: {
            "wave": 0.25,     # dominant capsize driver for small craft
            "cyclone": 0.25,  # official alerts / storm proximity
            "wind": 0.20,
            "weather": 0.10,  # rain, lightning, visibility
            "ocean": 0.10,    # sea state, currents
            "gis": 0.10,      # distance offshore, restricted-zone proximity
        }
    )

    # Category thresholds (upper bound of each band, 0-100).
    #
    # NOTE: we reserve EXTREME (80+) for conditions where an official severe
    # warning is active or the sea state is life-threatening, so that "EXTREME"
    # always means "do not launch, no judgement call". HIGH therefore extends
    # to 79.
    thresholds: Dict[str, int] = field(
        default_factory=lambda: {"LOW": 25, "MODERATE": 50, "HIGH": 79, "EXTREME": 100}
    )

    # --- deterministic safety floors -------------------------------------
    # Applied AFTER the weighted score. A floor can only raise a score, never
    # lower it, so official warnings always dominate the model output.
    severe_warning_floor: int = 92     # cyclone / tsunami / severe marine warning
    fishermen_warning_floor: int = 70  # "fishermen advised not to venture"
    wave_danger_m: float = 4.0
    wave_danger_floor: int = 85
    wind_danger_kmh: float = 62.0      # ~34 kt, gale force
    wind_danger_floor: int = 85
    restricted_zone_floor: int = 60

    def categorise(self, score: float) -> str:
        s = round(score)
        if s <= self.thresholds["LOW"]:
            return "LOW"
        if s <= self.thresholds["MODERATE"]:
            return "MODERATE"
        if s <= self.thresholds["HIGH"]:
            return "HIGH"
        return "EXTREME"


RISK = RiskConfig()


# --------------------------------------------------------------------------
# Data sufficiency: how old may the evidence behind a decision be?
# --------------------------------------------------------------------------
def _secs(name: str, default: Optional[int]) -> Optional[int]:
    """A limit in seconds from the environment; a bad or missing value keeps the default."""
    raw = os.getenv(name)
    if raw is None or default is None:
        return default
    try:
        return max(1, int(raw))
    except ValueError:
        return default


@dataclass(frozen=True)
class InputPolicy:
    """One input of the go/no-go decision: where it comes from, whether a
    normal-confidence decision needs it, and how old it may be.

    `fresh_s`: at or under this age the reading is FRESH. `max_age_s`: over this
    it is too old to use at all, and counts as missing. Both None for a static
    layer bundled with the app (the chart), which does not age by the minute.
    """

    label: str
    feed: str
    critical: bool
    fresh_s: Optional[int]
    max_age_s: Optional[int]


def _policy(key: str, label: str, feed: str, critical: bool,
            fresh: Optional[int], max_age: Optional[int]) -> InputPolicy:
    k = key.upper()
    return InputPolicy(label, feed, critical, _secs(f"ORCA_FRESH_{k}_S", fresh),
                       _secs(f"ORCA_MAXAGE_{k}_S", max_age))


@dataclass(frozen=True)
class DataHealthConfig:
    """Freshness limits for every input of the safety decision, kept in this one
    place rather than scattered as checks across the agents.

    Like the risk weights these are an engineering baseline, not a certified
    standard: marine and weather forecast models refresh every 1-6 hours, so a
    forecast older than one cycle is stale; an official warning can be issued at
    any hour, so the warnings check is held to one hour. The four critical inputs
    are the ones that carry a safety floor (wave 4 m, gale, the official
    warnings, the restricted zones). Override any limit with
    ORCA_FRESH_<INPUT>_S / ORCA_MAXAGE_<INPUT>_S (seconds).
    """

    inputs: Dict[str, InputPolicy] = field(default_factory=lambda: {
        "wave": _policy("wave", "Wave height", "marine", True, 3 * 3600, 6 * 3600),
        "wind": _policy("wind", "Wind", "weather", True, 3 * 3600, 6 * 3600),
        "warnings": _policy("warnings", "Official warnings", "warnings", True, 3600, 3 * 3600),
        "position": _policy("position", "Position and restricted zones", "chart", True,
                            None, None),
        "rain": _policy("rain", "Rain and visibility", "weather", False, 3 * 3600, 6 * 3600),
        "current": _policy("current", "Surface current", "marine", False, 6 * 3600, 12 * 3600),
    })

    def critical_inputs(self) -> List[str]:
        return [key for key, policy in self.inputs.items() if policy.critical]


DATA_HEALTH = DataHealthConfig()


# --------------------------------------------------------------------------
# Geofencing
# --------------------------------------------------------------------------
GEOFENCE_WARN_KM = 5.0     # warn when this close to a restricted zone
GEOFENCE_ALERT_KM = 2.5    # urgent alert threshold


# --------------------------------------------------------------------------
# Provenance labels
# --------------------------------------------------------------------------
SOURCE_LABELS = {
    "INCOIS": "INCOIS (Indian National Centre for Ocean Information Services)",
    "IMD": "IMD (India Meteorological Department)",
    "MOSDAC": "ISRO MOSDAC",
    "OPEN_METEO": "Open-Meteo Marine (open fallback source)",
    "DEMO": "ORCA demo dataset — SIMULATED, not official data",
    "ORCA_GIS": "ORCA geospatial layer (OpenStreetMap derived)",
}

# Text appended to every synthetic value so simulated data can never be
# mistaken for a live government feed.
DEMO_DISCLAIMER = "Demo / simulated data — not a live government feed"
