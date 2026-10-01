import { describe, expect, it } from "vitest";
import type { FishingArea, FishingOutlook } from "../types";
import {
  factorScore,
  fill,
  hourReadout,
  panelState,
  speciesParts,
  splitAdvice,
  tripIsOff,
} from "./todayModel";

const area = (rank: number, rating: FishingArea["rating"]): FishingArea => ({
  id: `z${rank}`,
  rank,
  latitude: 18.8,
  longitude: 72.4,
  distance_km: 31,
  bearing: "WSW",
  sst_c: 29.2,
  chlorophyll_mg_m3: 1.29,
  wave_height_m: 0.99,
  probability: 78,
  value_score: 65.9,
  rating,
  confidence: 0.78,
  rationale: "",
  factors: { chlorophyll: 0.596, sst: 0.943, front: 0.82, sea_state: 1, time_of_day: 0.68 },
});

const day = (day_offset: number) => ({
  day_offset,
  date: "2026-10-01",
  label: "",
  best_hour: 18,
  probability: 80,
  rating: "very_good" as const,
  wave_height_m: 1.2,
  wind_speed_kmh: 18,
  sea_state: "slight",
  calmer: true,
  official_warning: false,
  best_area_rank: 1,
  best_area_distance_km: 31,
});

/** Mumbai, moderate sea: the reading the Today view is rehearsed with. */
function mumbai(over: Partial<FishingOutlook> = {}): FishingOutlook {
  return {
    location: {
      latitude: 18.95,
      longitude: 72.75,
      name: "Mumbai",
      state: "Maharashtra",
      nearest_landing_centre: "Mumbai",
      distance_from_shore_km: 9.4,
    },
    generated_at: "2026-10-01T15:20:50+05:30",
    radius_km: 100,
    safety: {
      score: 30,
      category: "MODERATE",
      official_warning: false,
      improves_after: null,
      wave_height_m: 1.27,
      wind_speed_kmh: 19.3,
      sea_state: "moderate",
    },
    areas: [area(1, "very_good"), area(2, "good")],
    best_window: { from_hour: 14, to_hour: 19 },
    hourly_ranking: [],
    duration: {
      recommended_hours: 4,
      travel_each_way_minutes: 138,
      round_trip_hours: 4.6,
      total_trip_hours: 8.6,
      safe_window_hours: 9,
      limited_by_weather: false,
      feasible: true,
      return_by: "00:20",
      return_reason_wave_m: 1.9,
    },
    economics: null,
    routes: [],
    avoid: [
      { name: "Mumbai Port approach channel", zone_type: "port_limit", distance_km: 2.2, window: null, active_now: true, severity: "warning" },
      { name: "Naval exercise area (notified)", zone_type: "defence", distance_km: 6.9, window: "14:00-18:00", active_now: true, severity: "critical" },
    ],
    forecast: [day(0), day(1), day(2)],
    advice: [
      "You can go, but be careful and stay close to shore.",
      "Waves are about knee to waist high, there is a steady breeze.",
      "Never enter the red area on the map — Mumbai Port approach channel.",
      "Do not go into the red area on the map from 2 PM to 6 PM today.",
      "Areas 1, 2 on the map are your best chances today.",
      "Area 1 is about 31 kilometres towards the south-west.",
      "The best time to fish is 2 PM to 7 PM.",
      "Stay there about 4 hours.",
      "Tomorrow: very good chance of fish, and the sea will be calmer.",
      "The day after: very good chance of fish, and the sea will be rougher.",
      "This is our best guess from the data.",
    ],
    mode: "DEMO",
    method: "",
    ...over,
  };
}

