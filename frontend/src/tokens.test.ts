/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import shellHtml from "../index.html?raw";
import manifestJson from "../public/manifest.webmanifest?raw";
import {
  alpha,
  chance,
  chanceInk,
  colors,
  flow,
  fontSize,
  ink,
  paper,
  riskInk,
  rule,
  shadow,
  sheen,
  signalInk,
  sst,
  textColors,
  TYPE_BASE,
  TYPE_RATIO,
  typePx,
} from "./tokens";

describe("tokens", () => {
  it("writes a hex colour at an opacity", () => {
    expect(alpha(ink[900], 0.28)).toBe("rgba(18,33,45,0.28)");
    expect(alpha(paper[50], 1)).toBe("rgba(251,247,237,1)");
  });

  it("draws the three rules in ink", () => {
    expect(rule).toEqual({
      faint: alpha(ink[900], 0.14),
      DEFAULT: alpha(ink[900], 0.28),
      strong: alpha(ink[900], 0.55),
    });
  });

  it("names the values that used to sit outside the palette", () => {
    const named = { ...chance, ...sst, ...flow };
    expect(Object.keys(named)).toEqual([
      "good", "some", "poor", // chance of fish
      "cold", "cool", "mild", "warm", "hot", // sea-surface temperature
      "calm", // the particle field
    ]);
    // nine roles, nine values: none was merged into another
    expect(new Set(Object.values(named)).size).toBe(9);
  });

  it("writes every colour as six-digit hex, which alpha() and Tailwind both read", () => {
    const values = Object.entries(colors)
      .filter(([name]) => name !== "rule")
      .flatMap(([, scale]) => (typeof scale === "string" ? [scale] : Object.values(scale)));
    expect(values.length).toBeGreaterThan(30);
    for (const v of values) expect(v).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("gives every token a distinct value within its scale", () => {
    for (const [name, scale] of Object.entries(colors)) {
      if (typeof scale === "string") continue;
      const values = Object.values(scale);
      expect(new Set(values).size, name).toBe(values.length);
    }
  });
});

const sources = import.meta.glob<string>(
  ["./**/*.{ts,tsx}", "!./tokens.ts", "!./**/*.test.{ts,tsx}"],
  { eager: true, query: "?raw", import: "default" },
);

const styles = import.meta.glob<string>("./**/*.css", {
  eager: true,
  query: "?raw",
  import: "default",
});

describe("one token source", () => {
  it("no source file spells a colour as a literal hex", () => {
    expect(Object.keys(sources).length).toBeGreaterThan(30);
    const offenders: string[] = [];
    for (const [file, raw] of Object.entries(sources)) {
      // The landing hero illustration is being replaced; it is the one exemption.
      const text = file.endsWith("/Landing.tsx")
        ? raw.replace(/\{\/\* hero art:[\s\S]*?<\/Reveal>/, "")
        : raw;
      text.split("\n").forEach((line, i) => {
        if (/#[0-9a-fA-F]{6}\b/.test(line)) offenders.push(`${file}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("no source file sets an arbitrary pixel type size", () => {
    const offenders = Object.entries({ ...sources, ...styles })
      .filter(([, text]) => /text-\[[\d.]+px\]/.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });
});

describe("stylesheets", () => {
  const every = new Set(
    Object.entries(colors)
      .filter(([name]) => name !== "rule")
      .flatMap(([, scale]) => (typeof scale === "string" ? [scale] : Object.values(scale))),
  );

  it("are read by these tests", () => {
    // `?raw` CSS imports came back empty once (vite.config.ts, `test.css`).
    expect(Object.keys(styles).length).toBeGreaterThan(3);
    for (const [file, text] of Object.entries(styles)) expect(text.length, file).toBeGreaterThan(100);
  });

  it("spell no colour function with numbers in it", () => {
    const offenders = Object.entries(styles).flatMap(([file, text]) =>
      text
        .split("\n")
        .map((line, i) => ({ line, at: `${file}:${i + 1}` }))
        .filter(({ line }) => /\b(?:rgba?|hsla?)\(\s*\d/.test(line))
        .map(({ at }) => at),
    );
    expect(offenders).toEqual([]);
  });

  it("draw their inline SVG in token colours only", () => {
    const spelled = Object.values(styles).flatMap((text) =>
      [...text.matchAll(/(?:#|%23)([0-9a-fA-F]{6})\b/g)].map((m) => `#${m[1].toUpperCase()}`),
    );
    expect(spelled.length).toBeGreaterThan(3);
    expect([...new Set(spelled)].filter((c) => !every.has(c))).toEqual([]);
  });

  it("no component steps off the spacing scale by a pixel", () => {
    const offScale = /(?<![\w-])(?:[mp][trblxy]?|gap|space-[xy])-\[[\d.]+px\]/;
    const offenders = Object.entries(sources)
      .filter(([, text]) => offScale.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });

  it("take their elevation from the shadow tokens", () => {
    expect(Object.keys(shadow)).toEqual(["sheet", "lift"]);
    expect(shadow.sheet).toContain(alpha(ink[900], 0.35));
    expect(shadow.lift).toContain(alpha(sheen, 0.55));
  });
});

describe("what cannot read the tokens mirrors them", () => {
  const every = new Set(
    Object.entries(colors)
      .filter(([name]) => name !== "rule")
      .flatMap(([, scale]) => (typeof scale === "string" ? [scale] : Object.values(scale))),
  );

  it("the static shell in index.html spells only token colours", () => {
    const spelled = [...shellHtml.matchAll(/(?:#|%23)([0-9a-fA-F]{6})\b/g)].map(
      (m) => `#${m[1].toUpperCase()}`,
    );
    expect(spelled.length).toBeGreaterThan(8);
    expect(spelled.filter((c) => !every.has(c))).toEqual([]);
    expect(shellHtml).toContain(`<meta name="theme-color" content="${paper[100]}" />`);
  });

  it("the shell's hairlines are the rule tokens", () => {
    const rules = new Set<string>(Object.values(rule).map((v) => v.replace(/\s/g, "")));
    const spelled = [...shellHtml.matchAll(/rgba\([^)]*\)/g)].map((m) => m[0].replace(/\s/g, ""));
    expect(spelled.length).toBeGreaterThan(0);
    expect(spelled.filter((c) => !rules.has(c))).toEqual([]);
  });

  it("the shell's type sizes are steps of the scale", () => {
    const steps = new Set<number>(Object.values(typePx));
    const sizes = [...shellHtml.matchAll(/font-size:\s*([\d.]+)px/g)].map((m) => Number(m[1]));
    expect(sizes.length).toBeGreaterThan(4);
    expect(sizes.filter((px) => !steps.has(px))).toEqual([]);
  });

  it("the manifest's colours are the sheet", () => {
    const manifest = JSON.parse(manifestJson) as { background_color: string; theme_color: string };
    expect(manifest.background_color).toBe(paper[100]);
    expect(manifest.theme_color).toBe(paper[100]);
  });
});

describe("status inks", () => {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it("hold 4.5:1 as text on every paper that carries text", () => {
    const inks = { ...riskInk, ...chanceInk, signal: signalInk, label: ink[400] };
    for (const [name, value] of Object.entries(inks)) {
      for (const tone of [50, 100, 150] as const) {
        expect(contrast(value, paper[tone]), `${name} on paper-${tone}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("keep the hue of the fill they print", () => {
    expect(Object.keys(riskInk)).toEqual(Object.keys(colors.risk));
    expect(Object.keys(chanceInk)).toEqual(Object.keys(colors.chance));
    expect(textColors).toEqual({ risk: riskInk, chance: chanceInk, signal: signalInk });
  });
});

describe("type scale", () => {
  it("has nine steps, the smallest 11 px", () => {
    const sizes = Object.values(typePx);
    expect(sizes).toHaveLength(9);
    expect(Math.min(...sizes)).toBe(11);
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  });

  it("is a minor third counted from 16 px, rounded to the pixel", () => {
    const sizes = Object.values(typePx);
    const base = sizes.indexOf(TYPE_BASE);
    expect(base).toBeGreaterThan(-1);
    sizes.forEach((px, i) => {
      expect(px, `step ${i}`).toBe(Math.round(TYPE_BASE * TYPE_RATIO ** (i - base)));
    });
  });

  it("is handed to Tailwind in pixels", () => {
    expect(fontSize.label).toBe("11px");
    expect(fontSize.hero).toBe("48px");
    expect(Object.keys(fontSize)).toEqual(Object.keys(typePx));
  });

  it("no source file uses a step that was folded into another", () => {
    const folded = new RegExp(
      String.raw`(?<![\w-])text-(?:micro|readout|small|prose|subtitle|heading|figure|tile)\b(?!-)|\b(?:fontSize|typePx)\.(?:micro|readout|small|prose|subtitle|heading|figure|tile)\b`,
    );
    const offenders = Object.entries({ ...sources, ...styles })
      .filter(([, text]) => folded.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });
});
