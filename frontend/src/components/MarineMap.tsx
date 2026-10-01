import L from "leaflet";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import * as api from "../api";
import { FlowLayer, type FlowMode } from "./FlowLayer";
import type {
  FishingArea,
  GeofenceAlert,
  Language,
  Location,
  MarineAlert,
  PFZZone,
  PositionCheck,
  RouteOption,
  ZoneFeature,
} from "../types";
import { RATING_COLOR } from "../risk";
import { CompassMark } from "./glyphs";
import { ChevronGlyph } from "./viewGlyphs";
import { RATING_WORD } from "../i18n/fishing";
import { COURSE, HINT, LEGEND, MAP, ZONE_STATUS, ZONE_TYPE } from "../i18n/marineMap";
import { alpha, chance, chart, ink, paper, risk, sst, typePx } from "../tokens";
import { describeChart } from "./chartDescription";
import { fill } from "./todayModel";
import "./views.css";

/** Zone stroke colours; the fills are true chart hatching via CSS patterns. */
const ZONE_COLOR: Record<string, string> = {
  critical: risk.extreme,
  warning: risk.high,
  info: chart[500],
};

const STATUS_STYLE: Record<PositionCheck["status"], string> = {
  clear: "bg-risk-low",
  warning: "bg-risk-high",
  critical: "bg-risk-extreme",
};

const SERIF = `'Fraunces Variable','Noto Serif Devanagari Variable',Georgia,serif`;
const MONO = `'Spline Sans Mono Variable',Consolas,monospace`;
const FLOW_MODES: FlowMode[] = ["wind", "current", "off"];

/** Backend text goes into popups as HTML: keep it text. */
function esc(s: unknown): string {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] ?? ch,
  );
}
const small = (html: string, px: number = typePx.label) =>
  `<span style="font-size:${px}px;opacity:.75">${html}</span>`;

/** A narrow chart keeps its key folded so the key does not cover the sea. */
const startsNarrow = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(max-width: 480px)").matches;

/**
 * Leaflet map presented as a chart sheet: paper margin, tick marks, double
 * neatline, compass rose, hatched danger areas, plotted courses.
 *
 * Custom divIcons throughout so we never depend on Leaflet's default marker
 * image assets, which break under bundlers and would 404 with no network.
 *
 * The picture has a written twin: an ordered description of everything drawn
 * (see chartDescription.ts), kept beside the map for screen readers and built
 * from the same props, so the two cannot drift apart.
 */
