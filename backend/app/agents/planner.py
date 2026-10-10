"""Planner / Orchestrator — the central agent.

It owns the graph, not the marine maths: it decides WHICH specialists a question
needs, runs the independent ones concurrently, waits for the dependent ones, and
assembles the state that the Risk and Explanation agents consume.

    intent -> {weather, ocean, pfz, cyclone, gis}  (parallel)
           -> risk        (needs all four data agents)
           -> route       (needs pfz + risk)
           -> explanation (needs everything)

This is a hand-written state machine with the same execution semantics as a
LangGraph graph. It is written out explicitly so the whole orchestration is
readable in one screen during a code walkthrough, and so the demo has zero
heavyweight dependencies. `ORCA_USE_LANGGRAPH=1` is the documented upgrade path;
the node functions below are already shaped as LangGraph nodes (state in,
state out).
"""
from __future__ import annotations

import contextvars
import time
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

from ..config import get_data_mode
from ..data import feeds
from ..data.demo_store import IST, now_ist
from ..schemas import (AgentTrace, ChatRequest, ChatResponse, Evidence,
                       GeofenceAlert, Intent, Location, PFZZone, RiskAssessment,
                       RouteOption)
from ..services import data_health, safety_gate
from ..services.i18n import RISK_BAND, sea_state, t
from . import (cyclone_agent, explanation_agent, gis_agent, intent_agent,
               ocean_agent, pfz_agent, risk_agent, route_agent, weather_agent)

# session_id -> last intent (gives follow-ups their context). Bounded: the
# least recently used sessions are forgotten first, so memory cannot grow
# without limit on a long-running server.
_SESSIONS: "OrderedDict[str, Intent]" = OrderedDict()
MAX_SESSIONS = 2000

# One line per agent for the crew trace, in the reader's language (`g`).
# The intent line stays as the parser wrote it: it is a readback of code names.
AGENT_SUMMARY = {
    "weather": lambda d, g: (t("trace_weather", g, wind=d.get("wind_speed_kmh"),
                               rain=d.get("rain_probability_pct"))
                             if d.get("wind_speed_kmh") is not None
                             else t("trace_weather_none", g)),
    "ocean": lambda d, g: (t("trace_ocean", g, wave=d.get("wave_height_m"),
                             state=sea_state(d.get("sea_state"), g) if d.get("sea_state") else None)
                           if d.get("wave_height_m") is not None else t("trace_ocean_none", g)),
    "pfz": lambda d, g: t("trace_pfz", g, n=len(d.get("zones", []))),
    "cyclone": lambda d, g: (d.get("headline")
                             or (t("trace_warnings_not_connected", g)
                                 if d.get("feed_connected") is False
                                 else t("trace_no_warning", g))),
    "gis": lambda d, g: t("trace_gis", g, km=d.get("distance_from_shore_km"),
                          n=len(d.get("zones_nearby", []))),
    "risk": lambda d, g: f"{d.get('score')}/100 "
                         f"{RISK_BAND.get(str(d.get('category')), {}).get(g, d.get('category'))}",
    "route": lambda d, g: (t("trace_route", g, km=d.get("recommended", {}).get("distance_km"))
                           if d.get("recommended") else t("trace_no_route", g)),
    "explanation": lambda d, g: t("trace_explanation", g),
    "intent": lambda d, g: f"{d.get('intent')} @ {d.get('location_text') or 'unknown'} {d.get('time')}",
}


def _target_datetime(intent: Intent) -> datetime:
    """Combine the parsed date + time into an IST timestamp."""
    base = now_ist()
    try:
        y, m, d = (int(x) for x in (intent.date or base.date().isoformat()).split("-"))
        hh, mm = (int(x) for x in (intent.time or "06:00").split(":"))
        return datetime(y, m, d, hh, mm, tzinfo=IST)
    except Exception:
        return base


def _trace(result, name: str, lang: str = "en") -> AgentTrace:
    status = "ok" if result.ok else "failed"
    if result.ok and result.unavailable:
        status = "degraded"
    try:
        summary = AGENT_SUMMARY.get(name, lambda d, g: "")(result.data or {}, lang)
    except Exception:
        summary = ""
    return AgentTrace(agent=name, status=status,  # type: ignore[arg-type]
                      latency_ms=result.latency_ms or 0, summary=summary or "",
                      source=result.source, mode=result.mode)


def handle(req: ChatRequest) -> ChatResponse:
    """Run the full ORCA graph for one user message (under its own drill, if any)."""
    # The drill is read once and pinned for the whole request, so a switch
    # made mid-request can never mix two drills inside one answer.
    with feeds.drill_override(req.drill or feeds.active_drill()):
        return _handle(req)


