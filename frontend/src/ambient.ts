import { useEffect } from "react";

/**
 * The motion budget for everything that loops forever.
 *
 * The sea drifts, buoys bob, the needle sways, signals travel: about twenty
 * ambient loops, all of them CSS. They belong to the chart, but they must be
 * cheap and polite, so two marks switch them off (the rules are in index.css):
 *
 * - `data-ambient="paused"` on the root element while the tab is hidden;
 * - `data-offscreen` on a looping element while it is outside the viewport.
 *
 * Both only set `animation-play-state`, so a loop picks up where it stopped.
 */

/** Every class that carries an infinite loop. */
export const AMBIENT_SELECTOR = [
  ".sea-drift",
  ".fish-drift",
  ".wave-rule",
  ".compass-needle",
  ".swim",
  ".svg-swim",
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
].join(",");

/**
 * Starts watching `doc` and returns the function that stops it. Elements that
 * arrive later (a new view, Leaflet markers) are picked up as they are added.
 */
export function watchAmbientMotion(doc: Document = document): () => void {
  const root = doc.documentElement;

  const onVisibility = () => {
    if (doc.hidden) root.setAttribute("data-ambient", "paused");
    else root.removeAttribute("data-ambient");
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

  const watched = new Set<Element>();
  const io = new Observer(
    (entries) => {
      for (const e of entries) e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
    },
    // a little early, so a loop is already moving as it scrolls into view
    { rootMargin: "80px" },
  );

  const watch = (el: Element) => {
    if (watched.has(el)) return;
    watched.add(el);
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
        for (const el of watched) {
          if (n === el || n.contains(el)) {
            io.unobserve(el);
            watched.delete(el);
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
    watched.forEach((el) => el.removeAttribute("data-offscreen"));
    watched.clear();
    root.removeAttribute("data-ambient");
  };
}

/** Mount once, at the top of an app. */
export function useAmbientMotion(): void {
  useEffect(() => watchAmbientMotion(), []);
}
