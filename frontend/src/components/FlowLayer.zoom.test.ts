/**
 * A4: the sea layer respects zoom. At the home scale (zoom 9) trails step as
 * tuned; at harbour zoom they shorten by powers of two instead of becoming
 * screen-wide stripes; at basin zoom the growth is capped.
 */
import { describe, expect, it } from "vitest";
import { flowZoomScale } from "./FlowLayer";

describe("flowZoomScale", () => {
  it("is 1 at the tuned zoom", () => {
    expect(flowZoomScale(9)).toBe(1);
  });
  it("halves per zoom level in", () => {
    expect(flowZoomScale(10)).toBe(0.5);
    expect(flowZoomScale(12)).toBe(0.125);
  });
  it("is clamped at both ends", () => {
    expect(flowZoomScale(3)).toBe(4);
    expect(flowZoomScale(18)).toBeCloseTo(0.08);
  });
});
