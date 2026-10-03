import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthorityDashboard } from "../types";
import { L10N } from "../i18n/landing";

// The landing's heavy neighbours are not under test here.
vi.mock("../api");
vi.mock("./ReliefSection", () => ({ default: () => null }));
vi.mock("../effects/GroundSwell", () => ({ default: () => null }));

const board: AuthorityDashboard = {
  generated_at: "2026-10-03T19:11:47+05:30",
  summary: { monitored: 3, official_warnings: 2 },
  locations: [
    { name: "Paradip", state: "Odisha", latitude: 20.26, longitude: 86.69, risk_score: 92, risk_category: "EXTREME", official_warning: true, wave_height_m: 5.28, wind_speed_kmh: 88.1, headline: null },
    { name: "Digha", state: "West Bengal", latitude: 21.6, longitude: 87.5, risk_score: 78, risk_category: "HIGH", official_warning: true, wave_height_m: 2.85, wind_speed_kmh: 42.3, headline: null },
    { name: "Goa", state: "Goa", latitude: 15.4, longitude: 73.8, risk_score: 12, risk_category: "LOW", official_warning: false, wave_height_m: 0.8, wind_speed_kmh: 10, headline: null },
  ],
};

const tick = (ms = 20) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

/** Pretend the reader asked for less motion (or not). */
function reducedMotion(on: boolean) {
  window.matchMedia = ((q: string) => ({
    matches: on && q.includes("reduce"),
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

async function openLanding(authority: "ok" | "fail" | "pending", language: "en" | "hi" | "mr" = "en") {
  const api = vi.mocked(await import("../api"));
  vi.clearAllMocks();
  if (authority === "ok") api.authority.mockResolvedValue(board);
  else if (authority === "fail") api.authority.mockRejectedValue(new Error("offline"));
  else api.authority.mockReturnValue(new Promise(() => {}));
  api.ask.mockRejectedValue(new Error("not under test"));
  const { default: Landing } = await import("./Landing");
  const view = render(
    <Landing
      mode="DEMO"
      language={language}
      onLanguage={() => {}}
      onEnter={() => {}}
      onTour={() => {}}
      onScenario={() => {}}
    />,
  );
  await tick();
  return view;
}

const original = window.matchMedia;
beforeEach(() => reducedMotion(false));
afterEach(() => {
  window.matchMedia = original;
});

describe("the reading lamp (spotlight)", () => {
  it("follows a fine pointer over every index row and the relief panel; the rows stay links", async () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes("pointer: fine"),
      media: q,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
    const { container } = await openLanding("pending");
    const rows = container.querySelectorAll("nav li");
    expect(rows).toHaveLength(4);
    for (const row of rows) {
      expect(row.querySelector(".spotlight-pool")).not.toBeNull();
      expect(row.querySelector("a.sheet-row")).not.toBeNull();
    }
    expect(container.querySelectorAll(".spotlight")).toHaveLength(5);
  });

  it("is not lit on a touch screen", async () => {
    const { container } = await openLanding("pending");
    expect(container.querySelector(".spotlight-pool")).toBeNull();
  });
});

describe("decoded labels", () => {
  it("the masthead kicker and the two panel labels decode, each read once by assistive tech", async () => {
    const { container } = await openLanding("pending");
    for (const words of ["SIH26176 · ISRO · Smart India Hackathon 2026", L10N.en.indexTitle, L10N.en.pipelineTitle]) {
      const hidden = [...container.querySelectorAll(".sr-only")].find((s) => s.textContent === words);
      expect(hidden, words).toBeDefined();
      const drawn = hidden!.nextElementSibling!;
      expect(drawn).toHaveAttribute("aria-hidden", "true");
      expect(drawn.textContent).toBe(words);
    }
  });
});

describe("the hand-drawn mark under the teal word", () => {
  it("leaves the word readable throughout and marks it once the hero has settled", async () => {
    const { container } = await openLanding("pending");
    const h1 = container.querySelector("h1")!;
    const mark = h1.querySelector("[data-mark]")!;
    expect(mark).toHaveTextContent(L10N.en.tag2b);
    expect(mark).toHaveAttribute("data-mark", "waiting");
    await tick(1200);
    expect(mark).toHaveAttribute("data-mark", "drawn");
    expect(mark).toHaveTextContent(L10N.en.tag2b);
    expect(h1).toHaveTextContent(`${L10N.en.tag2a}${L10N.en.tag2b}${L10N.en.tag2c}`);
  });

  it("is drawn from the start under reduced motion, in every language", async () => {
    reducedMotion(true);
    const { container } = await openLanding("pending", "hi");
    const mark = container.querySelector("h1 [data-mark]")!;
    expect(mark).toHaveAttribute("data-mark", "drawn");
    expect(mark).toHaveTextContent(L10N.hi.tag2b);
  });
});

describe("the stats strip", () => {
  const cell = (container: HTMLElement, label: string) =>
    [...container.querySelectorAll(".label")].find((l) => l.textContent === label)!.nextElementSibling!;

  it("counts the live numbers with the number ticker; the two constants stay plain", async () => {
    reducedMotion(true); // the ticker prints its final value at once
    const { container } = await openLanding("ok");
    const [crew, centres, warnings, languages] = L10N.en.stats;
    expect(cell(container, centres).querySelector(".tabular-nums")).toHaveTextContent("3");
    expect(cell(container, warnings).querySelector(".tabular-nums")).toHaveTextContent("2");
    expect(cell(container, crew).textContent).toBe("10");
    expect(cell(container, crew).querySelector("span")).toBeNull();
    expect(cell(container, languages).textContent).toBe("3");
  });

  it("starts the ticker from zero when motion is allowed, and shows a dash until the board answers", async () => {
    const live = await openLanding("ok");
    expect(cell(live.container, L10N.en.stats[1]).querySelector(".tabular-nums")).toHaveTextContent("0");
    live.unmount();
    const pending = await openLanding("pending");
    expect(cell(pending.container, L10N.en.stats[1]).textContent).toBe("—");
  });
});

describe("the coast, right now (ticker)", () => {
  it("runs every landing centre past as a marquee, with a sentence for screen readers", async () => {
    const { container } = await openLanding("ok");
    const strip = container.querySelector(".coast-ticker")!;
    expect(strip).not.toBeNull();
    expect(strip).toHaveTextContent(L10N.en.coastLabel);
    // the moving copies are decoration; the sentence is what is read
    const moving = strip.querySelector(".animate-marquee")!;
    expect(moving.closest("[aria-hidden='true']")).not.toBeNull();
    const said = strip.querySelector(".sr-only")!;
    expect(said.textContent).toContain("Paradip 92 Extreme, official warning");
    expect(said.textContent).toContain("Goa 12 Low");
    // each centre: a band square, the name, the score, the band word, and a warning mark when warned
    const first = moving.querySelectorAll("[data-centre]");
    expect(first).toHaveLength(3);
    expect(first[0]).toHaveTextContent(/Paradip\s*92\s*Extreme/);
    expect(first[0].querySelector("svg")).not.toBeNull();
    expect(first[2].querySelector("svg")).toBeNull();
  });

  it("draws nothing while the board is loading or when it fails", async () => {
    const pending = await openLanding("pending");
    expect(pending.container.querySelector(".coast-ticker")).toBeNull();
    expect(screen.queryByText(L10N.en.coastLabel)).toBeNull();
    pending.unmount();
    const failed = await openLanding("fail");
    expect(failed.container.querySelector(".coast-ticker")).toBeNull();
  });

  it("stands still as a wrapped row under reduced motion", async () => {
    reducedMotion(true);
    const { container } = await openLanding("ok");
    const strip = container.querySelector(".coast-ticker")!;
    expect(strip.querySelector(".animate-marquee")).toBeNull();
    expect(strip.querySelectorAll("[data-centre]")).toHaveLength(3);
  });

  it("speaks the reader's language", async () => {
    const { container } = await openLanding("ok", "mr");
    const strip = container.querySelector(".coast-ticker")!;
    expect(strip).toHaveTextContent(L10N.mr.coastLabel);
    expect(strip.querySelector(".sr-only")!.textContent).toContain("अधिकृत इशारा");
  });
});
