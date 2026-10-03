import { describe, expect, it } from "vitest";
import { swellPaths, THREAD_SHAPE, threadPaths, WAKE_HALF, WAKE_SHAPE, wakePaths } from "./nightPaths";
import { CREW_SIZE } from "../../crew";

const points = (d: string) =>
  [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);

describe("the shapes the posters share with the shaders", () => {
  it("draws one thread per agent, all tied in one knot at the right edge", () => {
    const paths = threadPaths(1000, 240);
    expect(paths).toHaveLength(CREW_SIZE);
    const knotY = (1 - THREAD_SHAPE.position) * 240;
    for (const d of paths) {
      const pts = points(d);
      const [x, y] = pts[pts.length - 1];
      expect(x).toBe(1000);
      expect(y).toBeCloseTo(knotY, 0);
    }
  });

  it("keeps every thread inside its field", () => {
    for (const d of threadPaths(1000, 240)) for (const [, y] of points(d)) expect(y >= 0 && y <= 240).toBe(true);
  });

  it("keeps the wake to one lobe, flat at both ends", () => {
    const paths = wakePaths();
    expect(paths).toHaveLength(WAKE_SHAPE.count);
    expect(WAKE_HALF).toBeCloseTo((WAKE_SHAPE.scale * 0.5) / 1.3);
    for (const d of paths) {
      const pts = points(d);
      expect(pts[0][1]).toBeCloseTo(0, 3);
      expect(pts[pts.length - 1][1]).toBeCloseTo(0, 3);
      for (const [, y] of pts) expect(Math.abs(y)).toBeLessThan(0.5);
    }
  });

  it("lays the swell from the horizon down, closer together toward the horizon", () => {
    const lines = swellPaths(1000, 400);
    const bases = lines.map(({ d }) => points(d)[0][1]);
    expect(Math.min(...bases)).toBeGreaterThanOrEqual(190);
    const gaps = bases.slice(1).map((b, i) => b - bases[i]);
    expect(gaps[0]).toBeLessThan(gaps[gaps.length - 1]);
  });
});
