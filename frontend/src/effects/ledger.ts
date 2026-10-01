import type { EffectName } from "./gate";

/**
 * A small ledger the sensors read: which effect is in which state, and how
 * many WebGL contexts the page has opened. It exists so the rule "at most
 * three live WebGL contexts on the landing" is measured, not assumed.
 *
 *   window.__orcaFx = { effects: { relief: "live", … }, contexts: { opened, lost, live } }
 *
 * The context count is only kept when the page was opened with `?fxdebug=1`:
 * it works by wrapping `getContext`, which has no business running for
 * visitors.
 */

export type EffectState = "poster" | "waiting" | "loading" | "live" | "failed";

interface Ledger {
  effects: Partial<Record<EffectName, EffectState>>;
  contexts: { opened: number; lost: number; live: number } | null;
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

/** Call before any effect mounts. Counts every WebGL context opened after it. */
export function countContexts(): void {
  const l = ledger();
  if (!l || l.contexts) return;
  if (!new URLSearchParams(window.location.search).has("fxdebug")) return;
  const tally = { opened: 0, lost: 0, live: 0 };
  l.contexts = tally;
  const seen = new WeakSet<HTMLCanvasElement>();
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...rest: unknown[]) {
    const ctx = (original as (...a: unknown[]) => unknown).call(this, kind, ...rest);
    if (ctx && /^(webgl2?|experimental-webgl)$/.test(kind) && !seen.has(this)) {
      seen.add(this);
      tally.opened += 1;
      tally.live += 1;
      this.addEventListener("webglcontextlost", () => {
        tally.lost += 1;
        tally.live -= 1;
      });
    }
    return ctx;
  } as typeof HTMLCanvasElement.prototype.getContext;
}
