import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ERRORS } from "./i18n/errors";
import { LANG_NAME, TAB_LABEL, UI } from "./i18n/app";
import { UI as CARD_UI, VERDICT } from "./i18n/riskCard";
import { T as CHAT } from "./i18n/chat";
import type { ChatResponse, RiskAssessment, AgentTrace as Trace } from "./types";

// The chart needs a real layout engine; the shell does not need the chart.
vi.mock("./components/MarineMap", () => ({ default: () => null }));
vi.mock("./api");
vi.setConfig({ testTimeout: 20_000 });

const MARATHI_LEAD = "धोका जास्त आहे — जाऊ नका.";

const risk: RiskAssessment = {
  score: 70,
  category: "HIGH",
  factors: [
    { key: "cyclone", label: "Official warnings", factor: 0.84, weight: 0.25, contribution: 21, detail: "IMD चेतावनी लागू आहे." },
    { key: "wave", label: "Wave height", factor: 0.62, weight: 0.25, contribution: 15.5, detail: "लाटा 3.4 मी." },
  ],
  overrides: [],
  official_warning: true,
  go: false,
  window: null,
  sources: ["IMD"],
  generated_at: "2026-10-01T16:00:00",
  mode: "DEMO",
};

const trace: Trace[] = [
  { agent: "intent", status: "ok", latency_ms: 0, summary: "fishing_advice @ Mumbai", source: "parser", mode: "DEMO" },
  { agent: "weather", status: "ok", latency_ms: 12, summary: "Rain 20%", source: "Open-Meteo", mode: "DEMO" },
  { agent: "ocean", status: "ok", latency_ms: 9, summary: "Waves 3.4 m", source: "Open-Meteo", mode: "DEMO" },
  { agent: "cyclone", status: "ok", latency_ms: 4, summary: "IMD warning in force", source: "IMD", mode: "DEMO" },
  { agent: "gis", status: "ok", latency_ms: 0, summary: "No zone conflict", source: "GIS", mode: "DEMO" },
  { agent: "risk", status: "ok", latency_ms: 1, summary: "70/100 HIGH", source: "risk engine", mode: "DEMO" },
  { agent: "explanation", status: "ok", latency_ms: 2, summary: "Answered in Marathi", source: "composer", mode: "DEMO" },
];

const marathiResponse = {
  answer: `${MARATHI_LEAD} जोखीम 70/100.`,
  language: "mr",
  mode: "DEMO",
  suggestions: [],
  pfz: [],
  routes: [],
  geofence: [],
  alerts: [],
  risk,
  evidence: [],
  trace,
  intent: { location: null },
  disclaimer: "Decision support, not an official advisory.",
  elapsed_ms: 41,
} as unknown as ChatResponse;

async function openApp(search: string, response: ChatResponse = marathiResponse) {
  vi.resetModules(); // the deep link is read when App is first imported
  window.history.replaceState({}, "", `/${search}`);
  const api = vi.mocked(await import("./api"));
  vi.clearAllMocks();
  api.zones.mockResolvedValue({ features: [], note: "" });
  api.health.mockResolvedValue({ data_mode: "DEMO" } as Awaited<ReturnType<typeof api.health>>);
  api.resetSession.mockResolvedValue({} as Awaited<ReturnType<typeof api.resetSession>>);
  api.authority.mockRejectedValue(new Error("not under test"));
  api.fishingOutlook.mockRejectedValue(new Error("not under test"));
  api.riskTimeline.mockResolvedValue({ points: [] } as unknown as Awaited<ReturnType<typeof api.riskTimeline>>);
  api.alerts.mockResolvedValue({ marine_alerts: [], geofence_alerts: [] });
  api.ask.mockResolvedValue(response);
  const { default: App } = await import("./App");
  render(<App />);
  return api;
}

const tick = (ms = 20) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

afterEach(() => {
  window.history.replaceState({}, "", "/");
  document.documentElement.lang = "en";
});

