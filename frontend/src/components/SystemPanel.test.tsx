import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SystemPanel from "./SystemPanel";

vi.mock("../api");

const reading = {
  location: { name: "Mumbai", latitude: 18.922, longitude: 72.8347, state: "Maharashtra" },
  valid_for: "2026-10-01",
  ocean: {
    agent: "ocean",
    ok: true,
    data: {},
    measurements: {
      wave_height: { value: 1.5, unit: "m", label: "Wave", provenance: { source: "DEMO", timestamp: "", mode: "DEMO", confidence: 1 } },
      sst: { value: 28.3, unit: "deg C", label: "SST", provenance: { source: "DEMO", timestamp: "", mode: "DEMO", confidence: 1 } },
    },
    unavailable: [],
    source: "DEMO_STORE",
    timestamp: "",
    confidence: 1,
    mode: "DEMO",
    latency_ms: 2,
  },
  weather: {
    agent: "weather",
    ok: true,
    data: {},
    measurements: {
      wind_speed: { value: 19, unit: "km/h", label: "Wind", provenance: { source: "DEMO", timestamp: "", mode: "DEMO", confidence: 1 } },
      visibility: { value: 8, unit: "km", label: "Visibility", provenance: { source: "DEMO", timestamp: "", mode: "DEMO", confidence: 1 } },
    },
    unavailable: [],
    source: "DEMO_STORE",
    timestamp: "",
    confidence: 1,
    mode: "DEMO",
    latency_ms: 3,
  },
};

async function openPanel(mode: string) {
  const api = vi.mocked(await import("../api"));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api.forecast.mockResolvedValue(reading as any);
  return render(<SystemPanel mode={mode} language="en" />);
}

afterEach(() => vi.clearAllMocks());

/** A window that answers the media queries in `on` and no others. */
function mediaWindow(on: string[]) {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: on.some((q) => query.includes(q)),
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

describe("the live feed pushes in", () => {
  it("logs the previous reading at the top of the table and marks it newest for a moment", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await openPanel("DEMO");
      await screen.findByText("28.3 °C");
      await vi.advanceTimersByTimeAsync(7000);
      const table = await screen.findByRole("table");
      const body = table.querySelectorAll("tbody > tr");
      expect(body).toHaveLength(1);
      expect(body[0]).toHaveAttribute("data-newest");
      // the mark is a moment, not a state
      await vi.advanceTimersByTimeAsync(2500);
      expect(table.querySelector("tbody > tr")).not.toHaveAttribute("data-newest");
    } finally {
      vi.useRealTimers();
    }
  });

  it("takes nothing in while the feed is held", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await openPanel("DEMO");
      await screen.findByText("28.3 °C");
      fireEvent.click(screen.getByRole("button", { name: "Hold" }));
      await vi.advanceTimersByTimeAsync(14000);
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("the engine room runs (beams between the pipeline's nodes)", () => {
  it("at desktop width every gap in the pipeline carries a beam, not the old travelling dots", async () => {
    const restore = mediaWindow(["min-width: 1024px"]);
    try {
      const { container } = await openPanel("DEMO");
      await screen.findByText("28.3 °C");
      // intake → cache → agents (2) and the four crew phases (3)
      expect(container.querySelectorAll("[data-beam-gap]")).toHaveLength(5);
      expect(container.querySelectorAll("[data-beam-gap] svg")).toHaveLength(5);
      expect(container.querySelector(".v-connector")).toBeNull();
    } finally {
      restore();
    }
  });

  it("below desktop width the stacked flow keeps its drop lines and draws no beams", async () => {
    const { container } = await openPanel("DEMO");
    await screen.findByText("28.3 °C");
    expect(container.querySelectorAll("[data-beam-gap] svg")).toHaveLength(0);
    expect(container.querySelectorAll(".v-connector-down").length).toBeGreaterThanOrEqual(5);
  });
});

describe("provider status follows the data edition (S1)", () => {
  it("in DEMO the live providers stand by and the demo store is in use", async () => {
    await openPanel("DEMO");
    expect(await screen.findAllByText("Standby · verified")).toHaveLength(2);
    expect(screen.getByText("In use")).toBeInTheDocument();
    expect(screen.queryByText("Standby")).not.toBeInTheDocument();
  });

  it("the provider in use glows and pings; the ones standing by keep still", async () => {
    await openPanel("DEMO");
    const inUse = screen.getByText("In use");
    expect(inUse.closest("[data-pulse]")).not.toBeNull();
    for (const standby of await screen.findAllByText("Standby · verified"))
      expect(standby.closest("[data-pulse]")).toBeNull();
  });

  it("in LIVE the open providers are in use and the demo store stands by", async () => {
    await openPanel("LIVE");
    expect(await screen.findAllByText("In use")).toHaveLength(2);
    expect(screen.getByText("Standby")).toBeInTheDocument();
    expect(screen.queryByText("Standby · verified")).not.toBeInTheDocument();
  });
});

describe("the live feed (S4, S5, W3)", () => {
  it("prints degree readings with the degree sign", async () => {
    await openPanel("DEMO");
    expect(await screen.findByText("28.3 °C")).toBeInTheDocument();
    expect(screen.queryByText(/deg C/)).not.toBeInTheDocument();
  });

  it("shows the first reading once: no log table until the second tick", async () => {
    await openPanel("DEMO");
    await screen.findByText("28.3 °C");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("offers a visible Hold for the 7 s rotation (WCAG 2.2.2)", async () => {
    await openPanel("DEMO");
    const hold = await screen.findByRole("button", { name: "Hold" });
    expect(hold).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(hold);
    const resume = screen.getByRole("button", { name: "Resume" });
    expect(resume).toHaveAttribute("aria-pressed", "true");
  });

  it("explains the cache note in words, not an arrow", async () => {
    await openPanel("DEMO");
    expect(screen.getByText(/first read 32 s, from cache 0\.02 s/)).toBeInTheDocument();
    expect(screen.queryByText(/32 s → 0\.02 s/)).not.toBeInTheDocument();
  });
});
