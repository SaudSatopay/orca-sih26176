import { describe, expect, it } from "vitest";
import {
  BUOYS,
  CHANNEL_AREA,
  LEVELS,
  RESTRICTED_AREA,
  SOUNDINGS,
  VIEW,
  bandOf,
  coastU,
  contours,
  course,
  depthAt,
  directTrack,
  heightAt,
  insidePolygon,
  project,
  reliefChart,
  sampleGrid,
  shallowerThan,
  tintOf,
  type Polyline,
} from "./bathymetry";

const grid = sampleGrid(121, 67);
const EDGE = 1e-9;

function onBorder([u, v]: readonly [number, number]): boolean {
  return u <= EDGE || u >= 1 - EDGE || v <= EDGE || v >= 1 - EDGE;
}

describe("the depth field", () => {
  it("is deterministic", () => {
    const a = sampleGrid(40, 22);
    const b = sampleGrid(40, 22);
    expect(Array.from(a.values)).toEqual(Array.from(b.values));
    expect(depthAt(0.3, 0.4)).toBe(depthAt(0.3, 0.4));
    expect(contours(a, 20)).toEqual(contours(b, 20));
    expect(course()).toEqual(course());
  });

  it("puts land down the east edge and sea everywhere west of the coast", () => {
    for (let j = 0; j <= 20; j++) {
      const v = j / 20;
      const c = coastU(v);
      expect(c).toBeGreaterThan(0.7);
      expect(c).toBeLessThan(0.8);
      expect(depthAt(c + 0.02, v)).toBeLessThan(0);
      expect(depthAt(0.99, v)).toBeLessThan(0);
      for (let i = 0; i < 30; i++) expect(depthAt((c - 0.004) * (i / 29), v)).toBeGreaterThan(0);
    }
  });

  it("is continuous across the coast", () => {
    for (const v of [0.1, 0.5, 0.9]) {
      const c = coastU(v);
      expect(Math.abs(depthAt(c - 1e-5, v))).toBeLessThan(0.5);
      expect(Math.abs(depthAt(c + 1e-5, v))).toBeLessThan(0.5);
    }
  });

  it("deepens westward across the shelf", () => {
    for (const v of [0.05, 0.5, 0.95]) {
      const c = coastU(v);
      expect(depthAt(c - 0.6, v)).toBeGreaterThan(depthAt(c - 0.3, v));
      expect(depthAt(c - 0.3, v)).toBeGreaterThan(depthAt(c - 0.05, v));
    }
    // the outer shelf reaches the deepest contour drawn, and not much more
    const max = Math.max(...grid.values);
    expect(max).toBeGreaterThan(LEVELS[LEVELS.length - 1]);
    expect(max).toBeLessThan(80);
  });

  it("agrees with the soundings printed on the hero chart", () => {
    // HeroChart.tsx prints 44, 27 and 61 at these places on the same sheet.
    expect(depthAt(70 / VIEW.w, 52 / VIEW.h)).toBeCloseTo(44, -1);
    expect(depthAt(330 / VIEW.w, 300 / VIEW.h)).toBeCloseTo(27, -1);
    expect(depthAt(60 / VIEW.w, 296 / VIEW.h)).toBeCloseTo(61, -1);
  });

  it("names the band a depth falls in", () => {
    expect(bandOf(-3)).toBe(-1);
    expect(bandOf(2)).toBe(0);
    expect(bandOf(7)).toBe(1);
    expect(bandOf(1000)).toBe(LEVELS.length);
  });
});

describe("contours", () => {
  const byLevel = new Map<number, Polyline[]>(LEVELS.map((l) => [l, contours(grid, l)]));

  it("finds every level", () => {
    for (const l of LEVELS) expect(byLevel.get(l)!.length, `${l} m`).toBeGreaterThan(0);
  });

  it("are closed or end on the border", () => {
    for (const [level, lines] of byLevel)
      for (const line of lines) {
        expect(line.level).toBe(level);
        expect(line.points.length).toBeGreaterThan(1);
        if (line.closed) continue;
        expect(onBorder(line.points[0]), `${level} m starts inside the sheet`).toBe(true);
        expect(onBorder(line.points[line.points.length - 1]), `${level} m ends inside the sheet`).toBe(true);
      }
  });

  it("lie on their level", () => {
    for (const [level, lines] of byLevel)
      for (const line of lines)
        for (const [u, v] of line.points) expect(Math.abs(depthAt(u, v) - level)).toBeLessThan(2.5);
  });

  it("lie further offshore the deeper they are", () => {
    const offshore = LEVELS.map((l) => {
      const pts = byLevel.get(l)!.flatMap((line) => line.points);
      return pts.reduce((s, [u, v]) => s + (coastU(v) - u), 0) / pts.length;
    });
    for (let i = 1; i < offshore.length; i++) expect(offshore[i]).toBeGreaterThan(offshore[i - 1]);
  });

  it("draw a bank and a shoal as closed rings, so the sheet is worth reading", () => {
    const rings = [...byLevel.values()].flat().filter((l) => l.closed);
    expect(rings.length).toBeGreaterThanOrEqual(2);
  });

  it("gives the tint under each level as closed regions", () => {
    for (const l of LEVELS) {
      const regions = shallowerThan(grid, l);
      expect(regions.length).toBeGreaterThan(0);
      for (const r of regions) expect(r.closed).toBe(true);
    }
  });
});