def _handle(req: ChatRequest) -> ChatResponse:
    started = time.perf_counter()

    # ---- node 1: intent --------------------------------------------------
    previous = _SESSIONS.get(req.session_id)
    intent_res = intent_agent.run(
        req.message, language=req.language, latitude=req.latitude,
        longitude=req.longitude, location_name=req.location_name, previous=previous,
    )
    intent = Intent(**intent_res.data)
    if intent.location is None:
        from ..data.geo import DEFAULT_PORT
        intent.location = Location(name=DEFAULT_PORT["name"], latitude=DEFAULT_PORT["lat"],
                                   longitude=DEFAULT_PORT["lon"], state=DEFAULT_PORT["state"])
        intent.location_text = DEFAULT_PORT["name"]
    _SESSIONS[req.session_id] = intent
    _SESSIONS.move_to_end(req.session_id)
    while len(_SESSIONS) > MAX_SESSIONS:
        _SESSIONS.popitem(last=False)

    location = intent.location
    when = _target_datetime(intent)
    needs = set(intent.needs)
    # The reader's language. It chooses words only: every agent computes the
    # same numbers whatever it is.
    lang = intent.language

    trace: List[AgentTrace] = [_trace(intent_res, "intent", lang)]
    agents: Dict[str, object] = {}

    # ---- node 2: specialists, concurrently -------------------------------
    jobs = {}

    def submit(pool, fn, *args):
        # Each specialist runs in a copy of this request's context, so a drill
        # carried by the request travels into the worker thread with it.
        return pool.submit(contextvars.copy_context().run, fn, *args)

    with ThreadPoolExecutor(max_workers=5) as pool:
        if "weather" in needs:
            jobs["weather"] = submit(pool, weather_agent.run, location, when, lang)
        if "ocean" in needs:
            jobs["ocean"] = submit(pool, ocean_agent.run, location, when, lang)
        if "pfz" in needs:
            jobs["pfz"] = submit(pool, pfz_agent.run, location, when)
        if "cyclone" in needs:
            jobs["cyclone"] = submit(pool, cyclone_agent.run, location, when, lang)
        if "gis" in needs:
            jobs["gis"] = submit(pool, gis_agent.run, location, when, lang)
        results = {name: fut.result() for name, fut in jobs.items()}

    for name, res in results.items():
        agents[name] = res
        trace.append(_trace(res, name, lang))

    weather_d = results["weather"].data if "weather" in results else {}
    ocean_d = results["ocean"].data if "ocean" in results else {}
    cyclone_d = results["cyclone"].data if "cyclone" in results else {}
    gis_d = results["gis"].data if "gis" in results else {}

    sources = [r.source for r in results.values() if r.ok]
    mode = "LIVE" if any(r.mode == "LIVE" for r in results.values()) else get_data_mode()
    if mode not in ("LIVE", "DEMO", "CACHE"):
        mode = "DEMO"

    # ---- node 3: risk ----------------------------------------------------
    risk: Optional[RiskAssessment] = None
    if "risk" in needs:
        risk_res = risk_agent.run(location, when, weather=weather_d, ocean=ocean_d,
                                  cyclone=cyclone_d, gis=gis_d, sources=sources, mode=mode,
                                  lang=lang)
        agents["risk"] = risk_res
        trace.append(_trace(risk_res, "risk", lang))
        if risk_res.ok:
            risk = RiskAssessment(**risk_res.data)

    # ---- node 3b: the safety gate ----------------------------------------
    # Is the evidence behind that verdict fresh and complete enough to give it
    # at normal confidence? Deterministic, and it never alters `risk`.
    health = data_health.complete([h for r in results.values() for h in r.health], lang=lang)
    decision = safety_gate.decide(risk, health, now_ist(), lang=lang, drill=feeds.active_drill())
    # On insufficient evidence nothing below may plan a trip: no fishing
    # grounds, no course, and the crew trace says the score was withheld.
    withheld = decision.state == "INSUFFICIENT_DATA"
    if withheld:
        for row in trace:
            if row.agent == "risk":
                row.summary = t("trace_risk_withheld", lang)

    # ---- node 4: pfz list / route ---------------------------------------
    pfz_zones: List[PFZZone] = []
    if "pfz" in results and results["pfz"].ok and not withheld:
        zone_rows = results["pfz"].data.get("zones", [])
        # The PFZ agent ran alongside the Ocean agent, so it scored each
        # ground against the demo sea temperature. Re-stamp the chance of fish
        # with the Ocean agent's actual reading (it differs in LIVE mode) so
        # the answer and the Today view quote the same number.
        if ocean_d.get("sst_c") is not None:
            pfz_agent.apply_chance(zone_rows, ocean_d["sst_c"], when.hour)
            if zone_rows:
                results["pfz"].confidence = zone_rows[0]["confidence"]
        pfz_zones = [PFZZone(**z) for z in zone_rows]

    routes: List[RouteOption] = []
    if "route" in needs and pfz_zones:
        target = pfz_zones[0]
        route_res = route_agent.run(location, when,
                                    destination=(target.latitude, target.longitude),
                                    destination_name=f"PFZ #{target.rank}",
                                    ocean=ocean_d, weather=weather_d,
                                    risk=(risk.model_dump() if risk else {}), lang=lang)
        agents["route"] = route_res
        trace.append(_trace(route_res, "route", lang))
        if route_res.ok:
            routes = [RouteOption(**o) for o in route_res.data.get("options", [])]

    geofence = [GeofenceAlert(**a) for a in gis_d.get("geofence_alerts", [])]

    # ---- node 5: explanation --------------------------------------------
    expl_res = explanation_agent.run(
        intent=intent, risk=risk, pfz=pfz_zones, routes=routes, geofence=geofence,
        weather=weather_d, ocean=ocean_d, cyclone=cyclone_d, gis=gis_d,
        agents=agents, mode=mode, when=when,  # type: ignore[arg-type]
        decision=decision, health=health,
    )
    trace.append(_trace(expl_res, "explanation", lang))

    evidence = [Evidence(**e) for e in expl_res.data.get("evidence", [])]

    return ChatResponse(
        session_id=req.session_id,
        language=intent.language,
        answer=expl_res.data.get("answer", ""),
        intent=intent,
        risk=risk,
        pfz=pfz_zones,
        routes=routes,
        geofence=geofence,
        alerts=cyclone_d.get("alerts", []),
        evidence=evidence,
        trace=trace,
        suggestions=expl_res.data.get("suggestions", []),
        mode=mode,  # type: ignore[arg-type]
        disclaimer=expl_res.data.get("disclaimer", ""),
        elapsed_ms=int((time.perf_counter() - started) * 1000),
        decision=decision,
        data_health=health,
    )


def reset_session(session_id: str) -> None:
    _SESSIONS.pop(session_id, None)
