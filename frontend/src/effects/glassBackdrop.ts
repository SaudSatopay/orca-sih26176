import { drawRule, drawScale } from "./glassScale";

/**
 * Builds the texture a lens refracts — cheaply, with no html2canvas and no
 * DOM snapshot. The lens refracts SURFACES, never content: everything under
 * the two loupes is CSS — flat paper, gradient layers (the graticule, the
 * aged-edge vignette, the sea wash), two data-URI SVGs (the bathymetric
 * contours and the compass), and the graduated rules this module's sibling
 * draws. All of it can be repainted exactly into a small canvas by reading
 * the computed styles off the real elements:
 *
 *   - the page ground (the primary action's backdrop): the body's paper,
 *     the fixed `.sheet-ground` layer's gradients and `body::before`'s
 *     data-URI images, each drawn at its computed position;
 *   - the hero sheet (the tabs' backdrop): the sheet's own background
 *     colour plus the distance scale (glassScale.ts).
 *
 * Colours come from computed styles and tokens.ts — nothing is spelled here.
 * Textures are painted at 2x the CSS resolution so magnification stays
 * crisp. If anything fails to parse or load, the caller falls back to CSS.
 */

/** A rectangle in page coordinates (CSS px, document origin). */
export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Backdrop {
  canvas: HTMLCanvasElement;
  /** Logical size, CSS px. */
  width: number;
  height: number;
}

const TEXTURE_DPR = 2;

/* ------------------------------------------------------------------ */
/* CSS value parsing — only the forms the ORCA stylesheets produce.    */
/* ------------------------------------------------------------------ */

/** Split a computed list on top-level commas (not the ones inside url()/rgba()). */
function splitTop(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      out.push(value.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(value.slice(start).trim());
  return out.filter(Boolean);
}

/** Split on top-level whitespace — `calc(100% + 140px)` stays one token. */
function splitSpaceTop(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (/\s/.test(ch) && depth === 0) {
      if (i > start) out.push(value.slice(start, i));
      start = i + 1;
    }
  }
  if (value.length > start) out.push(value.slice(start));
  return out;
}

/** "12px" | "30%" | "calc(100% + 140px)" → px, resolved against `span`. */
function resolveLength(raw: string, span: number): number {
  const v = raw.trim();
  const calc = v.match(/^calc\(\s*(-?[\d.]+)%\s*([+-])\s*(-?[\d.]+)px\s*\)$/);
  if (calc) {
    const pct = (parseFloat(calc[1]) / 100) * span;
    const px = parseFloat(calc[3]);
    return calc[2] === "+" ? pct + px : pct - px;
  }
  if (v.endsWith("%")) return (parseFloat(v) / 100) * span;
  return parseFloat(v) || 0;
}

interface Stop {
  color: string;
  /** Position along the gradient line, px. */
  at: number;
}

/** Color stops of a parsed gradient body, positions resolved to px over `axis`. */
function parseStops(parts: string[], axis: number): Stop[] {
  const stops: Stop[] = [];
  for (const p of parts) {
    const m = p.match(/^((?:rgba?|hsla?)\([^)]*\)|\w+)\s*(.*)$/);
    if (!m) continue;
    const color = m[1];
    const positions = m[2].trim() ? m[2].trim().split(/\s+/) : [];
    if (positions.length === 0) stops.push({ color, at: NaN });
    for (const pos of positions) stops.push({ color, at: resolveLength(pos, axis) });
  }
  if (stops.length === 0) return stops;
  if (Number.isNaN(stops[0].at)) stops[0].at = 0;
  if (Number.isNaN(stops[stops.length - 1].at)) stops[stops.length - 1].at = axis;
  // Interior stops without positions: lerp between neighbours (not produced
  // by ORCA's sheets, but cheap to be correct about).
  for (let i = 1; i < stops.length - 1; i++) {
    if (Number.isNaN(stops[i].at)) {
      let j = i;
      while (Number.isNaN(stops[j].at)) j++;
      const span = (stops[j].at - stops[i - 1].at) / (j - i + 1);
      for (let k = i; k < j; k++) stops[k].at = stops[i - 1].at + span * (k - i + 1);
    }
  }
  return stops;
}

function isTransparent(color: string): boolean {
  const m = color.match(/^rgba?\([^)]*,\s*([\d.]+)\s*\)$/);
  return m ? parseFloat(m[1]) === 0 : color === "transparent";
}

/**
 * Canvas gradients interpolate stop colours WITHOUT premultiplying alpha, so
 * a `transparent` (black) stop drags the ramp grey — CSS premultiplies and
 * shows no such cast. Rewriting each fully transparent stop as alpha-0 of
 * its nearest opaque neighbour's channels reproduces the CSS result.
 */
