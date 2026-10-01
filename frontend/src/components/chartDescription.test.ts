import { describe, expect, it } from "vitest";
import { RATING_WORD } from "../i18n/fishing";
import { COURSE, MAP, ZONE_STATUS, ZONE_TYPE } from "../i18n/marineMap";
import type { FishingArea, Language, RouteOption, ZoneFeature } from "../types";
import {
  describeChart,
  haversineKm,
  latText,
  lonText,
  nearbyZones,
  type ChartContent,
  type ChartWords,
} from "./chartDescription";

const words = (l: Language): ChartWords => ({
  map: MAP[l],
  zoneType: ZONE_TYPE[l],
  zoneStatus: ZONE_STATUS[l],
  course: COURSE[l],
  rating: RATING_WORD[l],
});

const MUMBAI = { name: "Mumbai", latitude: 18.95, longitude: 72.75 };

const area = (rank: number, over: Partial<FishingArea> = {}): FishingArea => ({
  id: `z${rank}`,
  rank,
  latitude: 18.85,
  longitude: 72.47,
  distance_km: 30.6 + rank,
  bearing: "WSW",
  sst_c: 29,
  chlorophyll_mg_m3: 1.2,
  wave_height_m: 1,
  probability: 80 - rank,
  value_score: 60,
  rating: "very_good",
  confidence: 0.8,
  rationale: "",
  factors: {},
  ...over,
});

const zone = (name: string, lat: number, lon: number, zone_type: string, severity: string): ZoneFeature => ({
  type: "Feature",
  properties: { id: name, name, zone_type, severity, note: "" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [lon - 0.05, lat - 0.05],
        [lon + 0.05, lat - 0.05],
        [lon + 0.05, lat + 0.05],
        [lon - 0.05, lat + 0.05],
      ],
    ],
  },
});

const route = (kind: RouteOption["kind"], recommended: boolean, km: number): RouteOption => ({
  name: `${kind} route`,
  kind,
  legs: [],
  distance_km: km,
  eta_minutes: km * 4,
  risk_score: 20,
  risk_category: "LOW",
  penalties: {},
  recommended,
  notes: "",
});

const EMPTY: ChartContent = {
  origin: null,
  areas: [],
  pfz: [],
  zones: [],
  geofence: [],
  routes: [],
  alerts: [],
};

