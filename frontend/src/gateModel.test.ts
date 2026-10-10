import { describe, expect, it } from "vitest";
import {
  ageText,
  freshCount,
  gateTempers,
  gateTone,
  gateWithholds,
  isDrill,
  scoreUnconfirmed,
  shownReasons,
} from "./gateModel";
import type { SafetyDecision } from "./types";

describe("the safety gate's small arithmetic", () => {
  it("prints an age the same way in every language, digits unchanged", () => {
    expect(ageText(4 * 3600 + 600, "en")).toBe("4 h 10 min");
    expect(ageText(18 * 60, "mr")).toBe("18 मिनिटे");
    expect(ageText(3 * 3600, "hi")).toBe("3 घं");
    expect(ageText(30, "en")).toBe("0 min");
  });

  it("knows the four drills and nothing else", () => {
    expect(["healthy", "stale", "unavailable", "recovery"].every(isDrill)).toBe(true);
    expect(isDrill("chaos")).toBe(false);
    expect(isDrill(null)).toBe(false);
  });

  it("counts only critical inputs", () => {
    const h = (status: "FRESH" | "STALE", critical: boolean) =>
      ({ status, critical }) as Parameters<typeof freshCount>[0][number];
    expect(freshCount([h("FRESH", true), h("STALE", true), h("FRESH", false)])).toEqual({
      fresh: 1,
      total: 2,
    });
  });

  it("withholds on insufficient data, tempers on caution", () => {
    const d = (state: SafetyDecision["state"]) => ({ state }) as SafetyDecision;
    expect(gateWithholds(d("INSUFFICIENT_DATA"))).toBe(true);
    expect(gateWithholds(d("NO_GO"))).toBe(false);
    expect(gateTempers(d("CAUTION"))).toBe(true);
    expect(gateWithholds(null)).toBe(false);
    expect(gateTone("NO_GO")).toBe("nogo");
  });

  it("drops only the closing all-fresh line of a clean decision", () => {
    const clean = {
      state: "GO",
      reasons: ["reconnected", "all fresh"],
      blocking_inputs: [],
      stale_inputs: [],
    } as unknown as SafetyDecision;
    expect(shownReasons(clean)).toEqual(["reconnected"]);
    const stale = { ...clean, state: "CAUTION", stale_inputs: ["wave"] } as SafetyDecision;
    expect(shownReasons(stale)).toEqual(["reconnected", "all fresh"]);
  });
});

describe("when a shown score is unconfirmed", () => {
  const d = (state: SafetyDecision["state"], blocking: string[] = [], stale: string[] = []) =>
    ({ state, blocking_inputs: blocking, stale_inputs: stale }) as unknown as SafetyDecision;
  it("marks stale evidence, and a NO-GO resting on a missing reading", () => {
    expect(scoreUnconfirmed(d("CAUTION", [], ["wave"]))).toBe(true);
    expect(scoreUnconfirmed(d("NO_GO", ["wave"]))).toBe(true);
  });
  it("leaves clean answers, and the withheld score, alone", () => {
    expect(scoreUnconfirmed(d("GO"))).toBe(false);
    expect(scoreUnconfirmed(d("NO_GO"))).toBe(false);
    expect(scoreUnconfirmed(d("INSUFFICIENT_DATA", ["wave"]))).toBe(false);
    expect(scoreUnconfirmed(null)).toBe(false);
  });
});
