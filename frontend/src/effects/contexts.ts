import { ALL_EFFECTS, WEBGL_CAP, type EffectName } from "./gate";

/**
 * WebGL context leases: the landing's cap of three live contexts as a
 * guarantee, not an arithmetic accident.
 *
 * Every effect that opens a WebGL context first takes a lease and gives it
 * back only once its context is lost. While `cap` leases are out, the next
 * asker waits. Waiters are served nearest the reader first (`distance`: 0
 * on screen, then by how far off it they are), then by priority (their
 * place in ALL_EFFECTS), first come first served within one effect.
 *
 * A full house makes room for the waiter at the head of the queue, asking
 * each holder at most once:
 *   - a holder that is off screen and clearly farther away than the waiter
 *     steps aside (`onStepAside`, or `onYield` if that is all it has): this
 *     is how a section a screen ahead gets its context from one the reader
 *     has left behind, and arrives already drawn;
 *   - for a waiter on screen, a lower-priority holder that can step aside
 *     (`onYield`) is asked to; it lets go when it is ready (the splash waits
 *     for its ink to fade) and queues again behind the one it made room for.
 * A holder on screen is never asked to make room for one that is not.
 *
 * Waiters farther away than the horizon (a screen, on the landing) are not
 * served at all: a section the reader has left behind does not take a free
 * context back only to give it up to the next one coming up.
 *
 * A released lease is handed on after a short pause, so the old context's
 * `webglcontextlost` has fired before the next one opens and the measured
 * count (ledger.ts) never reads one over the cap, even for a frame.
 */

export interface Lease {
  readonly name: EffectName;
  /** Give the lease back. Call it after the context is lost. Safe to call twice. */
  release(): void;
}

export interface AcquireOptions {
  /** Abort while still waiting and the request leaves the queue (the promise rejects). */
  signal?: AbortSignal;
  /** Called at most once per lease when a higher-priority effect is kept waiting. */
  onYield?: () => void;
  /**
   * Called at most once per lease when the holder is off screen and a waiter
   * nearer the reader needs its context: nobody is looking, so let go now.
   */
  onStepAside?: () => void;
  /**
   * How far the effect is from the reader now, in CSS pixels: 0 while any of
   * it is on screen. Read again whenever the queue is reconsidered. Without
   * it the effect counts as on screen.
   */
  distance?: () => number;
  /** How many contexts this lease covers (an effect's CONTEXTS value). Default 1. */
  count?: number;
}

export interface LeaseStats {
  held: number;
  waiting: number;
  peak: number;
  holders: EffectName[];
}

interface Holder {
  name: EffectName;
  rank: number;
  count: number;
  onYield?: () => void;
  onStepAside?: () => void;
  distance: () => number;
  asked: boolean;
}

interface Waiter {
  name: EffectName;
  rank: number;
  count: number;
  seq: number;
  onYield?: () => void;
  onStepAside?: () => void;
  distance: () => number;
  /** Read once per pump: the order must not shift while it is being used. */
  near: number;
  grant: (lease: Lease) => void;
}

const onScreen = () => 0;

const rankOf = (name: EffectName) => {
  const at = ALL_EFFECTS.indexOf(name);
  return at < 0 ? ALL_EFFECTS.length : at;
};

/** A pause long enough for a queued `webglcontextlost` task to run first. */
export const HANDOVER_MS = 60;

/**
 * How much farther from the reader than the waiter a holder must be before
 * it is asked to make room: two slots at about the same distance never trade
 * a context back and forth as the page creeps.
 */
export const ROOM_MARGIN_PX = 160;

