import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { EffectProps } from "./EffectSlot";

// Every visitor in jsdom is turned away by the real gate; these tests let the
// effects run, so the slot's own rules are what is under test.
vi.mock("./gate", async (importOriginal) => {
  const real = await importOriginal<typeof import("./gate")>();
  return { ...real, effectsHere: () => ["ground", "ink", "glass", "relief", "splash"] };
});

import { AWAY_MS, EffectSlot, LOOK_AHEAD_AFTER_MS, POINTER_LINGER_MS, WARM_MARGIN } from "./EffectSlot";
import { HANDOVER_MS, leases, type Lease } from "./contexts";

/**
 * An IntersectionObserver the test drives. `look` reports to every observer
 * (in view, and so within a screen too); `lookAhead` only to the warm zone's,
 * as for a section a screen below the fold.
 */
let observers: { cb: IntersectionObserverCallback; el: Element; margin: string }[] = [];
function report(isIntersecting: boolean, which: (margin: string) => boolean) {
  act(() => {
    for (const o of observers)
      if (which(o.margin))
        o.cb([{ isIntersecting, target: o.el } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
}
const look = (isIntersecting: boolean) => report(isIntersecting, () => true);
const lookAhead = (isIntersecting: boolean) => report(isIntersecting, (m) => m === WARM_MARGIN);

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
      constructor(
        private cb: IntersectionObserverCallback,
        private opts?: IntersectionObserverInit,
      ) {}
      observe(el: Element) {
        observers.push({ cb: this.cb, el, margin: this.opts?.rootMargin ?? "" });
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

  it("before the visitor first moves, leaves a section a screen ahead as its poster: the load is posters alone", async () => {
    const { queryByTestId, getByText } = render(
      <EffectSlot name="relief" Effect={Live} poster={<p>poster</p>} />,
    );
    lookAhead(true);
    await tick(5000);
    expect(queryByTestId("live")).toBeNull();
    expect(leases.stats().holders).not.toContain("relief");
    expect(getByText("poster")).toBeInTheDocument();
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

  it("once the visitor has moved, draws a section a screen ahead off screen, then rests it until it is in view", async () => {
    act(() => {
      window.dispatchEvent(new Event("pointermove"));
    });
    const active: boolean[] = [];
    function Probe({ active: on, onReady }: EffectProps) {
      active.push(on);
      return (
        <canvas
          data-testid="live"
          ref={(c) => {
            if (c) queueMicrotask(onReady);
          }}
        />
      );
    }
    const { queryByTestId, container } = render(
      <EffectSlot name="relief" Effect={Probe} poster={<p>poster</p>} />,
    );
    lookAhead(true);
    await tick(LOOK_AHEAD_AFTER_MS + 700);
    // mounted ahead of the reader, under a lease, and live before anyone sees it
    expect(queryByTestId("live")).not.toBeNull();
    expect(leases.stats().holders).toContain("relief");
    expect(container.querySelector('[data-live="1"]')).not.toBeNull();
    // it drew its first frame out of view, then rests
    expect(active[0]).toBe(true);
    expect(active[active.length - 1]).toBe(false);
    // in view: it moves
    look(true);
    expect(active[active.length - 1]).toBe(true);
  });

  it("armed on pointer, holds no context until a mouse comes over it, and lets go after it leaves", async () => {
    const { queryByTestId, container } = render(
      <EffectSlot name="relief" Effect={Live} poster={<p>still water</p>} armOn="pointer" />,
    );
    look(true);
    await tick(5000);
    expect(queryByTestId("live")).toBeNull();
    expect(leases.stats().holders).not.toContain("relief");
    const slot = container.querySelector("[data-effect]")!;
    act(() => {
      slot.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    });
    await tick(10);
    expect(queryByTestId("live")).not.toBeNull();
    act(() => {
      slot.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    });
    await tick(POINTER_LINGER_MS - 10);
    expect(queryByTestId("live")).not.toBeNull();
    await tick(20);
    expect(queryByTestId("live")).toBeNull();
  });

  it("does not lease anything for an effect without a WebGL context", async () => {
    const { queryByTestId } = render(<EffectSlot name="ground" Effect={Live} poster={null} eager />);
    await tick(700);
    expect(queryByTestId("live")).not.toBeNull();
    expect(leases.stats().holders).not.toContain("ground");
  });
});
