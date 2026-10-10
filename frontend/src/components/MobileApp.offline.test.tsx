/**
 * The phone with no connection: Today shows ORCA's last plan with its age,
 * re-judged on the device by the gate's own rules (offline.ts), and Ask does
 * not guess. Fed the backend's real CAUTION payload (wave 4 h 10 min old).
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FishingOutlook } from "../types";
import fishingStale from "../test/fixtures/gate-fishing-stale.json";
import { forgetSights } from "../firstSight";
import { savePlan } from "../offline";

vi.mock("../api");
vi.mock("./MarineMap", () => ({ default: () => null }));
vi.setConfig({ testTimeout: 20_000 });

const TODAY_STALE = fishingStale as unknown as FishingOutlook;
const RECEIVED = Date.parse(TODAY_STALE.generated_at);
/** Words that plan a trip: none may appear on a withheld verdict. */
const PLANNING = [/Areas \d/, /best time/i, /Stay there/, /Safe to go/, /You can go/, /Tomorrow/];

beforeEach(() => {
  // the clock stands at the moment the payload was recorded
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(RECEIVED);
});

afterEach(() => {
  vi.useRealTimers();
  window.history.replaceState({}, "", "/");
  localStorage.clear();
  vi.clearAllMocks();
  forgetSights();
});

async function openPhone(search: string, outlook: () => Promise<FishingOutlook>) {
  vi.resetModules();
  window.history.replaceState({}, "", `/${search}`);
  const api = vi.mocked(await import("../api"));
  api.zones.mockResolvedValue({ features: [], note: "" });
  api.fishingOutlook.mockImplementation(outlook);
  const { default: MobileApp } = await import("./MobileApp");
  return { api, MobileApp };
}

describe("the phone, offline", () => {
  it("?offline=120: the last plan, 2 h old, re-judged to insufficient data and withheld", async () => {
    const { api, MobileApp } = await openPhone("?lang=en&offline=120", () => Promise.resolve(TODAY_STALE));
    const { container } = render(<MobileApp />);
    expect(await screen.findByText("No connection")).toBeInTheDocument();
    expect(screen.getByText("This is ORCA's last plan, from 11:31 AM, 2 h ago.")).toBeInTheDocument();
    expect(screen.getAllByText("Insufficient data").length).toBeGreaterThan(0);
    expect(screen.getByText("ORCA cannot clear a trip today")).toBeInTheDocument();
    expect(screen.queryByText("/ 100")).not.toBeInTheDocument();
    for (const word of PLANNING) expect(container).not.toHaveTextContent(word);
    expect(api.fishingOutlook).toHaveBeenCalledTimes(1);
  });

  it("?offline=10: a plan still inside the limits keeps its caution", async () => {
    const { MobileApp } = await openPhone("?lang=en&offline=10", () => Promise.resolve(TODAY_STALE));
    render(<MobileApp />);
    expect(await screen.findByText("This is ORCA's last plan, from 1:21 PM, 10 min ago.")).toBeInTheDocument();
    expect(screen.getAllByText("Caution — data stale").length).toBeGreaterThan(0);
  });

  it("a dropped connection shows the saved plan with its age, in the reader's language", async () => {
    savePlan("phone", { at: RECEIVED - 30 * 60_000, lat: 16, lon: 73, language: "hi", data: TODAY_STALE });
    const { MobileApp } = await openPhone("?lang=hi", () => Promise.reject(new TypeError("Failed to fetch")));
    render(<MobileApp />);
    expect(await screen.findByText("कनेक्शन नहीं है")).toBeInTheDocument();
    expect(screen.getByText(/30 मि पहले की/)).toBeInTheDocument();
  });

  it("with nothing saved, says so plainly", async () => {
    const { MobileApp } = await openPhone("?lang=en", () => Promise.reject(new TypeError("Failed to fetch")));
    render(<MobileApp />);
    expect(
      await screen.findByText(/this phone has no saved plan from ORCA yet\. ORCA will not guess/),
    ).toBeInTheDocument();
  });

  it("a server error is not called 'no connection'", async () => {
    const { MobileApp } = await openPhone("?lang=en", () => Promise.reject(new Error("500 Internal Server Error")));
    render(<MobileApp />);
    expect(await screen.findByText("No signal")).toBeInTheDocument();
    expect(screen.queryByText("No connection")).not.toBeInTheDocument();
  });

  it("Ask offline does not guess: it points to the last plan and its age", async () => {
    const { api, MobileApp } = await openPhone("?lang=en&tab=ask&offline=90", () =>
      Promise.resolve(TODAY_STALE),
    );
    render(<MobileApp />);
    // the demo reads once, then cuts the line
    await vi.waitFor(() => expect(api.fishingOutlook).toHaveBeenCalledTimes(1));
    await screen.findByRole("button", { name: "Where are the fish today?" });
    await new Promise((r) => setTimeout(r, 50));
    fireEvent.click(screen.getByRole("button", { name: "Where are the fish today?" }));
    expect(await screen.findByText("No connection, so ORCA will not guess an answer.")).toBeInTheDocument();
    expect(screen.getByText("ORCA's last plan is from 12:01 PM, 1 h 30 min ago, on Today.")).toBeInTheDocument();
    expect(api.ask).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Open the last plan" }));
    expect(await screen.findByText("This is ORCA's last plan, from 12:01 PM, 1 h 30 min ago.")).toBeInTheDocument();
  });
});
