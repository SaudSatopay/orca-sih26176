import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom has no IntersectionObserver. Motion's `useInView` (the vendored UI
// kit) needs one to construct; this one reports nothing, so components stay
// in their first-frame state — which is exactly what the tests assert on.
// Tests that need visibility install their own (see ambient.test.ts).
if (typeof globalThis.IntersectionObserver === "undefined") {
  class NoopIntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds: number[] = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  globalThis.IntersectionObserver =
    NoopIntersectionObserver as unknown as typeof IntersectionObserver;
}
