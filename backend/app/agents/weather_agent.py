"""Weather agent — wind, rain, lightning, visibility."""
from __future__ import annotations

from datetime import datetime

from ..data import demo_store, feeds, live_client
from ..data.demo_store import now_ist
from ..data.geo import compass
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

    live = live_client.fetch_weather(location.latitude, location.longitude, when) if live_enabled() else None

    if live and live.get("wind_speed_kmh") is not None:
        mode, source = "LIVE", "OPEN_METEO"
        wind = live["wind_speed_kmh"]
        wind_dir = live.get("wind_direction_deg") or 0
        rain = live.get("rain_probability_pct")
        visibility = live.get("visibility_km")
        temperature = live.get("temperature_c")
        # Open-Meteo has no lightning field; infer conservatively.
        lightning = bool(rain is not None and rain >= 80 and wind and wind >= 30)
        stamp = live.get("valid_time", stamp)
        feed = feeds.live_feed("weather", live)
    else:
        if live_enabled():
            # The labelled stand-in stays on screen; the freshness check counts it missing.
            unavailable.append("live weather provider unreachable — using cached demo data")
            feed = feeds.standin("weather", now)
        else:
            feed = feeds.demo_feed("weather", now)
        if feed.available:
            cond = demo_store.conditions(location.name, when)
            wind = cond["wind"]
            wind_dir = cond["wind_dir"]
            rain = cond["rain"]
            visibility = cond["visibility"]
            lightning = bool(cond["lightning"])
        else:
            # The rehearsed weather feed is silent: nothing is invented.
            unavailable.append("weather feed did not respond — no wind reading")
            wind = wind_dir = rain = visibility = None
            lightning = False
        temperature = None

    health = [data_health.check("wind", feed, now, lang=lang, mode=mode),
              data_health.check("rain", feed, now, lang=lang, mode=mode)]

    return AgentResult(
        agent="weather",
        ok=True,
        location=location,
        data={
            "wind_speed_kmh": _r(wind, 1),
            "wind_direction_deg": None if wind_dir is None else round(float(wind_dir)),
            "wind_direction": None if wind_dir is None else compass(float(wind_dir)),
            "rain_probability_pct": None if rain is None else round(float(rain)),
            "visibility_km": _r(visibility, 1),
            "temperature_c": _r(temperature, 1),
            "lightning": lightning,
        },
        measurements={
            "wind_speed": measurement(_r(wind, 1), "km/h", "Wind speed", source, stamp, mode),
            "rain_probability": measurement(None if rain is None else round(float(rain)),
                                            "%", "Rain probability", source, stamp, mode),
            "visibility": measurement(_r(visibility, 1), "km", "Visibility", source, stamp, mode),
        },
        unavailable=unavailable,
        source=source,
        timestamp=stamp,
        confidence=0.85 if mode == "LIVE" else 0.75,
        mode=mode,  # type: ignore[arg-type]
        health=health,
    )
