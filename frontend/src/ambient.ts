import { useEffect } from "react";

/**
 * The motion budget for everything that loops forever.
 *
 * The sea drifts, buoys bob, the needle sways, signals travel: about twenty
 * ambient loops, all of them CSS. They belong to the chart, but they must be
 * cheap and polite, so two marks switch them off (the rules are in index.css):
 *
 * - `data-ambient="paused"` on the root element while the tab is hidden, as a
 *   readable mark of what the watcher decided;
 * - `data-offscreen` on a looping element while it is outside the viewport,
 *   and on every loop while the tab is hidden.
 *
 * Both only set `animation-play-state`, so a loop picks up where it stopped.
 * Only loops are paused: entrances and the board's countdown keep their own
 * time whatever the tab is doing.
 */

/** Every class that carries an infinite loop. */
export const AMBIENT_SELECTOR = [
  ".sea-drift",
  ".fish-drift",
  ".wave-rule",
  ".compass-needle",
  ".swim",
  ".svg-bob",
  ".svg-ping",
  ".pulse-dot",
  ".v-connector",
  ".v-draft",
  ".m-draft-ring",
  ".storm-spin",
  ".bob",
  ".roll",
  "path.route-live",
  "path.radius-drift",
  // the vendored UI kit (src/ui)
  ".animate-marquee",
  ".animate-marquee-vertical",
  ".animate-ripple",
  ".border-beam-spin",
].join(",");

/**
 * Starts watching `doc` and returns the function that stops it. Elements that
 * arrive later (a new view, Leaflet markers) are picked up as they are added.
 */
export function watchAmbientMotion(doc: Document = document): () => void {
  const root = doc.documentElement;

  /** What the observer last said about each loop: true when it is outside the viewport. */
  const outside = new Map<Element, boolean>();
  // A loop rests when the tab is hidden or the loop itself is off-screen.
  const mark = (el: Element) =>
    el.toggleAttribute("data-offscreen", doc.hidden || outside.get(el) === true);

  const onVisibility = () => {
    if (doc.hidden) root.setAttribute("data-ambient", "paused");
    else root.removeAttribute("data-ambient");
    outside.forEach((_, el) => mark(el));
  };
  onVisibility();
  doc.addEventListener("visibilitychange", onVisibility);

  // Without IntersectionObserver (old browsers, jsdom) the loops simply run.
  const view = doc.defaultView;
  const Observer = view?.IntersectionObserver;
  const Mutations = view?.MutationObserver;
  if (!Observer || !Mutations) {
    return () => {
      doc.removeEventListener("visibilitychange", onVisibility);
      root.removeAttribute("data-ambient");
    };
  }

  const io = new Observer(
    (entries) => {
      for (const e of entries) {
        outside.set(e.target, !e.isIntersecting);
        mark(e.target);
      }
    },
    // a little early, so a loop is already moving as it scrolls into view
    { rootMargin: "80px" },
  );

  const watch = (el: Element) => {
    if (outside.has(el)) return;
    outside.set(el, false);
    mark(el);
    io.observe(el);
  };
  const scan = (node: ParentNode) => node.querySelectorAll(AMBIENT_SELECTOR).forEach(watch);
  scan(doc);

  const mo = new Mutations((records) => {
    for (const r of records) {
      r.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        const el = n as Element;
        if (el.matches(AMBIENT_SELECTOR)) watch(el);
        scan(el);
      });
      r.removedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        for (const el of [...outside.keys()]) {
          if (n === el || n.contains(el)) {
            io.unobserve(el);
            outside.delete(el);
          }
        }
      });
    }
  });
  mo.observe(doc.body, { childList: true, subtree: true });

  return () => {
    doc.removeEventListener("visibilitychange", onVisibility);
    mo.disconnect();
    io.disconnect();
    outside.forEach((_, el) => el.removeAttribute("data-offscreen"));
    outside.clear();
    root.removeAttribute("data-ambient");
  };
}

/** Mount once, at the top of an app. */
export function useAmbientMotion(): void {
  useEffect(() => watchAmbientMotion(), []);
}