export function createLeaseManager(
  cap: number = WEBGL_CAP,
  handoverMs: number = HANDOVER_MS,
  /** Waiters farther from the reader than this are kept waiting. */
  horizon: () => number = () => Number.POSITIVE_INFINITY,
) {
  const held = new Set<Holder>();
  let waiting: Waiter[] = [];
  /** Released leases still inside their handover pause: they count against the cap. */
  let cooling = 0;
  let peak = 0;
  let seq = 0;
  const listeners = new Set<(s: LeaseStats) => void>();

  /** Contexts covered by the leases out now. */
  let units = 0;
  const stats = (): LeaseStats => ({
    held: units,
    waiting: waiting.length,
    peak,
    holders: [...held].map((h) => h.name),
  });
  const tell = () => {
    const s = stats();
    listeners.forEach((fn) => fn(s));
  };
  /** Would this many more contexts fit under the cap right now? */
  const fits = (count: number) => units + cooling + count <= cap;

  function grant(next: Waiter) {
    const holder: Holder = {
      name: next.name,
      rank: next.rank,
      count: next.count,
      onYield: next.onYield,
      onStepAside: next.onStepAside,
      distance: next.distance,
      asked: false,
    };
    held.add(holder);
    units += holder.count;
    peak = Math.max(peak, units);
    let done = false;
    next.grant({
      name: next.name,
      release() {
        if (done) return;
        done = true;
        held.delete(holder);
        units -= holder.count;
        cooling += holder.count;
        tell();
        setTimeout(() => {
          cooling -= holder.count;
          pump();
        }, handoverMs);
      },
    });
  }

  /**
   * The best waiter is kept out by a full house: ask holders to make room,
   * until enough contexts are on their way back. First those off screen and
   * farther from the reader, farthest first; then, for a waiter on screen,
   * the humblest that can step aside. Each holder is asked once.
   */
  function makeRoom() {
    const best = waiting[0];
    if (!best || fits(best.count) || best.near > horizon()) return;
    let coming = [...held].filter((h) => h.asked).reduce((n, h) => n + h.count, 0);
    const ask = (h: Holder, how: (() => void) | undefined) => {
      h.asked = true;
      coming += h.count;
      how!();
    };
    const far = [...held]
      .filter((h) => !h.asked && (h.onStepAside || h.onYield))
      .map((h) => ({ h, d: h.distance() }))
      .filter(({ d }) => d > 0 && d > best.near + ROOM_MARGIN_PX)
      .sort((a, b) => b.d - a.d);
    for (const { h } of far) {
      if (fits(best.count - coming)) return;
      ask(h, h.onStepAside ?? h.onYield);
    }
    if (best.near > 0) return;
    const humble = [...held]
      .filter((h) => !h.asked && h.onYield && h.rank > best.rank)
      .sort((a, b) => b.rank - a.rank);
    for (const h of humble) {
      if (fits(best.count - coming)) return;
      ask(h, h.onYield);
    }
  }

  function pump() {
    // The reader moves: read each waiter's distance once, then order the
    // queue nearest first, by priority within the same distance.
    for (const w of waiting) w.near = w.distance();
    waiting.sort((a, b) => a.near - b.near || a.rank - b.rank || a.seq - b.seq);
    // Strictly in queue order: a big lease at the head is not overtaken by
    // smaller ones behind it, so it can never starve.
    const far = horizon();
    while (waiting.length && waiting[0].near <= far && fits(waiting[0].count)) grant(waiting.shift()!);
    makeRoom();
    tell();
  }

  function acquire(name: EffectName, opts: AcquireOptions = {}): Promise<Lease> {
    const { signal, onYield, onStepAside } = opts;
    const distance = opts.distance ?? onScreen;
    // A lease larger than the cap could never be granted; it takes the whole cap.
    const count = Math.max(1, Math.min(cap, Math.round(opts.count ?? 1)));
    return new Promise<Lease>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException("aborted", "AbortError"));
        return;
      }
      const onAbort = () => {
        const before = waiting.length;
        waiting = waiting.filter((w) => w !== waiter);
        if (waiting.length === before) return;
        reject(new DOMException("aborted", "AbortError"));
        // The head of the queue may have changed: someone behind may fit now.
        pump();
      };
      const waiter: Waiter = {
        name,
        rank: rankOf(name),
        count,
        seq: seq++,
        onYield,
        onStepAside,
        distance,
        near: 0,
        grant: (lease) => {
          signal?.removeEventListener("abort", onAbort);
          resolve(lease);
        },
      };
      signal?.addEventListener("abort", onAbort, { once: true });
      waiting.push(waiter);
      pump();
    });
  }

  return {
    acquire,
    stats,
    /**
     * Look at the queue again: the reader has scrolled, so who is nearest,
     * and who is now far enough behind to make room, may have changed.
     */
    reconsider: pump,
    /** Watch the counts (the debug ledger does). Returns the unsubscribe. */
    watch(fn: (s: LeaseStats) => void): () => void {
      listeners.add(fn);
      fn(stats());
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

export type LeaseManager = ReturnType<typeof createLeaseManager>;

/** The landing's one manager. */
export const leases: LeaseManager = createLeaseManager(WEBGL_CAP, HANDOVER_MS, () =>
  typeof window === "undefined" ? Number.POSITIVE_INFINITY : window.innerHeight,
);

/**
 * Give a lease back once every canvas it covered has really lost its
 * context, or after `fallbackMs` for a canvas that never had one or a
 * library that drops it late (React Three Fiber forces the loss 500 ms
 * after unmount).
 */
export function releaseAfterLoss(
  lease: Lease,
  canvases: Iterable<HTMLCanvasElement>,
  lost: WeakSet<HTMLCanvasElement>,
  fallbackMs = 1200,
): void {
  const pending = [...canvases].filter((c) => !lost.has(c));
  if (pending.length === 0) {
    lease.release();
    return;
  }
  let left = pending.length;
  const timer = setTimeout(() => lease.release(), fallbackMs);
  const one = () => {
    left -= 1;
    if (left > 0) return;
    clearTimeout(timer);
    lease.release();
  };
  for (const c of pending) c.addEventListener("webglcontextlost", one, { once: true });
}
