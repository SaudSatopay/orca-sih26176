import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AuthorityDashboard } from "../types";
import AuthorityPanel from "./AuthorityPanel";

vi.mock("../api");

const board: AuthorityDashboard = {
  generated_at: "2026-10-01T16:32:00",
  summary: { monitored: 3, official_warnings: 1 },
  locations: [
    {
      name: "Mumbai",
      state: "Maharashtra",
      latitude: 18.922,
      longitude: 72.8347,
      risk_score: 9,
      risk_category: "LOW",
      official_warning: false,
      wave_height_m: 1.52,
      wind_speed_kmh: 22.5,
      headline: null,
    },
    {
      name: "Kochi",
      state: "Kerala",
      latitude: 9.9312,
      longitude: 76.2673,
      risk_score: 40,
      risk_category: "MODERATE",
      official_warning: false,
      wave_height_m: 2.1,
      wind_speed_kmh: 31.4,
      headline: null,
    },
    {
      name: "Paradip",
      state: "Odisha",
      latitude: 20.2648,
      longitude: 86.6947,
      risk_score: 92,
      risk_category: "EXTREME",
      official_warning: true,
      wave_height_m: 5.5,
      wind_speed_kmh: 91.2,
      headline: "Cyclone alert for Odisha coast",
    },
  ],
};

async function openBoard(fail = false) {
  const api = vi.mocked(await import("../api"));
  if (fail) api.authority.mockRejectedValue(new Error("offline"));
  else api.authority.mockResolvedValue(board);
  return render(<AuthorityPanel language="en" />);
}

afterEach(() => vi.clearAllMocks());

describe("the summary tiles name their centres (AU1)", () => {
  it("prints the centre and its score instead of repeating the legend's count", async () => {
    await openBoard();
    // "Paradip · 92" — the score rides the name
    expect(await screen.findByText("· 92")).toBeInTheDocument();
    // the empty HIGH tile is quiet, not a bare zero
    expect(screen.getByText("none")).toBeInTheDocument();
  });
});

describe("the coast profile's scale names the bands (AU4)", () => {
  it("rules the bands with their names, not bare edge numbers", async () => {
    await openBoard();
    await screen.findByText("· 92");
    // the band words stand on the scale (the band legend also uses them)
    expect(screen.getAllByText("Extreme").length).toBeGreaterThanOrEqual(2);
    // the bare edges are gone
    expect(screen.queryByText("25")).not.toBeInTheDocument();
    expect(screen.queryByText("50")).not.toBeInTheDocument();
  });
});

describe("readings carry one format (AU5, X5)", () => {
  it("writes waves to one decimal and wind as whole km/h", async () => {
    await openBoard();
    await screen.findByText("· 92");
    expect(screen.getAllByText("5.5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("91").length).toBeGreaterThan(0);
    expect(screen.queryByText("5.50")).not.toBeInTheDocument();
    expect(screen.queryByText("91.2")).not.toBeInTheDocument();
  });
});

describe("the warned row survives narrow sheets (AU2)", () => {
  it("prints the active warning inside the centre cell as well as its own column", async () => {
    await openBoard();
    await screen.findByText("· 92");
    // once in the lg-only warning column, once folded into the centre cell
    expect(screen.getAllByText("Cyclone alert for Odisha coast")).toHaveLength(2);
  });

  it("marks an empty warning cell as none", async () => {
    await openBoard();
    await screen.findByText("· 92");
    expect(screen.getAllByRole("img", { name: "No active warning" }).length).toBeGreaterThan(0);
  });
});

describe("the board as a departures board", () => {
  it("keeps its name for assistive tech while the tiles settle", async () => {
    await openBoard();
    await screen.findByText("· 92");
    expect(screen.getByRole("heading", { name: "Coastal risk board" })).toBeInTheDocument();
  });

  it("offers a refresh beside the countdown that reads the board now", async () => {
    const api = vi.mocked(await import("../api"));
    await openBoard();
    await screen.findByText("· 92");
    const now = screen.getByRole("button", { name: "Read the board now" });
    expect(api.authority).toHaveBeenCalledTimes(1);
    fireEvent.click(now);
    await waitFor(() => expect(api.authority).toHaveBeenCalledTimes(2));
  });

  it("names the refresh in Hindi and Marathi too", async () => {
    const api = vi.mocked(await import("../api"));
    api.authority.mockResolvedValue(board);
    const hi = render(<AuthorityPanel language="hi" />);
    expect(await screen.findByRole("button", { name: "बोर्ड अभी पढ़ें" })).toBeInTheDocument();
    hi.unmount();
    render(<AuthorityPanel language="mr" />);
    expect(await screen.findByRole("button", { name: "फलक आत्ता वाचा" })).toBeInTheDocument();
  });

  it("prints every score whole for assistive tech while its digits roll", async () => {
    await openBoard();
    await screen.findByText("· 92");
    const table = screen.getByRole("table");
    for (const score of ["9", "40", "92"])
      expect(within(table).getAllByText(score, { selector: ".sr-only" }).length).toBe(1);
  });
});

describe("a failed first reading keeps the board's frame (AU3)", () => {
  it("lists the ten watched centres with em-dash readings under the notice", async () => {
    await openBoard(true);
    const alert = await screen.findByRole("alert");
    expect(within(alert).getByRole("button", { name: "Try again" })).toBeInTheDocument();
    // the frame: the ten centres from ports.ts, readings as em dashes
    expect(screen.getByText("Visakhapatnam")).toBeInTheDocument();
    expect(screen.getByText("Port Blair")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(40);
  });
});

describe("the board passes the same safety gate as a fisher's question", () => {
  it("says first when a centre rests on missing readings, and marks those rows", async () => {
    const api = vi.mocked(await import("../api"));
    api.authority.mockResolvedValue({
      ...board,
      locations: [
        { ...board.locations[0], gate: "INSUFFICIENT_DATA", evidence: "missing" },
        { ...board.locations[1], gate: "GO", evidence: "fresh" },
        { ...board.locations[2], gate: "NO_GO", evidence: "missing" },
      ],
      decision: {
        state: "INSUFFICIENT_DATA",
        confidence: "insufficient",
        headline: "",
        reasons: ["Wave height: no reading — the marine forecast feed did not respond."],
        blocking_inputs: ["wave"],
        stale_inputs: [],
        risk_go: true,
        drill: "unavailable",
        timestamp: "t-board",
      },
      data_health: [],
    });
    render(<AuthorityPanel language="en" />);
    expect(
      await screen.findByText("Wave height: no reading — the marine forecast feed did not respond."),
    ).toBeInTheDocument();
    const table = screen.getByRole("table");
    // the insufficient centre says so; the warned one keeps NO-GO, marked unconfirmed
    expect(within(table).getAllByText("Insufficient data")).toHaveLength(1);
    expect(within(table).getAllByText("unconfirmed")).toHaveLength(1);
  });

  it("adds nothing when every centre rests on fresh readings", async () => {
    await openBoard();
    await screen.findAllByText("Paradip");
    expect(screen.queryByText("Evidence check")).not.toBeInTheDocument();
    expect(screen.queryByText("unconfirmed")).not.toBeInTheDocument();
  });
});
