import { describe, expect, it } from "vitest";
import { RULE_H, SCALE, SCALE_H, scaleNumerals, scaleTicks } from "./glassScale";

describe("the chart's distance scale (what the loupes magnify)", () => {
  it("draws a tick every 6 px, a longer one every fifth, a numbered one every tenth", () => {
    const ticks = scaleTicks(120);
    expect(ticks).toHaveLength(21);
    expect(ticks[0]).toEqual({ x: 0, kind: "tall" });
    expect(ticks[1]).toEqual({ x: 6, kind: "short" });
    expect(ticks[5]).toEqual({ x: 30, kind: "mid" });
    expect(ticks[10]).toEqual({ x: 60, kind: "tall" });
    expect(ticks[15]).toEqual({ x: 90, kind: "mid" });
    expect(ticks[20]).toEqual({ x: 120, kind: "tall" });
  });

  it("never places a tick past the strip", () => {
    for (const width of [0, 5, 59, 300]) {
      for (const t of scaleTicks(width)) expect(t.x).toBeLessThanOrEqual(width);
    }
  });

  it("labels itself honestly: 60 px to 5 km, the unit on the last numeral", () => {
    expect(scaleNumerals(185)).toEqual([
      { x: 0, text: "0" },
      { x: 60, text: "5" },
      { x: 120, text: "10" },
      { x: 180, text: "15 km" },
    ]);
  });

  it("keeps the numerals on the type scale's smallest legal step (11 px)", () => {
    expect(SCALE.textH).toBe(11);
    expect(SCALE_H).toBe(24);
    expect(RULE_H).toBe(11);
  });
});
