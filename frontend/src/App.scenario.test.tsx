import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatResponse } from "./types";

// The chart needs a real layout engine; the conversation does not need the chart.
vi.mock("./components/MarineMap", () => ({ default: () => null }));
vi.mock("./api");
// The first test imports the whole console cold; on a busy machine that alone
// can take several seconds.
vi.setConfig({ testTimeout: 20_000 });

const QUESTION = "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?";
// The conversation sets the first sentence as the lead and the rest as prose.
const LEAD = "धोका जास्त आहे — जाऊ नका.";
const REST = "जोखीम 70/100.";
const ANSWER = `${LEAD} ${REST}`;

const response = {
  answer: ANSWER,
  language: "mr",
  mode: "DEMO",
  suggestions: [],
  pfz: [],
  routes: [],
  geofence: [],
  alerts: [],
  risk: null,
  evidence: [],
  trace: [],
  intent: { location: null },
  disclaimer: "Decision support, not an official advisory.",
  elapsed_ms: 12,
} as unknown as ChatResponse;

async function openApp(search: string) {
  vi.resetModules(); // the deep link is read when App is first imported
  window.history.replaceState({}, "", `/${search}`);
  const api = vi.mocked(await import("./api"));
  api.zones.mockResolvedValue({ features: [], note: "" });
  api.health.mockResolvedValue({ data_mode: "DEMO" } as Awaited<ReturnType<typeof api.health>>);
  api.resetSession.mockResolvedValue({} as Awaited<ReturnType<typeof api.resetSession>>);
  api.authority.mockRejectedValue(new Error("not under test"));
  api.fishingOutlook.mockRejectedValue(new Error("not under test"));
  api.alerts.mockResolvedValue({ marine_alerts: [], geofence_alerts: [] });
  api.ask.mockResolvedValue(response);
  const { default: App } = await import("./App");
  // StrictMode, as main.tsx renders it: effects mount, unmount and mount again.
  render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return api;
}

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  window.history.replaceState({}, "", "/");
});

describe("a rehearsed scenario opened by deep link", () => {
  it("asks once and answers once under StrictMode", async () => {
    const api = await openApp("?demo=danger");

    expect(await screen.findByText(LEAD)).toBeInTheDocument();
    // leave room for a second, stale run to land if there is one
    await act(() => new Promise((r) => setTimeout(r, 500)));

    expect(api.ask).toHaveBeenCalledTimes(1);
    expect(api.ask).toHaveBeenCalledWith(expect.objectContaining({ message: QUESTION }));
    expect(screen.getAllByText(QUESTION)).toHaveLength(1);
    expect(screen.getAllByText(LEAD)).toHaveLength(1);
    expect(screen.getAllByText(REST)).toHaveLength(1);
  });

  it("keeps only the newest answer when two scenarios overlap", async () => {
    const api = await openApp("?tab=ask");
    let releaseFirst: (r: ChatResponse) => void = () => {};
    api.ask
      .mockReset()
      .mockImplementationOnce(() => new Promise<ChatResponse>((r) => (releaseFirst = r)))
      .mockResolvedValueOnce({ ...response, answer: "second answer", language: "en" });

    const chips = await screen.findAllByRole("button", { name: /Safe|Cyclone/ });
    const safe = chips.find((b) => b.textContent?.includes("Safe"))!;
    const cyclone = chips.find((b) => b.textContent?.includes("Cyclone"))!;

    await act(async () => {
      safe.click();
      await new Promise((r) => setTimeout(r, 20));
      // the chip is disabled while busy, so restart the way the tour does
      cyclone.removeAttribute("disabled");
      cyclone.click();
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(await screen.findByText("second answer")).toBeInTheDocument();

    await act(async () => {
      releaseFirst({ ...response, answer: "first answer, arriving late", language: "en" });
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(screen.queryByText("first answer, arriving late")).not.toBeInTheDocument();
    expect(screen.getAllByText("second answer")).toHaveLength(1);
  });
});

describe("the safety-gate data drill", () => {
  it("sets the drill, asks the question on screen again, and carries the drill with it", async () => {
    const api = await openApp("?demo=danger");
    // a real answer names the question it answered; the drill asks it again
    api.ask.mockResolvedValue({
      ...response,
      intent: { location: null, raw_query: QUESTION },
    } as unknown as ChatResponse);
    api.setDataDrill.mockResolvedValue({ ok: true, drill: "stale", drills: [] });
    expect(await screen.findByText(LEAD)).toBeInTheDocument();
    const firstCalls = api.ask.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: "Stale" }));
    await waitFor(() => expect(api.ask.mock.calls.length).toBe(firstCalls + 1));
    expect(api.setDataDrill).toHaveBeenCalledWith("stale");
    expect(api.ask).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: QUESTION, drill: "stale" }),
    );
  });

  it("answers a ?drill= link under that drill from the very first question", async () => {
    const api = await openApp("?demo=danger&drill=unavailable");
    expect(await screen.findByText(LEAD)).toBeInTheDocument();
    expect(api.ask).toHaveBeenCalledWith(
      expect.objectContaining({ message: QUESTION, drill: "unavailable" }),
    );
  });

  it("sends no drill at all when the visit never chose one", async () => {
    const api = await openApp("?demo=danger");
    expect(await screen.findByText(LEAD)).toBeInTheDocument();
    expect(api.ask.mock.calls[0][0]).not.toHaveProperty("drill");
  });
});
