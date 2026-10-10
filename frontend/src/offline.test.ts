import { afterEach, describe, expect, it, vi } from "vitest";
import type { DataHealth, FishingOutlook, GateState, SafetyDecision } from "./types";
import {
  agePlan,
  isNetworkFailure,
  loadPlan,
  planAgeSeconds,
  regate,
  regateHealth,
  regateOutlook,
  savePlan,
  shiftIso,
  type SavedPlan,
} from "./offline";
import { gateWithholds } from "./gateModel";
import { tripIsOff } from "./components/todayModel";
import { OFFLINE } from "./i18n/offline";
import staleFixture from "./test/fixtures/gate-fishing-stale.json";

const T0 = Date.parse("2026-10-10T08:00:00+05:30");
const MIN = 60_000;
const H = 3600;

/** A record observed at T0, with the backend's limits for that input (config.DATA_HEALTH). */
function rec(input: string, over: Partial<DataHealth> = {}): DataHealth {
  const limits: Record<string, [number | null, number | null]> = {
    wave: [3 * H, 6 * H],
    wind: [3 * H, 6 * H],
    warnings: [H, 3 * H],
    position: [null, null],
    rain: [3 * H, 6 * H],
  };
  const [fresh, max] = limits[input];
  return {
    input,
    label: input,
    source: "test",
    feed: input,
    available: true,
    observed_at: fresh == null ? null : "2026-10-10T08:00:00+05:30",
    age_seconds: fresh == null ? null : 0,
    freshness_limit_seconds: fresh,
    max_age_seconds: max,
    status: "FRESH",
    critical: input !== "rain",
    usable: true,
    detail: "",
    mode: "DEMO",
    ...over,
  };
}

const HEALTH = ["wave", "wind", "warnings", "position", "rain"].map((k) => rec(k));

function decision(state: GateState, over: Partial<SafetyDecision> = {}): SafetyDecision {
  return {
    state,
    confidence: "normal",
    headline: "",
    reasons: [],
    blocking_inputs: [],
    stale_inputs: [],
    risk_go: state !== "NO_GO",
    drill: "healthy",
    timestamp: "2026-10-10T08:00:00+05:30",
    ...over,
  };
}