describe("the plotted course", () => {
  const pts = course();

  it("runs from the harbour to the best ground", () => {
    expect(pts[0][0] * VIEW.w).toBeCloseTo(436, 5);
    expect(pts[0][1] * VIEW.h).toBeCloseTo(198, 5);
    const end = pts[pts.length - 1];
    expect(end[0] * VIEW.w).toBeCloseTo(BUOYS[0].x, 5);
    expect(end[1] * VIEW.h).toBeCloseTo(BUOYS[0].y, 5);
    expect(BUOYS[0].n).toBe(1);
  });

  it("never crosses land", () => {
    for (const [u, v] of pts) expect(depthAt(u, v)).toBeGreaterThan(0);
  });

  it("bends around the restricted area and the port channel", () => {
    for (const [u, v] of pts) {
      const p = [u * VIEW.w, v * VIEW.h] as const;
      expect(insidePolygon(p, RESTRICTED_AREA)).toBe(false);
      expect(insidePolygon(p, CHANNEL_AREA)).toBe(false);
    }
  });

  it("is longer than the direct track, which does cross the restricted area", () => {
    const length = (line: readonly (readonly [number, number])[]) =>
      line.slice(1).reduce((s, p, i) => s + Math.hypot((p[0] - line[i][0]) * VIEW.w, (p[1] - line[i][1]) * VIEW.h), 0);
    const direct = directTrack();
    expect(length(pts)).toBeGreaterThan(length(direct));
    expect(direct.some(([u, v]) => insidePolygon([u * VIEW.w, v * VIEW.h], RESTRICTED_AREA))).toBe(true);
  });

  it("keeps every buoy and sounding at sea", () => {
    for (const b of BUOYS) expect(depthAt(b.x / VIEW.w, b.y / VIEW.h)).toBeGreaterThan(5);
    for (const s of SOUNDINGS) expect(depthAt(s.x / VIEW.w, s.y / VIEW.h)).toBeGreaterThan(1);
  });
});

describe("the chart both drawings share", () => {
  const chart = reliefChart();

  it("is worked out once", () => {
    expect(reliefChart()).toBe(chart);
  });

  it("labels every level, inside the frame", () => {
    for (const level of LEVELS) expect(chart.labels.some((l) => l.level === level), `${level} m`).toBe(true);
    for (const l of chart.labels) {
      expect(l.u).toBeGreaterThan(0.03);
      expect(l.u).toBeLessThan(0.97);
      expect(l.v).toBeGreaterThan(0.04);
      expect(l.v).toBeLessThan(0.96);
    }
  });

  it("washes shallow water bluest and the deepest band not at all", () => {
    for (let band = 1; band <= LEVELS.length; band++) expect(tintOf(band)).toBeLessThan(tintOf(band - 1));
    expect(tintOf(LEVELS.length)).toBe(0);
  });
});

describe("the relief", () => {
  it("is lower the deeper the water, and land stands above the sea", () => {
    const v = 0.5;
    const c = coastU(v);
    expect(heightAt(c + 0.05, v)).toBeGreaterThan(0);
    expect(heightAt(c - 0.05, v)).toBeLessThan(0);
    expect(heightAt(c - 0.6, v)).toBeLessThan(heightAt(c - 0.2, v));
  });

  it("projects straight down when the sheet is not leaning: the poster", () => {
    expect(project(0.25, 0.5)).toEqual([150, 165]);
  });

  it("slides the low ground one way and the high ground the other when it leans", () => {
    const lean = { x: 0.1, y: 0.3 };
    const [sx, sy] = project(0.1, 0.5, lean); // deep water
    expect(sx).toBeLessThan(60);
    expect(sy).toBeGreaterThan(165);
    const [lx, ly] = project(0.95, 0.5, lean); // land
    expect(lx).toBeGreaterThan(570);
    expect(ly).toBeLessThan(165);
  });
});
