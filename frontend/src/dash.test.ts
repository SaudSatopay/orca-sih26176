import { describe, expect, it } from "vitest";
import { dashLoop } from "./dash";

describe("a running dash pattern", () => {
  it.each([
    ["12 12", 48],
    ["3 5", 48],
    ["3 7", 50],
    ["2 7", 45],
    ["11 8", 57],
  ])("%s loops over %i units", (dash, loop) => {
    expect(dashLoop(dash)).toBe(loop);
  });

  it("always travels a whole number of its own periods", () => {
    for (const dash of ["12 12", "3 7", "2 7", "11 8", "2 8", "9 5", "4"]) {
      const parts = dash.split(" ").map(Number);
      const sum = parts.reduce((a, b) => a + b, 0);
      expect(dashLoop(dash) % (parts.length % 2 ? sum * 2 : sum)).toBe(0);
    }
  });
});
