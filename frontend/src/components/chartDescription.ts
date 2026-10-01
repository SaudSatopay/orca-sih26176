import type {
  CatchRating,
  FishingArea,
  GeofenceAlert,
  Location,
  MarineAlert,
  PFZZone,
  RouteOption,
  ZoneFeature,
} from "../types";
import { fill } from "./todayModel";

/**
 * The chart, in words. A map is a picture; this is the same content as an
 * ordered list a screen reader can walk: where you are, the grounds best
 * first, the areas to keep out of, the course, any storm. It is built from
 * exactly the props the map draws from, so the two cannot drift apart.
 */

/** The strings the description is written with, already in one language. */
export interface ChartWords {
  map: Record<string, string>;
  zoneType: Record<string, string>;
  zoneStatus: Record<"critical" | "warning" | "info", string>;
  course: Record<"safest" | "shortest" | "alternate", string>;
  rating: Record<CatchRating, string>;
}

export interface ChartContent {
  origin: Location | null;
  radiusKm?: number;
  areas: FishingArea[];
  pfz: PFZZone[];
  zones: ZoneFeature[];
  geofence: GeofenceAlert[];
  routes: RouteOption[];
  alerts: MarineAlert[];
}

/** 18.95 → "18.95°N"; −4.2 → "4.20°S". */
export function latText(lat: number): string {
  return `${Math.abs(lat).toFixed(2)}°${lat < 0 ? "S" : "N"}`;
}
export function lonText(lon: number): string {
  return `${Math.abs(lon).toFixed(2)}°${lon < 0 ? "W" : "E"}`;
}

/** Great-circle distance in kilometres. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Distance from a point to the middle of a restricted area's outline. */
export function zoneDistanceKm(origin: Location, zone: ZoneFeature): number | null {
  const ring = zone.geometry.coordinates[0] ?? [];
  if (!ring.length) return null;
  const lon = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const lat = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  return haversineKm(origin.latitude, origin.longitude, lat, lon);
}

/** A restricted area is "on the chart" for a fisher within this much of the search radius. */
const ZONE_MARGIN_KM = 60;
/** With no position to measure from, name at most this many areas. */
const ZONE_LIMIT = 8;

type Severity = "critical" | "warning" | "info";
const severityOf = (s: string): Severity => (s === "warning" || s === "info" ? s : "critical");

/**
 * The restricted areas worth naming, nearest first: those within the search
 * radius (plus a margin) of the fisher, or the first few when there is no
 * position yet.
 */
export function nearbyZones(
  origin: Location | null,
  zones: ZoneFeature[],
  radiusKm = 100,
): { zone: ZoneFeature; km: number | null }[] {
  if (!origin) return zones.slice(0, ZONE_LIMIT).map((zone) => ({ zone, km: null }));
  return zones
    .map((zone) => ({ zone, km: zoneDistanceKm(origin, zone) }))
    .filter((z) => z.km != null && z.km <= radiusKm + ZONE_MARGIN_KM)
    .sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
}

export function describeChart(c: ChartContent, w: ChartWords): string[] {
  const t = w.map;
  const out: string[] = [];

  if (c.origin) {
    let line = fill(t.you, {
      place: c.origin.name,
      lat: latText(c.origin.latitude),
      lon: lonText(c.origin.longitude),
    });
    if (c.radiusKm) line += ` ${fill(t.radius, { km: Math.round(c.radiusKm) })}`;
    out.push(line);
  }

  // Where the fisher already is comes before where he might go.
  for (const g of c.geofence) if (g.inside) out.push(fill(t.inside, { name: g.zone_name }));

  // Grounds, best first. Scored grounds take precedence over raw zones,
  // exactly as on the chart.
  if (c.areas.length) {
    for (const a of [...c.areas].sort((x, y) => x.rank - y.rank)) {
      let line = fill(t.ground, {
        rank: a.rank,
        km: Math.round(a.distance_km),
        bearing: a.bearing,
        p: a.probability,
        rating: w.rating[a.rating],
      });
      if (a.recommended) line += ` ${t.groundBest}`;
      out.push(line);
    }
  } else {
    for (const z of [...c.pfz].sort((x, y) => x.rank - y.rank))
      out.push(
        fill(t.zone, {
          rank: z.rank,
          km: Math.round(z.distance_km),
          bearing: z.bearing,
          p: Math.round(z.confidence * 100),
        }),
      );
  }

  for (const { zone, km } of nearbyZones(c.origin, c.zones, c.radiusKm)) {
    const p = zone.properties;
    let line = fill(t.area, {
      name: p.name,
      type: w.zoneType[p.zone_type] ?? w.zoneType.other,
      status: w.zoneStatus[severityOf(p.severity)],
    });
    if (km != null) line += ` ${fill(t.areaNear, { km: Math.round(km) })}`;
    out.push(line);
  }

  // The recommended course first, then the others.
  for (const r of [...c.routes].sort((x, y) => Number(y.recommended) - Number(x.recommended)))
    out.push(
      fill(r.recommended ? t.courseBest : t.courseOther, {
        name: w.course[r.kind] ?? r.name,
        km: r.distance_km,
        min: Math.round(r.eta_minutes),
      }),
    );

  for (const al of c.alerts) {
    const s = al.storm;
    if (!s) continue;
    out.push(
      fill(t.storm, {
        headline: al.headline,
        km: Math.round(s.radius_km),
        lat: latText(s.latitude),
        lon: lonText(s.longitude),
      }),
    );
    if (s.track && s.track.length > 1)
      out.push(fill(t.track, { labels: s.track.map((p) => p.label).join(", ") }));
  }

  return out.length ? out : [t.nothing];
}