function fixTransparentStops(stops: Stop[]): Stop[] {
  const rgbOf = (color: string): string | null => {
    const m = color.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
    return m ? `${m[1]}, ${m[2]}, ${m[3]}` : null;
  };
  return stops.map((s, i) => {
    if (!isTransparent(s.color)) return s;
    const neighbour =
      [...stops.slice(i + 1), ...stops.slice(0, i).reverse()].find((o) => !isTransparent(o.color)) ?? s;
    const rgb = rgbOf(neighbour.color);
    return rgb ? { ...s, color: `rgba(${rgb}, 0)` } : s;
  });
}

/* ------------------------------------------------------------------ */
/* Layer painters. The layer box is the viewport (the surfaces are     */
/* fixed, full-bleed); `ox, oy` shift its origin into region space.    */
/* ------------------------------------------------------------------ */

interface Box {
  w: number;
  h: number;
  ox: number;
  oy: number;
}

function paintRepeatingLinear(ctx: CanvasRenderingContext2D, body: string, box: Box, region: Region): boolean {
  const m = body.match(/^(-?[\d.]+)deg\s*,\s*([\s\S]*)$/);
  if (!m) return false;
  const deg = ((parseFloat(m[1]) % 360) + 360) % 360;
  if (deg !== 0 && deg !== 90 && deg !== 180 && deg !== 270) return false;
  const axis = deg === 90 || deg === 270 ? box.w : box.h;
  const stops = parseStops(splitTop(m[2]), axis);
  if (stops.length < 2) return false;
  const period = stops[stops.length - 1].at;
  if (!(period > 0)) return false;

  // Solid runs within one period.
  const runs: { from: number; to: number; color: string }[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (a.color === b.color && !isTransparent(a.color) && b.at > a.at) {
      runs.push({ from: a.at, to: b.at, color: a.color });
    }
  }
  if (!runs.length) return true; // fully transparent pattern: nothing to draw

  // Position p along the axis → region-space coordinate.
  const horizontal = deg === 90 || deg === 270;
  for (let k = 0; k * period < axis + period; k++) {
    for (const run of runs) {
      const from = k * period + run.from;
      const to = k * period + run.to;
      if (from > axis) continue;
      ctx.fillStyle = run.color;
      if (horizontal) {
        const x0 = deg === 90 ? from : box.w - to;
        ctx.fillRect(x0 + box.ox, 0, to - from, region.height);
      } else {
        const y0 = deg === 0 ? box.h - to : from;
        ctx.fillRect(0, y0 + box.oy, region.width, to - from);
      }
    }
  }
  return true;
}

function paintLinear(ctx: CanvasRenderingContext2D, body: string, box: Box, region: Region): boolean {
  const m = body.match(/^(-?[\d.]+)deg\s*,\s*([\s\S]*)$/);
  if (!m) return false;
  const deg = ((parseFloat(m[1]) % 360) + 360) % 360;
  if (deg !== 0 && deg !== 90 && deg !== 180 && deg !== 270) return false;
  const axis = deg === 90 || deg === 270 ? box.w : box.h;
  const stops = fixTransparentStops(parseStops(splitTop(m[2]), axis));
  if (stops.length < 2) return false;
  let g: CanvasGradient;
  if (deg === 0) g = ctx.createLinearGradient(0, box.h + box.oy, 0, box.oy);
  else if (deg === 180) g = ctx.createLinearGradient(0, box.oy, 0, box.h + box.oy);
  else if (deg === 90) g = ctx.createLinearGradient(box.ox, 0, box.w + box.ox, 0);
  else g = ctx.createLinearGradient(box.w + box.ox, 0, box.ox, 0);
  for (const s of stops) g.addColorStop(Math.min(1, Math.max(0, s.at / axis)), s.color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, region.width, region.height);
  return true;
}

function paintRadial(ctx: CanvasRenderingContext2D, body: string, box: Box, region: Region): boolean {
  // radial-gradient(130% 100% at 50% -10%, A 55%, B 100%)
  const m = body.match(/^([\d.]+)%\s+([\d.]+)%\s+at\s+(-?[\d.]+)%\s+(-?[\d.]+)%\s*,\s*([\s\S]*)$/);
  if (!m) return false;
  const rx = (parseFloat(m[1]) / 100) * box.w;
  const ry = (parseFloat(m[2]) / 100) * box.h;
  const cx = (parseFloat(m[3]) / 100) * box.w + box.ox;
  const cy = (parseFloat(m[4]) / 100) * box.h + box.oy;
  if (!(rx > 0) || !(ry > 0)) return false;
  const stops = fixTransparentStops(parseStops(splitTop(m[5]), rx));
  if (stops.length < 2) return false;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  for (const s of stops) g.addColorStop(Math.min(1, Math.max(0, s.at / rx)), s.color);
  ctx.fillStyle = g;
  // Cover the whole region, inverse-transformed.
  ctx.fillRect(-cx, (-cy * rx) / ry, region.width + Math.abs(cx) * 2, ((region.height + Math.abs(cy) * 2) * rx) / ry);
  ctx.restore();
  return true;
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(url: string): Promise<HTMLImageElement> {
  let p = imageCache.get(url);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("backdrop image failed"));
      img.src = url;
    });
    imageCache.set(url, p);
  }
  return p;
}

