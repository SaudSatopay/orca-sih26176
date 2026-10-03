import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ROOM_MARGIN_PX, createLeaseManager, releaseAfterLoss, type Lease } from "./contexts";
import { ALL_EFFECTS, WEBGL_CAP } from "./gate";

const HANDOVER = 60;

describe("WebGL context leases", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("never has more than the cap out at once", async () => {
    const m = createLeaseManager(3, HANDOVER);
    const got: Lease[] = [];
    const asks = (["ink", "relief", "splash", "glass", "ink"] as const).map((n) =>
      m.acquire(n).then((l) => got.push(l)),
    );
    await vi.advanceTimersByTimeAsync(0);
    expect(got).toHaveLength(3);
    expect(m.stats()).toMatchObject({ held: 3, waiting: 2, peak: 3 });
    got[0].release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    expect(got).toHaveLength(4);
    got[1].release();
    got[2].release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    await Promise.all(asks);
    expect(m.stats().peak).toBe(3);
  });

  it("is the landing's cap of three", () => {
    expect(WEBGL_CAP).toBe(3);
  });

  it("hands a released lease on only after a pause, so the old context is gone first", async () => {
    const m = createLeaseManager(1, HANDOVER);
    const first = await m.acquire("ink");
    let second: Lease | null = null;
    void m.acquire("relief").then((l) => (second = l));
    first.release();
    await vi.advanceTimersByTimeAsync(HANDOVER - 1);
    expect(second).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    expect(second).not.toBeNull();
  });

  it("serves waiters by priority, then in the order they asked", async () => {
    const m = createLeaseManager(1, HANDOVER);
    const first = await m.acquire("ink");
    const order: string[] = [];
    void m.acquire("splash").then((l) => (order.push("splash"), l.release()));
    void m.acquire("relief").then((l) => (order.push("relief-1"), l.release()));
    void m.acquire("relief").then((l) => (order.push("relief-2"), l.release()));
    void m.acquire("glass").then((l) => (order.push("glass"), l.release()));
    first.release();
    await vi.advanceTimersByTimeAsync(HANDOVER * 5);
    expect(order).toEqual(["glass", "relief-1", "relief-2", "splash"]);
    // priority is the order of ALL_EFFECTS
    expect(ALL_EFFECTS.indexOf("glass")).toBeLessThan(ALL_EFFECTS.indexOf("relief"));
    expect(ALL_EFFECTS.indexOf("relief")).toBeLessThan(ALL_EFFECTS.indexOf("splash"));
  });

  it("asks the humblest holder that can step aside, once, when a better one waits", async () => {
    const m = createLeaseManager(2, HANDOVER);
    const splashYield = vi.fn();
    const reliefYield = vi.fn();
    const splash = await m.acquire("splash", { onYield: splashYield });
    await m.acquire("relief", { onYield: reliefYield });
    let glass: Lease | null = null;
    void m.acquire("glass").then((l) => (glass = l));
    expect(splashYield).toHaveBeenCalledTimes(1);
    expect(reliefYield).not.toHaveBeenCalled();
    // asked once, not on every pump
    void m.acquire("glass");
    expect(splashYield).toHaveBeenCalledTimes(1);
    splash.release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    expect(glass).not.toBeNull();
  });

  it("never asks a holder of equal or higher priority to step aside", async () => {
    const m = createLeaseManager(1, HANDOVER);
    const inkYield = vi.fn();
    await m.acquire("ink", { onYield: inkYield });
    void m.acquire("relief");
    void m.acquire("ink");
    expect(inkYield).not.toHaveBeenCalled();
  });

  it("lets a waiter walk away: an aborted request leaves the queue and rejects", async () => {
    const m = createLeaseManager(1, HANDOVER);
    const first = await m.acquire("ink");
    const ctl = new AbortController();
    const gone = m.acquire("relief", { signal: ctl.signal });
    ctl.abort();
    await expect(gone).rejects.toThrow();
    expect(m.stats().waiting).toBe(0);
    first.release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    expect(m.stats().held).toBe(0);
  });

  it("counts contexts, not leases: a two-context effect takes two places", async () => {
    const m = createLeaseManager(3, HANDOVER);
    const big = await m.acquire("relief", { count: 2 });
    expect(m.stats().held).toBe(2);
    await m.acquire("ink");
    let more: Lease | null = null;
    void m.acquire("ink").then((l) => (more = l));
    await vi.advanceTimersByTimeAsync(0);
    expect(more).toBeNull();
    big.release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    expect(more).not.toBeNull();
    expect(m.stats()).toMatchObject({ held: 2, peak: 3 });
  });

  it("does not let a small lease overtake a big one at the head of the queue", async () => {
    const m = createLeaseManager(3, HANDOVER);
    const a = await m.acquire("ink", { count: 2 });
    const order: string[] = [];
    void m.acquire("glass", { count: 2 }).then(() => order.push("glass"));
    void m.acquire("relief").then(() => order.push("relief"));
    await vi.advanceTimersByTimeAsync(0);
    // one place is free, but the glass is first in line and needs two
    expect(order).toEqual([]);
    a.release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    expect(order).toEqual(["glass", "relief"]);
  });

  it("asks as many humble holders to step aside as the waiter needs", async () => {
    const m = createLeaseManager(3, HANDOVER);
    const y1 = vi.fn();
    const y2 = vi.fn();
    await m.acquire("ink");
    await m.acquire("relief", { onYield: y1 });
    await m.acquire("splash", { onYield: y2 });
    void m.acquire("glass", { count: 2 });
    expect(y2).toHaveBeenCalledTimes(1);
    expect(y1).toHaveBeenCalledTimes(1);
  });

  it("counts a release once, however often it is called", async () => {
    const m = createLeaseManager(2, HANDOVER);
    const a = await m.acquire("ink");
    await m.acquire("relief");
    a.release();
    a.release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    expect(m.stats().held).toBe(1);
  });
});

