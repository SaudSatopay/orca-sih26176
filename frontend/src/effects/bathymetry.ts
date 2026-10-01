/**
 * The sea bed under the hero chart — one data source for the relief sheet.
 *
 * An ILLUSTRATIVE, SYNTHETIC depth field for a piece of continental shelf off
 * Mumbai. It is not a survey and not for navigation; the section that draws
 * it says so. It exists so the SVG poster and the 3D sheet are the same
 * chart: both ask these functions and nothing else.
 *
 * The sheet is the hero chart's sheet (HeroChart.tsx): the same 600 x 330
 * drawing space, the same coast down the east edge (`LAND_WEST` there), the
 * same harbour, restricted area, plotted course and buoys. The hero prints
 * three soundings on it (44, 27, 61); this field passes through them.
 *
 * Pure and deterministic: no randomness, no clock, no DOM.
 */

/** The drawing space, shared with the hero chart. */
export const VIEW = { w: 600, h: 330 } as const;

/** A point on the unit square: u runs west to east, v north to south. */
export type Point = readonly [number, number];

/** Contour levels, metres below the surface. */
export const LEVELS = [5, 10, 20, 30, 40, 50] as const;

// ---------------------------------------------------------------- the coast

/** The hero's `LAND_WEST` coastline: four cubic curves, north to south, in sheet units. */
const COAST_CURVES: readonly (readonly number[])[] = [
  [452, 0, 440, 34, 468, 68, 455, 104],
  [455, 104, 445, 132, 462, 162, 450, 193],
  [450, 193, 440, 219, 458, 252, 447, 284],
  [447, 284, 442, 302, 452, 318, 448, 330],
];

function cubic(c: readonly number[], t: number): [number, number] {
  const m = 1 - t;
  const a = m * m * m;
  const b = 3 * m * m * t;
  const d = 3 * m * t * t;
  const e = t * t * t;
  return [a * c[0] + b * c[2] + d * c[4] + e * c[6], a * c[1] + b * c[3] + d * c[5] + e * c[7]];
}

function sampleCurves(curves: readonly (readonly number[])[], steps: number): [number, number][] {
  const out: [number, number][] = [];
  curves.forEach((c, n) => {
    for (let i = n === 0 ? 0 : 1; i <= steps; i++) out.push(cubic(c, i / steps));
  });
  return out;
}

/** The coast as (x, y) in sheet units; y rises all the way down it. */
const COAST = sampleCurves(COAST_CURVES, 24);

/** Where the coast is, in sheet units, at a given y. Held at its ends beyond the sheet. */
function coastX(y: number): number {
  if (y <= COAST[0][1]) return COAST[0][0];
  const last = COAST[COAST.length - 1];
  if (y >= last[1]) return last[0];
  let lo = 0;
  let hi = COAST.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (COAST[mid][1] <= y) lo = mid;
    else hi = mid;
  }
  const [x0, y0] = COAST[lo];
  const [x1, y1] = COAST[hi];
  return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
}

/** The coast on the unit square: sea where `u < coastU(v)`. */
export function coastU(v: number): number {
  return coastX(v * VIEW.h) / VIEW.w;
}

/** The coastline as a polyline, north to south. */
export function coastline(): Point[] {
  return COAST.map(([x, y]) => [x / VIEW.w, y / VIEW.h] as const);
}

// ---------------------------------------------------------------- the field

/** A shoal north-west of the harbour, between grounds 2 and 3. */
const SHOAL = { x: 165, y: 100, rx: 40, ry: 27, rise: 13 };
/** The bank the best ground sits on. */
const BANK = { x: 146, y: 254, rx: 36, ry: 26, rise: 15 };
/** The dredged approach to the harbour: a trough fading out to sea. */
const TROUGH = { x0: 448, y0: 208, x1: 318, y1: 226, width: 9, cut: 7 };
/** How high the land stands, in the same metres. */
const LAND_RISE = 9;

function bump(x: number, y: number, f: { x: number; y: number; rx: number; ry: number }): number {
  const dx = (x - f.x) / f.rx;
  const dy = (y - f.y) / f.ry;
  return Math.exp(-(dx * dx + dy * dy));
}

function trough(x: number, y: number): number {
  const ax = TROUGH.x1 - TROUGH.x0;
  const ay = TROUGH.y1 - TROUGH.y0;
  const t = Math.min(1, Math.max(0, ((x - TROUGH.x0) * ax + (y - TROUGH.y0) * ay) / (ax * ax + ay * ay)));
  const d = Math.hypot(x - (TROUGH.x0 + ax * t), y - (TROUGH.y0 + ay * t));
  return Math.exp(-(d * d) / (TROUGH.width * TROUGH.width)) * (1 - t * t);
}

