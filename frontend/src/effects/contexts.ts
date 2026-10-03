import { ALL_EFFECTS, WEBGL_CAP, type EffectName } from "./gate";

/**
 * WebGL context leases: the landing's cap of three live contexts as a
 * guarantee, not an arithmetic accident.
 *
 * Every effect that opens a WebGL context first takes a lease and gives it
 * back only once its context is lost. While `cap` leases are out, the next
 * asker waits; waiters are served by priority (their place in ALL_EFFECTS),
 * first come first served within one effect.
 *
 * A holder may say it can step aside (`onYield`). When a higher-priority
 * effect is kept waiting, the lowest-priority holder that can step aside is
 * asked to, once; it lets go when it is ready (the splash waits for its ink
 * to fade) and queues again behind the one it made room for.
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
  asked: boolean;
}

interface Waiter {
  name: EffectName;
  rank: number;
  count: number;
  seq: number;
  onYield?: () => void;
  grant: (lease: Lease) => void;
}

const rankOf = (name: EffectName) => {
  const at = ALL_EFFECTS.indexOf(name);
  return at < 0 ? ALL_EFFECTS.length : at;
};

/** A pause long enough for a queued `webglcontextlost` task to run first. */
export const HANDOVER_MS = 60;

export function createLeaseManager(cap: number = WEBGL_CAP, handoverMs: number = HANDOVER_MS) {
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
    const holder: Holder = { name: next.name, rank: next.rank, count: next.count, onYield: next.onYield, asked: false };
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
   * The best waiter is kept out by a full house: ask the humblest holders
   * that can step aside, fewest first, until enough contexts are on their
   * way back. Each holder is asked once.
   */
  function askToYield() {
    const best = waiting[0];
    if (!best || fits(best.count)) return;
    const humble = [...held]
      .filter((h) => h.onYield && h.rank > best.rank)
      .sort((a, b) => b.rank - a.rank);
    let coming = humble.filter((h) => h.asked).reduce((n, h) => n + h.count, 0);
    for (const h of humble) {
      if (fits(best.count - coming)) return;
      if (h.asked) continue;
      h.asked = true;
      coming += h.count;
      h.onYield!();
    }
  }

  function pump() {
    // Strictly in queue order: a big lease at the head is not overtaken by
    // smaller ones behind it, so it can never starve.
    while (waiting.length && fits(waiting[0].count)) grant(waiting.shift()!);
    askToYield();
    tell();
  }

  function acquire(name: EffectName, opts: AcquireOptions = {}): Promise<Lease> {
    const { signal, onYield } = opts;
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
        grant: (lease) => {
          signal?.removeEventListener("abort", onAbort);
          resolve(lease);
        },
      };
      signal?.addEventListener("abort", onAbort, { once: true });
      waiting.push(waiter);
      waiting.sort((a, b) => a.rank - b.rank || a.seq - b.seq);
      pump();
    });
  }

  return {
    acquire,
    stats,
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
export const leases: LeaseManager = createLeaseManager();

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
