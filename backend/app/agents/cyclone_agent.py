"""Cyclone / marine-alert agent.

Highest-priority agent in the system. If it reports an official severe warning,
the risk engine's deterministic floor forces EXTREME regardless of what every
other agent — or the language model — thinks.
"""
from __future__ import annotations

from datetime import datetime
from typing import Dict, List

from ..data import demo_store, feeds
from ..data.demo_store import now_ist
from ..schemas import AgentResult, Language, Location
from ..services import data_health
from ..services.i18n import localise_alert
from .base import live_enabled, timed

SEVERITY_RANK = {"low": 0, "moderate": 1, "high": 2, "severe": 3}


@timed
def run(location: Location, when: datetime, lang: Language = "en") -> AgentResult:
    stamp = when.isoformat(timespec="seconds")
    now = now_ist()
    # There is no open IMD warnings API, so the bulletin store is the warnings
    # provider in both modes. A silent warnings feed is never read as "no
    # warning": its health is MISSING, and the safety gate will not clear a trip.
    # In LIVE mode there is no official warnings feed to read (no open IMD /
    # INCOIS API): the scripted demo bulletins are never shown there — a flat
    # sea under a fake "IMD warning" teaches a fisher to ignore the next one —
    # and the status is "not connected", never "no warning".
    live = live_enabled()
    feed = (feeds.FeedStatus("warnings", "DEMO", False, None, "not_connected")
            if live else feeds.demo_feed("warnings", now))
    # Words only: the type, severity and "official" flag the risk engine
    # reads are the same in every language.
    alerts: List[Dict] = [localise_alert(a, lang)
                          for a in demo_store.alerts(location.name, when)] if feed.available else []
    alerts.sort(key=lambda a: SEVERITY_RANK.get(str(a.get("severity")).lower(), 0), reverse=True)

    worst = alerts[0] if alerts else None
    official = any(a.get("official") for a in alerts)

    return AgentResult(
        agent="cyclone",
        ok=True,
        location=location,
        data={
            "alerts": alerts,
            "count": len(alerts),
            "official_warning_active": official,
            "highest_severity": (worst or {}).get("severity"),
            "headline": (worst or {}).get("headline"),
            # False in LIVE mode: no warnings feed is connected, so "no alert"
            # means "not checked", never "none".
            "feed_connected": not live,
        },
        unavailable=([] if feed.available else
                     ["no official warnings feed connected in live mode — check IMD / INCOIS"]
                     if live else ["warnings feed did not respond — no warnings check"]),
        source="DEMO",
        timestamp=stamp,
        confidence=0.95 if alerts else 0.8,
        mode="DEMO",
        health=[data_health.check("warnings", feed, now, lang=lang)],
    )
