import { Lens } from "../vendor/liquid-glass/index.js";
import { paintGround, paintSheet, type Backdrop, type Region } from "./glassBackdrop";
import { paper } from "../tokens";

/**
 * Arms the chart loupes: builds each lens's backdrop texture
 * (glassBackdrop.ts), opens ONE WebGL context, renders every still the
 * loupe needs, copies them out as plain 2D canvases, and releases the
 * context. After this returns, the page holds zero live WebGL contexts for
 * the glass — a lens draws once.
 *
 * This module is its own chunk, imported only when the gate lets the effect
 * run; a phone or a plain desktop never fetches it.
 */

export interface PageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 4 percent of paper-50: the only tint the glass carries (no white haze). */
function paperTint(): { r: number; g: number; b: number } {
  const n = parseInt(paper[50].slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

const TINT_OPACITY = 0.04;

function union(rects: PageRect[], margin: number): Region {
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  for (const r of rects) {
    x0 = Math.min(x0, r.x);
    y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.width);
    y1 = Math.max(y1, r.y + r.height);
  }
  return { x: x0 - margin, y: y0 - margin, width: x1 - x0 + margin * 2, height: y1 - y0 + margin * 2 };
}

function renderStills(
  backdrop: Backdrop,
  region: Region,
  lenses: PageRect[],
  opts: { radius: number; magnify: number; controls: ConstructorParameters<typeof Lens>[0]["controls"] },
  dpr: number,
): HTMLCanvasElement[] {
  const lens = new Lens({
    texture: backdrop.canvas,
    textureSize: { width: backdrop.width, height: backdrop.height },
    dpr,
    radius: opts.radius,
    magnify: opts.magnify,
    tint: paperTint(),
    tintOpacity: TINT_OPACITY,
    controls: opts.controls,
  });
  try {
    return lenses.map((r) => {
      lens.setView({
        width: r.width,
        height: r.height,
        centerX: r.x + r.width / 2 - region.x,
        centerY: r.y + r.height / 2 - region.y,
      });
      lens.render();
      return lens.copyStill();
    });
  } finally {
    lens.dispose();
  }
}

export interface ArmResult {
  stills: HTMLCanvasElement[];
  /** The raw backdrop texture, for the debug ledger and the evidence shots. */
  backdrop: HTMLCanvasElement;
  ms: number;
}

/**
 * The question tabs: one still per tab, all from one context. The lens body
 * magnifies the distance scale under the selected tab.
 */
export function armTabs(args: {
  sheetEl: Element;
  strip: { x: number; y: number; width: number };
  lenses: PageRect[];
  dpr: number;
}): ArmResult {
  const t0 = performance.now();
  const region = union(args.lenses, 24);
  const backdrop = paintSheet(region, args.sheetEl, args.strip);
  const stills = renderStills(backdrop, region, args.lenses, {
    radius: 3,
    magnify: 1.14,
    controls: { blurRadius: 0.7, edgeIntensity: 3.5, edgeDistance: 0.2, rimIntensity: 7, rimDistance: 0.6, cornerBoost: 1.2 },
  }, args.dpr);
  return { stills, backdrop: backdrop.canvas, ms: performance.now() - t0 };
}

/**
 * The primary action: one still of the page ground — graticule, contour
 * rings, the graduated rule — magnified under the glass slab.
 */
export async function armOpen(args: {
  lens: PageRect;
  rule: { x: number; baseY: number; width: number };
  dpr: number;
}): Promise<ArmResult> {
  const t0 = performance.now();
  const region = union([args.lens], 56);
  const backdrop = await paintGround(region, args.rule);
  const stills = renderStills(backdrop, region, [args.lens], {
    radius: 2,
    magnify: 1.1,
    controls: { blurRadius: 0.7, edgeIntensity: 3, edgeDistance: 0.22, rimIntensity: 6, rimDistance: 0.65, cornerBoost: 1 },
  }, args.dpr);
  return { stills, backdrop: backdrop.canvas, ms: performance.now() - t0 };
}
