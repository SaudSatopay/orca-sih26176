import { chart, ink } from "./../tokens";

/**
 * Effect 1 — the wet-ink wordmark: the numbers behind it.
 *
 * Paper Shaders' LiquidMetal paints stripes between a fixed near-white and a
 * fixed near-black and can only colour-burn a tint over them, so on its own
 * the highlights stay white: that is chrome, whatever the tint. The live
 * wordmark therefore reads the shader as a grey map and prints it in ink
 * (an SVG filter: luminance, then one table per channel): darkest grey to
 * ink-900, lightest to chart-500, never lighter. The recipe and this ramp
 * were settled in the studio (frontend/studio/InkStudio.tsx) and the stills
 * (og.png, the splashes) were captured from the same numbers.
 */

/** Dark to light. The teal bloom low in the letters is the chart-500 end. */
export const INK_RAMP: readonly string[] = [
  ink[900],
  ink[900],
  ink[800],
  chart[700],
  chart[700],
  chart[600],
  chart[500],
];

/** Rec. 601 luminance into every channel; alpha is left alone. */
export const LUMA_MATRIX =
  "0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0";

/** One channel of the ramp as `feComponentTransfer` table values. */
export function rampTable(shift: 16 | 8 | 0): string {
  return INK_RAMP.map((hex) => (((parseInt(hex.slice(1), 16) >> shift) & 255) / 255).toFixed(4)).join(
    " ",
  );
}

/**
 * The studio's settled recipe. `frame` is the shader's clock in milliseconds:
 * starting from the stills' frame, the live mark takes up where og.png and the
 * splashes left off. `speed` is the live difference — ink creeping, not chrome
 * flowing (1 is the library's own pace; 0.16 was judged by eye in real time).
 */
export const RECIPE = {
  repetition: 1,
  softness: 1,
  distortion: 0.6,
  contour: 0.34,
  angle: 70,
  shiftRed: 0,
  shiftBlue: 0,
  frame: 4800,
  speed: 0.16,
} as const;

/**
 * The shader draws only when all three say so: the slot has it in view on a
 * visible tab (`active`), the tab is not hidden (our own second lock) and the
 * visitor has not asked for reduced motion (the gate already refused; this is
 * the double lock if it is ever mounted anyway).
 */
export function inkSpeed(active: boolean, reducedMotion: boolean, documentHidden: boolean): number {
  return active && !reducedMotion && !documentHidden ? RECIPE.speed : 0;
}

/** The canvas budget for a box: device pixel ratio capped at 1.5. */
export function capPixels(cssWidth: number, cssHeight: number): number {
  return Math.max(1, cssWidth) * Math.max(1, cssHeight) * 1.5 * 1.5;
}

/**
 * The wordmark's geometry: "ORCA" in Fraunces Black at 640 px with 90 px of
 * padding for the shader's edge field, measured once in Chromium
 * (canvas measureText, the app's own self-hosted face):
 * actualBoundingBox left −20, right 1995.6, ascent 460, descent 20.
 * The live canvas re-measures at runtime; the poster and the reserved box use
 * these numbers, so the two drawings land in the same place.
 */
export const WORD = {
  text: "ORCA",
  size: 640,
  pad: 90,
  /** `ceil(left + right) + 2 × pad` */
  w: 2156,
  /** `ceil(ascent + descent) + 2 × pad` */
  h: 660,
  /** `pad + actualBoundingBoxLeft` */
  x: 70,
  /** `pad + actualBoundingBoxAscent` */
  baseline: 550,
} as const;
