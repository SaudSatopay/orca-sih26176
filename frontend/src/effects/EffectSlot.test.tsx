import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { EffectProps } from "./EffectSlot";

// Every visitor in jsdom is turned away by the real gate; these tests let the
// effects run, so the slot's own rules are what is under test.
vi.mock("./gate", async (importOriginal) => {
  const real = await importOriginal<typeof import("./gate")>();
  return { ...real, effectsHere: () => ["ground", "ink", "glass", "relief", "splash"] };
});

import { AWAY_MS, EffectSlot } from "./EffectSlot";
import { HANDOVER_MS, leases, type Lease } from "./contexts";

/** An IntersectionObserver the test drives: every observer reports `near`. */
let observers: { cb: IntersectionObserverCallback; el: Element }[] = [];
function look(isIntersecting: boolean) {
  act(() => {
    for (const o of observers)
      o.cb([{ isIntersecting, target: o.el } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
}

function Live({ onReady }: EffectProps) {
  return (
    <canvas
      data-testid="live"
      ref={(c) => {
        if (c) queueMicrotask(onReady);
      }}
    />
  );
}

async function tick(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe("a WebGL effect's slot", () => {
  const held: Lease[] = [];
  beforeEach(() => {
    vi.useFakeTimers();
    observers = [];
    globalThis.IntersectionObserver = class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe(el: Element) {
        observers.push({ cb: this.cb, el });
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = "";
      thresholds = [];
    } as unknown as typeof IntersectionObserver;
  });
  afterEach(async () => {
    // unmount here, under the fake clock, so every lease is back before the next test
    cleanup();
    held.splice(0).forEach((l) => l.release());
    await vi.advanceTimersByTimeAsync(HANDOVER_MS * 2 + 2000);
    vi.useRealTimers();
  });

  it("keeps its poster while it waits for a lease, and mounts once one is free", async () => {
    for (let i = 0; i < 3; i++) held.push(await leases.acquire("ink"));
    const { queryByTestId, getByText } = render(
      <EffectSlot name="relief" Effect={Live} poster={<p>poster</p>} />,
    );
    look(true);
    await tick(700); // past the idle wait
    expect(getByText("poster")).toBeInTheDocument();
    expect(queryByTestId("live")).toBeNull();
    held.pop()!.release();
    await tick(HANDOVER_MS);
    expect(queryByTestId("live")).not.toBeNull();
    expect(leases.stats().holders).toContain("relief");
  });

  it("lets its effect go, and its lease, once it has been away a while", async () => {
    const { queryByTestId, container } = render(
      <EffectSlot name="relief" Effect={Live} poster={<p>poster</p>} />,
    );
    look(true);
    await tick(700);
    expect(queryByTestId("live")).not.toBeNull();
    look(false);
    await tick(AWAY_MS - 10);
    expect(queryByTestId("live")).not.toBeNull();
    await tick(20);
    expect(queryByTestId("live")).toBeNull();
    expect(container.querySelector('[data-live="0"]')).not.toBeNull();
    // the canvas never says its context is lost here: the fallback hands the lease back
    await tick(2000);
    expect(leases.stats().holders).not.toContain("relief");
    // back near: mounted again under a new lease
    look(true);
    await tick(10);
    expect(queryByTestId("live")).not.toBeNull();
  });

  it("armed on interaction, keeps its poster through the load until the visitor first moves", async () => {
    const { queryByTestId, getByText } = render(
      <EffectSlot name="ink" Effect={Live} poster={<p>printed mark</p>} armOn="interaction" />,
    );
    look(true);
    await tick(5000); // long past the idle wait: still nothing
    expect(queryByTestId("live")).toBeNull();
    expect(leases.stats().holders).not.toContain("ink");
    expect(getByText("printed mark")).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new Event("pointermove"));
    });
    await tick(700);
    expect(queryByTestId("live")).not.toBeNull();
  });

  it("does not lease anything for an effect without a WebGL context", async () => {
    const { queryByTestId } = render(<EffectSlot name="ground" Effect={Live} poster={null} eager />);
    await tick(700);
    expect(queryByTestId("live")).not.toBeNull();
    expect(leases.stats().holders).not.toContain("ground");
  });
});