export default function MarineMap({
  origin,
  zones,
  pfz,
  areas = [],
  radiusKm,
  routes,
  geofence,
  alerts = [],
  language = "en",
  onPickLocation,
  focusRank,
  heightPx,
}: {
  origin: Location | null;
  zones: ZoneFeature[];
  pfz: PFZZone[];
  /** Scored fishing grounds — takes precedence over `pfz` when present. */
  areas?: FishingArea[];
  radiusKm?: number;
  routes: RouteOption[];
  geofence: GeofenceAlert[];
  /** Official warnings; those carrying `storm` geometry are drawn on the chart. */
  alerts?: MarineAlert[];
  /** Fixed map height (px) — the phone layout sizes the chart to the screen. */
  heightPx?: number;
  language?: Language;
  /** Tap anywhere on the water to move the fisher's position. */
  onPickLocation?: (lat: number, lon: number) => void;
  focusRank?: number | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const boatRef = useRef<L.Marker | null>(null);
  const flowRef = useRef<FlowLayer | null>(null);
  const flowButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const [flowMode, setFlowMode] = useState<FlowMode>("wind");
  const [probe, setProbe] = useState<PositionCheck | null>(null);
  const [dragging, setDragging] = useState(false);
  const [keyOpen, setKeyOpen] = useState(() => !startsNarrow());
  // The grounds view (a search radius is given) is tall from the first paint,
  // so the sheet does not jump when the grounds arrive.
  const mapHeight = heightPx ?? (areas.length || radiusKm ? 540 : 420);
  const keyId = useId();

  const legend = LEGEND[language] ?? LEGEND.en;
  const tx = MAP[language] ?? MAP.en;

  // The chart in words, in step with what is drawn below.
  const description = useMemo(
    () =>
      describeChart(
        { origin, radiusKm, areas, pfz, zones, geofence, routes, alerts },
        {
          map: MAP[language] ?? MAP.en,
          zoneType: ZONE_TYPE[language] ?? ZONE_TYPE.en,
          zoneStatus: ZONE_STATUS[language] ?? ZONE_STATUS.en,
          course: COURSE[language] ?? COURSE.en,
          rating: RATING_WORD[language] ?? RATING_WORD.en,
        },
      ),
    [origin, radiusKm, areas, pfz, zones, geofence, routes, alerts, language],
  );

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
    // SVG renderer (not canvas): zone polygons take CSS pattern fills, and the
    // recommended course animates its dashes — neither works on canvas.
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([18.92, 72.6], 10);

    L.control.zoom({ position: "topleft" }).addTo(map);

    // OSM standard tiles — keyless and never watermarked. CARTO's free
    // basemaps started stamping "API KEY REQUIRED" over anonymous raster
    // tiles mid-demo-rehearsal; a basemap that can silently start demanding
    // a key is not acceptable on stage. The sepia tile filter in index.css
    // warms OSM's palette to match the paper.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    flowRef.current = new FlowLayer(map);
    flowRef.current.setMode("wind");
    const settle = window.setTimeout(() => map.invalidateSize(), 120);
    return () => {
      window.clearTimeout(settle);
      flowRef.current?.destroy();
      flowRef.current = null;
      // Leaflet leaves its zoom-animation timer running after remove(); if the
      // chart is unmounted mid-zoom (a tab change during fitBounds) the timer
      // fires on a dead map and throws. Stop the motion and tell it the
      // animation is over before the map goes.
      map.stop();
      (map as unknown as { _animatingZoom?: boolean })._animatingZoom = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    flowRef.current?.setMode(flowMode);
  }, [flowMode]);

  // The zoom buttons are Leaflet's; their names follow the language.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const name = (selector: string, label: string) => {
      const el = root.querySelector(selector);
      el?.setAttribute("title", label);
      el?.setAttribute("aria-label", label);
    };
    name(".leaflet-control-zoom-in", tx.zoomIn);
    name(".leaflet-control-zoom-out", tx.zoomOut);
  }, [tx]);

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

    const t = MAP[language] ?? MAP.en;
    const zoneType = ZONE_TYPE[language] ?? ZONE_TYPE.en;
    const zoneStatus = ZONE_STATUS[language] ?? ZONE_STATUS.en;
    const course = COURSE[language] ?? COURSE.en;
    const bounds: L.LatLngExpression[] = [];

    // search radius — shows exactly how far ORCA looked for grounds
    if (origin && radiusKm) {
      L.circle([origin.latitude, origin.longitude], {
        radius: radiusKm * 1000,
        color: chart[500],
        weight: 1.6,
        opacity: 0.75,
        dashArray: "2 7",
        fillColor: chart[500],
        fillOpacity: 0.03,
        interactive: false,
        className: "radius-drift",
      })
        .bindTooltip(fill(t.searchArea, { km: Math.round(radiusKm) }), {
          permanent: false,
          direction: "top",
        })
        .addTo(group);
    }

    // restricted zones — hatched like chart danger areas
    zones.forEach((z) => {
      const ring = z.geometry.coordinates[0].map(([lon, lat]) => [lat, lon] as [number, number]);
      const severity = z.properties.severity in ZONE_COLOR ? z.properties.severity : "critical";
      const color = ZONE_COLOR[severity];
      L.polygon(ring, {
        color,
        weight: 2,
        dashArray: "9 5",
        className: `zone-hatch-${severity}`,
      })
        .bindPopup(
          `<b>${esc(z.properties.name)}</b><br/>` +
            `${esc(zoneType[z.properties.zone_type] ?? zoneType.other)} · ` +
            `<b style="font-family:inherit;font-size:inherit">${esc(
              zoneStatus[severity as "critical" | "warning" | "info"],
            )}</b><br/>` +
            small(esc(z.properties.note)),
        )
        .addTo(group);
    });

    // official warnings with geometry — the storm is DRAWN, not just recited
    alerts.forEach((al) => {
      const s = al.storm;
      if (!s) return;
      const isCyclone = al.type === "cyclone_warning";

      // warning area, hatched like every danger area on this chart
      L.circle([s.latitude, s.longitude], {
        radius: s.radius_km * 1000,
        color: risk.extreme,
        weight: 2,
        opacity: 0.9,
        dashArray: "10 6",
        className: "zone-hatch-critical",
        interactive: false,
      }).addTo(group);

      // past + forecast track with timestamped position dots
      const track = s.track ?? [];
      if (track.length > 1) {
        const line = track.map((p) => [p.latitude, p.longitude] as [number, number]);
        L.polyline(line, {
          color: risk.extreme,
          weight: 2.5,
          opacity: 0.85,
          dashArray: "3 7",
          className: "route-live",
        }).addTo(group);
        track.forEach((p) => {
          L.marker([p.latitude, p.longitude], {
            // The track is read out in the written description; its dots are
            // not separate stops for the keyboard.
            keyboard: false,
            icon: L.divIcon({
              className: "",
              iconSize: [11, 11],
              iconAnchor: [5.5, 5.5],
              html: `<div style="width:11px;height:11px;border-radius:50%;background:${paper[50]};
                       border:2.5px solid ${risk.extreme};box-shadow:0 1px 4px ${alpha(ink[900], 0.4)}"></div>`,
            }),
          })
            .bindTooltip(esc(p.label), { direction: "top", offset: [0, -6] })
            .addTo(group);
          bounds.push([p.latitude, p.longitude]);
        });
      }

      // the storm itself — the meteorological symbol, turning
      if (isCyclone) {
        L.marker([s.latitude, s.longitude], {
          zIndexOffset: 800,
          title: al.headline,
          icon: L.divIcon({
            className: "",
            iconSize: [56, 56],
            iconAnchor: [28, 28],
            html: `<div class="storm-spin" style="width:56px;height:56px;
                        filter:drop-shadow(0 0 3px ${alpha(paper[100], 0.95)}) drop-shadow(0 2px 6px ${alpha(ink[900], 0.35)})">
                     <svg viewBox="0 0 56 56" width="56" height="56" fill="none" aria-hidden="true">
                       <path d="M28 5 A 23 23 0 0 1 51 28" stroke="${risk.extreme}" stroke-width="6" stroke-linecap="round"/>
                       <path d="M28 51 A 23 23 0 0 1 5 28" stroke="${risk.extreme}" stroke-width="6" stroke-linecap="round"/>
                       <circle cx="28" cy="28" r="10.5" fill="${risk.extreme}"/>
                       <circle cx="28" cy="28" r="4" fill="${paper[50]}"/>
                     </svg>
                   </div>`,
          }),
        })
          .bindTooltip(esc(al.headline), {
            permanent: true,
            direction: "top",
            offset: [0, -32],
            className: "storm-label",
          })
          .bindPopup(
            `<b>${esc(al.headline)}</b><br/>${esc(al.detail)}<br/>` +
              small(`${esc(al.source)} · ${esc(t.stormNote)}`),
          )
          .addTo(group);
      }
      bounds.push([s.latitude, s.longitude]);
    });

    // plotted courses (under the pins)
    routes.forEach((r) => {
      const line = r.legs.map((l) => [l.latitude, l.longitude] as [number, number]);
      line.forEach((p) => bounds.push(p));
      const rec = r.recommended;
      L.polyline(line, {
        color: rec ? risk.low : ink[400],
        weight: rec ? 4 : 2.5,
        opacity: rec ? 0.95 : 0.55,
        dashArray: rec ? "12 12" : "2 8",
        className: rec ? "route-live" : "",
      })
        .bindPopup(
          `<b>${esc(course[r.kind] ?? r.name)}</b><br/>` +
            `${r.distance_km} km · ${Math.round(r.eta_minutes)} ${esc(t.minutes)}<br/>` +
            small(esc(r.notes), typePx.readout),
        )
        .addTo(group);
    });

    // fishing grounds as numbered buoys: paper face, rating-coloured ring,
    // rank set in the chart's serif, probability as a sounding beneath it.
    if (areas.length) {
      areas.forEach((a) => {
        const best = a.rank === 1;
        const size = best ? 46 : 38;
        const color = RATING_COLOR[a.rating];
        const focused = focusRank === a.rank;
        const title = `${fill(t.areaTitle, { rank: a.rank })}: ${fill(t.chance, { p: a.probability })}`;
        L.marker([a.latitude, a.longitude], {
          zIndexOffset: best ? 500 : 0,
          title,
          icon: L.divIcon({
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            html: `<div class="bob" style="position:relative;width:${size}px;height:${size}px;
                        animation-delay:${((a.rank * 7) % 10) / 3}s">
                     ${focused ? `<div style="position:absolute;inset:-8px;border-radius:50%;
                        border:2px solid ${color};animation:ping2 1.6s cubic-bezier(0,0,.2,1) infinite"></div>` : ""}
                     <div class="buoy" style="position:absolute;inset:0;border-radius:50%;background:${paper[50]};
                       border:${best ? 4 : 3.5}px solid ${color};display:flex;flex-direction:column;
                       align-items:center;justify-content:center;line-height:1;gap:1px;
                       box-shadow:0 3px 10px ${alpha(ink[900], 0.4)};color:${ink[900]}">
                       <span style="font:${best ? `800 ${typePx.subtitle}px` : `700 ${typePx.prose}px`} ${SERIF}">${a.rank}</span>
                       <span style="font:600 ${typePx.micro}px ${MONO};color:${ink[500]}">${a.probability}%</span>
                     </div>
                   </div>`,
          }),
        })
          .bindPopup(
            `<b>${esc(fill(t.areaTitle, { rank: a.rank }))}</b> · ${esc(fill(t.chance, { p: a.probability }))}<br/>` +
              `${Math.round(a.distance_km)} km ${esc(a.bearing)}<br/>` +
              `${esc(fill(t.water, { sst: a.sst_c ?? "—", chl: a.chlorophyll_mg_m3 ?? "—" }))}<br/>` +
              (a.likely_species?.length
                ? `${esc(fill(t.likely, { list: a.likely_species.join(", ") }))}<br/>`
                : "") +
              small(esc(t.noGuarantee)),
          )
          .addTo(group);
        bounds.push([a.latitude, a.longitude]);
      });
    } else {
      pfz.forEach((z) => {
        const best = z.rank === 1;
        const size = best ? 40 : 32;
        const color = best ? risk.low : chart[500];
        const pct = Math.round(z.confidence * 100);
        L.marker([z.latitude, z.longitude], {
          title: `${fill(t.zoneTitle, { rank: z.rank })}: ${fill(t.chance, { p: pct })}`,
          icon: L.divIcon({
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            html: `<div class="bob" style="width:${size}px;height:${size}px;animation-delay:${((z.rank * 7) % 10) / 3}s">
                     <div class="buoy" style="width:100%;height:100%;border-radius:50%;background:${paper[50]};
                       border:${best ? 4 : 3}px solid ${color};display:grid;place-items:center;
                       color:${ink[900]};font:${best ? `800 ${typePx.subtitle}px` : `700 ${typePx.body}px`} ${SERIF};
                       box-shadow:0 3px 10px ${alpha(ink[900], 0.4)}">${z.rank}</div>
                   </div>`,
          }),
        })
          .bindPopup(
            `<b>${esc(fill(t.zoneTitle, { rank: z.rank }))}</b> · ${esc(fill(t.chance, { p: pct }))}<br/>` +
              `${z.distance_km} km ${esc(z.bearing)}<br/>` +
              `${esc(fill(t.water, { sst: z.sst_c ?? "—", chl: z.chlorophyll_mg_m3 ?? "—" }))}<br/>` +
              small(esc(t.noGuarantee)),
          )
          .addTo(group);
        bounds.push([z.latitude, z.longitude]);
      });
    }

    // draggable vessel — ink boat on a paper disc
    if (origin) {
      const boat = L.marker([origin.latitude, origin.longitude], {
        draggable: true,
        autoPan: true,
        title: fill(t.boat, { place: origin.name }),
        icon: L.divIcon({
          className: "",
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          // Inline SVG rather than an emoji: emoji glyphs vary by OS and can
          // fail to render entirely on a projector/kiosk machine.
          html: `<div class="roll" style="position:relative;width:34px;height:34px;cursor:grab">
                   <div style="position:absolute;inset:-9px;border-radius:50%;
                     border:2px solid ${alpha(chart[500], 0.6)};
                     animation:ping2 2s cubic-bezier(0,0,.2,1) infinite"></div>
                   <div class="buoy" style="position:absolute;inset:0;border-radius:50%;background:${ink[900]};
                     border:2.5px solid ${paper[50]};box-shadow:0 3px 10px ${alpha(ink[900], 0.5)};
                     display:grid;place-items:center">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                          stroke="${paper[50]}" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round">
                       <path d="M12 3v10"/><path d="M12 5l7 8H5l7-8z" fill="${paper[50]}" stroke="none"/>
                       <path d="M3 17c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0"/>
                     </svg>
                   </div>
                 </div>`,
        }),
      })
        .bindPopup(`<b>${esc(origin.name)}</b><br/>${esc(t.dragMe)}`)
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
  }, [origin, zones, pfz, areas, routes, radiusKm, focusRank, alerts, language]);

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
      ? { style: STATUS_STYLE[probe.status], text: probe.headline, sub: probeSub(probe, tx) }
      : critical.length
        ? { style: STATUS_STYLE.critical, text: critical[0].message, sub: null }
        : null;

  // Radio group: arrows move the choice and the focus together.
  const onFlowKey = (e: React.KeyboardEvent, i: number) => {
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + FLOW_MODES.length) % FLOW_MODES.length;
    setFlowMode(FLOW_MODES[next]);
    flowButtons.current[next]?.focus();
  };

  const keyRow = "flex items-center gap-2 py-[1.5px] text-label font-medium text-ink-700";

  return (
    <div className="chart-sheet min-w-0">
      <div className="chart-frame" data-key={keyOpen ? "open" : "closed"}>
        {/*
          The height is an inline style on purpose. Leaflet adds its own classes
          (leaflet-container, leaflet-touch, ...) to this element on mount; a
          conditional `className` makes React rewrite the whole class attribute
          when it changes, silently removing them. Without leaflet-container the
          library's CSS stops applying, the tile panes collapse to 0x0 and every
          tile renders at zero width — tiles download fine, the map just vanishes.
          React writes style properties individually, so this leaves classes alone.
        */}
        <div
          ref={containerRef}
          className="w-full"
          style={{ height: mapHeight }}
          role="region"
          aria-label={origin ? fill(tx.mapLabel, { place: origin.name }) : tx.mapLabelBare}
        />

        {/* compass rose, printed on the water */}
        <CompassMark
          size={62}
          className="pointer-events-none absolute right-3 top-3 z-[500] text-ink-800 opacity-70"
        />

        {/* the sea in motion — flow layer control */}
        <div className="absolute left-3 top-[92px] z-[500] rounded-[2px] border border-ink-700/50 bg-paper-50/95 px-2 pb-2 pt-1.5 shadow-md">
          <div
            id={`${keyId}-flow`}
            className="mb-1 font-mono text-micro font-bold uppercase tracking-[0.16em] text-ink-500"
          >
            {legend.flow}
          </div>
          <div role="radiogroup" aria-labelledby={`${keyId}-flow`} className="flex gap-1">
            {FLOW_MODES.map((m, i) => (
              <button
                key={m}
                ref={(el) => {
                  flowButtons.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={flowMode === m}
                tabIndex={flowMode === m ? 0 : -1}
                onClick={() => setFlowMode(m)}
                onKeyDown={(e) => onFlowKey(e, i)}
                className="v-seg v-press px-1.5 py-0.5 font-mono text-label font-bold"
              >
                {legend[m]}
              </button>
            ))}
          </div>
        </div>

        {/* symbols legend, as a chart's key: folds away so it never hides the sea */}
        <div className="v-map-key absolute bottom-3 left-3 z-[500] rounded-[2px] border border-ink-700/50 bg-paper-50/95 shadow-md">
          <button
            type="button"
            aria-expanded={keyOpen}
            aria-controls={keyId}
            title={keyOpen ? tx.hideKey : tx.showKey}
            onClick={() => setKeyOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-3 py-1.5 font-mono text-micro font-bold uppercase tracking-[0.16em] text-ink-500"
          >
            {legend.symbols}
            <span className="rotate-180 text-ink-700">
              <ChevronGlyph size={9} className="v-chevron" />
            </span>
          </button>
          <div id={keyId} hidden={!keyOpen} className="v-map-key-body px-3 pb-2">
            {[
              [risk.low, legend.veryGood],
              [chance.some, legend.some],
            ].map(([c, label]) => (
              <div key={label} className={keyRow}>
                <span className="h-2.5 w-2.5 rounded-full border-2 bg-paper-50" style={{ borderColor: c }} />
                {label}
              </div>
            ))}
            <div className={keyRow}>
              <svg width="10" height="10" aria-hidden>
                <rect x="0.5" y="0.5" width="9" height="9" fill="url(#hatch-critical)" stroke={risk.extreme} strokeWidth="1" />
              </svg>
              {legend.noEntry}
            </div>
            <div className={keyRow}>
              <svg width="12" height="6" aria-hidden>
                <line x1="0" y1="3" x2="12" y2="3" stroke={risk.low} strokeWidth="2" strokeDasharray="4 2.5" />
              </svg>
              {legend.course}
            </div>
            {alerts.some((a) => a.storm) && (
              <div className={keyRow}>
                <svg width="11" height="11" viewBox="0 0 56 56" fill="none" aria-hidden>
                  <path d="M28 5 A 23 23 0 0 1 51 28" stroke={risk.extreme} strokeWidth="9" strokeLinecap="round" />
                  <path d="M28 51 A 23 23 0 0 1 5 28" stroke={risk.extreme} strokeWidth="9" strokeLinecap="round" />
                  <circle cx="28" cy="28" r="12" fill={risk.extreme} />
                </svg>
                {legend.storm}
              </div>
            )}
            {flowMode !== "off" && (
              <div
                className="mt-1 flex items-center gap-1.5 border-t pt-1 text-micro font-medium text-ink-700"
                style={{ borderColor: "var(--rule-faint)" }}
              >
                <span className="sr-only">{legend.sstLabel}: </span>
                <span>{legend.sstCool}</span>
                <span
                  className="h-[5px] w-14 rounded-sm"
                  style={{ background: `linear-gradient(90deg,${Object.values(sst).join(",")})` }}
                  title={legend.sstLabel}
                />
                <span>{legend.sstWarm}</span>
              </div>
            )}
          </div>
        </div>

        {/* drag hint */}
        {origin && !probe && !dragging && (
          <div className="v-map-hint pointer-events-none absolute bottom-3 right-3 z-[500] max-w-[62%] rounded-[2px] border border-ink-700/40 bg-paper-50/95 px-2.5 py-1.5 text-label font-medium text-ink-700 shadow-md">
            {HINT[language] ?? HINT.en}
          </div>
        )}

        {/* live geofence banner */}
        {banner && (
          // Centred by the row, not by a transform: the entrance owns the transform.
          <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] flex justify-center px-3">
            <div
              role="status"
              className={`v-enter pointer-events-auto max-w-[78%] rounded-[2px] px-3.5 py-2 text-small font-semibold text-paper-50 shadow-lg ${banner.style}`}
            >
              <div>{banner.text}</div>
              {banner.sub && <div className="mt-0.5 font-mono text-label font-normal">{banner.sub}</div>}
            </div>
          </div>
        )}
      </div>

      {/* the chart in words, for readers who cannot see it */}
      <div className="sr-only">
        <h2>{tx.descTitle}</h2>
        <ol>
          {description.map((line, i) => (
            <li key={`${i}-${line}`}>{line}</li>
          ))}
        </ol>
      </div>

      {/* sheet margin note */}
      <div className="mt-[7px] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <span className="font-mono text-micro font-semibold uppercase tracking-[0.18em] text-ink-500">
          {legend.marginL}
        </span>
        <span className="font-mono text-micro uppercase tracking-[0.18em] text-ink-500">
          {legend.marginR}
        </span>
      </div>
    </div>
  );
}

function probeSub(p: PositionCheck, t: Record<string, string>): string {
  const bits: string[] = [];
  if (p.distance_from_shore_km != null) bits.push(fill(t.offshore, { km: p.distance_from_shore_km }));
  if (p.nearest_zone_name && p.nearest_zone_km != null && !p.inside_restricted_zone)
    bits.push(`${p.nearest_zone_name}: ${p.nearest_zone_km} km`);
  return bits.join(" · ");
}
