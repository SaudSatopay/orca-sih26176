import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FishingOutlook } from "../types";
import { forgetSights } from "../firstSight";
import FishingPanel from "./FishingPanel";

/** A readable day off Mumbai: MODERATE, a feasible trip, one warned forecast day. */
const goDay = {
  location: {
    latitude: 18.922,
    longitude: 72.8347,
    name: "Mumbai",
    state: "Maharashtra",
    nearest_landing_centre: "Mumbai",
    distance_from_shore_km: 0,
  },
  generated_at: "2026-10-01T15:07:00+05:30",
  radius_km: 100,
  safety: {
    score: 28,
    category: "MODERATE",
    official_warning: false,
    improves_after: null,
    wave_height_m: 1.27,
    wind_speed_kmh: 18.7,
    sea_state: "moderate",
  },
  areas: [
    {
      id: "z1",
      rank: 1,
      latitude: 18.8,
      longitude: 72.5,
      distance_km: 46.5,
      bearing: "WSW",
      sst_c: 29,
      chlorophyll_mg_m3: 1.2,
      wave_height_m: 1,
      probability: 77,
      value_score: 60,
      rating: "very_good",
      confidence: 0.7,
      rationale: "",
      factors: { chlorophyll: 0.8, sst: 0.7 },
      likely_species: ["Bombil (Bombay duck)"],
      recommended: true,
    },
  ],
  best_window: { from_hour: 14, to_hour: 19 },
  hourly_ranking: [],
  duration: {
    recommended_hours: 3.5,
    travel_each_way_minutes: 145,
    round_trip_hours: 4.8,
    total_trip_hours: 8.8,
    safe_window_hours: 9,
    limited_by_weather: false,
    feasible: true,
    return_by: "00:32",
    return_reason_wave_m: 1.9,
  },
  economics: {
    fuel_litres: 32,
    fuel_cost_inr: 3424,
    catch_kg_low: 40,
    catch_kg_high: 80,
    revenue_inr: 10800,
    profit_inr: 7376,
    assumptions: "9 m boat, 40 HP",
  },
  routes: [],
  avoid: [
    {
      name: "Naval exercise area",
      zone_type: "naval",
      distance_km: 12.4,
      window: null,
      active_now: true,
      severity: "critical",
    },
    {
      name: "Shipping lane",
      zone_type: "traffic",
      distance_km: 21.8,
      window: "14:00-18:00",
      active_now: true,
      severity: "warning",
    },
  ],
  forecast: [
    {
      day_offset: 0,
      date: "2026-10-01",
      label: "Today",
      best_hour: 18,
      probability: 74,
      rating: "good",
      wave_height_m: 1.27,
      wind_speed_kmh: 18.7,
      sea_state: "moderate",
      calmer: false,
      official_warning: false,
      best_area_rank: 1,
      best_area_distance_km: 46.5,
    },
    {
      day_offset: 1,
      date: "2026-10-02",
      label: "Tomorrow",
      best_hour: 6,
      probability: 70,
      rating: "good",
      wave_height_m: 0.94,
      wind_speed_kmh: 16,
      sea_state: "smooth",
      calmer: true,
      official_warning: false,
      best_area_rank: 1,
      best_area_distance_km: 46.5,
    },
    {
      day_offset: 2,
      date: "2026-10-03",
      label: "Day after",
      best_hour: 18,
      probability: 30,
      rating: "poor",
      wave_height_m: 3.2,
      wind_speed_kmh: 44,
      sea_state: "rough",
      calmer: false,
      official_warning: true,
      best_area_rank: null,
      best_area_distance_km: null,
    },
  ],
  advice: ["You can go, but be careful and stay close to shore.", "The disclaimer."],
  mode: "DEMO",
  method: "Model v2",
} as unknown as FishingOutlook;

/** The cyclone coast: EXTREME, no feasible trip, grounds that must not sell themselves. */
const noGoDay = {
  ...goDay,
  safety: {
    ...goDay.safety,
    score: 92,
    category: "EXTREME",
    official_warning: true,
    wave_height_m: 5.5,
    wind_speed_kmh: 91.2,
  },
  duration: { ...goDay.duration, feasible: false },
  economics: null,
  best_window: { from_hour: 5, to_hour: 8 },
  advice: ["Do not go out. A cyclone warning is in force.", "The disclaimer."],
} as unknown as FishingOutlook;

beforeEach(() => forgetSights());

describe("the Advice panel's verdict lockup (impeccable L1)", () => {
  it("leads with the dial, the verdict stamp and the plain instruction", () => {
    render(<FishingPanel data={goDay} language="en" />);
    // the dial, with the score for assistive tech
    expect(screen.getByRole("img", { name: /28 \/ 100/ })).toBeInTheDocument();
    // the stamp prints the verdict phrase from the one VERDICT table (X1)
    expect(screen.getByText("Go with care")).toBeInTheDocument();
    // the headline is the plain instruction
    expect(
      screen.getByText("You can go, but be careful and stay close to shore."),
    ).toBeInTheDocument();
  });

  it("stamps the do-not-go phrase on an EXTREME day", () => {
    render(<FishingPanel data={noGoDay} language="en" />);
    expect(screen.getByText("Do not launch")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /92 \/ 100/ })).toBeInTheDocument();
  });
});