describe("describeChart", () => {
  it("says so when nothing is plotted", () => {
    expect(describeChart(EMPTY, words("en"))).toEqual([MAP.en.nothing]);
  });

  it("walks the chart in order: position, grounds by rank, areas, course", () => {
    const lines = describeChart(
      {
        ...EMPTY,
        origin: MUMBAI,
        radiusKm: 100,
        areas: [area(2), area(1, { recommended: true })],
        zones: [
          zone("Kochi Port navigation channel", 9.95, 76.2, "port_limit", "warning"),
          zone("Naval exercise area (notified)", 18.9, 72.7, "defence", "critical"),
        ],
        routes: [route("shortest", false, 31), route("safest", true, 34.7)],
      },
      words("en"),
    );
    expect(lines).toEqual([
      "Your position: Mumbai, 18.95°N, 72.75°E. ORCA searched 100 km around it.",
      "Fishing ground 1: 32 km WSW, 79% chance of fish, Very good. This is the best trip.",
      "Fishing ground 2: 33 km WSW, 78% chance of fish, Very good.",
      "Restricted area: Naval exercise area (notified), defence area. Do not enter. About 8 km from you.",
      "Recommended course: Safest course, 34.7 km, about 139 minutes.",
      "Other course: Shortest course, 31 km, about 124 minutes.",
    ]);
  });

  it("falls back to raw fishing zones when no ground has been scored", () => {
    const lines = describeChart(
      {
        ...EMPTY,
        pfz: [
          {
            rank: 1,
            latitude: 15,
            longitude: 73,
            distance_km: 22.4,
            bearing: "W",
            sst_c: 28,
            chlorophyll_mg_m3: 1,
            wave_height_m: 1,
            confidence: 0.71,
            rationale: "",
            source: "",
            timestamp: "",
          },
        ],
      },
      words("en"),
    );
    expect(lines).toEqual(["Fishing zone 1: 22 km W, 71% chance of fish."]);
  });

  it("puts 'you are inside' before the grounds and draws the storm last", () => {
    const lines = describeChart(
      {
        ...EMPTY,
        origin: MUMBAI,
        areas: [area(1)],
        geofence: [
          { zone_name: "Naval exercise area", zone_type: "defence", distance_km: 0, inside: true, severity: "critical", message: "" },
          { zone_name: "Port channel", zone_type: "port_limit", distance_km: 4, inside: false, severity: "warning", message: "" },
        ],
        alerts: [
          { type: "wind", severity: "high", official: true, headline: "Strong wind", detail: "", source: "IMD" },
          {
            type: "cyclone_warning",
            severity: "severe",
            official: true,
            headline: "Severe Cyclonic Storm",
            detail: "",
            source: "IMD",
            storm: {
              latitude: 19.4,
              longitude: 87.9,
              radius_km: 250,
              track: [
                { latitude: 18, longitude: 88.5, label: "06:00" },
                { latitude: 19.4, longitude: 87.9, label: "now" },
              ],
            },
          },
        ],
      },
      words("en"),
    );
    expect(lines[1]).toBe("You are inside Naval exercise area.");
    expect(lines[2]).toMatch(/^Fishing ground 1/);
    expect(lines.slice(-2)).toEqual([
      "Storm warning: Severe Cyclonic Storm. The warning area reaches 250 km from its centre at 19.40°N, 87.90°E.",
      "Storm track: 06:00, now.",
    ]);
    // an alert with no geometry is not on the chart, so it is not described
    expect(lines.join(" ")).not.toMatch(/Strong wind/);
  });

  it("is written in Hindi and Marathi without leaving a slot unfilled", () => {
    for (const l of ["hi", "mr"] as const) {
      const lines = describeChart(
        {
          ...EMPTY,
          origin: MUMBAI,
          radiusKm: 100,
          areas: [area(1, { recommended: true })],
          zones: [zone("Naval exercise area (notified)", 18.9, 72.7, "defence", "critical")],
          routes: [route("safest", true, 34.7)],
        },
        words(l),
      );
      expect(lines).toHaveLength(4);
      expect(lines.join(" ")).not.toMatch(/[{}]/);
      expect(lines[2]).toContain(ZONE_STATUS[l].critical);
      expect(lines[3]).toContain(COURSE[l].safest);
    }
  });

  it("names an unknown zone type and severity safely", () => {
    const [line] = describeChart(
      { ...EMPTY, zones: [zone("Somewhere", 10, 76, "new_kind", "unheard-of")] },
      words("en"),
    );
    expect(line).toBe("Restricted area: Somewhere, restricted area. Do not enter.");
  });
});

describe("nearbyZones", () => {
  const far = zone("Far", 9.95, 76.2, "port_limit", "warning");
  const near = zone("Near", 18.9, 72.7, "defence", "critical");
  const mid = zone("Mid", 18.2, 72.4, "defence", "critical");

  it("keeps the areas within reach of the fisher, nearest first", () => {
    expect(nearbyZones(MUMBAI, [far, mid, near], 100).map((z) => z.zone.properties.name)).toEqual([
      "Near",
      "Mid",
    ]);
  });
  it("names the first few when there is no position", () => {
    expect(nearbyZones(null, [far, near])).toEqual([
      { zone: far, km: null },
      { zone: near, km: null },
    ]);
  });
});

describe("coordinates", () => {
  it("writes hemispheres", () => {
    expect(latText(18.954)).toBe("18.95°N");
    expect(latText(-4.2)).toBe("4.20°S");
    expect(lonText(72.75)).toBe("72.75°E");
    expect(lonText(-0.5)).toBe("0.50°W");
  });
  it("measures Mumbai to Goa at about 400 km", () => {
    const km = haversineKm(18.92, 72.83, 15.49, 73.83);
    expect(km).toBeGreaterThan(380);
    expect(km).toBeLessThan(410);
  });
});
