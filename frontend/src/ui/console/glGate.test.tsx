import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { consoleGlAllowed, consoleGlHere, forgetConsoleGl, rgb } from "./glGate";
import { GlSlot } from "./GlSlot";
import { chart } from "../../tokens";

const desk = { wide: true, finePointer: true, reducedMotion: false, saveData: false, webgl: true };

describe("the console's WebGL gate", () => {
  it("lets a wide desktop with a fine pointer and working WebGL have the decoration", () => {
    expect(consoleGlAllowed(desk)).toBe(true);
  });

  it.each([
    ["a narrow window", { wide: false }],
    ["a touch-first pointer", { finePointer: false }],
    ["reduced motion", { reducedMotion: true }],
    ["the data saver", { saveData: true }],
    ["no WebGL (or ?fx=none)", { webgl: false }],
  ])("refuses %s", (_, change) => {
    expect(consoleGlAllowed({ ...desk, ...change })).toBe(false);
  });

  it("in a window without media support (jsdom) mounts nothing at all", () => {
    forgetConsoleGl();
    expect(consoleGlHere()).toBe(false);
    const { container } = render(
      <GlSlot>
        <canvas data-should-not-render />
      </GlSlot>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("hands the shaders token colours", () => {
    expect(rgb(chart[500]).map((v) => Math.round(v * 255))).toEqual([42, 115, 145]);
  });
});