/**
 * Depth in metres at a place on the unit square. Positive is water; on land
 * the value is negative, the height the ground stands above the sea.
 */
export function depthAt(u: number, v: number): number {
  const x = u * VIEW.w;
  const y = v * VIEW.h;
  const offshore = coastX(y) - x;
  if (offshore <= 0) return -LAND_RISE * (1 - Math.exp(offshore / 7));

  // A wide, gentle shelf, deeper to the south-west.
  const shelf = 1.086 * Math.pow(offshore, 0.65);
  const tilt = 1 + 0.5 * (v - 0.5) * Math.min(1, offshore / 380);
  // Long, low undulations: the shelf is not a ruled surface.
  const swell = 1.7 * Math.sin(x / 47 + y / 31) * Math.sin(y / 53 - x / 90) * Math.min(1, offshore / 70);
  const depth =
    shelf * tilt + swell - SHOAL.rise * bump(x, y, SHOAL) - BANK.rise * bump(x, y, BANK) + TROUGH.cut * trough(x, y);
  // The sea stays sea: no feature may lift the bed through the surface.
  return Math.max(depth, 0.25 * shelf);
}

/** Which tint a depth falls in: -1 land, 0 the shallowest water, LEVELS.length the deepest. */
export function bandOf(depth: number): number {
  if (depth < 0) return -1;
  let band = 0;
  while (band < LEVELS.length && depth >= LEVELS[band]) band++;
  return band;
}

// ---------------------------------------------------------------- the grid

export interface Grid {
  nx: number;
  ny: number;
  /** The square the nodes span; the unit square unless padded. */
  u0: number;
  v0: number;
  u1: number;
  v1: number;
  /** Row by row from the north-west corner: `values[j * nx + i]`. */
  values: Float32Array;
}

/** The field sampled on `nx` by `ny` nodes across the unit square, edges included. */
export function sampleGrid(nx: number, ny: number): Grid {
  const values = new Float32Array(nx * ny);
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) values[j * nx + i] = depthAt(i / (nx - 1), j / (ny - 1));
  return { nx, ny, u0: 0, v0: 0, u1: 1, v1: 1, values };
}

/** The same grid with one ring of `fill` around it, so every contour closes. */
function padded(g: Grid, fill: number): Grid {
  const nx = g.nx + 2;
  const ny = g.ny + 2;
  const du = (g.u1 - g.u0) / (g.nx - 1);
  const dv = (g.v1 - g.v0) / (g.ny - 1);
  const values = new Float32Array(nx * ny).fill(fill);
  for (let j = 0; j < g.ny; j++)
    for (let i = 0; i < g.nx; i++) values[(j + 1) * nx + i + 1] = g.values[j * g.nx + i];
  return { nx, ny, u0: g.u0 - du, v0: g.v0 - dv, u1: g.u1 + du, v1: g.v1 + dv, values };
}

// ---------------------------------------------------------------- contours

export interface Polyline {
  level: number;
  points: Point[];
  /** A ring. An open line ends on the border of the grid. */
  closed: boolean;
}

/**
 * Marching squares: the lines along which the grid crosses `level`, joined
 * into polylines. Each crossing sits on a grid edge and is shared by the two
 * cells either side, so the pieces chain without any tolerance.
 */
