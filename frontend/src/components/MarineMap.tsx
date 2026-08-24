import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import * as api from "../api";
import type {
  FishingArea,
  GeofenceAlert,
  Language,
  Location,
  PFZZone,
  PositionCheck,
  RouteOption,
  ZoneFeature,
} from "../types";
import { RATING_COLOR } from "./FishingPanel";

const ZONE_COLOR: Record<string, string> = {
  critical: "#E05B4A",
  warning: "#E08A3C",
  info: "#3FA0E0",
};

const HINT: Record<Language, string> = {
  en: "Drag the boat to check any position",
  hi: "किसी भी स्थान की जाँच के लिए नाव खींचें",
  mr: "कोणतेही ठिकाण तपासण्यासाठी होडी ओढा",
};

const STATUS_STYLE: Record<PositionCheck["status"], string> = {
  clear: "bg-emerald-500/90",
  warning: "bg-amber-500/90",
  critical: "bg-red-600/95",
};

/**
 * Leaflet map with a draggable vessel marker.
 *
 * Custom divIcons throughout so we never depend on Leaflet's default marker
 * image assets, which break under bundlers and would 404 with no network.
 */
export default function MarineMap({
  origin,
  zones,
  pfz,
  areas = [],
  radiusKm,
  routes,
  geofence,
  language = "en",
  onPickLocation,
  focusRank,
}: {
  origin: Location | null;
  zones: ZoneFeature[];
  pfz: PFZZone[];
  /** Scored fishing grounds — takes precedence over `pfz` when present. */
  areas?: FishingArea[];
  radiusKm?: number;
  routes: RouteOption[];
  geofence: GeofenceAlert[];
  language?: Language;
  /** Tap anywhere on the water to move the fisher's position. */
  onPickLocation?: (lat: number, lon: number) => void;
  focusRank?: number | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const boatRef = useRef<L.Marker | null>(null);
  const [probe, setProbe] = useState<PositionCheck | null>(null);
  const [dragging, setDragging] = useState(false);
  const mapHeight = areas.length ? 560 : 430;

  // Leaflet caches the container size, so tell it whenever the height changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const id = window.setTimeout(() => map.invalidateSize(), 60);
    return () => window.clearTimeout(id);
  }, [mapHeight]);

  // ---- init once -------------------------------------------------------
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    }).setView([18.92, 72.6], 10);

    L.control.zoom({ position: "topright" }).addTo(map);

    // Dark basemap to match the console; OSM standard as the fallback.
    const dark = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      },
    );
    let fellBack = false;
    dark.on("tileerror", () => {
      if (fellBack) return;
      fellBack = true;
      map.removeLayer(dark);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
    });
    dark.addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    setTimeout(() => map.invalidateSize(), 120);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Tap-to-choose-position. Registered separately so the handler always closes
  // over the latest callback rather than the one from first render.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onPickLocation) return;
    const handler = (e: L.LeafletMouseEvent) =>
      onPickLocation(+e.latlng.lat.toFixed(4), +e.latlng.lng.toFixed(4));
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [onPickLocation]);

  // ---- redraw content --------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const group = layerRef.current;
    if (!map || !group) return;
    group.clearLayers();
    boatRef.current = null;
    setProbe(null);

    const bounds: L.LatLngExpression[] = [];

    // search radius — shows exactly how far ORCA looked for grounds
    if (origin && radiusKm) {
      L.circle([origin.latitude, origin.longitude], {
        radius: radiusKm * 1000,
        color: "#9FCBEF",
        weight: 2,
        opacity: 0.85,
        dashArray: "10 9",
        fillColor: "#7FB2E5",
        fillOpacity: 0.055,
        interactive: false,
      })
        .bindTooltip(`${radiusKm} km search area`, { permanent: false, direction: "top" })
        .addTo(group);
    }

    // restricted zones
    zones.forEach((z) => {
      const ring = z.geometry.coordinates[0].map(([lon, lat]) => [lat, lon] as [number, number]);
      const color = ZONE_COLOR[z.properties.severity] ?? "#E05B4A";
      L.polygon(ring, {
        color,
        weight: 2.5,
        dashArray: "8 6",
        fillColor: color,
        fillOpacity: 0.22,
      })
        .bindPopup(
          `<b>${z.properties.name}</b><br/><span style="opacity:.75">${z.properties.zone_type.replace(/_/g, " ")}</span><br/><span style="font-size:10px;opacity:.6">${z.properties.note}</span>`,
        )
        .addTo(group);
    });

    // routes (under the pins)
    routes.forEach((r) => {
      const line = r.legs.map((l) => [l.latitude, l.longitude] as [number, number]);
      line.forEach((p) => bounds.push(p));
      const rec = r.recommended;
      L.polyline(line, {
        color: rec ? "#2FBF71" : "#8FA6C4",
        weight: rec ? 5 : 3,
        opacity: rec ? 0.95 : 0.6,
        dashArray: rec ? "14 10" : "5 9",
      })
        .bindPopup(
          `<b>${r.name}</b><br/>${r.distance_km} km · ${Math.round(r.eta_minutes)} min<br/><span style="font-size:11px;opacity:.8">${r.notes}</span>`,
        )
        .addTo(group);
    });

    // fishing grounds — scored areas when available, otherwise chat PFZ pins
    if (areas.length) {
      areas.forEach((a) => {
        const best = a.rank === 1;
        const size = best ? 42 : 34;
        const color = RATING_COLOR[a.rating];
        const focused = focusRank === a.rank;
        L.marker([a.latitude, a.longitude], {
          zIndexOffset: best ? 500 : 0,
          icon: L.divIcon({
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            html: `<div style="position:relative;width:${size}px;height:${size}px">
                     ${focused ? `<div style="position:absolute;inset:-8px;border-radius:50%;
                        border:2px solid ${color};animation:ping2 1.6s cubic-bezier(0,0,.2,1) infinite"></div>` : ""}
                     <div style="position:absolute;inset:0;border-radius:50%;background:${color};
                       border:3px solid rgba(255,255,255,.92);display:flex;flex-direction:column;
                       align-items:center;justify-content:center;line-height:1;
                       box-shadow:0 4px 16px rgba(0,0,0,.6);color:#08131f">
                       <span style="font:800 ${best ? 14 : 12}px Inter,sans-serif">${a.rank}</span>
                       <span style="font:700 ${best ? 9 : 8}px Inter,sans-serif;opacity:.85">${a.probability}%</span>
                     </div>
                   </div>`,
          }),
        })
          .bindPopup(
            `<b>Area ${a.rank}</b> — ${a.probability}% chance of fish<br/>
             ${Math.round(a.distance_km)} km ${a.bearing}<br/>
             SST ${a.sst_c ?? "—"} °C · chlorophyll ${a.chlorophyll_mg_m3 ?? "—"} mg/m³<br/>
             <span style="font-size:10px;opacity:.65">A likelihood from the data — never a guarantee of fish.</span>`,
          )
          .addTo(group);
        bounds.push([a.latitude, a.longitude]);
      });
    } else {
      pfz.forEach((z) => {
        const best = z.rank === 1;
        const size = best ? 36 : 29;
        const color = best ? "#2FBF71" : "#3FA0E0";
        L.marker([z.latitude, z.longitude], {
          icon: L.divIcon({
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};
                     border:3px solid rgba(255,255,255,.92);display:grid;place-items:center;
                     color:#08131f;font:800 ${best ? 15 : 13}px Inter,sans-serif;
                     box-shadow:0 4px 14px rgba(0,0,0,.55)">${z.rank}</div>`,
          }),
        })
          .bindPopup(
            `<b>Fishing zone #${z.rank}</b><br/>${z.distance_km} km ${z.bearing}<br/>
             SST ${z.sst_c ?? "—"} °C · chlorophyll ${z.chlorophyll_mg_m3 ?? "—"} mg/m³<br/>
             confidence ${Math.round(z.confidence * 100)}%<br/>
             <span style="font-size:10px;opacity:.65">Potential zone — not a guarantee of fish.</span>`,
          )
          .addTo(group);
        bounds.push([z.latitude, z.longitude]);
      });
    }

    // draggable vessel
    if (origin) {
      const boat = L.marker([origin.latitude, origin.longitude], {
        draggable: true,
        autoPan: true,
        icon: L.divIcon({
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          // Inline SVG rather than an emoji: emoji glyphs vary by OS and can
          // fail to render entirely on a projector/kiosk machine.
          html: `<div style="position:relative;width:30px;height:30px;cursor:grab">
                   <div style="position:absolute;inset:-9px;border-radius:50%;
                     border:2px solid rgba(127,178,229,.65);
                     animation:ping2 2s cubic-bezier(0,0,.2,1) infinite"></div>
                   <div style="position:absolute;inset:0;border-radius:50%;background:#1F497D;
                     border:3px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,.6);
                     display:grid;place-items:center">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="#fff" stroke-width="2.2" stroke-linecap="round"
                          stroke-linejoin="round">
                       <path d="M12 3v10"/><path d="M12 5l7 8H5l7-8z" fill="#fff" stroke="none"/>
                       <path d="M3 17c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0"/>
                     </svg>
                   </div>
                 </div>`,
        }),
      })
        .bindPopup(`<b>${origin.name}</b><br/>Drag me anywhere to check that position`)
        .addTo(group);

      boat.on("dragstart", () => setDragging(true));
      boat.on("dragend", async () => {
        setDragging(false);
        const { lat, lng } = boat.getLatLng();
        try {
          setProbe(await api.checkPosition(+lat.toFixed(4), +lng.toFixed(4)));
        } catch {
          setProbe(null);
        }
      });

      boatRef.current = boat;
      bounds.push([origin.latitude, origin.longitude]);
    }

    if (bounds.length > 1) map.fitBounds(L.latLngBounds(bounds).pad(0.22), { animate: true });
    else if (origin) map.setView([origin.latitude, origin.longitude], 10, { animate: true });
  }, [origin, zones, pfz, areas, routes, radiusKm, focusRank]);

  // Fly to a ground when the user taps its card in the list.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusRank) return;
    const target = areas.find((a) => a.rank === focusRank);
    if (target) map.flyTo([target.latitude, target.longitude], 11, { duration: 0.8 });
  }, [focusRank, areas]);

  const critical = geofence.filter((g) => g.severity === "critical");
  const banner =
    probe != null
      ? { style: STATUS_STYLE[probe.status], text: probe.headline, sub: probeSub(probe) }
      : critical.length
        ? { style: STATUS_STYLE.critical, text: critical[0].message, sub: null }
        : null;

  return (
    <div className="card relative overflow-hidden">
      {/*
        The height is an inline style on purpose. Leaflet adds its own classes
        (leaflet-container, leaflet-touch, ...) to this element on mount; a
        conditional `className` makes React rewrite the whole class attribute
        when it changes, silently removing them. Without leaflet-container the
        library's CSS stops applying, the tile panes collapse to 0x0 and every
        tile renders at zero width — tiles download fine, the map just vanishes.
        React writes style properties individually, so this leaves classes alone.
      */}
      <div ref={containerRef} className="w-full" style={{ height: mapHeight }} />

      {/* legend */}
      <div className="pointer-events-none absolute bottom-6 left-3 z-[500] space-y-1.5">
        {[
          ["#2FBF71", "Very good chance"],
          ["#D9A63C", "Some chance"],
          ["#E05B4A", "Do not enter"],
        ].map(([c, label]) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-lg bg-ocean-950/85 px-2.5 py-1 text-[11px] font-medium text-ocean-100 backdrop-blur"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-lg bg-ocean-950/85 px-2.5 py-1 text-[11px] font-medium text-ocean-100 backdrop-blur">
          <span className="h-0.5 w-5 rounded" style={{ background: "#2FBF71" }} />
          Safest route
        </div>
      </div>

      {/* drag hint */}
      {origin && !probe && !dragging && (
        <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-lg bg-ocean-950/85 px-2.5 py-1.5 text-[11px] font-medium text-ocean-200 backdrop-blur">
          ⛵ {HINT[language] ?? HINT.en}
        </div>
      )}

      {/* live geofence banner */}
      {banner && (
        <div
          className={`absolute right-3 top-3 z-[500] max-w-[64%] animate-rise rounded-xl px-3 py-2 text-[12px] font-semibold text-white shadow-xl backdrop-blur ${banner.style}`}
        >
          <div>{probe?.status === "clear" ? "✓" : "⚠"} {banner.text}</div>
          {banner.sub && <div className="mt-0.5 font-mono text-[10px] opacity-85">{banner.sub}</div>}
        </div>
      )}
    </div>
  );
}

function probeSub(p: PositionCheck): string {
  const bits: string[] = [];
  if (p.distance_from_shore_km != null) bits.push(`${p.distance_from_shore_km} km offshore`);
  if (p.nearest_zone_name && p.nearest_zone_km != null && !p.inside_restricted_zone)
    bits.push(`${p.nearest_zone_name}: ${p.nearest_zone_km} km`);
  return bits.join(" · ");
}
