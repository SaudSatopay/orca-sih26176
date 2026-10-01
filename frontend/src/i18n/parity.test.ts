/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";

/**
 * Trilingual parity. Every string table in the frontend lives in this folder;
 * each is found by shape (an object with `en`, `hi` and `mr`), wherever it
 * sits — a top-level table, a label on a scenario, a step of the tour.
 */
const modules = import.meta.glob<Record<string, unknown>>(["./*.ts", "!./*.test.ts"], {
  eager: true,
});

const LANGS = ["en", "hi", "mr"] as const;

type Table = { where: string; value: Record<(typeof LANGS)[number], unknown> };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function findTables(value: unknown, where: string, out: Table[]): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => findTables(v, `${where}[${i}]`, out));
  } else if (isObject(value)) {
    if (LANGS.some((l) => l in value)) {
      out.push({ where, value: value as Table["value"] });
      return;
    }
    Object.entries(value).forEach(([k, v]) => findTables(v, `${where}.${k}`, out));
  }
}

/** The structure of a value: keys, array lengths and leaf types — not the text. */
function shape(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shape);
  if (isObject(v))
    return Object.fromEntries(
      Object.keys(v)
        .sort()
        .map((k) => [k, shape(v[k])]),
    );
  return typeof v;
}

function emptyStrings(v: unknown, where: string, out: string[]): void {
  if (typeof v === "string") {
    if (!v.trim()) out.push(where);
  } else if (Array.isArray(v)) v.forEach((x, i) => emptyStrings(x, `${where}[${i}]`, out));
  else if (isObject(v)) Object.entries(v).forEach(([k, x]) => emptyStrings(x, `${where}.${k}`, out));
}

const tables: Table[] = [];
for (const [file, mod] of Object.entries(modules))
  for (const [name, value] of Object.entries(mod)) findTables(value, `${file}:${name}`, tables);

describe("trilingual parity", () => {
  it("finds the string tables", () => {
    const names = tables.map((t) => t.where);
    // the three the demo path leans on, by name
    expect(names).toContain("./landing.ts:L10N");
    expect(names).toContain("./app.ts:UI");
    expect(names).toContain("./app.ts:TAB_LABEL");
    expect(names).toContain("./mobile.ts:T");
    // every module in the folder contributes at least one table
    for (const file of Object.keys(modules))
      expect(names.some((n) => n.startsWith(`${file}:`)), `${file} has no table`).toBe(true);
    expect(tables.length).toBeGreaterThan(50); // 23 tables, 5 scenario labels, 34 tour strings
  });

  it.each(tables.map((t) => [t.where, t] as const))("%s has en, hi and mr in step", (_, t) => {
    expect(Object.keys(t.value).sort()).toEqual([...LANGS]);
    const en = shape(t.value.en);
    expect(shape(t.value.hi), "hi differs from en").toEqual(en);
    expect(shape(t.value.mr), "mr differs from en").toEqual(en);
  });

  it.each(tables.map((t) => [t.where, t] as const))("%s has no empty string", (_, t) => {
    const empty: string[] = [];
    for (const l of LANGS) emptyStrings(t.value[l], l, empty);
    expect(empty).toEqual([]);
  });
});

describe("string tables stay in src/i18n", () => {
  const sources = import.meta.glob<string>(
    ["../**/*.{ts,tsx}", "!../i18n/**", "!../**/*.test.{ts,tsx}"],
    { eager: true, query: "?raw", import: "default" },
  );

  it("no other source file declares a per-language entry", () => {
    expect(Object.keys(sources).length).toBeGreaterThan(15);
    const offenders = Object.entries(sources)
      // speech.ts maps languages to BCP 47 locales; that is not user-facing text
      .filter(([file]) => !file.endsWith("/speech.ts"))
      .filter(([, text]) => /^\s*(hi|mr):\s/m.test(text) || /language === "(hi|mr)"/.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });
});