async function paintUrl(
  ctx: CanvasRenderingContext2D,
  url: string,
  position: string,
  box: Box,
): Promise<boolean> {
  if (!url.startsWith("data:")) return false; // the surfaces use data URIs only
  const img = await loadImage(url);
  const pos = splitSpaceTop(position.trim());
  const px = resolveLength(pos[0] ?? "0%", box.w - img.width);
  const py = resolveLength(pos[1] ?? "0%", box.h - img.height);
  ctx.drawImage(img, px + box.ox, py + box.oy);
  return true;
}

/**
 * Paint one element's computed background layers (bottom-most last in the
 * computed list, so they are walked in reverse) into the region.
 */
async function paintElementLayers(
  ctx: CanvasRenderingContext2D,
  style: CSSStyleDeclaration,
  box: Box,
  region: Region,
): Promise<void> {
  const layers = splitTop(style.backgroundImage);
  if (layers.length === 1 && layers[0] === "none") return;
  const positions = splitTop(style.backgroundPosition);
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    const urlMatch = layer.match(/^url\(["']?([\s\S]*?)["']?\)$/);
    if (urlMatch) {
      await paintUrl(ctx, urlMatch[1], positions[i % positions.length] ?? "0% 0%", box);
      continue;
    }
    const fn = layer.match(/^(repeating-linear-gradient|linear-gradient|radial-gradient)\(([\s\S]*)\)$/);
    if (!fn) continue;
    if (fn[1] === "repeating-linear-gradient") paintRepeatingLinear(ctx, fn[2], box, region);
    else if (fn[1] === "linear-gradient") paintLinear(ctx, fn[2], box, region);
    else paintRadial(ctx, fn[2], box, region);
  }
}

/* ------------------------------------------------------------------ */
/* The two backdrops.                                                  */
/* ------------------------------------------------------------------ */

function makeCanvas(region: Region): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(region.width * TEXTURE_DPR));
  canvas.height = Math.max(1, Math.round(region.height * TEXTURE_DPR));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  ctx.scale(TEXTURE_DPR, TEXTURE_DPR);
  return { canvas, ctx };
}

/**
 * The page ground under the primary action: body paper, the fixed
 * `.sheet-ground` gradients, `body::before`'s chart furniture, and the
 * graduated rule the loupe lies across.
 */
export async function paintGround(
  region: Region,
  rule?: { x: number; baseY: number; width: number },
): Promise<Backdrop> {
  const { canvas, ctx } = makeCanvas(region);
  const bodyStyle = getComputedStyle(document.body);
  ctx.fillStyle = bodyStyle.backgroundColor;
  ctx.fillRect(0, 0, region.width, region.height);

  // Fixed full-viewport layers: their origin in region space.
  const box: Box = {
    w: window.innerWidth,
    h: window.innerHeight,
    ox: window.scrollX - region.x,
    oy: window.scrollY - region.y,
  };
  const ground = document.querySelector(".sheet-ground");
  if (ground) await paintElementLayers(ctx, getComputedStyle(ground), box, region);
  else await paintElementLayers(ctx, bodyStyle, box, region);
  await paintElementLayers(ctx, getComputedStyle(document.body, "::before"), box, region);

  if (rule) drawRule(ctx, rule.x - region.x, rule.baseY - region.y, rule.width);
  return { canvas, width: region.width, height: region.height };
}

/**
 * The hero sheet under the question tabs: the sheet's own paper and the
 * distance scale. `strip` is the scale's page rect (top edge at `y`).
 */
export function paintSheet(
  region: Region,
  sheetEl: Element,
  strip: { x: number; y: number; width: number },
): Backdrop {
  const { canvas, ctx } = makeCanvas(region);
  ctx.fillStyle = getComputedStyle(sheetEl).backgroundColor;
  ctx.fillRect(0, 0, region.width, region.height);
  drawScale(ctx, strip.x - region.x, strip.y - region.y, strip.width);
  return { canvas, width: region.width, height: region.height };
}
