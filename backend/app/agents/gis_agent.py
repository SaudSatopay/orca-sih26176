"""GIS agent — position context, restricted zones, geofencing."""
from __future__ import annotations

from datetime import datetime
from typing import List

from ..config import GEOFENCE_ALERT_KM, GEOFENCE_WARN_KM
from ..data.geo import distance_from_shore_km, nearest_port, zones_near
from ..schemas import AgentResult, GeofenceAlert, Language, Location
from ..services.i18n import t, zone_name
from .base import timed


@timed
def run(location: Location, when: datetime, lang: Language = "en") -> AgentResult:
    stamp = when.isoformat(timespec="seconds")
    lat, lon = location.latitude, location.longitude

    offshore_km = distance_from_shore_km(lat, lon)
    port = nearest_port(lat, lon)
    zones = zones_near(lat, lon, radius_km=60.0)

    alerts: List[GeofenceAlert] = []
    for z in zones:
        # The alert is read by a person, so it names the area in their
        # language; `zones_nearby` and `nearest_zone_name` below keep the
        # chart's own name, which is what the rest of the system matches on.
        name = zone_name(z["name"], lang)
        if z["inside"]:
            severity, message = "critical", t("gf_msg_inside", lang, zone=name)
        elif z["distance_km"] <= GEOFENCE_ALERT_KM:
            severity, message = "critical", t("gf_msg_close", lang, zone=name,
                                              distance=z["distance_km"])
        elif z["distance_km"] <= GEOFENCE_WARN_KM:
            severity, message = "warning", t("gf_msg_approach", lang, zone=name,
                                             distance=z["distance_km"])
        else:
            continue
        alerts.append(GeofenceAlert(zone_name=name, zone_type=z["zone_type"],
                                    distance_km=z["distance_km"], inside=z["inside"],
                                    severity=severity, message=message))  # type: ignore[arg-type]

    nearest_zone = zones[0] if zones else None

    return AgentResult(
        agent="gis",
        ok=True,
        location=location,
        data={
            "distance_from_shore_km": round(offshore_km, 1),
            "nearest_landing_centre": port["name"],
            "state": port["state"],
            "zones_nearby": zones,
            "nearest_zone_km": None if not nearest_zone else nearest_zone["distance_km"],
            "nearest_zone_name": None if not nearest_zone else nearest_zone["name"],
            "inside_restricted_zone": bool(nearest_zone and nearest_zone["inside"]),
            "geofence_alerts": [a.model_dump() for a in alerts],
            "layer_note": "Illustrative demo geofences — not official maritime boundaries.",
        },
        source="ORCA_GIS",
        timestamp=stamp,
        confidence=0.9,
        mode="DEMO",
    )
