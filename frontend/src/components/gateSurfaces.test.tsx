/**
 * Every surface, fed the backend's REAL responses under the data drills
 * (captured from /api/chat and /api/fishing into src/test/fixtures): when the
 * safety gate withholds a verdict, no screen may print a score, a go stamp,
 * a best window, a course or a fishing-ground pitch; when the evidence is
 * stale, the verdict stands but reads unconfirmed. (Review finding: toy
 * fixtures with one-line advice hid exactly these contradictions.)
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChatResponse, FishingOutlook } from "../types";
import { forgetSights } from "../firstSight";
import FishingPanel from "./FishingPanel";
import chatUnavailable from "../test/fixtures/gate-chat-unavailable.json";
import chatStale from "../test/fixtures/gate-chat-stale.json";
import fishingUnavailable from "../test/fixtures/gate-fishing-unavailable.json";
import fishingStale from "../test/fixtures/gate-fishing-stale.json";

vi.mock("../api");
vi.mock("./MarineMap", () => ({ default: () => null }));
vi.setConfig({ testTimeout: 20_000 });

const CHAT_DOWN = chatUnavailable as unknown as ChatResponse;
const CHAT_STALE = chatStale as unknown as ChatResponse;
const TODAY_DOWN = fishingUnavailable as unknown as FishingOutlook;
const TODAY_STALE = fishingStale as unknown as FishingOutlook;

/** Words that plan a trip: none may appear on a withheld verdict. */
const PLANNING = [/Areas \d/, /best time/i, /Stay there/, /Safe to go/, /You can go/];

afterEach(() => {
  window.history.replaceState({}, "", "/");
  vi.clearAllMocks();
  forgetSights();
});

describe("the real payloads are what the backend now sends", () => {
  it("withholds the trip plan on missing data", () => {
    expect(TODAY_DOWN.decision?.state).toBe("INSUFFICIENT_DATA");
    expect(TODAY_DOWN.areas).toEqual([]);
    expect(TODAY_DOWN.routes).toEqual([]);
    expect(TODAY_DOWN.best_window).toBeNull();
    expect(CHAT_DOWN.decision?.state).toBe("INSUFFICIENT_DATA");
    expect(CHAT_STALE.decision?.state).toBe("CAUTION");
  });
});

describe("desktop Today", () => {
  it("prints no score, no stamp to go and no plan on missing data", () => {
    const { container } = render(<FishingPanel data={TODAY_DOWN} language="en" />);
    expect(screen.getByText("No score — ORCA will not guess")).toBeInTheDocument();
    expect(screen.getAllByText("Insufficient data").length).toBeGreaterThan(0);
    for (const word of PLANNING) expect(container).not.toHaveTextContent(word);
  });

  it("keeps the number on stale data, stamped with caution and unconfirmed", () => {
    render(<FishingPanel data={TODAY_STALE} language="en" />);
    expect(screen.getAllByText("Caution — data stale").length).toBeGreaterThan(0);
    expect(screen.getByText(/unconfirmed/)).toBeInTheDocument();
  });
});

async function openPhone(search: string) {
  vi.resetModules();
  window.history.replaceState({}, "", `/${search}`);
  const api = vi.mocked(await import("../api"));
  api.zones.mockResolvedValue({ features: [], note: "" });
  api.fishingOutlook.mockResolvedValue(TODAY_DOWN);
  api.ask.mockResolvedValue(CHAT_DOWN);
  const { default: MobileApp } = await import("./MobileApp");
  return { api, MobileApp };
}

describe("the phone", () => {
  it("Today: an empty ring, the gate's stamp, and the day off says why", async () => {
    const { MobileApp } = await openPhone("?lang=en");
    const { container } = render(<MobileApp />);
    expect(await screen.findByText("ORCA cannot clear a trip today")).toBeInTheDocument();
    expect(screen.getAllByText("Insufficient data").length).toBeGreaterThan(0);
    expect(screen.queryByText("/ 100")).not.toBeInTheDocument();
    for (const word of PLANNING) expect(container).not.toHaveTextContent(word);
  });

  it("Ask: the answer card never stamps 'Safe to go' on a withheld verdict", async () => {
    const { MobileApp } = await openPhone("?lang=en&tab=ask");
    render(<MobileApp />);
    fireEvent.click(screen.getByRole("button", { name: "Where are the fish today?" }));
    expect(await screen.findByText("Follow the official advisory")).toBeInTheDocument();
    expect(screen.getAllByText("Insufficient data").length).toBeGreaterThan(0);
    expect(screen.queryByText("Safe to go")).not.toBeInTheDocument();
    // the gate's reason is the first "why", not a factor built on a missing reading
    expect(screen.getByText(/no reading — the marine forecast feed did not respond/)).toBeInTheDocument();
  });

  it("Ask: a stale answer keeps its number, stamped with caution and unconfirmed", async () => {
    const { api, MobileApp } = await openPhone("?lang=en&tab=ask");
    api.ask.mockResolvedValue(CHAT_STALE);
    render(<MobileApp />);
    fireEvent.click(screen.getByRole("button", { name: "Where are the fish today?" }));
    expect((await screen.findAllByText("Caution — data stale")).length).toBeGreaterThan(0);
    expect(screen.getByText(/· unconfirmed/)).toBeInTheDocument();
    expect(screen.queryByText("Safe to go")).not.toBeInTheDocument();
  });
});

async function openConsole(search: string) {
  vi.resetModules();
  window.history.replaceState({}, "", `/${search}`);
  const api = vi.mocked(await import("../api"));
  api.zones.mockResolvedValue({ features: [], note: "" });
  api.health.mockResolvedValue({ data_mode: "DEMO" } as Awaited<ReturnType<typeof api.health>>);
  api.resetSession.mockResolvedValue({} as Awaited<ReturnType<typeof api.resetSession>>);
  api.authority.mockRejectedValue(new Error("not under test"));
  api.alerts.mockResolvedValue({ marine_alerts: [], geofence_alerts: [] });
  api.fishingOutlook.mockResolvedValue(TODAY_DOWN);
  api.ask.mockResolvedValue(CHAT_DOWN);
  api.riskTimeline.mockResolvedValue({ points: [] });
  const { default: App } = await import("../App");
  render(<App />);
  return api;
}

describe("the desktop console", () => {
  it("Today's stat row prints no score on missing data", async () => {
    await openConsole("?m=0&tab=home&at=15.40,73.70");
    const label = await screen.findByText("Risk", { selector: "dt" });
    await vi.waitFor(() => expect(label.nextElementSibling).toHaveTextContent("—Insufficient data"));
  });

  it("Ask draws no 24-hour score timeline under a withheld verdict", async () => {
    const api = await openConsole("?m=0&tab=ask&demo=safe");
    expect(await screen.findByText("No score — ORCA will not guess")).toBeInTheDocument();
    expect(api.riskTimeline).not.toHaveBeenCalled();
  });
});
