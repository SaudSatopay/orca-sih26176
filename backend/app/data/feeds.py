"""What each provider last delivered, and when: the input to the freshness check.

ORCA reads four feeds:

    marine    wave height and period, sea temperature, surface current
    weather   wind, rain, visibility
    warnings  the official warnings bulletin
    chart     position, coastline and restricted zones (bundled with the app)

DEMO mode: the rehearsed dataset is the provider, and a *data drill* sets how
old its last delivery is, or whether it answered at all. The drills move only
the marine feed, and the sea itself never changes between them, so one cause is
on show at a time:

    healthy      delivered 18 min ago
    stale        delivered 4 h 10 min ago (over the 3 h freshness limit)
    unavailable  did not respond
    recovery     reconnected 1 min ago, after the outage

LIVE mode: the marine and weather feeds are Open-Meteo, and the delivery time
is when the series was fetched (`live_client` remembers it). There is no open
IMD warnings API, so warnings come from the bundled bulletin store in both
modes and the drill sets their age too. The chart layer ships with the app.

The drill is a runtime switch like the LIVE/DEMO mode: no restart, and the next
question sees it. Switch it with POST /api/config/data-health, the Ask view's
drill chips, ?drill= in a link, or ORCA_DATA_DRILL at start-up. A single
request can also carry its own drill (`drill_override`), which wins for that
request only and leaves the server-wide switch alone: stateless, so it holds
on a serverless host where consecutive requests may reach different instances.
"""
from __future__ import annotations

import contextvars
import os
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, Iterator, Optional


@dataclass(frozen=True)
class FeedStatus:
    """One provider's last delivery, as the freshness check sees it."""

    feed: str
    source: str                      # source code: DEMO | OPEN_METEO | ORCA_GIS
    available: bool
    observed_at: Optional[datetime] = None
    error: Optional[str] = None      # "no_response" | "provider_error"
    note: Optional[str] = None       # "reconnected" | "standin"


@dataclass(frozen=True)
class FeedDrill:
    """How a drill sets one feed: its age in seconds, or None if it is silent."""

    age_s: Optional[int]
    error: Optional[str] = None
    note: Optional[str] = None


_STEADY = {"weather": FeedDrill(12 * 60), "warnings": FeedDrill(25 * 60)}

DRILLS: Dict[str, Dict[str, FeedDrill]] = {
    "healthy": {"marine": FeedDrill(18 * 60), **_STEADY},
    "stale": {"marine": FeedDrill(4 * 3600 + 10 * 60), **_STEADY},
    "unavailable": {"marine": FeedDrill(None, error="no_response"), **_STEADY},
    "recovery": {"marine": FeedDrill(60, note="reconnected"), **_STEADY},
}

_ACTIVE = {"drill": os.getenv("ORCA_DATA_DRILL", "healthy").strip().lower()}
if _ACTIVE["drill"] not in DRILLS:
    _ACTIVE["drill"] = "healthy"


# A drill carried by the request being served; None means "use the server's".
_REQUEST_DRILL: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "orca_request_drill", default=None)


def active_drill() -> str:
    return _REQUEST_DRILL.get() or _ACTIVE["drill"]


@contextmanager
def drill_override(name: Optional[str]) -> Iterator[None]:
    """Serve one request under `name` (if given) without touching the server's drill.

    The value lives in a context variable, so concurrent requests never see
    each other's drill; work handed to a thread pool must run in a copy of the
    caller's context (contextvars.copy_context().run) to carry it along.
    """
    if not name:
        yield
        return
    if name not in DRILLS:
        raise ValueError(f"drill must be one of: {', '.join(DRILLS)}")
    token = _REQUEST_DRILL.set(name)
    try:
        yield
    finally:
        _REQUEST_DRILL.reset(token)


def set_drill(name: str) -> str:
    name = (name or "").strip().lower()
    if name not in DRILLS:
        raise ValueError(f"drill must be one of: {', '.join(DRILLS)}")
    _ACTIVE["drill"] = name
    return name


def demo_feed(feed: str, now: datetime) -> FeedStatus:
    """The rehearsed provider's last delivery for `feed`, under the active drill."""
    spec = DRILLS[active_drill()].get(feed) or DRILLS["healthy"][feed]
    if spec.age_s is None:
        return FeedStatus(feed, "DEMO", False, None, spec.error or "no_response", spec.note)
    return FeedStatus(feed, "DEMO", True, now - timedelta(seconds=spec.age_s), None, spec.note)


def live_feed(feed: str, payload: Optional[dict]) -> FeedStatus:
    """A live provider's delivery: when the series was fetched, or silence."""
    if not payload or not payload.get("fetched_at"):
        return FeedStatus(feed, "OPEN_METEO", False, None, "no_response")
    return FeedStatus(feed, "OPEN_METEO", True, datetime.fromisoformat(payload["fetched_at"]))


def standin(feed: str, now: datetime) -> FeedStatus:
    """A demo value standing in for a live reading that did not arrive."""
    return FeedStatus(feed, "DEMO", True, now, None, "standin")


def chart_feed() -> FeedStatus:
    """The chart layer is bundled with the app: always present, static."""
    return FeedStatus("chart", "ORCA_GIS", True, None)
