import type { EffectName } from "./gate";
import { leases, type LeaseStats } from "./contexts";

/**
 * A small ledger the sensors read: which effect is in which state, and how
 * many WebGL contexts the page has opened. It exists so the rule "at most
 * three live WebGL contexts on the landing" is measured, not assumed.
 *
 *   window.__orcaFx = {
 *     effects: { relief: "live", … },
 *     contexts: { opened, lost, live, peak },   // counted at getContext
 *     leases: { held, waiting, peak, holders }, // contexts.ts
 *   }
 *
 * `contexts.peak` is the most live contexts the page has held at any instant
 * since it opened: the number the cap is checked against.
 *
 * The counts are only kept when the page was opened with `?fxdebug=1`:
 * they work by wrapping `getContext`, which has no business running for
 * visitors.
 */

export type EffectState = "poster" | "waiting" | "loading" | "live" | "failed";

interface Ledger {
  effects: Partial<Record<EffectName, EffectState>>;
  contexts: { opened: number; lost: number; live: number; peak: number } | null;
  leases?: LeaseStats;
  frames?: Partial<Record<EffectName, number>>;
}

declare global {
  interface Window {
    __orcaFx?: Ledger;
  }
}

function ledger(): Ledger | null {
  if (typeof window === "undefined") return null;
  window.__orcaFx ??= { effects: {}, contexts: null };
  return window.__orcaFx;
}

export function noteEffect(name: EffectName, state: EffectState): void {
  const l = ledger();
  if (l) l.effects[name] = state;
}

/**
 * Count one drawn frame for `name` (only under `?fxdebug=1`, when the
 * context tally is on): the sensors check that an effect at rest draws none.
 */
export function noteFrame(name: EffectName): void {
  const l = typeof window === "undefined" ? null : window.__orcaFx;
  if (!l?.contexts) return;
  l.frames ??= {};
  l.frames[name] = (l.frames[name] ?? 0) + 1;
}

/** Call before any effect mounts. Counts every WebGL context opened after it. */
export function countContexts(): void {
  const l = ledger();
  if (!l || l.contexts) return;
  if (!new URLSearchParams(window.location.search).has("fxdebug")) return;
  const tally = { opened: 0, lost: 0, live: 0, peak: 0 };
  l.contexts = tally;
  leases.watch((s) => {
    l.leases = s;
  });
  const seen = new WeakSet<HTMLCanvasElement>();
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...rest: unknown[]) {
    const ctx = (original as (...a: unknown[]) => unknown).call(this, kind, ...rest);
    if (ctx && /^(webgl2?|experimental-webgl)$/.test(kind) && !seen.has(this)) {
      seen.add(this);
      tally.opened += 1;
      tally.live += 1;
      tally.peak = Math.max(tally.peak, tally.live);
      this.addEventListener("webglcontextlost", () => {
        tally.lost += 1;
        tally.live -= 1;
      });
    }
    return ctx;
  } as typeof HTMLCanvasElement.prototype.getContext;
}
