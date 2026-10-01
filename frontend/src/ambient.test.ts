import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AMBIENT_SELECTOR, watchAmbientMotion } from "./ambient";

/** A stand-in IntersectionObserver the test can drive by hand. */
class FakeIO {
  static last: FakeIO | null = null;
  observed = new Set<Element>();
  constructor(private cb: IntersectionObserverCallback) {
    FakeIO.last = this;
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.observed.clear();
  }
  report(el: Element, isIntersecting: boolean) {
    this.cb(
      [{ target: el, isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function setHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
  document.dispatchEvent(new Event("visibilitychange"));
}

let stop = () => {};

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", FakeIO);
  document.body.innerHTML = "";
});
afterEach(() => {
  stop();
  setHidden(false);
  vi.unstubAllGlobals();
});

describe("ambient motion", () => {
  it("pauses every loop while the tab is hidden and resumes when it returns", () => {
    stop = watchAmbientMotion();
    expect(document.documentElement).not.toHaveAttribute("data-ambient");

    setHidden(true);
    expect(document.documentElement).toHaveAttribute("data-ambient", "paused");

    setHidden(false);
    expect(document.documentElement).not.toHaveAttribute("data-ambient");
  });

  it("marks a looping element off-screen and clears the mark when it comes back", () => {
    document.body.innerHTML = `<div class="wave-rule"></div><p>not a loop</p>`;
    const wave = document.querySelector(".wave-rule")!;
    stop = watchAmbientMotion();
    const io = FakeIO.last!;

    expect([...io.observed]).toEqual([wave]);

    io.report(wave, false);
    expect(wave).toHaveAttribute("data-offscreen");
    io.report(wave, true);
    expect(wave).not.toHaveAttribute("data-offscreen");
  });

  it("picks up loops added after it started, and lets go of removed ones", async () => {
    stop = watchAmbientMotion();
    const io = FakeIO.last!;
    expect(io.observed.size).toBe(0);

    const view = document.createElement("section");
    view.innerHTML = `<span class="pulse-dot"></span><div class="bob"></div>`;
    document.body.append(view);
    await Promise.resolve(); // MutationObserver delivers in a microtask
    expect(io.observed.size).toBe(2);

    view.remove();
    await Promise.resolve();
    expect(io.observed.size).toBe(0);
  });

  it("stops cleanly", () => {
    document.body.innerHTML = `<div class="sea-drift"></div>`;
    const sea = document.querySelector(".sea-drift")!;
    const off = watchAmbientMotion();
    FakeIO.last!.report(sea, false);
    setHidden(true);

    off();
    expect(sea).not.toHaveAttribute("data-offscreen");
    expect(document.documentElement).not.toHaveAttribute("data-ambient");
  });

  it("covers the loops index.css defines", () => {
    for (const cls of [".sea-drift", ".fish-drift", ".wave-rule", ".compass-needle", ".storm-spin"])
      expect(AMBIENT_SELECTOR.split(",")).toContain(cls);
  });
});