export function contours(g: Grid, level: number): Polyline[] {
  const { nx, ny, values } = g;
  const du = (g.u1 - g.u0) / (nx - 1);
  const dv = (g.v1 - g.v0) / (ny - 1);
  const at = (i: number, j: number) => values[j * nx + i];
  const deep = (i: number, j: number) => at(i, j) > level;
  const H = nx * ny; // offset of the vertical edges' ids

  /** Edge ids: the edge east of node (i, j), and the edge south of it. */
  const east = (i: number, j: number) => j * nx + i;
  const south = (i: number, j: number) => H + j * nx + i;

  const pointOf = (id: number): Point => {
    const vertical = id >= H;
    const n = vertical ? id - H : id;
    const i = n % nx;
    const j = (n - i) / nx;
    const a = at(i, j);
    const b = vertical ? at(i, j + 1) : at(i + 1, j);
    const t = Math.min(1, Math.max(0, (level - a) / (b - a)));
    return vertical ? [g.u0 + i * du, g.v0 + (j + t) * dv] : [g.u0 + (i + t) * du, g.v0 + j * dv];
  };

  const links = new Map<number, number[]>();
  const join = (a: number, b: number) => {
    (links.get(a) ?? links.set(a, []).get(a)!).push(b);
    (links.get(b) ?? links.set(b, []).get(b)!).push(a);
  };

  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const tl = deep(i, j);
      const tr = deep(i + 1, j);
      const br = deep(i + 1, j + 1);
      const bl = deep(i, j + 1);
      const kind = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0);
      if (kind === 0 || kind === 15) continue;
      const T = east(i, j);
      const B = east(i, j + 1);
      const L = south(i, j);
      const R = south(i + 1, j);
      switch (kind) {
        case 1:
        case 14:
          join(L, B);
          break;
        case 2:
        case 13:
          join(B, R);
          break;
        case 3:
        case 12:
          join(L, R);
          break;
        case 4:
        case 11:
          join(T, R);
          break;
        case 6:
        case 9:
          join(T, B);
          break;
        case 7:
        case 8:
          join(L, T);
          break;
        default: {
          // A saddle: the cell's middle decides which pair of corners is joined.
          const middleDeep = (at(i, j) + at(i + 1, j) + at(i + 1, j + 1) + at(i, j + 1)) / 4 > level;
          const deepJoined = kind === 5 ? middleDeep : !middleDeep;
          if (deepJoined) {
            join(L, T);
            join(B, R);
          } else {
            join(T, R);
            join(L, B);
          }
        }
      }
    }
  }

  const used = new Set<number>();
  const walk = (start: number): number[] => {
    const chain = [start];
    used.add(start);
    let here = start;
    for (;;) {
      const next = links.get(here)!.find((n) => !used.has(n));
      if (next == null) return chain;
      used.add(next);
      chain.push(next);
      here = next;
    }
  };

  const out: Polyline[] = [];
  const ids = [...links.keys()].sort((a, b) => a - b);
  // Open lines first, from the ends that touch the border...
  for (const id of ids)
    if (!used.has(id) && links.get(id)!.length === 1)
      out.push({ level, points: walk(id).map(pointOf), closed: false });
  // ...then what is left are rings.
  for (const id of ids)
    if (!used.has(id)) out.push({ level, points: walk(id).map(pointOf), closed: true });
  return out;
}

/**
 * The water shallower than `level` (and the land) as closed regions, for the
 * poster's depth tints. Draw them as one path with the even-odd rule.
 */
export function shallowerThan(g: Grid, level: number): Polyline[] {
  return contours(padded(g, 1e4), level);
}

// ---------------------------------------------------------------- the story

/** The restricted area the direct track would cross, in sheet units (the hero's). */
export const RESTRICTED_AREA: readonly Point[] = [
  [246, 186],
  [350, 178],
  [358, 250],
  [254, 258],
];

/** The port channel off the harbour mouth, in sheet units (the hero's). */
export const CHANNEL_AREA: readonly Point[] = [
  [376, 202],
  [424, 198],
  [428, 220],
  [380, 226],
];

/** The harbour the boat leaves from. */
export const HARBOUR = { x: 436, y: 198 } as const;

/** The fishing grounds, numbered by rank: 1 is the best chance of fish. */
export const BUOYS: readonly { n: number; x: number; y: number }[] = [
  { n: 1, x: 148, y: 252 },
  { n: 2, x: 240, y: 78 },
  { n: 3, x: 112, y: 150 },
];

/** Where the sheet prints a spot depth. The first three are the hero's own. */
export const SOUNDINGS: readonly { x: number; y: number }[] = [
  { x: 70, y: 52 },
  { x: 330, y: 300 },
  { x: 60, y: 296 },
  { x: 318, y: 96 },
  { x: 392, y: 60 },
  { x: 30, y: 176 },
  { x: 214, y: 306 },
  { x: 400, y: 284 },
  { x: 408, y: 112 },
];

/** The hero's `COURSE`: harbour to the best ground, north around the restricted area. */
const COURSE_CURVES: readonly (readonly number[])[] = [
  [436, 198, 418, 176, 390, 156, 348, 152],
  [348, 152, 294, 148, 234, 170, 202, 206],
  [202, 206, 184, 226, 168, 242, 148, 252],
];

/** The plotted course as a polyline on the unit square. */
export function course(stepsPerCurve = 20): Point[] {
  return sampleCurves(COURSE_CURVES, stepsPerCurve).map(([x, y]) => [x / VIEW.w, y / VIEW.h] as const);
}

/** The direct track: shorter, and through the restricted area. */
export function directTrack(steps = 24): Point[] {
  const end = BUOYS[0];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return [(HARBOUR.x + (end.x - HARBOUR.x) * t) / VIEW.w, (HARBOUR.y + (end.y - HARBOUR.y) * t) / VIEW.h] as const;
  });
}