describe("the reader's language stays put (C2)", () => {
  it("keeps the chrome in the reader's language after a Marathi answer, and says what language answered", async () => {
    await openApp("?demo=danger");
    expect(await screen.findByText(MARATHI_LEAD)).toBeInTheDocument();
    await tick(300);

    // chrome and document stay with the reader (boot-detected English)
    expect(document.documentElement.lang).toBe("en");
    const nav = screen.getByRole("navigation", { name: UI.en.views });
    expect(within(nav).getByRole("link", { name: TAB_LABEL.en.ask })).toBeInTheDocument();

    // the verdict labels are the reader's; the chip says the answer's language
    expect(screen.getByText(CARD_UI.en.why)).toBeInTheDocument();
    expect(
      screen.getByText(CARD_UI.en.answeredIn.replace("{lang}", LANG_NAME.mr)),
    ).toBeInTheDocument();

    // the chat bubble keeps the answer's language, marked for assistive tech
    const bubble = screen.getByText(MARATHI_LEAD);
    expect(bubble.closest("[lang]")).toHaveAttribute("lang", "mr");
  });

  it("keeps an explicit language choice through a rehearsed scenario", async () => {
    const api = await openApp("?tab=ask&lang=en");
    const chip = await screen.findByRole("button", { name: /Paradip/ });
    fireEvent.click(chip);
    await tick(100);
    expect(api.ask).toHaveBeenCalledWith(expect.objectContaining({ language: "en" }));
  });
});

describe("views are addresses and focus follows (W1 + W2)", () => {
  it("preserves m, lang and at in the URL, drops demo, and answers the Back button", async () => {
    await openApp("?demo=danger&lang=en&m=0");
    await screen.findByText(MARATHI_LEAD);
    await tick(300);

    const nav = screen.getByRole("navigation", { name: UI.en.views });
    fireEvent.click(within(nav).getByRole("link", { name: TAB_LABEL.en.home }));
    const search = new URLSearchParams(window.location.search);
    expect(search.get("tab")).toBe("home");
    expect(search.get("lang")).toBe("en");
    expect(search.get("m")).toBe("0");
    expect(search.get("demo")).toBeNull();

    // focus lands on the sheet it opened
    expect(document.activeElement).toBe(screen.getByRole("main"));

    // Back returns to the Ask sheet without leaving ORCA
    act(() => {
      window.history.back();
    });
    expect(await screen.findByRole("heading", { level: 1, name: "Ask" })).toBeInTheDocument();
  });
});

describe("one verdict vocabulary (X1 + A1 + A2)", () => {
  it("stamps the verdict phrase, moves the band to the eyebrow, and scales bars to the fixed 25-point weight", async () => {
    await openApp("?demo=danger");
    await screen.findByText(MARATHI_LEAD);
    await tick(300);

    // the stamp prints the verdict phrase in the reader's language
    expect(screen.getByText(VERDICT.en.HIGH)).toHaveClass("stamp");
    // the eyebrow carries VERDICT · band · score
    const eyebrow = document.querySelector(".verdict .label");
    expect(eyebrow?.textContent).toMatch(/HIGH · 70\/100/);

    // why-bars: 21 of the fixed 25-point scale, not 21 of this answer's max
    const bars = document.querySelectorAll<HTMLElement>(".verdict-why li [style*='scaleX']");
    expect(bars.length).toBeGreaterThan(0);
    expect(bars[0].style.transform).toBe("scaleX(0.84)");
    expect(bars[1].style.transform).toBe("scaleX(0.62)");
  });
});

describe("crew truth (S2 + C5 + P9)", () => {
  it("counts ten agents, prints <1 ms for zero latencies, and keeps a crew foot on the verdict", async () => {
    await openApp("?demo=danger");
    await screen.findByText(MARATHI_LEAD);
    await tick(300);

    // the trace speaks for the whole roster of ten
    expect(screen.getByText(/10 agents · 41 ms total/)).toBeInTheDocument();
    // zero latencies are printed, not hidden
    expect(screen.getAllByText("<1 ms").length).toBeGreaterThan(0);
    // the crew foot on the verdict links to the manifest
    const foot = document.querySelector("a[href='#crew-trace']");
    expect(foot).not.toBeNull();
    expect(foot!.textContent).toContain("10");
  });
});

describe("Ask states (A6 + H4)", () => {
  it("says nothing has been answered yet when the first question fails", async () => {
    const api = await openApp("?tab=ask");
    api.ask.mockReset().mockRejectedValue(new Error("offline"));
    const field = screen.getByRole("textbox", { name: CHAT.en.question });
    fireEvent.change(field, { target: { value: "Can I go?" } });
    fireEvent.submit(field.closest("form")!);
    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText(ERRORS.en.offlineFirstBody)).toBeInTheDocument();
  });

  it("glosses the Devanagari rehearsed questions in the reader's language", async () => {
    await openApp("?tab=ask");
    const { SCENARIOS } = await import("./i18n/app");
    const danger = SCENARIOS.find((s) => s.id === "danger")!;
    expect(danger.gloss).toBeDefined();
    expect(screen.getByText(danger.gloss!.en)).toBeInTheDocument();
    // every hint shares one grammar: PLACE · expected band
    for (const s of SCENARIOS) expect(s.hint).toMatch(/^[A-Za-z]+ · [A-Z]+$/);
  });
});
