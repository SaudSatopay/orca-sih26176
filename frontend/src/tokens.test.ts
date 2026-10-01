/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { alpha, chance, colors, flow, fontSize, ink, paper, rule, sst, typePx } from "./tokens";

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

describe("one token source", () => {
  const sources = import.meta.glob<string>(
    ["./**/*.{ts,tsx}", "!./tokens.ts", "!./**/*.test.{ts,tsx}"],
    { eager: true, query: "?raw", import: "default" },
  );

  const styles = import.meta.glob<string>("./**/*.css", {
    eager: true,
    query: "?raw",
    import: "default",
  });

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

describe("type scale", () => {
  it("rises strictly, one step per role", () => {
    const sizes = Object.values(typePx);
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
    expect(new Set(sizes).size).toBe(sizes.length);
  });

  it("is handed to Tailwind in pixels", () => {
    expect(fontSize.label).toBe("10px");
    expect(fontSize.hero).toBe("48px");
    expect(Object.keys(fontSize)).toEqual(Object.keys(typePx));
  });
});
