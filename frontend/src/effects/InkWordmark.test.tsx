import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InkCartouche from "./InkWordmark";
import { INK_RAMP, RECIPE, capPixels, inkSpeed, rampTable, WORD } from "./inkRamp";
import { chart, ink } from "../tokens";
import { L10N } from "../i18n/landing";

describe("the closing cartouche, with the effect off", () => {
  // jsdom has no matchMedia and no WebGL: this is every visitor the gate
  // turns away, and every visitor at all until the slot arms after idle.

  it("shows the static wordmark in ink-900, a wave rule and the tagline", () => {
    render(<InkCartouche language="en" />);
    const word = screen.getByText("ORCA");
    // SVG text: real selectable text, printed flat in the heading ink.
    expect(word.tagName).toBe("text");
    expect(word).toHaveClass("fill-ink-900");
    expect(word.closest("svg")).not.toBeNull();
    expect(document.querySelector(".wave-rule")).not.toBeNull();
    expect(screen.getByText(L10N.en.folioTagline)).toBeInTheDocument();
  });

  it("never translates the mark and names the section for readers", () => {
    render(<InkCartouche language="hi" />);
    const word = screen.getByText("ORCA");
    expect(word.closest("[translate]")).toHaveAttribute("translate", "no");
    expect(screen.getByText(L10N.hi.folioTagline)).toBeInTheDocument();
  });

  it("mounts no canvas and fetches no shader chunk when the gate refuses", () => {
    const { container } = render(<InkCartouche language="en" />);
    expect(container.querySelector("canvas")).toBeNull();
    // the slot wrapper is there, armed on "ink", with the poster as content
    const slot = container.querySelector('[data-effect="ink"]');
    expect(slot).not.toBeNull();
    expect(slot).toHaveAttribute("data-live", "0");
  });

  it("reserves the wordmark box, so the live canvas causes no layout shift", () => {
    const { container } = render(<InkCartouche language="en" />);
    const slot = container.querySelector<HTMLElement>('[data-effect="ink"]');
    expect(slot?.style.aspectRatio).toBe(`${WORD.w} / ${WORD.h}`);
  });

  it("has the tagline in all three languages", () => {
    for (const lang of ["en", "hi", "mr"] as const) {
      expect(L10N[lang].folioTagline.trim()).not.toBe("");
    }
  });
});

describe("the ink ramp", () => {
  it("prints the shader dark to light: ink-900 up to chart-500, never lighter", () => {
    expect(INK_RAMP[0]).toBe(ink[900]);
    expect(INK_RAMP[INK_RAMP.length - 1]).toBe(chart[500]);
    expect(INK_RAMP).toEqual([
      ink[900], ink[900], ink[800], chart[700], chart[700], chart[600], chart[500],
    ]);
  });

  it("writes each channel as a feComponentTransfer table from the tokens", () => {
    // red channel of ink-900 (#12212D) is 0x12/255; of chart-500 (#2A7391) 0x2A/255
    const red = rampTable(16).split(" ");
    expect(red).toHaveLength(INK_RAMP.length);
    expect(Number(red[0])).toBeCloseTo(0x12 / 255, 4);
    expect(Number(red[red.length - 1])).toBeCloseTo(0x2a / 255, 4);
  });
});

describe("the live recipe", () => {
  it("keeps the studio's settled numbers and a slow creep, not a chrome flow", () => {
    expect(RECIPE).toMatchObject({
      repetition: 1,
      softness: 1,
      distortion: 0.6,
      contour: 0.34,
      angle: 70,
      shiftRed: 0,
      shiftBlue: 0,
    });
    expect(RECIPE.speed).toBeGreaterThanOrEqual(0.1);
    expect(RECIPE.speed).toBeLessThanOrEqual(0.25);
  });

  it("is still when out of view, on a hidden tab or under reduced motion", () => {
    expect(inkSpeed(true, false, false)).toBe(RECIPE.speed);
    expect(inkSpeed(false, false, false)).toBe(0);
    expect(inkSpeed(true, true, false)).toBe(0);
    expect(inkSpeed(true, false, true)).toBe(0);
  });

  it("caps the canvas at 1.5 device pixels per CSS pixel", () => {
    expect(capPixels(800, 300)).toBe(800 * 300 * 2.25);
    expect(capPixels(0, 300)).toBeGreaterThan(0); // never a zero budget
  });
});
