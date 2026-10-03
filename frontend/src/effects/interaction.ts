/**
 * The visitor's first interaction with the page: the moment a slot armed on
 * "interaction" (EffectSlot's `armOn`) may start its way to the effect.
 */

/** What counts as the first interaction. */
const INTERACTIONS = ["pointermove", "wheel", "scroll", "touchstart", "keydown"] as const;
let interacted = false;
let interactedAt = 0;
let listening = false;
const waiting = new Set<() => void>();

/**
 * Call `cb` once the visitor has first moved, scrolled, touched or typed
 * (at once if they already have). One set of passive listeners serves the
 * whole page and removes itself on the first event. Returns the unsubscribe.
 */
export function onFirstInteraction(cb: () => void): () => void {
  if (interacted || typeof window === "undefined") {
    cb();
    return () => {};
  }
  if (!listening) {
    listening = true;
    const fire = () => {
      interacted = true;
      interactedAt = performance.now();
      listening = false;
      INTERACTIONS.forEach((type) => window.removeEventListener(type, fire, { capture: true }));
      const all = [...waiting];
      waiting.clear();
      all.forEach((fn) => fn());
    };
    INTERACTIONS.forEach((type) => window.addEventListener(type, fire, { capture: true, passive: true }));
  }
  waiting.add(cb);
  return () => {
    waiting.delete(cb);
  };
}

/** Whether the first interaction has happened. */
export function hasInteracted(): boolean {
  return interacted;
}

/** Milliseconds since the first interaction; -1 before it. */
export function sinceFirstInteraction(): number {
  return interacted ? performance.now() - interactedAt : -1;
}