describe("one format for every quantity (taste T5 + X5)", () => {
  it("writes durations as hours and minutes, never bare minutes or decimal hours", () => {
    render(<FishingPanel data={goDay} language="en" />);
    expect(screen.getByText(/3 h 30 min/)).toBeInTheDocument(); // stay, not "3.5 hours"
    expect(screen.getByText(/2 h 25 min/)).toBeInTheDocument(); // travel, not "145 min"
    expect(screen.getByText(/8 h 48 min/)).toBeInTheDocument(); // whole trip
    expect(screen.queryByText(/145\s*min/)).not.toBeInTheDocument();
    expect(screen.queryByText(/3\.5/)).not.toBeInTheDocument();
  });

  it("says which day the return-by time belongs to, as the phone already does", () => {
    render(<FishingPanel data={goDay} language="en" />);
    // 00:32 against a 15:07 reading is past midnight: tonight
    expect(screen.getByText(/tonight, after midnight/)).toBeInTheDocument();
  });

  it("prints 'Stay there' once, not again in the Trip row", () => {
    render(<FishingPanel data={goDay} language="en" />);
    expect(screen.getAllByText("Stay there")).toHaveLength(1);
  });

  it("writes waves with one decimal in the forecast strip", () => {
    render(<FishingPanel data={goDay} language="en" />);
    expect(screen.getByText(/0\.9 m waves/)).toBeInTheDocument();
    expect(screen.queryByText(/0\.94/)).not.toBeInTheDocument();
  });
});

describe("baselines and tags (taste T6)", () => {
  it("tags both closed-zone rows", () => {
    render(<FishingPanel data={goDay} language="en" />);
    expect(screen.getByText("always closed")).toBeInTheDocument();
    expect(screen.getByText("closed now")).toBeInTheDocument();
  });
});

describe("the chart gets marked by hand", () => {
  it("boxes STAY OUT OF THESE AREAS in extreme red, once, when it comes into view", async () => {
    const shown: { type: string; color: string; animationDuration: number }[] = [];
    vi.doMock("rough-notation", () => ({
      annotate: (_: Element, o: { type: string; color: string; animationDuration: number }) => {
        shown.push(o);
        return { show() {}, hide() {}, remove() {} };
      },
    }));
    // a viewport in which everything is on screen
    const Seen = class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe(el: Element) {
        this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
    vi.stubGlobal("IntersectionObserver", Seen);
    try {
      vi.resetModules();
      const { default: Panel } = await import("./FishingPanel");
      const { risk } = await import("../tokens");
      const first = render(<Panel data={goDay} language="en" />);
      const heading = screen.getByRole("heading", { name: /Stay out of these areas/i });
      expect(heading.querySelector("[data-mark]")).not.toBeNull();
      expect(shown[shown.length - 1]).toMatchObject({ type: "box", color: risk.extreme });
      expect(shown[shown.length - 1].animationDuration).toBeGreaterThan(0);
      // the same reading opened again: the box is there at once, not drawn again
      first.unmount();
      render(<Panel data={goDay} language="en" />);
      expect(shown[shown.length - 1].animationDuration).toBe(0);
    } finally {
      vi.unstubAllGlobals();
      vi.doUnmock("rough-notation");
      vi.resetModules();
    }
  });
});

describe("a do-not-go day stops selling the fishing (impeccable C4)", () => {
  it("folds the grounds under 'Not today' with no BEST TRIP stamp", () => {
    render(<FishingPanel data={noGoDay} language="en" />);
    const fold = screen.getByRole("button", { name: /Not today: where the fish would be/ });
    expect(fold).toHaveAttribute("aria-expanded", "false");
    // folded: no ground is on offer
    expect(screen.queryByText("Best trip")).not.toBeInTheDocument();
    expect(screen.queryByText("77")).not.toBeInTheDocument();

    // opened on purpose, the grounds show — still without the trip stamp
    fireEvent.click(fold);
    expect(fold).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("77")).toBeInTheDocument();
    expect(screen.queryByText("Best trip")).not.toBeInTheDocument();
  });

  it("offers no best hour on a warned day", () => {
    render(<FishingPanel data={noGoDay} language="en" />);
    expect(screen.queryByText(/Best time to fish/)).not.toBeInTheDocument();
    // the warned forecast day carries no "best around" either
    expect(screen.getAllByText(/best around/)).toHaveLength(2);
  });

  it("keeps the best hour on a readable day", () => {
    render(<FishingPanel data={goDay} language="en" />);
    expect(screen.getByText("Best time to fish")).toBeInTheDocument();
    expect(screen.getByText("14:00–19:00")).toBeInTheDocument();
  });

  it("shows the grounds openly when the trip is on", () => {
    render(<FishingPanel data={goDay} language="en" />);
    expect(screen.getByText("Best places to fish")).toBeInTheDocument();
    expect(screen.getByText("77")).toBeInTheDocument();
    expect(screen.getByText("Best trip")).toBeInTheDocument();
  });
});
