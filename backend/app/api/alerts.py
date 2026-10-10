"""Marine alerts + the authority-side rollup."""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Query

from ..agents import cyclone_agent, gis_agent, ocean_agent, risk_agent, weather_agent
from ..data import feeds
from ..data.demo_store import now_ist
from ..data.geo import PORTS, nearest_port
from ..schemas import Location, RiskAssessment
from ..services import data_health, safety_gate
from ..services.i18n import coerce_language

router = APIRouter(prefix="/api", tags=["alerts"])


@router.get("/alerts")
def alerts(lat: float = Query(...), lon: float = Query(...),
           lang: str = Query("en")) -> dict:
    language = coerce_language(lang)
    port = nearest_port(lat, lon)
    loc = Location(name=port["name"], latitude=lat, longitude=lon, state=port["state"])
    now = now_ist()
    cyc = cyclone_agent.run(loc, now, language)
    gis = gis_agent.run(loc, now, language)
    return {
        "location": loc.model_dump(),
        "marine_alerts": cyc.data.get("alerts", []),
        "geofence_alerts": gis.data.get("geofence_alerts", []),
        "generated_at": now.isoformat(timespec="seconds"),
    }


@router.get("/authority/dashboard")
def authority_dashboard(lang: str = Query("en"),
                        drill: Optional[str] = Query(
                            None, pattern="^(healthy|stale|unavailable|recovery)$")) -> dict:
    with feeds.drill_override(drill):
        return _dashboard(lang)


def _dashboard(lang: str) -> dict:
    """Every monitored landing centre, scored — the authority view.

    Shows ORCA serving district administrations, not just individual fishers.
    `lang` translates the warning headline; every figure is the same.

    Every centre passes the same safety gate as a fisher's own question: its
    row carries the gate's state, and when any centre rests on stale or
    missing evidence the board carries that centre's decision and data health,
    so the view can say so above the scores. No score is changed by it.
    """
    language = coerce_language(lang)
    now = now_ist()
    rows = []
    flagged = None
    for port in PORTS:
        loc = Location(name=port["name"], latitude=port["lat"],
                       longitude=port["lon"], state=port["state"])
        weather = weather_agent.run(loc, now, language)
        ocean = ocean_agent.run(loc, now, language)
        cyclone = cyclone_agent.run(loc, now, language)
        gis = gis_agent.run(loc, now, language)
        assessment = risk_agent.run(
            loc, now, weather=weather.data, ocean=ocean.data, cyclone=cyclone.data,
            gis=gis.data, sources=[], mode=weather.mode,
        )
        data = assessment.data
        health = data_health.complete(
            weather.health + ocean.health + cyclone.health + gis.health, lang=language)
        decision = safety_gate.decide(RiskAssessment(**data) if assessment.ok else None, health,
                                      now, lang=language, drill=feeds.active_drill())
        if flagged is None and (decision.blocking_inputs or decision.stale_inputs):
            flagged = (decision, health)
        rows.append({
            "name": port["name"],
            "state": port["state"],
            "latitude": port["lat"],
            "longitude": port["lon"],
            "risk_score": data.get("score"),
            "risk_category": data.get("category"),
            "official_warning": data.get("official_warning"),
            "wave_height_m": ocean.data.get("wave_height_m"),
            "wind_speed_kmh": weather.data.get("wind_speed_kmh"),
            "headline": cyclone.data.get("headline"),
            "gate": decision.state,
            # How complete the evidence behind this row is: a score resting on
            # a missing or stale reading is shown as unconfirmed.
            "evidence": ("missing" if decision.blocking_inputs
                         else "stale" if decision.stale_inputs else "fresh"),
        })

    rows.sort(key=lambda r: r["risk_score"] or 0, reverse=True)
    summary = {
        "monitored": len(rows),
        "extreme": sum(1 for r in rows if r["risk_category"] == "EXTREME"),
        "high": sum(1 for r in rows if r["risk_category"] == "HIGH"),
        "moderate": sum(1 for r in rows if r["risk_category"] == "MODERATE"),
        "low": sum(1 for r in rows if r["risk_category"] == "LOW"),
        "official_warnings": sum(1 for r in rows if r["official_warning"]),
        "evidence_flagged": sum(1 for r in rows if r["gate"] in ("CAUTION", "INSUFFICIENT_DATA")),
    }
    return {"generated_at": now.isoformat(timespec="seconds"),
            "summary": summary, "locations": rows,
            # The first centre whose evidence is stale or missing, as the board's
            # evidence check; None when every centre rests on fresh readings.
            "decision": flagged[0].model_dump() if flagged else None,
            "data_health": [h.model_dump() for h in flagged[1]] if flagged else []}
