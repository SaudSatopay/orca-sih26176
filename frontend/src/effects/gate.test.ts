import { describe, expect, it } from "vitest";
import {
  ALL_EFFECTS,
  CONTEXTS,
  DEFAULT_EFFECTS,
  WEBGL_CAP,
  allowedEffects,
  requestedEffects,
  type EffectEnv,
} from "./gate";

const desktop: EffectEnv = {
  search: "?fx=all",
  wide: true,
  finePointer: true,
  reducedMotion: false,
  reducedTransparency: false,
  saveData: false,
  webgl: true,
};

describe("which landing effects may run", () => {
  it("reads the ?fx= switch", () => {
    expect(requestedEffects("")).toBeNull();
    expect(requestedEffects("?tab=home")).toBeNull();
    expect(requestedEffects("?fx=none")).toEqual([]);
    expect(requestedEffects("?fx=all")).toEqual(ALL_EFFECTS);
    expect(requestedEffects("?fx=relief,ink")).toEqual(["ink", "relief"]);
    expect(requestedEffects("?fx=INK")).toEqual(["ink"]);
    expect(requestedEffects("?fx=nonsense")).toEqual([]);
  });

  it("gives a narrow or touch window the poster by default, but an explicit ?fx= is a demand", () => {
    expect(allowedEffects({ ...desktop, search: "", wide: false })).toEqual([]);
    expect(allowedEffects({ ...desktop, search: "", finePointer: false })).toEqual([]);
    expect(allowedEffects({ ...desktop, wide: false })).toEqual(ALL_EFFECTS);
    // …except the splash, which follows a mouse and has nothing to follow on touch
    expect(allowedEffects({ ...desktop, finePointer: false })).toEqual(
      ALL_EFFECTS.filter((name) => name !== "splash"),
    );
  });

  it("runs the splash on a desktop with a mouse, alone on request, and never on touch", () => {
    expect(DEFAULT_EFFECTS).toContain("splash");
    expect(allowedEffects({ ...desktop, search: "" })).toContain("splash");
    expect(allowedEffects({ ...desktop, search: "?fx=splash" })).toEqual(["splash"]);
    expect(allowedEffects({ ...desktop, search: "?fx=none" })).not.toContain("splash");
    expect(allowedEffects({ ...desktop, search: "?fx=splash", finePointer: false })).toEqual([]);
    expect(allowedEffects({ ...desktop, search: "", reducedMotion: true })).toEqual([]);
    expect(allowedEffects({ ...desktop, search: "", saveData: true })).toEqual([]);
    expect(allowedEffects({ ...desktop, search: "", webgl: false })).toEqual([]);
    expect(CONTEXTS.splash).toBe(1);
  });

  it("gives reduced motion, data saver and no-WebGL the poster", () => {
    expect(allowedEffects({ ...desktop, reducedMotion: true })).toEqual([]);
    expect(allowedEffects({ ...desktop, saveData: true })).toEqual([]);
    expect(allowedEffects({ ...desktop, webgl: false })).toEqual([]);
  });

  it("keeps glass opaque under reduced transparency and leaves the rest alone", () => {
    const got = allowedEffects({ ...desktop, reducedTransparency: true });
    expect(got).not.toContain("glass");
    expect(got).toContain("ink");
  });

  it("never exceeds the WebGL context cap, whatever is asked for", () => {
    const got = allowedEffects(desktop);
    const contexts = got.reduce((n, name) => n + CONTEXTS[name], 0);
    expect(contexts).toBeLessThanOrEqual(WEBGL_CAP);
    expect(WEBGL_CAP).toBe(3);
  });

  it("runs only what was asked for, in priority order", () => {
    expect(allowedEffects({ ...desktop, search: "?fx=glass,ink" })).toEqual(["ink", "glass"]);
    expect(allowedEffects({ ...desktop, search: "?fx=none" })).toEqual([]);
  });

  it("with no switch, runs exactly the shipped set", () => {
    expect(allowedEffects({ ...desktop, search: "" })).toEqual(
      ALL_EFFECTS.filter((name) => DEFAULT_EFFECTS.includes(name)),
    );
  });

  it("ships nothing that would break the cap on its own", () => {
    const shipped = DEFAULT_EFFECTS.reduce((n, name) => n + CONTEXTS[name], 0);
    expect(shipped).toBeLessThanOrEqual(WEBGL_CAP);
  });
});
