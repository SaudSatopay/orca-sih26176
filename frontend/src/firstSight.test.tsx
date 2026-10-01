import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { forgetSights, useFirstSight } from "./firstSight";

beforeEach(() => {
  vi.useFakeTimers();
  forgetSights();
});
afterEach(() => vi.useRealTimers());

describe("a reveal plays once per reading", () => {
  it("is fresh on first sight and settles after its time", () => {
    const { result } = renderHook(() => useFirstSight("risk:a"));
    expect(result.current).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(false);
  });

  it("is not fresh when the same reading is mounted again (a view change)", () => {
    renderHook(() => useFirstSight("risk:a")).unmount();
    expect(renderHook(() => useFirstSight("risk:a")).result.current).toBe(false);
  });

  it("is fresh again for a new reading in a view that stayed mounted", () => {
    const { result, rerender } = renderHook(({ k }) => useFirstSight(k), { initialProps: { k: "risk:a" } });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    rerender({ k: "risk:b" });
    expect(result.current).toBe(true);
  });
});
