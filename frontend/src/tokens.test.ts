/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { alpha, chance, colors, flow, ink, paper, rule, sst } from "./tokens";

describe("tokens", () => {
  it("writes a hex colour at an opacity", () => {
    expect(alpha("#12212D", 0.28)).toBe("rgba(18,33,45,0.28)");
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
    expect({ ...chance, ...sst, ...flow }).toEqual({
      good: "#63862B",
      some: "#B08000",
      poor: "#9C5F44",
      cold: "#3E7A99",
      cool: "#2F8A7D",
      mild: "#7E9A4A",
      warm: "#B08532",
      hot: "#BF6A1F",
      calm: "#8FB0C0",
    });
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
});
