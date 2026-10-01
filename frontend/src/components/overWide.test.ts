import { afterEach, describe, expect, it, vi } from "vitest";
import { overWide } from "./overWide";

function box(tag: string, cls: string, width: number): HTMLElement {
  const el = document.createElement(tag);
  el.className = cls;
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ width } as DOMRect);
  return el;
}

afterEach(() => vi.restoreAllMocks());

describe("the phone layout probe", () => {
  it("lists only what is wider than the viewport, widest first", () => {
    const root = document.createElement("div");
    root.append(box("section", "ok", 390), box("div", "wide", 423), box("ul", "wider", 459));
    expect(overWide(root, 390)).toEqual(["459 ul.wider", "423 div.wide"]);
  });

  it("says nothing when everything fits", () => {
    const root = document.createElement("div");
    root.append(box("div", "a", 390), box("div", "b", 200));
    expect(overWide(root, 390)).toEqual([]);
  });

  it("allows a pixel of rounding and caps the list", () => {
    const root = document.createElement("div");
    root.append(box("div", "rounding", 391));
    for (let i = 0; i < 8; i++) root.append(box("div", `w${i}`, 400 + i));
    const rows = overWide(root, 390);
    expect(rows).toHaveLength(5);
    expect(rows[0]).toBe("407 div.w7");
    expect(rows.join(" ")).not.toContain("rounding");
  });
});
