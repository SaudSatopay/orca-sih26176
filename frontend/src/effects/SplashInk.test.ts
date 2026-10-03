/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import splashSource from "./SplashInk.tsx?raw";
import splashCss from "./splash.css?raw";
import appSource from "../App.tsx?raw";
import {
  INVISIBLE,
  RESIDUAL_CAP,
  SPLASH,
  SPLASH_INKS,
  SPLASH_PAPER,
  fadeSeconds,
  luminance,
  maxCoverage,
  rgbOf,
  settled,
} from "./splashRecipe";
import { chart, ink } from "../tokens";

const mix = (paperHex: string, inkHex: string, a: number) => {
  const p = rgbOf(paperHex);
  const c = rgbOf(inkHex);
  return p.map((v, k) => v + (c[k] - v) * a);
};
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

describe("the splash's inks", () => {
  it("are the four marine inks from the tokens, and nothing else", () => {
    expect(SPLASH_INKS).toEqual([ink[900], chart[700], chart[600], chart[500]]);
  });

  it("left the rainbow behind", () => {
    // the header may say "no rainbow"; the code may not have one
    expect(splashSource).not.toMatch(/HSVtoRGB|RAINBOW_MODE|generateColor|hsl\(/);
    expect(splashSource).not.toMatch(/console\./);
  });
});

describe("the splash keeps body text legible", () => {
  // Measured on a screenshot crop of the hero sub-line (ink-500) with every
  // effect off: the sheet's ground there has a median luminance of 0.673.
  const GROUND = 0.6728;
  const SUBLINE = luminance(rgbOf(ink[500]));

  it("takes at most maxLoss of the paper's luminance where there are words", () => {
    for (const c of SPLASH_INKS) {
      const a = maxCoverage(c, SPLASH_PAPER, SPLASH.maxLoss);
      expect(a).toBeGreaterThan(0);
      expect(luminance(mix(SPLASH_PAPER, c, a))).toBeGreaterThanOrEqual(luminance(rgbOf(SPLASH_PAPER)) * (1 - SPLASH.maxLoss) - 1e-6);
    }
  });

  it("which leaves the sub-line at 4.5:1 or better on its measured ground", () => {
    expect(contrast(SUBLINE, GROUND * (1 - SPLASH.maxLoss))).toBeGreaterThanOrEqual(4.5);
  });

  it("is never a black blot, even on bare paper", () => {
    expect(SPLASH.openLoss).toBeLessThan(0.4);
    // the darkest ink covers the paper by under a quarter at the most
    expect(maxCoverage(ink[900], SPLASH_PAPER, SPLASH.openLoss)).toBeLessThan(0.25);
  });

  it("pads each word's keep-out by two blur widths", () => {
    expect(SPLASH.maskPad).toBeGreaterThanOrEqual(2 * SPLASH.maskBlur);
  });
});

describe("the splash is quiet", () => {
  it("runs a small sim at a capped resolution and pixel ratio", () => {
    expect(SPLASH.simResolution).toBe(128);
    expect(SPLASH.dyeLongSide).toBeLessThanOrEqual(1024);
    expect(SPLASH.dprCap).toBeLessThanOrEqual(1.5);
    // softer than React Bits' defaults (force 6000, radius 0.2)
    expect(SPLASH.splatForce).toBeLessThan(6000);
    expect(SPLASH.splatRadius).toBeLessThan(0.2);
  });

  it("lets its ink fade in about two to three seconds", () => {
    const fade = fadeSeconds(RESIDUAL_CAP, INVISIBLE);
    expect(fade).toBeGreaterThan(2);
    expect(fade).toBeLessThan(3.5);
  });

  it("stops only when the pointer has rested and the ink is gone", () => {
    const t = 10_000;
    expect(settled(t, t - 100, 0)).toBe(false); // still moving
    expect(settled(t, t - SPLASH.idleMs, RESIDUAL_CAP)).toBe(false); // ink still there
    expect(settled(t, t - SPLASH.idleMs, INVISIBLE / 2)).toBe(true);
  });
});

describe("the splash's canvas", () => {
  it("lies under the content and never takes a pointer", () => {
    const slot = /\.splash-slot\s*\{([^}]*)\}/.exec(splashCss)?.[1] ?? "";
    expect(slot).toMatch(/position:\s*fixed/);
    expect(slot).toMatch(/z-index:\s*-1/);
    expect(slot).toMatch(/pointer-events:\s*none/);
    expect(splashSource).toMatch(/aria-hidden/);
  });

  it("follows a mouse or pen, never a touch, and makes no click splat", () => {
    expect(splashSource).toMatch(/pointerType === "touch"/);
    expect(splashSource).not.toMatch(/mousedown|touchstart|clickSplat/);
  });

  it("mounts once, behind a gated slot, for the whole landing", () => {
    expect(appSource.match(/name="splash"/g)).toHaveLength(1);
    expect(appSource).toMatch(/lazy\(\(\) => import\("\.\/effects\/SplashInk"\)\)/);
  });
});
