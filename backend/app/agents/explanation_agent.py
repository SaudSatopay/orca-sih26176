"""Explanation agent — the only component allowed to speak in sentences.

It answers the five questions every ORCA recommendation must answer:
WHAT (the verdict), WHY (ranked factors), WHERE, WHEN, and from WHICH SOURCE
with what confidence. It renders from structured agent output only; it cannot
invent a number, because it never sees free text — only typed measurements.
"""
from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Optional, Sequence

from ..schemas import (AgentResult, DataHealth, Evidence, Language, Location, PFZZone,
                       RiskAssessment, RouteOption, SafetyDecision)
from ..services import safety_gate
from ..services.i18n import (SEA_STATE_L10N, SUGGESTIONS, direction, format_stamp,
                             humanise_duration, sea_state, source_label, t, verdict_key,
                             zone_name)
from .base import timed

# Localised names for the risk factors (rendering concern, kept next to the renderer)
FACTOR_LABELS: Dict[str, Dict[str, str]] = {
    "wave":    {"en": "Wave height",        "hi": "लहरों की ऊँचाई", "mr": "लाटांची उंची"},
    "wind":    {"en": "Wind speed",         "hi": "हवा की गति",     "mr": "वाऱ्याचा वेग"},
    "cyclone": {"en": "Official warning",   "hi": "आधिकारिक चेतावनी", "mr": "अधिकृत इशारा"},
    "weather": {"en": "Rain / visibility",  "hi": "बारिश / दृश्यता", "mr": "पाऊस / दृश्यमानता"},
    "ocean":   {"en": "Sea state",          "hi": "समुद्र की स्थिति", "mr": "समुद्राची स्थिती"},
    "gis":     {"en": "Position & zones",   "hi": "स्थिति व क्षेत्र",  "mr": "स्थान व क्षेत्रे"},
}


def _factor_label(key: str, lang: Language) -> str:
    return FACTOR_LABELS.get(key, {}).get(lang) or FACTOR_LABELS.get(key, {}).get("en", key)


WARNING_STATE = {"active": {"en": "active", "hi": "सक्रिय", "mr": "सक्रिय"},
                 "none": {"en": "none", "hi": "कोई नहीं", "mr": "नाही"},
                 "unchecked": {"en": "not connected — check IMD",
                               "hi": "स्रोत जुड़ा नहीं — IMD देखें",
                               "mr": "स्रोत जोडलेला नाही — IMD पाहा"}}


def _short_value(key: str, weather: Dict, ocean: Dict, cyclone: Dict, gis: Dict,
                 lang: Language = "en") -> str:
    """Compact value for the reason line — units stay numeric in every language."""
    if key == "wave" and ocean.get("wave_height_m") is not None:
        return f"{ocean['wave_height_m']:.1f} m"
    if key == "wind" and weather.get("wind_speed_kmh") is not None:
        return f"{weather['wind_speed_kmh']:.0f} km/h"
    if key == "cyclone":
        if cyclone.get("feed_connected") is False:
            state = "unchecked"   # LIVE: no warnings feed, so never "none"
        else:
            state = "active" if cyclone.get("official_warning_active") else "none"
        return WARNING_STATE[state].get(lang, state)
    if key == "weather" and weather.get("rain_probability_pct") is not None:
        return f"{weather['rain_probability_pct']:.0f}%"
    if key == "ocean":
        label = str(ocean.get("sea_state", "-"))
        return SEA_STATE_L10N.get(label, {}).get(lang, label)
    if key == "gis":
        if gis.get("inside_restricted_zone"):
            return {"en": "restricted area", "hi": "प्रतिबंधित क्षेत्र",
                    "mr": "प्रतिबंधित क्षेत्र"}.get(lang, "restricted area")
        if gis.get("distance_from_shore_km") is not None:
            offshore = {"en": "km offshore", "hi": "किमी दूर", "mr": "किमी दूर"}.get(lang, "km offshore")
            return f"{gis['distance_from_shore_km']:.0f} {offshore}"
    return "-"


def build_evidence(weather: Dict, ocean: Dict, cyclone: Dict, gis: Dict,
                   agents: Dict[str, AgentResult], lang: Language = "en") -> List[Evidence]:
    """The 'tap to see the source' table behind every recommendation.

    `label` is a stable English key (the frontend looks rows up by it and
    shows its own translated heading); `source` is prose, so it is written in
    the reader's language.
    """
    rows: List[Evidence] = []

    def add(label: str, value: str, agent_key: str):
        a = agents.get(agent_key)
        if not a:
            return
        rows.append(Evidence(label=label, value=value,
                             source=source_label(a.source, lang),
                             timestamp=a.timestamp, confidence=a.confidence,
                             mode=a.mode))

    if ocean.get("wave_height_m") is not None:
        add("Wave height", f"{ocean['wave_height_m']:.1f} m", "ocean")
    if ocean.get("wave_period_s") is not None:
        add("Wave period", f"{ocean['wave_period_s']:.1f} s", "ocean")
    if ocean.get("sea_state"):
        add("Sea state", sea_state(str(ocean["sea_state"]), lang), "ocean")
    if ocean.get("sst_c") is not None:
        add("Sea surface temperature", f"{ocean['sst_c']:.1f} °C", "ocean")
    if weather.get("wind_speed_kmh") is not None:
        add("Wind", f"{weather['wind_speed_kmh']:.0f} km/h "
                    f"{direction(weather.get('wind_direction'), lang)}".strip(), "weather")
    if weather.get("rain_probability_pct") is not None:
        add("Rain probability", f"{weather['rain_probability_pct']:.0f}%", "weather")
    if weather.get("visibility_km") is not None:
        add("Visibility", f"{weather['visibility_km']:.1f} km", "weather")
    if cyclone.get("headline"):
        add("Marine warning", str(cyclone["headline"]), "cyclone")
    if gis.get("distance_from_shore_km") is not None:
        add("Distance from shore", f"{gis['distance_from_shore_km']:.1f} km", "gis")
    if gis.get("nearest_zone_name"):
        add("Nearest restricted zone",
            f"{zone_name(gis['nearest_zone_name'], lang)} ({gis.get('nearest_zone_km')} km)", "gis")
    return rows


