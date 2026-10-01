/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";

/**
 * The motion doctrine (DESIGN.md, "Motion doctrine"), checked against the
 * stylesheets themselves, the way tokens.test.ts checks the colours.
 */
const styles = import.meta.glob<string>("./**/*.css", {
  eager: true,
  query: "?raw",
  import: "default",
});
const config = import.meta.glob<string>("../tailwind.config.js", {
  eager: true,
  query: "?raw",
  import: "default",
});

const bare = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Every `@keyframes` block: its file, its name and the properties it animates. */
function keyframes(): { file: string; name: string; props: string[] }[] {
  const found: { file: string; name: string; props: string[] }[] = [];
  for (const [file, raw] of Object.entries(styles)) {
    const css = bare(raw);
    const head = /@keyframes\s+([\w-]+)\s*\{/g;
    for (let m = head.exec(css); m; m = head.exec(css)) {
      let depth = 1;
      let end = head.lastIndex;
      while (depth > 0 && end < css.length) {
        if (css[end] === "{") depth += 1;
        else if (css[end] === "}") depth -= 1;
        end += 1;
      }
      const props = new Set<string>();
      for (const [, block] of css.slice(head.lastIndex, end - 1).matchAll(/\{([^{}]*)\}/g))
        for (const declaration of block.split(";")) {
          const prop = declaration.split(":")[0].trim();
          if (prop) props.add(prop);
        }
      found.push({ file, name: m[1], props: [...props] });
    }
  }
  return found;
}

/** What a keyframe may move: the compositor's two, and the two the chart draws with. */
const MOVES = new Set(["transform", "opacity", "clip-path", "stroke-dashoffset"]);

/** Keyframes that still break the rule; each is owned by a plan in .missile/checks/motion-it1.md. */
const PENDING = new Set<string>([]);

/** Keyframes of the landing hero while its sequence is being rebuilt. Empty this when it lands. */
const REBUILDING = new Set<string>([]);

describe("motion doctrine", () => {
  it("finds the stylesheets", () => {
    expect(Object.keys(styles).length).toBeGreaterThanOrEqual(4);
    expect(keyframes().length).toBeGreaterThan(20);
  });

  // A (plan 1)
  it("keyframes move by transform, opacity, clip-path or stroke-dashoffset only", () => {
    const offenders = keyframes()
      .filter((k) => !PENDING.has(k.name))
      .flatMap((k) =>
        k.props.filter((p) => !MOVES.has(p)).map((p) => `${k.file} @keyframes ${k.name} animates ${p}`),
      );
    expect(offenders).toEqual([]);
  });

  // B (plan 4)
  it("no keyframe that animates opacity is run with a fill-mode", () => {
    const fades = new Set(keyframes().filter((k) => k.props.includes("opacity")).map((k) => k.name));
    const offenders: string[] = [];
    for (const [file, raw] of Object.entries(styles))
      for (const [, value] of bare(raw).matchAll(/animation:\s*([^;}]+)/g)) {
        if (!/\b(both|forwards|backwards)\b/.test(value)) continue;
        const name = value.split(/\s+/).find((word) => fades.has(word));
        if (name && !REBUILDING.has(name)) offenders.push(`${file}: animation: ${value.trim()}`);
      }
    expect(offenders).toEqual([]);
  });

  // C (plan 4)
  it("the house entrances keep no fill-mode, and reduced motion never resets a resting transform", () => {
    const tailwind = Object.values(config)[0] ?? "";
    const animation = /animation:\s*\{([^}]*)\}/.exec(tailwind)?.[1] ?? "";
    expect(animation).toContain("rise");
    expect(animation).not.toMatch(/\b(both|forwards|backwards)\b/);
    const css = bare(styles["./index.css"]);
    const reduced = css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).not.toMatch(/transform:\s*none\s*!important/);
  });

  // D (plan 7)
  it("the pause rule names loops, never every element", () => {
    expect(bare(styles["./index.css"])).not.toMatch(/\[data-ambient="paused"\]\s*\*/);
  });
});