describe("leases follow the reader", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("serves the waiter nearest the reader first, whatever its priority", async () => {
    const m = createLeaseManager(1, HANDOVER);
    const first = await m.acquire("ink");
    const order: string[] = [];
    void m.acquire("relief", { distance: () => 700 }).then((l) => (order.push("relief"), l.release()));
    void m.acquire("strands", { distance: () => 120 }).then((l) => (order.push("strands"), l.release()));
    void m.acquire("webthreads", { distance: () => 0 }).then((l) => (order.push("webthreads"), l.release()));
    first.release();
    await vi.advanceTimersByTimeAsync(HANDOVER * 5);
    expect(order).toEqual(["webthreads", "strands", "relief"]);
  });

  it("takes the context of a holder left far behind, farthest first, and never of one on screen", async () => {
    const m = createLeaseManager(2, HANDOVER);
    const behind = vi.fn();
    const farther = vi.fn();
    const shown = vi.fn();
    await m.acquire("ink", { distance: () => 900, onStepAside: behind });
    await m.acquire("relief", { distance: () => 0, onStepAside: shown });
    void m.acquire("gradientwaves", { distance: () => 200 });
    expect(behind).toHaveBeenCalledTimes(1);
    expect(shown).not.toHaveBeenCalled();
    // asked once, however often the queue is looked at
    m.reconsider();
    expect(behind).toHaveBeenCalledTimes(1);

    const m2 = createLeaseManager(2, HANDOVER);
    await m2.acquire("ink", { distance: () => 600, onStepAside: behind });
    await m2.acquire("relief", { distance: () => 1800, onStepAside: farther });
    void m2.acquire("gradientwaves", { distance: () => 0 });
    expect(farther).toHaveBeenCalledTimes(1);
    expect(behind).toHaveBeenCalledTimes(1);
  });

  it("does not trade a context between two slots about as far away", async () => {
    const m = createLeaseManager(1, HANDOVER);
    const step = vi.fn();
    await m.acquire("ink", { distance: () => 300, onStepAside: step });
    void m.acquire("relief", { distance: () => 300 - ROOM_MARGIN_PX + 40 });
    expect(step).not.toHaveBeenCalled();
  });

  it("never asks the splash on screen to yield for a section that is still ahead", async () => {
    const m = createLeaseManager(1, HANDOVER);
    const splashYield = vi.fn();
    await m.acquire("splash", { distance: () => 0, onYield: splashYield });
    void m.acquire("gradientwaves", { distance: () => 240 });
    expect(splashYield).not.toHaveBeenCalled();
    // …but does for one on screen
    void m.acquire("relief", { distance: () => 0 });
    expect(splashYield).toHaveBeenCalledTimes(1);
  });

  it("keeps a waiter beyond the horizon waiting, even with a context free", async () => {
    let horizon = 900;
    const m = createLeaseManager(2, HANDOVER, () => horizon);
    let behind: Lease | null = null;
    void m.acquire("patternwaves", { distance: () => 1300 }).then((l) => (behind = l));
    await vi.advanceTimersByTimeAsync(0);
    expect(behind).toBeNull();
    expect(m.stats()).toMatchObject({ held: 0, waiting: 1 });
    // nor may it take a context from anyone: two holders the reader has left far behind
    let away = 0;
    const step = vi.fn();
    await m.acquire("ink", { distance: () => away, onStepAside: step });
    await m.acquire("relief", { distance: () => away, onStepAside: step });
    away = 2400;
    m.reconsider();
    expect(step).not.toHaveBeenCalled();
    // the reader turns round: it is ahead again, and within reach
    horizon = 1400;
    m.reconsider();
    expect(step).toHaveBeenCalledTimes(1);
  });

  it("looks again when asked: a holder the reader has left behind makes room", async () => {
    const m = createLeaseManager(1, HANDOVER);
    let inkAt = 0;
    const step = vi.fn();
    const ink = await m.acquire("ink", { distance: () => inkAt, onStepAside: step });
    let granted: Lease | null = null;
    void m.acquire("relief", { distance: () => 300 }).then((l) => (granted = l));
    expect(step).not.toHaveBeenCalled();
    inkAt = 1200;
    m.reconsider();
    expect(step).toHaveBeenCalledTimes(1);
    ink.release();
    await vi.advanceTimersByTimeAsync(HANDOVER);
    expect(granted).not.toBeNull();
  });
});

describe("releasing after the context is really lost", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("waits for webglcontextlost on every canvas, with a fallback", () => {
    const release = vi.fn();
    const a = document.createElement("canvas");
    const b = document.createElement("canvas");
    const lost = new WeakSet<HTMLCanvasElement>();
    releaseAfterLoss({ name: "relief", release }, [a, b], lost, 1000);
    a.dispatchEvent(new Event("webglcontextlost"));
    expect(release).not.toHaveBeenCalled();
    b.dispatchEvent(new Event("webglcontextlost"));
    expect(release).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("releases at once when the canvases are already lost, and by timeout when one never says", () => {
    const now = vi.fn();
    const a = document.createElement("canvas");
    const lost = new WeakSet<HTMLCanvasElement>([a]);
    releaseAfterLoss({ name: "ink", release: now }, [a], lost);
    expect(now).toHaveBeenCalledTimes(1);

    const late = vi.fn();
    releaseAfterLoss({ name: "relief", release: late }, [document.createElement("canvas")], lost, 800);
    vi.advanceTimersByTime(799);
    expect(late).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(late).toHaveBeenCalledTimes(1);
  });
});
