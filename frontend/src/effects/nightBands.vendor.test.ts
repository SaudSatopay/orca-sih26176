/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { BAND_EFFECTS, CONTEXTS } from "./gate";

/**
 * The vendoring contract for the night bands' React Bits pieces, checked on
 * the sources themselves: each names where it came from and under which
 * licence, says what was changed, takes the slot's EffectProps, runs on the
 * shared night stage (DPR cap, zero frames out of view, context release),
 * and spells no colour of its own.
 */
const sources = import.meta.glob<string>(
  [
    "./GradientWaves.tsx",
    "./GlowCursor.tsx",
    "./ParticleText.tsx",
    "./SideRays.tsx",
    "./ElectricLogo.tsx",
    "./WebThreads.tsx",
    "./Strands.tsx",
    "./PatternWaves.tsx",
    "../ui/reactbits/particle-text.tsx",
  ],
  { eager: true, query: "?raw", import: "default" },
);

const SLUG: Record<string, string> = {
  GradientWaves: "backgrounds/gradient-waves",
  GlowCursor: "animations/glow-cursor",
  ParticleText: "text-animations/particle-text",
  SideRays: "backgrounds/side-rays",
  ElectricLogo: "animations/electric-logo",
  WebThreads: "backgrounds/web-threads",
  Strands: "animations/strands",
  PatternWaves: "backgrounds/pattern-waves",
};

const effectFiles = Object.keys(SLUG).map((name) => `./${name}.tsx`);
const webgl = effectFiles.filter((f) => f !== "./ParticleText.tsx");

describe("the night bands' vendored pieces", () => {
  it("are all here, one module per effect name", () => {
    for (const f of effectFiles) expect(sources[f], f).toBeTruthy();
    expect(effectFiles.map((f) => f.slice(2, -4).toLowerCase()).sort()).toEqual([...BAND_EFFECTS].sort());
  });

  it("name their source, licence and adaptation in the header", () => {
    for (const [name, slug] of Object.entries(SLUG)) {
      const head = sources[`./${name}.tsx`].slice(0, 1200);
      expect(head, name).toContain(`https://reactbits.dev/${slug}`);
      expect(head, name).toContain("MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md");
      expect(head, name).toContain("Adapted for ORCA");
    }
    const vendored = sources["../ui/reactbits/particle-text.tsx"].slice(0, 1200);
    expect(vendored).toContain("https://reactbits.dev/text-animations/particle-text");
    expect(vendored).toContain("MIT + Commons Clause");
  });

  it("take the slot's EffectProps as their default export", () => {
    for (const f of effectFiles) {
      expect(sources[f], f).toMatch(/export default function \w+\((props: EffectProps|\{ active, onReady \}: EffectProps)\)/);
    }
  });

  it("run every WebGL piece on the shared night stage, which caps DPR and releases the context", () => {
    for (const f of webgl) {
      const src = sources[f];
      expect(src, f).toContain("useNightScene(");
      expect(src, f).toContain("nightDpr()");
      expect(src, f).toContain("releaseContext(gl)");
      expect(src, f).not.toMatch(/devicePixelRatio\s*\|\|\s*1,\s*2\)/);
      // no loop of its own: the stage owns requestAnimationFrame
      expect(src, f).not.toContain("requestAnimationFrame");
      expect(CONTEXTS[f.slice(2, -4).toLowerCase() as keyof typeof CONTEXTS], f).toBe(1);
    }
  });

  it("listen for the pointer on the band or the piece, never the whole window", () => {
    for (const f of effectFiles) expect(sources[f], f).not.toMatch(/window\.addEventListener\("pointer/);
  });

  it("take every colour from the tokens", () => {
    for (const [f, src] of Object.entries(sources)) {
      expect(src, f).not.toMatch(/#[0-9a-fA-F]{6}\b/);
      expect(src, f).not.toMatch(/#[0-9a-fA-F]{3}\b['"]/);
    }
    for (const f of webgl) {
      expect(sources[f], f).toMatch(/from "\.\.\/tokens";/);
      expect(sources[f], f).toContain("hexToVec3(");
    }
  });
});
