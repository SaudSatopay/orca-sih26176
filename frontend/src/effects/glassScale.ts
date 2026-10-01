import { alpha, chart, ink, typePx } from "../tokens";

/**
 * The chart's distance scale — the graduated ruler the loupes lie across.
 *
 * One geometry, two renderers: GlassLoupe prints it in the DOM (CSS layers
 * and numeral spans, glass.css) and glassBackdrop paints the identical ruler
 * into the lens's backdrop texture, so what the glass magnifies is exactly
 * what the page shows around it. Both read the constants from here.
 *
 * It is drawn honestly: ticks every 6 px, a longer tick every fifth, a
 * numbered tick every tenth, 60 px to 5 km. It is decoration (`aria-hidden`)
 * — the chart's own labels carry the information.
 */

export const SCALE = {
  /** px between ticks. */
  tick: 6,
  /** every Nth tick is mid-height. */
  midEvery: 5,
  /** every Nth tick is tall and numbered. */
  numEvery: 10,
  /** km per numbered tick. */
  kmPerNum: 5,
  /** tick heights, px (short, mid, tall). */
  shortH: 5,
  midH: 8,
  tallH: 11,
  /** numeral row height (the type scale's label step). */
  textH: typePx.label,
  /** gap between numerals and ticks. */
  gap: 2,
} as const;

/** Total height of the ruler strip, numerals over ticks. */
export const SCALE_H = SCALE.textH + SCALE.gap + SCALE.tallH;

/** The ruler's colours, from the tokens (ink-500 / chart-600, as specified). */
export const SCALE_COLOR = {
  short: alpha(ink[500], 0.4),
  mid: alpha(chart[600], 0.62),
  tall: alpha(chart[600], 0.95),
  text: ink[500],
} as const;

export interface ScaleTick {
  x: number;
  kind: "short" | "mid" | "tall";
}

/** Every tick that fits in `width`, left-anchored at 0. */
export function scaleTicks(width: number): ScaleTick[] {
  const out: ScaleTick[] = [];
  for (let i = 0; i * SCALE.tick <= width; i++) {
    out.push({
      x: i * SCALE.tick,
      kind: i % SCALE.numEvery === 0 ? "tall" : i % SCALE.midEvery === 0 ? "mid" : "short",
    });
  }
  return out;
}

export interface ScaleNumeral {
  x: number;
  text: string;
}

/** The numerals over the tall ticks; the last one carries the unit. */
export function scaleNumerals(width: number): ScaleNumeral[] {
  const out: ScaleNumeral[] = [];
  const step = SCALE.tick * SCALE.numEvery;
  for (let i = 0; i * step <= width; i++) {
    out.push({ x: i * step, text: String(i * SCALE.kmPerNum) });
  }
  if (out.length > 1) out[out.length - 1].text += " km";
  return out;
}

export const SCALE_FONT = `600 ${typePx.label}px "Spline Sans Mono Variable", Consolas, monospace`;

/**
 * Paint the ruler into a 2D context at (x, y) — the same strip the DOM
 * renders, for the lens's backdrop texture. `y` is the strip's top edge.
 */
export function drawScale(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
  const base = y + SCALE_H;
  for (const t of scaleTicks(width)) {
    const h = t.kind === "tall" ? SCALE.tallH : t.kind === "mid" ? SCALE.midH : SCALE.shortH;
    ctx.fillStyle = SCALE_COLOR[t.kind];
    ctx.fillRect(x + t.x, base - h, 1, h);
  }
  ctx.fillStyle = SCALE_COLOR.text;
  ctx.font = SCALE_FONT;
  ctx.textBaseline = "top";
  const numerals = scaleNumerals(width);
  for (let i = 0; i < numerals.length; i++) {
    const n = numerals[i];
    const w = ctx.measureText(n.text).width;
    // Centred on its tick; the first keeps inside the strip's left edge.
    const nx = i === 0 ? x + n.x : x + n.x - w / 2;
    ctx.fillText(n.text, nx, y);
  }
}

/**
 * The short unnumbered rule under the primary action: ticks only. Same
 * rhythm, bottom-anchored at (x, baseY).
 */
export function drawRule(ctx: CanvasRenderingContext2D, x: number, baseY: number, width: number): void {
  for (const t of scaleTicks(width)) {
    const h = t.kind === "tall" ? SCALE.tallH : t.kind === "mid" ? SCALE.midH : SCALE.shortH;
    ctx.fillStyle = SCALE_COLOR[t.kind];
    ctx.fillRect(x + t.x, baseY - h, 1, h);
  }
}

/** Height of the unnumbered rule. */
export const RULE_H = SCALE.tallH;