@timed
def run(*, intent, risk: Optional[RiskAssessment], pfz: List[PFZZone],
        routes: List[RouteOption], geofence: List, weather: Dict, ocean: Dict,
        cyclone: Dict, gis: Dict, agents: Dict[str, AgentResult],
        mode: str, when: datetime, decision: Optional[SafetyDecision] = None,
        health: Sequence[DataHealth] = ()) -> AgentResult:
    lang: Language = intent.language
    parts: List[str] = []
    # The safety gate decides how much of the normal answer may be given.
    # GO, and a NO-GO on clean evidence, keep the answer exactly as it was.
    state = decision.state if decision else "GO"
    data_problem = bool(decision and (decision.blocking_inputs or decision.stale_inputs))
    insufficient = state == "INSUFFICIENT_DATA"

    if insufficient:
        # No score, no reasons from a model that is missing its inputs, and
        # nothing that plans a trip: what is missing, and who to listen to.
        parts.append(decision.headline)  # type: ignore[union-attr]
        parts.extend(decision.reasons)  # type: ignore[union-attr]
        parts.append(t("gate_advisory", lang))
    elif state == "CAUTION":
        parts.append(decision.headline)  # type: ignore[union-attr]

    # ---- WHAT ------------------------------------------------------------
    if risk is not None and not insufficient:
        verdict = t(verdict_key(risk.category), lang)
        parts.append(f"{verdict}. {t('risk_score', lang)}: {risk.score}/100.")

        # ---- WHY ---------------------------------------------------------
        top = [f for f in risk.factors if f.contribution > 0][:3]
        if top:
            reasons = "; ".join(
                f"{_factor_label(f.key, lang)} {_short_value(f.key, weather, ocean, cyclone, gis, lang)}"
                for f in top
            )
            parts.append(f"{t('why', lang)}: {reasons}.")

        if risk.official_warning:
            parts.append(t("official_warning", lang))

        # ---- WHEN --------------------------------------------------------
        if risk.category in ("HIGH", "EXTREME"):
            if risk.window:
                parts.append(t("improves_at", lang, hour=risk.window.split(":")[0]))
            else:
                parts.append(t("no_improvement", lang))

        # ---- how far the evidence can be trusted ---------------------------
        if data_problem:
            parts.extend(decision.reasons)  # type: ignore[union-attr]

    # ---- fishing zones ---------------------------------------------------
    if pfz and intent.intent in ("find_pfz", "route") and not insufficient:
        top = pfz[0]
        parts.append(
            f"{t('pfz_intro', lang)}: "
            + t("pfz_line", lang, rank=top.rank, distance=top.distance_km,
                direction=direction(top.bearing, lang),
                sst="-" if top.sst_c is None else top.sst_c,
                chl="-" if top.chlorophyll_mg_m3 is None else top.chlorophyll_mg_m3,
                # The same chance of fish the Today view and the map show for
                # this ground (PFZ agent -> services/fishing.zone_chance).
                chance=round(top.confidence * 100))
        )
        parts.append(t("pfz_note", lang))

    # ---- route -----------------------------------------------------------
    if routes and not insufficient:
        rec = next((r for r in routes if r.recommended), routes[0])
        parts.append(
            f"{t('route_intro', lang)}: "
            + t("route_detail", lang, distance=rec.distance_km,
                eta=humanise_duration(rec.eta_minutes, lang))
        )

    # ---- geofence --------------------------------------------------------
    for alert in geofence[:2]:
        key = "geofence_inside" if alert.inside else "geofence_warn"
        parts.append(t(key, lang, zone=zone_name(alert.zone_name, lang),
                       distance=alert.distance_km))

    # ---- provenance ------------------------------------------------------
    # Only real data providers belong in the citation line — "ORCA" is us.
    srcs = sorted({source_label(a.source, lang)
                   for a in agents.values() if a.ok and a.source not in ("ORCA",)})
    parts.append(t("sources_line", lang, sources=", ".join(srcs),
                   stamp=format_stamp(when, lang)))
    if mode == "DEMO":
        parts.append(t("demo_mode", lang))

    answer = " ".join(parts)

    evidence = build_evidence(weather, ocean, cyclone, gis, agents, lang)
    if decision is not None:
        # The data-health result rides the same provenance path as every reading.
        evidence += safety_gate.evidence_rows(decision, health, lang, mode)

    return AgentResult(
        agent="explanation",
        ok=True,
        data={
            "answer": answer,
            "evidence": [e.model_dump() for e in evidence],
            "suggestions": SUGGESTIONS.get(lang, SUGGESTIONS["en"]),
            "disclaimer": t("disclaimer", lang),
        },
        source="ORCA",
        timestamp=when.isoformat(timespec="seconds"),
        confidence=0.9,
        mode=mode,  # type: ignore[arg-type]
    )
