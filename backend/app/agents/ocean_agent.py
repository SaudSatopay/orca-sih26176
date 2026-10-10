"""Ocean agent — wave height/period, sea state, SST, surface current."""
from __future__ import annotations

from datetime import datetime

from ..data import demo_store, feeds, live_client
from ..data.demo_store import now_ist
from ..schemas import AgentResult, Language, Location
from ..services import data_health
from .base import live_enabled, measurement, timed


def _r(value, digits):
    return None if value is None else round(float(value), digits)


@timed
def run(location: Location, when: datetime, lang: Language = "en") -> AgentResult:
    stamp = when.isoformat(timespec="seconds")
    mode, source = "DEMO", "DEMO"
    unavailable = []
    now = now_ist()
    cond = demo_store.conditions(location.name, when)

    if live_enabled():
        live = live_client.fetch_marine(location.latitude, location.longitude, when)
        if live and live.get("wave_height_m") is not None:
            mode, source = "LIVE", "OPEN_METEO"
            wave = live["wave_height_m"]
            period = live.get("wave_period_s")
            sst = live.get("sst_c")
            stamp = live.get("valid_time", stamp)
            # Open-Meteo Marine does not expose surface currents; fall back and say so.
            current = cond["current"]
            unavailable.append("surface current not available from the live provider — demo value shown")
            wave_feed, current_feed = feeds.live_feed("marine", live), feeds.standin("marine", now)
        else:
            # The labelled demo stand-in stays on screen (honest degrade), but
            # the freshness check counts it as missing: it never clears a trip.
            unavailable.append("live marine provider unreachable — using cached demo data")
            wave, period, sst, current = cond["wave"], cond["period"], cond["sst"], cond["current"]
            wave_feed = current_feed = feeds.standin("marine", now)
    else:
        wave_feed = current_feed = feeds.demo_feed("marine", now)
        if wave_feed.available:
            wave, period, sst, current = cond["wave"], cond["period"], cond["sst"], cond["current"]
        else:
            # The rehearsed marine feed is silent (a data drill): nothing is
            # invented in its place, so the safety gate sees a missing reading.
            unavailable.append("marine feed did not respond — no wave reading")
            wave = period = sst = current = None

    state = None if wave is None else demo_store.sea_state(float(wave))
    health = [data_health.check("wave", wave_feed, now, lang=lang, mode=mode),
              data_health.check("current", current_feed, now, lang=lang, mode=mode)]

    return AgentResult(
        agent="ocean",
        ok=True,
        location=location,
        data={
            "wave_height_m": _r(wave, 2),
            "wave_period_s": _r(period, 1),
            "sea_state": state,
            "sst_c": _r(sst, 1),
            "current_speed_ms": _r(current, 2),
            "chlorophyll_mg_m3": round(float(cond["chl"]), 2),
        },
        measurements={
            "wave_height": measurement(_r(wave, 2), "m", "Wave height", source, stamp, mode),
            "wave_period": measurement(_r(period, 1), "s", "Wave period", source, stamp, mode),
            "sst": measurement(_r(sst, 1), "°C", "Sea surface temperature", source, stamp, mode),
        },
        unavailable=unavailable,
        source=source,
        timestamp=stamp,
        confidence=0.88 if mode == "LIVE" else 0.75,
        mode=mode,  # type: ignore[arg-type]
        health=health,
    )
