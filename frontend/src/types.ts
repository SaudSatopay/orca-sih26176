export type Language = "en" | "hi" | "mr";
export type DataMode = "LIVE" | "DEMO" | "CACHE";
export type RiskCategory = "LOW" | "MODERATE" | "HIGH" | "EXTREME";

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  state?: string | null;
}

export interface Intent {
  intent: string;
  activity: string;
  location: Location | null;
  location_text: string;
  date: string | null;
  time: string | null;
  language: Language;
  raw_query: string;
  needs: string[];
  missing: string[];
}

export interface RiskFactor {
  key: string;
  label: string;
  factor: number;
  weight: number;
  contribution: number;
  detail: string;
}

export interface RiskAssessment {
  score: number;
  category: RiskCategory;
  factors: RiskFactor[];
  overrides: string[];
  official_warning: boolean;
  go: boolean;
  window?: string | null;
  sources: string[];
  generated_at: string;
  mode: DataMode;
}

export interface PFZZone {
  rank: number;
  latitude: number;
  longitude: number;
  distance_km: number;
  bearing: string;
  sst_c: number | null;
  chlorophyll_mg_m3: number | null;
  wave_height_m: number | null;
  confidence: number;
  rationale: string;
  source: string;
  timestamp: string;
}

export interface RouteLeg {
  latitude: number;
  longitude: number;
}

export interface RouteOption {
  name: string;
  kind: "safest" | "shortest" | "alternate";
  legs: RouteLeg[];
  distance_km: number;
  eta_minutes: number;
  risk_score: number;
  risk_category: RiskCategory;
  penalties: Record<string, number>;
  recommended: boolean;
  notes: string;
}

export interface GeofenceAlert {
  zone_name: string;
  zone_type: string;
  distance_km: number;
  inside: boolean;
  severity: "info" | "warning" | "critical";
  message: string;
}

export interface Evidence {
  label: string;
  value: string;
  source: string;
  timestamp: string;
  confidence: number | null;
  mode: DataMode;
}

export interface AgentTrace {
  agent: string;
  status: "ok" | "skipped" | "failed" | "degraded";
  latency_ms: number;
  summary: string;
  source: string;
  mode: DataMode;
}

export interface MarineAlert {
  type: string;
  severity: string;
  official: boolean;
  headline: string;
  detail: string;
  source: string;
  valid_till?: string;
  location?: string;
}

export interface ChatResponse {
  session_id: string;
  language: Language;
  answer: string;
  intent: Intent;
  risk: RiskAssessment | null;
  pfz: PFZZone[];
  routes: RouteOption[];
  geofence: GeofenceAlert[];
  alerts: MarineAlert[];
  evidence: Evidence[];
  trace: AgentTrace[];
  suggestions: string[];
  mode: DataMode;
  disclaimer: string;
  elapsed_ms: number;
}

export interface AuthorityRow {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  risk_category: RiskCategory;
  official_warning: boolean;
  wave_height_m: number | null;
  wind_speed_kmh: number | null;
  headline: string | null;
}

export interface AuthorityDashboard {
  generated_at: string;
  summary: Record<string, number>;
  locations: AuthorityRow[];
}

export interface ZoneFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    zone_type: string;
    severity: string;
    note: string;
  };
  geometry: { type: "Polygon"; coordinates: number[][][] };
}

export interface PositionCheck {
  latitude: number;
  longitude: number;
  status: "clear" | "warning" | "critical";
  headline: string;
  distance_from_shore_km: number | null;
  nearest_landing_centre: string | null;
  nearest_zone_km: number | null;
  nearest_zone_name: string | null;
  inside_restricted_zone: boolean;
  geofence_alerts: GeofenceAlert[];
  official_warning_active: boolean;
  checked_at: string;
}

export interface TimelinePoint {
  hour: number;
  time: string;
  score: number;
  category: RiskCategory;
  wave_height_m: number | null;
  wind_speed_kmh: number | null;
  warning: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "orca";
  text: string;
  response?: ChatResponse;
}