describe("regate: the backend's gate rules, re-run on the phone as a plan ages", () => {
  // minutes after T0 -> state, confidence, stale, blocking (mirrors test_safety_gate.py)
  const rows: [number, GateState, string, string[], string[]][] = [
    [0, "GO", "normal", [], []],
    [30, "GO", "normal", [], []],
    [60, "GO", "normal", [], []], // at the limit is still fresh
    [61, "CAUTION", "degraded", ["warnings"], []], // warnings degrade first, past 1 h
    [90, "CAUTION", "degraded", ["warnings"], []],
    [180, "CAUTION", "degraded", ["warnings"], []], // warnings at their 3 h maximum: still usable
    [181, "INSUFFICIENT_DATA", "insufficient", ["wave", "wind"], ["warnings"]], // past 3 h: unusable
    [200, "INSUFFICIENT_DATA", "insufficient", ["wave", "wind"], ["warnings"]],
    [361, "INSUFFICIENT_DATA", "insufficient", [], ["wave", "wind", "warnings"]], // all past max
  ];

  it.each(rows)("%i min after a GO -> %s", (mins, state, confidence, stale, blocking) => {
    const out = regate(HEALTH, decision("GO"), T0 + mins * MIN);
    expect(out.decision.state).toBe(state);
    expect(out.decision.confidence).toBe(confidence);
    expect(out.decision.stale_inputs).toEqual(stale);
    expect(out.decision.blocking_inputs).toEqual(blocking);
  });

  it("re-derives each input's status from observed_at and its own limits", () => {
    const at = (mins: number, input: string) =>
      regate(HEALTH, decision("GO"), T0 + mins * MIN).health.find((h) => h.input === input)!;
    expect(at(30, "warnings")).toMatchObject({ status: "FRESH", usable: true, age_seconds: 1800 });
    expect(at(90, "warnings")).toMatchObject({ status: "STALE", usable: true });
    expect(at(200, "warnings")).toMatchObject({ status: "STALE", usable: false });
    expect(at(200, "wave")).toMatchObject({ status: "STALE", usable: true });
    expect(at(400, "wave")).toMatchObject({ status: "STALE", usable: false });
    // a non-critical input ages too, but never moves the gate
    expect(at(400, "rain")).toMatchObject({ status: "STALE", usable: false, critical: false });
  });

  it("keeps the static chart layer FRESH however old the plan is", () => {
    const out = regate(HEALTH, decision("GO"), T0 + 30 * 24 * 60 * MIN);
    expect(out.health.find((h) => h.input === "position")).toMatchObject({ status: "FRESH", usable: true });
    expect(out.decision.blocking_inputs).not.toContain("position");
  });

  it.each([0, 90, 200, 10_000])("holds NO_GO at %i min: it is never weakened", (mins) => {
    const out = regate(HEALTH, decision("NO_GO"), T0 + mins * MIN);
    expect(out.decision.state).toBe("NO_GO");
    expect(out.decision.risk_go).toBe(false);
  });

  it("says why a NO-GO rests on old evidence, without softening it", () => {
    const out = regate(HEALTH, decision("NO_GO"), T0 + 200 * MIN);
    expect(out.decision.confidence).toBe("insufficient");
    expect(out.decision.reasons[out.decision.reasons.length - 1]).toBe(OFFLINE.en.gate.nogoMissing);
  });

  it.each(["MISSING", "ERROR"] as const)("keeps a %s input unusable, even at once", (status) => {
    const health = HEALTH.map((h) =>
      h.input === "wave" ? { ...h, status, usable: false, available: false, observed_at: null } : h,
    );
    const out = regate(health, decision("INSUFFICIENT_DATA", { blocking_inputs: ["wave"] }), T0);
    expect(out.health[0]).toMatchObject({ status, usable: false });
    expect(out.decision.state).toBe("INSUFFICIENT_DATA");
    expect(out.decision.blocking_inputs).toEqual(["wave"]);
  });

  it("never reads a plan as better than the server did, whatever the phone's clock", () => {
    const health = HEALTH.map((h) =>
      h.input === "wave" ? { ...h, status: "STALE" as const, age_seconds: 4 * H } : h,
    );
    const caution = decision("CAUTION", { stale_inputs: ["wave"], confidence: "degraded" });
    // the phone's clock runs two hours behind the server's
    const out = regate(health, caution, T0 - 120 * MIN, { receivedAt: T0 });
    expect(out.decision.state).toBe("CAUTION");
    expect(out.health[0].status).toBe("STALE");
  });

  it("counts time since receipt too, so a slow phone clock cannot freshen a reading", () => {
    // received at T0 (age 0); the phone's clock then says only 10 min passed
    // since observed_at, but 2 h have passed since receipt by its own clock
    const shifted = HEALTH.map((h) => (h.observed_at ? { ...h, observed_at: shiftIso(h.observed_at, 110 * MIN) } : h));
    const out = regate(shifted, decision("GO"), T0 + 120 * MIN, { receivedAt: T0 });
    expect(out.decision.state).toBe("CAUTION");
  });

  it("treats a reading from the future as a fault", () => {
    const out = regateHealth(rec("wave"), T0 - 30 * MIN);
    expect(out).toMatchObject({ status: "ERROR", usable: false });
  });

  it("decides nothing with no decision or no health", () => {
    expect(regate(HEALTH, null, T0).decision.state).toBe("INSUFFICIENT_DATA");
    expect(regate([], decision("GO"), T0).decision.state).toBe("INSUFFICIENT_DATA");
  });

  it("writes its reasons in the plan's language", () => {
    const out = regate(HEALTH, decision("GO"), T0 + 90 * MIN, { lang: "mr" });
    expect(out.decision.headline).toBe(OFFLINE.mr.gate.headline.CAUTION);
    expect(out.decision.reasons[0]).toBe("warnings: 1 तास 30 मिनिटे जुनी नोंद — 1 तास मर्यादेपेक्षा जास्त.");
  });
});

