/// <reference types="vite/client" />
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SHOWCASE } from "../../i18n/showcase";
import type { Language } from "../../types";
import { BULLETIN, PHONE_EDITION, SHEETS } from "./sheets";
import { BulletinCrumple, ChartRipple, EditionsSwap, SheetsFlow } from "./SheetsShowcase";

const LANGS: Language[] = ["en", "hi", "mr"];

/** Node's file reader, reached without @types/node (the project ships none). */
const fs = (await import(/* @vite-ignore */ ["node", "fs"].join(":"))) as {
  existsSync: (p: string) => boolean;
  readFileSync: (p: string) => Uint8Array;
};
/** Tests run from frontend/ (vite.config.ts). */
const root = (globalThis as unknown as { process: { cwd: () => string } }).process.cwd();
/** A file in public/, as its bytes. */
const bytesOf = (src: string): Uint8Array | null => {
  const path = `${root}/public${src}`;
  return fs.existsSync(path) ? fs.readFileSync(path) : null;
};

afterEach(() => {
  vi.useRealTimers();
});

describe("the sheets on disk", () => {
  it("are WebP files on this origin, each at most 90 KB", () => {
    for (const s of [...SHEETS, PHONE_EDITION, BULLETIN]) {
      expect(s.src).toMatch(/^\/sheets\/[a-z-]+\.webp$/);
      const bytes = bytesOf(s.src);
      expect(bytes, s.src).not.toBeNull();
      const tag = (from: number) => String.fromCharCode(...bytes!.subarray(from, from + 4));
      expect(tag(0), s.src).toBe("RIFF");
      expect(tag(8), s.src).toBe("WEBP");
      expect(bytes!.length, s.src).toBeLessThanOrEqual(90 * 1024);
    }
  });

  it("are four console sheets and three phone ones", () => {
    expect(SHEETS.filter((s) => s.edition === "console")).toHaveLength(4);
    expect(SHEETS.filter((s) => s.edition === "phone")).toHaveLength(3);
  });
});

describe.each(LANGS)("the showcase in %s", (language) => {
  const t = SHOWCASE[language];

  it("EditionsSwap: a heading, both editions as images, and two labelled buttons", () => {
    render(<EditionsSwap language={language} />);
    const section = screen.getByRole("region", { name: t.editions.title });
    expect(within(section).getByRole("heading", { level: 2, name: t.editions.title })).toBeInTheDocument();
    expect(within(section).getByAltText(t.sheets.today.alt)).toBeInTheDocument();
    expect(within(section).getByAltText(t.editions.phoneAlt)).toBeInTheDocument();
    const consoleBtn = within(section).getByRole("button", { name: t.editions.console });
    const phoneBtn = within(section).getByRole("button", { name: t.editions.phone });
    expect(consoleBtn).toHaveAttribute("aria-pressed", "true");
    expect(phoneBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("SheetsFlow: every sheet with its caption, in a scrollable strip", () => {
    render(<SheetsFlow language={language} />);
    const section = screen.getByRole("region", { name: t.flow.title });
    const strip = within(section).getByRole("region", { name: t.flow.strip });
    expect(strip).toHaveAttribute("tabindex", "0");
    for (const s of SHEETS) {
      expect(within(strip).getByAltText(t.sheets[s.id].alt)).toBeInTheDocument();
      expect(within(strip).getByText(t.sheets[s.id].caption)).toBeInTheDocument();
    }
    expect(section.querySelector("[data-effect='sheets']")).not.toBeNull();
  });

  it("ChartRipple: the Ask sheet with the line it illustrates", () => {
    render(<ChartRipple language={language} />);
    const section = screen.getByRole("region", { name: t.ripple.title });
    expect(within(section).getByAltText(t.sheets.ask.alt)).toBeInTheDocument();
    expect(within(section).getByText(t.ripple.caption)).toBeInTheDocument();
    expect(section.querySelector("[data-effect='ripple']")).not.toBeNull();
  });

  it("BulletinCrumple: the plain answer is real text, never part of an image", () => {
    render(<BulletinCrumple language={language} />);
    const section = screen.getByRole("region", { name: t.crumple.title });
    const answer = within(section).getByText(t.crumple.answer);
    expect(answer.tagName).not.toBe("IMG");
    expect(answer.closest("[aria-hidden='true']")).toBeNull();
    expect(within(section).getByAltText(t.crumple.bulletinAlt)).toBeInTheDocument();
    expect(section.querySelector("[data-effect='crumple']")).not.toBeNull();
  });
});

describe("every showcase image", () => {
  it("loads lazily, from this origin, with its size reserved", () => {
    const { container } = render(
      <>
        <EditionsSwap language="en" />
        <SheetsFlow language="en" />
        <ChartRipple language="en" />
        <BulletinCrumple language="en" />
      </>,
    );
    const images = [...container.querySelectorAll("img")];
    expect(images.length).toBeGreaterThanOrEqual(11);
    for (const img of images) {
      expect(img.getAttribute("src")).toMatch(/^\/sheets\//);
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("width");
      expect(img).toHaveAttribute("height");
      expect(img.getAttribute("alt") ?? "").not.toBe("");
    }
  });
});

describe("EditionsSwap", () => {
  it("switches on hover, focus and click of its two buttons", () => {
    render(<EditionsSwap language="en" />);
    const consoleBtn = screen.getByRole("button", { name: "Console" });
    const phoneBtn = screen.getByRole("button", { name: "Phone" });

    fireEvent.mouseEnter(phoneBtn);
    expect(phoneBtn).toHaveAttribute("aria-pressed", "true");
    fireEvent.focus(consoleBtn);
    expect(consoleBtn).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(phoneBtn);
    expect(phoneBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("advances by itself every four seconds while in view, and can be paused", () => {
    vi.useFakeTimers();
    // in view: the section's observer reports it at once
    class SeenIO {
      constructor(private cb: IntersectionObserverCallback) {}
      observe(el: Element) {
        this.cb([{ target: el, isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", SeenIO);
    render(<EditionsSwap language="en" />);
    const phoneBtn = screen.getByRole("button", { name: "Phone" });
    expect(phoneBtn).toHaveAttribute("aria-pressed", "false");
    act(() => {
      vi.advanceTimersByTime(4100);
    });
    expect(phoneBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    act(() => {
      vi.advanceTimersByTime(9000);
    });
    expect(phoneBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});

describe("BulletinCrumple", () => {
  it("offers a crumple toggle a keyboard can reach", () => {
    render(<BulletinCrumple language="en" />);
    const toggle = screen.getByRole("button", { name: "Crumple the bulletin" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Smooth it out" })).toHaveAttribute("aria-pressed", "true");
  });
});