describe("splitAdvice", () => {
  it("cuts the spoken list into verdict, prohibitions, plan, outlook and disclaimer", () => {
    const p = splitAdvice(mumbai());
    expect(p.structured).toBe(true);
    expect(p.verdict).toMatch(/^You can go/);
    expect(p.sea).toMatch(/^Waves are/);
    expect(p.notices).toEqual([]);
    expect(p.prohibitions.map((x) => x.zone?.name)).toEqual([
      "Mumbai Port approach channel",
      "Naval exercise area (notified)",
    ]);
    expect(p.prohibitions[1].text).toMatch(/2 PM to 6 PM/);
    expect(p.where).toHaveLength(2);
    expect(p.plan).toEqual(["The best time to fish is 2 PM to 7 PM.", "Stay there about 4 hours."]);
    expect(p.outlook).toHaveLength(2);
    expect(p.disclaimer).toMatch(/best guess/);
  });

  it("reads an official warning and an infeasible trip (the cyclone coast)", () => {
    const base = mumbai();
    const p = splitAdvice(
      mumbai({
        safety: { ...base.safety, score: 92, category: "EXTREME", official_warning: true },
        areas: [area(1, "poor")],
        avoid: [],
        duration: { ...base.duration!, feasible: false, limited_by_weather: true },
        advice: [
          "Do not go out. Stay on land and keep your boat tied.",
          "The sea is wild.",
          "The government has put out a warning for this coast. Please follow it.",
          "None of the nearby areas look good today. Fishing will be hard.",
          "The best time to fish is 5 AM to 8 AM.",
          "There is not enough safe time today to make the trip worthwhile.",
          "Tomorrow: some chance of fish.",
          "The day after: some chance of fish.",
          "This is our best guess from the data.",
        ],
      }),
    );
    expect(p.structured).toBe(true);
    expect(p.notices).toEqual(["The government has put out a warning for this coast. Please follow it."]);
    expect(p.prohibitions).toEqual([]);
    expect(p.where).toEqual(["None of the nearby areas look good today. Fishing will be hard."]);
    expect(p.plan[p.plan.length - 1]).toMatch(/not enough safe time/);
  });

  it("counts the 'sea settles after' line only when the sea is high and a window exists", () => {
    const base = mumbai();
    const advice = [...base.advice];
    advice.splice(2, 0, "The sea should settle after 11 AM. Ask me again then.");
    const p = splitAdvice(
      mumbai({ safety: { ...base.safety, category: "HIGH", improves_after: "11:00" }, advice }),
    );
    expect(p.structured).toBe(true);
    expect(p.notices).toEqual(["The sea should settle after 11 AM. Ask me again then."]);
  });

  it("keeps every line as notes when the list does not match the structured fields", () => {
    const advice = ["Go.", "A line nobody planned for.", "Another.", "Follow the warning."];
    const p = splitAdvice(mumbai({ advice }));
    expect(p.structured).toBe(false);
    expect(p.verdict).toBe("Go.");
    expect(p.plan).toEqual(["A line nobody planned for.", "Another."]);
    expect(p.disclaimer).toBe("Follow the warning.");
    expect(p.prohibitions).toEqual([]);
  });

  it("survives an empty or one-line advisory", () => {
    expect(splitAdvice(mumbai({ advice: [] })).verdict).toBe("");
    const one = splitAdvice(mumbai({ advice: ["Do not go out today."] }));
    expect(one.verdict).toBe("Do not go out today.");
    expect(one.disclaimer).toBeNull();
  });
});

describe("panelState", () => {
  it("drafts while the first reading is on its way", () => {
    expect(panelState({ hasData: false, loading: true })).toBe("loading");
    expect(panelState({ hasData: false })).toBe("loading");
  });
  it("shows the error sheet when nothing was ever read", () => {
    expect(panelState({ hasData: false, error: true })).toBe("error");
  });
  it("drafts again while a retry is in flight", () => {
    expect(panelState({ hasData: false, error: true, loading: true })).toBe("loading");
  });
  it("keeps the last reading when a refresh fails", () => {
    expect(panelState({ hasData: true, error: true })).toBe("stale");
  });
  it("holds the reading during a refresh instead of flashing a skeleton", () => {
    expect(panelState({ hasData: true, loading: true })).toBe("ready");
  });
});

describe("small formatters", () => {
  it("puts the local species name first", () => {
    expect(speciesParts("Bombil (Bombay duck)")).toEqual({ local: "Bombil", gloss: "Bombay duck" });
    expect(speciesParts("Hilsa")).toEqual({ local: "Hilsa", gloss: null });
  });
  it("scores a factor out of 100 and refuses nonsense", () => {
    expect(factorScore(0.596)).toBe(60);
    expect(factorScore(1.4)).toBe(100);
    expect(factorScore(-1)).toBe(0);
    expect(factorScore(undefined)).toBeNull();
    expect(factorScore(Number.NaN)).toBeNull();
  });
  it("writes hours as 24-hour readouts", () => {
    expect(hourReadout(14)).toBe("14:00");
    expect(hourReadout(5)).toBe("05:00");
    expect(hourReadout(24)).toBe("00:00");
  });
  it("fills template slots and leaves unknown ones alone", () => {
    expect(fill("No grounds within {km} km", { km: 100 })).toBe("No grounds within 100 km");
    expect(fill("{a} and {b}", { a: 1 })).toBe("1 and {b}");
  });
});

describe("a day with no trip in it", () => {
  const day = (category: string, feasible: boolean | null) => ({
    safety: { category },
    duration: feasible == null ? null : { feasible },
  });

  it("is off whenever the sea is EXTREME, whatever the planner says", () => {
    expect(tripIsOff(day("EXTREME", true))).toBe(true);
    expect(tripIsOff(day("EXTREME", false))).toBe(true);
    expect(tripIsOff(day("EXTREME", null))).toBe(true);
  });

  it("follows the planner otherwise: no safe time means no trip", () => {
    expect(tripIsOff(day("HIGH", false))).toBe(true);
    expect(tripIsOff(day("MODERATE", false))).toBe(true);
  });

  it("keeps the plan on a day that still has a safe window", () => {
    expect(tripIsOff(day("LOW", true))).toBe(false);
    expect(tripIsOff(day("MODERATE", true))).toBe(false);
    // a morning warning that lifts later: the afternoon window is still worth showing
    expect(tripIsOff(day("HIGH", true))).toBe(false);
    expect(tripIsOff(day("MODERATE", null))).toBe(false);
  });
});