/** A closed outline with its edges cut into short steps, so it can lie on a surface. */
export function outline(polygon: readonly Point[], stepsPerEdge = 8): Point[] {
  const out: Point[] = [];
  polygon.forEach((a, n) => {
    const b = polygon[(n + 1) % polygon.length];
    for (let i = 0; i < stepsPerEdge; i++) {
      const t = i / stepsPerEdge;
      out.push([(a[0] + (b[0] - a[0]) * t) / VIEW.w, (a[1] + (b[1] - a[1]) * t) / VIEW.h]);
    }
  });
  return out;
}

export function insidePolygon(p: Point, polygon: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// ---------------------------------------------------------------- the relief

/** Sheet units of relief per layer of paper. */
const LAYER = 6.5;
/** How much of the relief is cut in steps (paper layers) rather than moulded. */
const TERRACE = 0.62;

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

/**
 * How high the paper stands at a place, in sheet units: zero at the sea
 * surface, negative under water. One layer of paper per contour level, each
 * layer's edge a short riser just seaward of its contour, so the ink line
 * lies along the lip of a step.
 */
export function heightAt(u: number, v: number): number {
  const depth = depthAt(u, v);
  if (depth < 0) return (-depth / LAND_RISE) * LAYER * 0.9;
  // Depth as a count of layers: 0 at the surface, 1 at the first level...
  const band = bandOf(depth);
  const lo = band === 0 ? 0 : LEVELS[band - 1];
  const hi = band < LEVELS.length ? LEVELS[band] : lo + 10;
  const layers = band + (depth - lo) / (hi - lo);
  const frac = layers - Math.floor(layers);
  const stepped = Math.floor(layers) + smoothstep(frac / 0.4);
  return -LAYER * (layers * (1 - TERRACE) + stepped * TERRACE);
}

/** How far the sheet leans: sheet units of sideways slide per unit of height. */
export interface Lean {
  x: number;
  y: number;
}

export const NO_LEAN: Lean = { x: 0, y: 0 };

/**
 * Where a place on the sheet is drawn, in sheet units. With no lean this is
 * the plan, straight down: the poster. Leaning slides every point by its
 * height and nothing else (a plan-oblique view), which is exactly what the 3D
 * sheet's orthographic camera sees, so ink drawn through this function lies
 * on the relief.
 */
export function project(u: number, v: number, lean: Lean = NO_LEAN): [number, number] {
  const x = u * VIEW.w;
  const y = v * VIEW.h;
  if (lean.x === 0 && lean.y === 0) return [x, y];
  const z = heightAt(u, v);
  return [x + z * lean.x, y - z * lean.y];
}

// ---------------------------------------------------------------- the chart

export interface ReliefChart {
  grid: Grid;
  /** The coast: the line where the depth is zero. */
  coast: Polyline[];
  /** Every contour in LEVELS. */
  lines: Polyline[];
  /** Per level, deepest first: the regions shallower than it, for the tints. */
  tints: { level: number; regions: Polyline[] }[];
  /** Where each contour's depth is written. */
  labels: { level: number; u: number; v: number }[];
}

/** Open contours are labelled where they cross this row, so the numbers read as a scale. */
const LABEL_ROW = 0.075;

let chart: ReliefChart | null = null;

/** Everything both drawings need, worked out once from the field. */
export function reliefChart(): ReliefChart {
  if (chart) return chart;
  const grid = sampleGrid(151, 84);
  const lines = LEVELS.flatMap((level) => contours(grid, level));
  const labels = lines
    .filter((line) => line.points.length > 12)
    .map((line) => {
      // A ring is labelled at its southern end; an open line where it crosses the label row.
      const at = line.closed
        ? line.points.reduce((best, p) => (p[1] > best[1] ? p : best))
        : line.points
            // clear of the frame, so the number is never cut by it
            .filter((p) => p[0] > 0.04 && p[1] > 0.05)
            .reduce((best, p) => (Math.abs(p[1] - LABEL_ROW) < Math.abs(best[1] - LABEL_ROW) ? p : best), line.points[0]);
      return { level: line.level, u: at[0], v: at[1] };
    });
  chart = {
    grid,
    coast: contours(grid, 0),
    lines,
    tints: [...LEVELS].reverse().map((level) => ({ level, regions: shallowerThan(grid, level) })),
    labels,
  };
  return chart;
}

/**
 * How strongly the sea's tint is laid over the paper in a band (0 the
 * shallowest water): each level adds one wash, so shallow water is the
 * bluest, as on a printed chart.
 */
export const TINT_WASH = 0.06;
export function tintOf(band: number): number {
  return 1 - Math.pow(1 - TINT_WASH, Math.max(0, LEVELS.length - band));
}
