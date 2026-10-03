import { chart, ink, paper } from "../tokens";

/**
 * The splash's settled numbers (SplashInk.tsx), kept out of the component so
 * the tests can hold them and so the shader's one safety rule (how dark the
 * ink may make the paper) has a JavaScript mirror that is measured.
 *
 * React Bits ships SplashCursor loud: rainbow dye, force 6000, radius 0.2,
 * dye at 1440, the device's full pixel ratio, a loop that never stops. On a
 * chart it has to be the opposite: a little marine ink let into still water.
 */
export const SPLASH = {
  /** Velocity grid, short side. */
  simResolution: 128,
  /** Dye texture, long side: never above 1024. */
  dyeLongSide: 1024,
  /** Device pixels per CSS pixel, at most. */
  dprCap: 1.5,
  /** The ink thins out: about 13 % left after one second, gone by two and a half. */
  densityDissipation: 2.0,
  /** The water keeps moving a little after the pointer stops, so the bloom spreads. */
  velocityDissipation: 1.4,
  pressure: 0.1,
  pressureIterations: 20,
  /** Small eddies: the tendrils ink makes in water. */
  curl: 3,
  /** Splat radius (React Bits units, /100 in the shader). Default 0.2. */
  splatRadius: 0.12,
  /** How hard a stroke pushes the water. Default 6000. */
  splatForce: 2600,
  /** Ink let in per frame of movement. */
  splatAmount: 0.22,
  /** Density to coverage: 1 - e^(-gain * density). */
  gain: 3.5,
  /** A bloom's rim pools darker, as ink does at the edge of a wet patch. */
  edge: 24,
  /**
   * The most the ink may take from the paper's luminance, as a fraction,
   * where there are words. The hero sub-line (ink-500 on the sheet's ground)
   * measures 5.0:1 with no effects on; 4.5:1 is the floor, about 10 % of
   * luminance. 9 % leaves margin. In display-space mixing that is only 5 to
   * 7 % coverage of ink, so everywhere else the ink is let go further.
   */
  maxLoss: 0.09,
  /**
   * The same on open paper, away from every word on screen: ink that reads
   * as ink (about a fifth coverage of the darkest), never a black blot.
   */
  openLoss: 0.32,
  /** The text keep-out mask: one mask pixel per this many CSS pixels. */
  maskScale: 8,
  /** The keep-out's soft edge: a Gaussian of this many CSS pixels. */
  maskBlur: 12,
  /**
   * Each word's keep-out reaches this far past its box, CSS pixels: two
   * blur widths, so the blur leaves the mask at 98 % or more over the glyphs.
   */
  maskPad: 24,
  /** A stroke changes ink this often, per second. */
  inkChangeHz: 2,
  /** No pointer movement for this long, and the ink gone: the loop stops. */
  idleMs: 3000,
} as const;

/** The four marine inks, darkest first. No other colour is ever let in. */
export const SPLASH_INKS: readonly string[] = [ink[900], chart[700], chart[600], chart[500]];

/** The paper the luminance rule is measured against. */
export const SPLASH_PAPER = paper[100];

/** `#RRGGBB` as display-space red, green and blue, 0 to 1. */
export function rgbOf(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** WCAG relative luminance of a display-space colour. */
export function luminance([r, g, b]: readonly number[]): number {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * The highest coverage at which `inkHex` laid over `paperHex` keeps the
 * paper's luminance above (1 - loss) of itself. The display shader solves
 * the same thing per pixel for the mixed ink it finds there.
 */
export function maxCoverage(inkHex: string, paperHex: string = SPLASH_PAPER, loss: number = SPLASH.maxLoss): number {
  const p = rgbOf(paperHex);
  const c = rgbOf(inkHex);
  const floor = luminance(p) * (1 - loss);
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 16; i++) {
    const m = (lo + hi) / 2;
    const mixed = p.map((v, k) => v + (c[k] - v) * m);
    if (luminance(mixed) >= floor) lo = m;
    else hi = m;
  }
  return lo;
}

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Where the words are, in the viewport: one box per line of every visible
 * text node (form controls' labels included), so the ink can thin out under
 * them. Text inside an `aria-hidden` decoration counts too: it is still read
 * by eye.
 */
export function textBoxes(doc: Document, width: number, height: number): Box[] {
  const out: Box[] = [];
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const range = doc.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    range.selectNodeContents(n);
    for (const r of Array.from(range.getClientRects())) {
      if (r.width < 1 || r.height < 1) continue;
      if (r.bottom < 0 || r.top > height || r.right < 0 || r.left > width) continue;
      out.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
    }
  }
  range.detach();
  return out;
}

/** Seconds until ink at density `from` has thinned to `to` (the advection's decay). */
export function fadeSeconds(from: number, to: number, dissipation: number = SPLASH.densityDissipation): number {
  return Math.log(from / to) / dissipation;
}

/**
 * The density below which a pixel is not drawn at all: under half a step of
 * an 8-bit channel at the darkest ink's full coverage.
 */
export const INVISIBLE = 0.5 / 255 / (SPLASH.gain * maxCoverage(ink[900], SPLASH_PAPER, SPLASH.openLoss));

/**
 * The bound kept on how dense any pixel can be. Splats add up while the
 * pointer moves, but past this density the coverage is already full (1 - e^-9),
 * so counting further only keeps the loop running for ink no one can see
 * getting lighter.
 */
export const RESIDUAL_CAP = 9 / SPLASH.gain;

/** Whether the loop may stop: the pointer has rested and the ink is gone. */
export function settled(now: number, lastMove: number, residual: number): boolean {
  return now - lastMove >= SPLASH.idleMs && residual <= INVISIBLE;
}