describe("regateOutlook: a saved plan withheld exactly as the server withholds it", () => {
  const data = staleFixture as unknown as FishingOutlook;
  const received = Date.parse(data.generated_at);
  const plan: SavedPlan = { at: received, lat: 16.05, lon: 73.47, language: "en", data };

  it("keeps a CAUTION plan, with the gate's sentence first", () => {
    const out = regateOutlook(plan, received + 5 * MIN);
    expect(out.decision?.state).toBe("CAUTION");
    expect(out.advice[0]).toBe(OFFLINE.en.gate.line.CAUTION);
    expect(out.areas.length).toBeGreaterThan(0);
  });

  it("plans no trip once the evidence is too old", () => {
    // the wave reading was 4 h 10 min old; past 6 h it is unusable
    const out = regateOutlook(plan, received + 120 * MIN);
    expect(out.decision?.state).toBe("INSUFFICIENT_DATA");
    expect(out.decision?.blocking_inputs).toEqual(expect.arrayContaining(["wave"]));
    expect(out).toMatchObject({
      areas: [],
      best_window: null,
      hourly_ranking: [],
      duration: null,
      economics: null,
      routes: [],
      forecast: [],
    });
    expect(out.advice[0]).toBe(OFFLINE.en.gate.line.INSUFFICIENT_DATA);
    expect(out.advice[out.advice.length - 1]).toBe(data.advice[data.advice.length - 1]); // the disclaimer stays
    expect(out.advice.join(" ")).not.toMatch(/best time|Stay there|Tomorrow|best chances/i);
    expect(gateWithholds(out.decision)).toBe(true);
    expect(tripIsOff(out)).toBe(true);
  });
});

describe("the offline demo's ageing", () => {
  it("moves a timestamp and keeps its offset", () => {
    expect(shiftIso("2026-10-10T13:31:23+05:30", -90 * MIN)).toBe("2026-10-10T12:01:23+05:30");
    expect(shiftIso("2026-10-10T00:10:00Z", -20 * MIN)).toBe("2026-10-09T23:50:00Z");
  });

  it("makes a fresh plan N minutes old, consistently", () => {
    const data = staleFixture as unknown as FishingOutlook;
    const now = Date.parse(data.generated_at);
    const aged = agePlan({ at: now, lat: 0, lon: 0, language: "en", data }, 90);
    expect(planAgeSeconds(aged, now)).toBe(90 * 60);
    expect(aged.data.generated_at).toBe("2026-10-10T12:01:23+05:30");
    // warnings were 25 min old: 115 min now, over the 1 h limit
    expect(regateOutlook(aged, now).decision?.stale_inputs).toEqual(["wave", "warnings"]);
  });
});

describe("the saved plan", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("round-trips through localStorage, per device", () => {
    const plan = { at: T0, lat: 1, lon: 2, language: "hi" as const, data: staleFixture as unknown as FishingOutlook };
    savePlan("phone", plan);
    expect(loadPlan("phone")).toEqual(plan);
    expect(loadPlan("console")).toBeNull();
  });

  it("never throws when storage does, and rejects junk", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => savePlan("phone", { at: T0, lat: 1, lon: 2, language: "en", data: {} as FishingOutlook })).not.toThrow();
    vi.restoreAllMocks();
    localStorage.setItem("orca.lastPlan.v1.phone", "{not json");
    expect(loadPlan("phone")).toBeNull();
    localStorage.setItem("orca.lastPlan.v1.phone", JSON.stringify({ at: "x" }));
    expect(loadPlan("phone")).toBeNull();
  });

  it("tells a dropped connection from a server error", () => {
    expect(isNetworkFailure(new TypeError("Failed to fetch"), true)).toBe(true);
    expect(isNetworkFailure(Object.assign(new Error("t"), { name: "TimeoutError" }), true)).toBe(true);
    expect(isNetworkFailure(new Error("500 Internal Server Error"), true)).toBe(false);
    expect(isNetworkFailure(new Error("500 Internal Server Error"), false)).toBe(true);
  });
});
