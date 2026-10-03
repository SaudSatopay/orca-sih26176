import { CREW_SIZE } from "../../crew";

/**
 * The shapes the night bands share between their live shaders and their
 * posters, so a visitor who never gets the effect sees the same drawing,
 * frozen. The shaders (effects/WebThreads.tsx, effects/Strands.tsx) read
 * these numbers; the posters (NightBands.tsx) trace the same curves at t = 0.
 */

/** Ten threads, one per agent: loose on the left, knotted at the right edge. */
export const THREAD_SHAPE = {
  count: Math.min(CREW_SIZE, 10),
  /** Radians of sine across the band's width. */
  frequency: 4.2,
  /** Amplitude per unit of distance from the knot, in band heights. */
  spread: 0.27,
  /** Each later thread swings a little wider. */
  taper: 0.08,
  /** Height of the knot, 0 at the bottom, 1 at the top. */
  position: 0.5,
} as const;

/** Three strands of wake under the call strip. */
export const WAKE_SHAPE = {
  count: 3,
  amplitude: 0.9,
  waviness: 0.8,
  taper: 2.4,
  spread: 1,
  intensity: 0.32,
  /** The shader divides by this: larger is a wider, gentler wake. */
  scale: 2.4,
} as const;

/** Half the wake's visible width, in band heights: the shader's one lobe. */
export const WAKE_HALF = (WAKE_SHAPE.scale * 0.5) / 1.3;

const TAU = Math.PI * 2;

function pathOf(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

/**
 * The threads at t = 0 in a `w` × `h` box (SVG y runs down), as the shader
 * draws them: y = position − sin(x·frequency + i·τ/n) · spread·|x − 1|·(1 + i·taper).
 */
export function threadPaths(w = 1000, h = 240, samples = 96): string[] {
  const { count, frequency, spread, taper, position } = THREAD_SHAPE;
  return Array.from({ length: count }, (_, i) => {
    const pts: [number, number][] = [];
    for (let k = 0; k <= samples; k++) {
      const u = k / samples;
      const amp = spread * Math.abs(u - 1) * (1 + i * taper);
      const v = position - Math.sin(u * frequency + (i * TAU) / count) * amp;
      pts.push([u * w, (1 - v) * h]);
    }
    return pathOf(pts);
  });
}

/**
 * The wake at t = 0, in shader units: x and y measured in band heights from
 * the centre (the box is `-half … half` wide and `-0.5 … 0.5` tall).
 */
export function wakePaths(half = WAKE_HALF, samples = 80): string[] {
  const { count, amplitude, waviness, taper, spread, intensity, scale } = WAKE_SHAPE;
  const e = 0.06 + intensity * 0.94;
  return Array.from({ length: count }, (_, i) => {
    const ph = i * 1.7 * spread;
    const freq = (2 + i * 0.35) * waviness;
    const pts: [number, number][] = [];
    for (let k = 0; k <= samples; k++) {
      const x = -half + (2 * half * k) / samples;
      const ux = x / scale;
      const env = Math.abs(ux * 1.3) < 0.5 ? Math.pow(Math.max(Math.cos(ux * Math.PI * 1.3), 0), taper) : 0;
      const wv = Math.sin(ux * freq + ph) * 0.6 + Math.sin(ux * freq * 1.1 + ph * 1.7) * 0.4;
      const y = wv * (0.1 + 0.02 * e) * env * amplitude * scale;
      pts.push([x, -y]);
    }
    return pts.map(([x, y], j) => `${j ? "L" : "M"}${x.toFixed(4)} ${y.toFixed(4)}`).join(" ");
  });
}

/**
 * The Night watch poster's swell: wave lines from the horizon to the band's
 * foot, closer together and flatter toward the horizon, as a chart engraver
 * draws open water in perspective. In a `w` x `h` box whose horizon is at
 * half height (the live sea's canvas is centred on its horizon too).
 */
export function swellPaths(w = 1000, h = 400, lines = 11, samples = 120): { d: string; depth: number }[] {
  return Array.from({ length: lines }, (_, i) => {
    const depth = (i + 1) / lines;
    const base = h * (0.5 + 0.5 * Math.pow(depth, 1.7));
    const amp = h * (0.003 + 0.028 * depth * depth);
    const cycles = 9 - 5.5 * depth;
    const phase = i * 1.9;
    const pts: [number, number][] = [];
    for (let k = 0; k <= samples; k++) {
      const u = k / samples;
      const y =
        base +
        amp * (0.7 * Math.sin(u * cycles * TAU + phase) + 0.3 * Math.sin(u * cycles * 2.3 * TAU + phase * 0.6));
      pts.push([u * w, y]);
    }
    return { d: pathOf(pts), depth };
  });
}
