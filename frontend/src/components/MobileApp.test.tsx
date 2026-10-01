import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChatResponse, FishingOutlook } from "../types";

vi.mock("./MarineMap", () => ({ default: () => null }));
vi.mock("../api");

const outlook = {
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
    wind_speed_kmh: 19.3,
    sea_state: "moderate",
  },
  areas: [
    {
      id: "z1",
      rank: 1,
      latitude: 18.8,
      longitude: 72.5,
      distance_km: 31,
      bearing: "WSW",
      sst_c: 29,
      chlorophyll_mg_m3: 1.2,
      wave_height_m: 1,
      probability: 77,
      value_score: 60,
      rating: "very_good",
      confidence: 0.7,
      rationale: "",
      factors: {},
      likely_species: ["Bombil (Bombay duck)", "Paplet (silver pomfret)"],
    },
  ],
  best_window: { from_hour: 14, to_hour: 19 },
  hourly_ranking: [],
  duration: {
    recommended_hours: 4,
    travel_each_way_minutes: 145,
    round_trip_hours: 4.8,
    total_trip_hours: 8.8,
    safe_window_hours: 9,
    limited_by_weather: false,
    feasible: true,
    return_by: "00:07",
  },
  economics: null,
  routes: [],
  avoid: [],
  forecast: [],
  advice: ["You can go, but be careful and stay close to shore."],
  mode: "DEMO",
  method: "",
} as unknown as FishingOutlook;

const answer = {
  session_id: "phone",
  language: "en",
  answer:
    "High risk — not recommended. Risk score: 70/100. Main reasons: Official warning active; Wave height 1.9 m; Wind speed 29 km/h. An official warning is in force.",
  risk: { score: 70, category: "HIGH", factors: [], overrides: [], official_warning: true, go: false },
  suggestions: ["What about 12 PM?"],
  mode: "DEMO",
  disclaimer: "ORCA is a decision-support tool.",
} as unknown as ChatResponse;

/** jsdom has no geolocation, so the app opens on the first harbour, as a phone without GPS does. */
async function openPhone(search = "?lang=en") {
  vi.resetModules();
  window.history.replaceState({}, "", `/${search}`);
  const api = vi.mocked(await import("../api"));
  api.zones.mockResolvedValue({ features: [], note: "" });
  api.fishingOutlook.mockResolvedValue(outlook);
  api.ask.mockResolvedValue(answer);
  const { default: MobileApp } = await import("./MobileApp");
  return { api, MobileApp };
}

afterEach(() => {
  window.history.replaceState({}, "", "/");
  vi.clearAllMocks();
});

describe("the phone's Today tab", () => {
  it("drafts the sheet while the sea is read, then shows the verdict with no tap", async () => {
    const { MobileApp } = await openPhone();
    render(<MobileApp />);
    expect(screen.getByText("Reading the sea…")).toBeInTheDocument();

    expect(await screen.findByText("Risk 28 out of 100")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("You can go, but be careful and stay close to shore.")).toBeInTheDocument();
    expect(screen.getByText("Sea safety for fishers")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Can I go to sea today?" })).toBeInTheDocument();
    // the score reads as a score, never a bare number in a faint colour
    expect(screen.getByText("/ 100")).toHaveClass("text-ink-500");
  });

  it("labels a return time after midnight in the fisher's terms", async () => {
    const { MobileApp } = await openPhone();
    render(<MobileApp />);
    await screen.findByText("Risk 28 out of 100");
    expect(screen.getByText("12:07 AM")).toBeInTheDocument();
    expect(screen.getByText("tonight, after midnight")).toBeInTheDocument();
    expect(screen.queryByText("00:07")).not.toBeInTheDocument();
    expect(screen.getByText("2 PM – 7 PM")).toBeInTheDocument();
  });

  it("is a real page: nav with the current tab, a main, the language and the title", async () => {
    const { MobileApp } = await openPhone("?lang=mr");
    render(<MobileApp />);
    await screen.findByText("धोका 100 पैकी 28");
    const nav = screen.getByRole("navigation");
    expect(within(nav).getByRole("button", { name: "आज" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("button", { name: "विचारा" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("mr");
    expect(document.title).toBe("आज · ORCA");

    fireEvent.click(within(nav).getByRole("button", { name: "विचारा" }));
    expect(document.title).toBe("विचारा · ORCA");
  });

  it("says so, calmly, when the crew cannot be reached, and tries again", async () => {
    const { api, MobileApp } = await openPhone();
    api.fishingOutlook.mockRejectedValueOnce(new Error("offline"));
    render(<MobileApp />);

    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText("No signal")).toBeInTheDocument();
    fireEvent.click(within(alert).getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Risk 28 out of 100")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps the last reading on screen when a later request fails", async () => {
    const { api, MobileApp } = await openPhone();
    render(<MobileApp />);
    await screen.findByText("Risk 28 out of 100");

    api.fishingOutlook.mockRejectedValue(new Error("offline"));
    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "हिंदी" }));

    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText("सिग्नल नहीं है")).toBeInTheDocument();
    expect(within(alert).getByText(/पिछली रीडिंग: Mumbai/)).toBeInTheDocument();
    // the verdict from the last good reading is still there
    expect(screen.getByText("जोखिम 100 में से 28")).toBeInTheDocument();
  });

  it("offers the harbour list when the phone has no position", async () => {
    const { api, MobileApp } = await openPhone();
    render(<MobileApp />);
    await screen.findByText("Risk 28 out of 100");
    expect(screen.getByText("Your position could not be found. Showing Mumbai.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Choose harbour" }));
    const sheet = screen.getByRole("dialog", { name: "Harbours" });
    fireEvent.click(within(sheet).getByRole("button", { name: /Kochi/ }));
    await act(async () => {});
    expect(api.fishingOutlook).toHaveBeenLastCalledWith(9.9312, 76.2673, expect.anything());
  });
});

describe("the phone's Ask tab", () => {
  it("says plainly that this browser cannot listen and takes a typed question", async () => {
    const { api, MobileApp } = await openPhone("?lang=en&tab=ask");
    render(<MobileApp />);
    expect(
      screen.getByText("This browser cannot listen. Type your question, or tap one below."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ask by voice" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Type your question" }), {
      target: { value: "Can I go at 6?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Risk 70 out of 100")).toBeInTheDocument();
    expect(api.ask).toHaveBeenCalledWith(expect.objectContaining({ message: "Can I go at 6?" }));
    expect(screen.getByText("Can I go at 6?")).toBeInTheDocument();
    expect(screen.getByText("High risk — not recommended")).toBeInTheDocument();
    expect(screen.getByText("Wave height 1.9 m")).toBeInTheDocument();
    expect(screen.getByText("Simulated data, not a live government feed")).toBeInTheDocument();
  });

  it("asks a rehearsed question on tap, and offers a retry when the crew is out of reach", async () => {
    const { api, MobileApp } = await openPhone("?lang=en&tab=ask");
    api.ask.mockRejectedValueOnce(new Error("offline"));
    render(<MobileApp />);

    fireEvent.click(screen.getByRole("button", { name: "Where are the fish today?" }));
    const alert = await screen.findByRole("alert");
    fireEvent.click(within(alert).getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Risk 70 out of 100")).toBeInTheDocument();
    expect(api.ask).toHaveBeenCalledTimes(2);
  });
});
