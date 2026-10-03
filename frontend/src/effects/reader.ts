/**
 * Where the reader is, for the landing's effect slots (EffectSlot.tsx): how
 * far a slot is from the screen, which way the page is heading, and the
 * queue that fetches effects' code ahead of the reader.
 */

/* ------------------------------------------------------- where the reader is */

/** The way the page last scrolled: 1 down the page, -1 up it. */
let heading: 1 | -1 = 1;
let headingFrom: number | null = null;
export function followHeading() {
  if (headingFrom != null || typeof window === "undefined") return;
  headingFrom = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (headingFrom != null && y !== headingFrom) heading = y > headingFrom ? 1 : -1;
      headingFrom = y;
    },
    { passive: true },
  );
}

/**
 * How far an element is from the reader, in CSS pixels: 0 while any of it is
 * on screen. Ahead (the way the page is scrolling) it is the gap to the
 * screen; behind, that gap plus a whole screen, so the section the reader is
 * heading for wins a context from the one just left behind.
 */
export function distanceFromReader(el: Element): number {
  const r = el.getBoundingClientRect();
  // a box that is not laid out (no size) is not anywhere: count it as here
  if (r.width === 0 && r.height === 0) return 0;
  const vh = window.innerHeight;
  if (r.bottom > 0 && r.top < vh) return 0;
  const below = r.top >= vh;
  const gap = below ? r.top - vh : -r.bottom;
  return (below ? heading < 0 : heading > 0) ? gap + vh : gap;
}

/* ------------------------------------------------------ fetching ahead of time */

export interface Fetchable {
  preload: () => Promise<unknown>;
  distance: () => number;
}
const toFetch = new Set<Fetchable>();
let fetching = false;

/**
 * After the visitor's first move, the code of every effect this page may run
 * is fetched in the background, nearest the reader first, one chunk at a time
 * in idle time: by the time a section is a screen away, its effect is here.
 */
export function fetchAhead() {
  if (fetching || toFetch.size === 0 || typeof window === "undefined") return;
  fetching = true;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  };
  const later = (fn: () => void) =>
    w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout: 2000 }) : window.setTimeout(fn, 200);
  const next = () => {
    let best: Fetchable | null = null;
    let nearest = Number.POSITIVE_INFINITY;
    for (const f of toFetch) {
      const d = f.distance();
      if (best == null || d < nearest) {
        best = f;
        nearest = d;
      }
    }
    if (!best) {
      fetching = false;
      return;
    }
    toFetch.delete(best);
    best.preload().then(
      () => later(next),
      () => later(next),
    );
  };
  later(next);
}

/** Queue an effect's code to be fetched ahead of the reader. Returns the withdrawal. */
export function fetchSoon(entry: Fetchable): () => void {
  toFetch.add(entry);
  return () => {
    toFetch.delete(entry);
  };
}
