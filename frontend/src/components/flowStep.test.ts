import { describe, expect, it } from "vitest";
import { flowStep } from "./flowStep";

/** One second of display frames at `hz`: how many 60 Hz frames the field advanced. */
function advancedIn(hz: number): number {
  const frame = 1000 / hz;
  let last = 0;
  let total = 0;
  for (let now = frame; now <= 1000 + 1e-6; now += frame) {
    const k = flowStep(now - last);
    if (k === 0) continue;
    last = now;
    total += k;
  }
  return total;
}

describe("the chart's sea keeps one pace", () => {
  it.each([60, 75, 90, 120, 144, 240])("advances about 60 steps a second at %i Hz", (hz) => {
    expect(advancedIn(hz)).toBeGreaterThan(57);
    expect(advancedIn(hz)).toBeLessThanOrEqual(60.5);
  });

  it("skips the frames a fast display adds", () => {
    expect(flowStep(1000 / 144)).toBe(0);
  });

  it("does not leap after a stall", () => {
    expect(flowStep(2000)).toBe(3);
  });
});
