import type {
  AuthorityDashboard,
  ChatResponse,
  DataDrill,
  FishingOutlook,
  GeofenceAlert,
  Language,
  MarineAlert,
  PositionCheck,
  RiskCategory,
  ZoneFeature,
} from "./types";

const BASE = "/api";

/**
 * A stalled connection must become the calm offline sheet, not a skeleton
 * that never resolves: every request gives up after this long and rejects,
 * which lands in the same catch as a refused one. At sea, slow is normal —
 * the limit is generous.
 */
const TIMEOUT_MS = 15_000;

function timeout(): AbortSignal | undefined {
  // Older WebViews lack AbortSignal.timeout; there, requests simply wait.
  return typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
    ? AbortSignal.timeout(TIMEOUT_MS)
    : undefined;
}

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    signal: timeout(),
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export function ask(params: {
  message: string;
  language?: Language;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  sessionId?: string;
}): Promise<ChatResponse> {
  return json<ChatResponse>(`${BASE}/chat`, {
    method: "POST",
    body: JSON.stringify({
      message: params.message,
      language: params.language ?? null,
      latitude: params.latitude ?? null,
      longitude: params.longitude ?? null,
      location_name: params.locationName ?? null,
      session_id: params.sessionId ?? "demo",
    }),
  });
}

export function resetSession(sessionId = "demo") {
  return json(`${BASE}/chat/reset?session_id=${encodeURIComponent(sessionId)}`, {
    method: "POST",
  });
}

export function zones(): Promise<{ features: ZoneFeature[]; note: string }> {
  return json(`${BASE}/map/zones`);
}

/** The coastal risk board. `lang` translates warning headlines, never figures. */
export function authority(lang: Language = "en"): Promise<AuthorityDashboard> {
  return json(`${BASE}/authority/dashboard?lang=${lang}`);
}

/** Official warnings and geofence alerts in force at a position. */
export function alerts(
  lat: number,
  lon: number,
  lang: Language = "en",
): Promise<{ marine_alerts: MarineAlert[]; geofence_alerts: GeofenceAlert[] }> {
  return json(`${BASE}/alerts?lat=${lat}&lon=${lon}&lang=${lang}`);
}

export function riskTimeline(lat: number, lon: number, hours = 24) {
  return json<{
    points: {
      hour: number;
      time: string;
      score: number;
      category: RiskCategory;
      wave_height_m: number | null;
      wind_speed_kmh: number | null;
      warning: boolean;
    }[];
  }>(`${BASE}/risk/timeline?lat=${lat}&lon=${lon}&hours=${hours}`);
}

/** Fast geofence check — called while the vessel marker is dragged. */
export function checkPosition(
  lat: number,
  lon: number,
  lang: Language = "en",
): Promise<PositionCheck> {
  return json<PositionCheck>(`${BASE}/position?lat=${lat}&lon=${lon}&lang=${lang}`);
}

/** Everything a fisher needs for a position: safety, grounds, timing, forecast. */
export function fishingOutlook(
  lat: number,
  lon: number,
  opts: { radiusKm?: number; days?: number; lang?: Language } = {},
): Promise<FishingOutlook> {
  const p = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radius_km: String(opts.radiusKm ?? 100),
    days: String(opts.days ?? 3),
    lang: opts.lang ?? "en",
  });
  return json<FishingOutlook>(`${BASE}/fishing?${p}`);
}

export interface Measurement {
  value: number | null;
  unit: string;
  label: string;
  provenance: {
    source: string;
    timestamp: string;
    mode: string;
    confidence: number | null;
    note?: string | null;
  };
}

export interface AgentSnapshot {
  agent: string;
  ok: boolean;
  data: Record<string, unknown>;
  measurements: Record<string, Measurement>;
  unavailable: string[];
  source: string;
  timestamp: string;
  confidence: number | null;
  mode: string;
  latency_ms: number;
}

/** One raw pull of the sea at a position — drives the System page's live feed. */
export function forecast(lat: number, lon: number) {
  return json<{
    location: { name: string; latitude: number; longitude: number; state?: string | null };
    valid_for: string;
    weather: AgentSnapshot;
    ocean: AgentSnapshot;
  }>(`${BASE}/forecast?lat=${lat}&lon=${lon}`);
}

export interface FlowField {
  mode: string;
  generated_at?: string;
  nx: number;
  ny: number;
  lats: number[];
  lons: number[];
  points: {
    sea: boolean;
    wind_u: number;
    wind_v: number;
    cur_u: number | null;
    cur_v: number | null;
    sst: number | null;
  }[];
  /** Fine land/sea mask, row-major, "1" = sea. */
  mask?: string;
  mask_nx?: number;
  mask_ny?: number;
  note?: string;
}

/** The wind/current/SST grid for a map view — drives the flow animation. */
export function flowField(
  b: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  nx = 10,
  ny = 8,
): Promise<FlowField> {
  const p = new URLSearchParams({
    min_lat: b.minLat.toFixed(3),
    max_lat: b.maxLat.toFixed(3),
    min_lon: b.minLon.toFixed(3),
    max_lon: b.maxLon.toFixed(3),
    nx: String(nx),
    ny: String(ny),
  });
  return json<FlowField>(`${BASE}/field?${p}`);
}

/**
 * Set the rehearsed marine feed's health for the safety-gate demo. Server-wide
 * and immediate: the next question sees it, nothing restarts.
 */
export function setDataDrill(drill: DataDrill) {
  return json<{ ok: boolean; drill: DataDrill; drills: DataDrill[] }>(`${BASE}/config/data-health`, {
    method: "POST",
    body: JSON.stringify({ drill }),
  });
}

export function setMode(mode: "LIVE" | "DEMO") {
  return json<{ ok: boolean; data_mode: string; note: string }>(`${BASE}/config/mode`, {
    method: "POST",
    body: JSON.stringify({ mode }),
  });
}

export function health() {
  return json<{ status: string; data_mode: string; version: string }>(`${BASE}/health`);
}

export function config() {
  return json<{
    data_mode: string;
    risk_weights: Record<string, number>;
    risk_thresholds: Record<string, number>;
    deterministic_overrides: Record<string, number>;
    note: string;
  }>(`${BASE}/config`);
}
