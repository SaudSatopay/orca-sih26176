import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { effectsHere } from "./gate";
import { noteEffect, type EffectState } from "./ledger";
import "./glass.css";

/**
 * Effect 3 — the chart loupe (liquid-glass-js) under a real control.
 *
 * The children are the control and stay the control: the same DOM elements,
 * roles, focus ring, keys and handlers. The lens is an `aria-hidden` layer
 * laid under them, so the accessibility tree does not change. Until the lens
 * has drawn, and for everyone the gate turns away, this component renders
 * its children and nothing else.
 *
 * The lens refracts ONE still picture of the page (html2canvas), so it is
 * mounted only after the fonts are in and the hero has settled, and it is
 * taken down and laid again when the window is resized.
 *
 * `id` names the loupe: "tabs" (the hero's question tabs) or "open" (the
 * primary action). Each live loupe holds one WebGL context.
 */

/** The loupes that run when the glass effect is on. `?fxloupe=tabs,open` overrides it for a trial. */
const SHIPPED_LOUPES: readonly string[] = ["tabs"];

/** After load and fonts: long enough for the hero's entrance to have landed. */
const SETTLE_MS = 1200;

function loupesHere(): readonly string[] {
  if (typeof window === "undefined") return [];
  if (!effectsHere().includes("glass")) return [];
  const raw = new URLSearchParams(window.location.search).get("fxloupe");
  return raw == null ? SHIPPED_LOUPES : raw.split(",").map((s) => s.trim().toLowerCase());
}

// One ledger entry for however many loupes there are: the furthest any has got.
const states = new Map<string, EffectState>();
const ORDER: readonly EffectState[] = ["live", "loading", "waiting", "failed", "poster"];
function note(id: string, state: EffectState | null) {
  if (state) states.set(id, state);
  else states.delete(id);
  const all = [...states.values()];
  noteEffect("glass", ORDER.find((s) => all.includes(s)) ?? "poster");
}

/** The controls that sit on a lens: the snapshot leaves them out, or each would be refracted under itself. */
const controls = new Set<Element>();

interface GlassDebug {
  snapshotMs: number | null;
  snapshot: HTMLCanvasElement | null;
}

/** Lay the host exactly over the control; glass.css grows it by the loupe's rim. */
function place(host: HTMLElement, control: HTMLElement) {
  host.style.left = `${control.offsetLeft}px`;
  host.style.top = `${control.offsetTop}px`;
  host.style.width = `${control.offsetWidth}px`;
  host.style.height = `${control.offsetHeight}px`;
}

/** The snapshot stops just below the lowest lens: the landing is five screens tall and the lenses are on the first. */
function snapshotHeight(): number {
  let bottom = 0;
  controls.forEach((el) => {
    bottom = Math.max(bottom, el.getBoundingClientRect().bottom + window.scrollY);
  });
  return Math.ceil(Math.max(bottom, window.innerHeight));
}

function afterLoadAndFonts(): Promise<void> {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((done) => window.addEventListener("load", () => done(), { once: true }));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  return Promise.all([loaded, fonts]).then(() => undefined);
}

export default function GlassLoupe({ id, children }: { id: string; children: ReactNode }) {
  const may = useMemo(() => loupesHere().includes(id), [id]);
  const host = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const [failed, setFailed] = useState(false);
  const on = may && !failed;

  useEffect(() => {
    note(id, !may ? "poster" : failed ? "failed" : "waiting");
    return () => note(id, null);
  }, [id, may, failed]);

  // The control is known from the first render, so every loupe's control is
  // left out of the snapshot whichever lens asks for it first.
  useLayoutEffect(() => {
    const control = host.current?.nextElementSibling;
    if (!on || !control) return;
    controls.add(control);
    return () => {
      controls.delete(control);
    };
  }, [on]);

  // Arm after load, fonts and the hero's entrance; disarm on resize (the
  // snapshot is of the old layout) and arm again once the window is still.
  useEffect(() => {
    if (!on) return;
    let timer: number | undefined;
    let gone = false;
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => !gone && setArmed(true), SETTLE_MS);
    };
    void afterLoadAndFonts().then(() => !gone && arm());
    const onResize = () => {
      setArmed(false);
      arm();
    };
    window.addEventListener("resize", onResize);
    return () => {
      gone = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [on]);

  // The lens itself.
  useEffect(() => {
    const el = host.current;
    const control = el?.nextElementSibling;
    if (!on || !armed || !el || !(control instanceof HTMLElement)) return;
    let gone = false;
    let teardown: (() => void) | undefined;
    note(id, "loading");
    place(el, control);

    const fail = () => {
      if (gone) return;
      teardown?.();
      setFailed(true);
    };

    // The vendored module and html2canvas are their own chunks, asked for
    // only here: a phone, or a desktop without the effect, never fetches them.
    Promise.all([import("../vendor/liquid-glass/index.js"), import("html2canvas")])
      .then(([{ Container }]) => {
        if (gone) return;
        Container.ignore = controls;
        Container.snapshotOptions = () => ({ height: snapshotHeight() });

        const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        const lens = new Container({
          type: "rounded",
          borderRadius: radius,
          // No tint: the library's tint is its own white-to-grey, not a token.
          tintOpacity: 0,
          controls: { blurRadius: 3, edgeIntensity: 0.006, rimIntensity: 0.03, cornerBoost: 0.01, rippleEffect: 0.04 },
          onReady: () => {
            if (gone) return;
            el.dataset.live = "1";
            note(id, "live");
            if (new URLSearchParams(window.location.search).has("fxdebug")) {
              (window as Window & { __orcaGlass?: GlassDebug }).__orcaGlass = {
                snapshotMs: Container.snapshotMs,
                snapshot: Container.pageSnapshot,
              };
            }
          },
          onFail: fail,
        });
        lens.canvas.addEventListener("webglcontextlost", fail);
        el.appendChild(lens.element);
        lens.updateSizeFromDOM();

        // The control changed size or moved within its parent: follow it.
        const follow = new ResizeObserver(() => {
          place(el, control);
          lens.updateSizeFromDOM();
          lens.render?.();
        });
        follow.observe(control);
        if (control.offsetParent) follow.observe(control.offsetParent);

        teardown = () => {
          follow.disconnect();
          lens.canvas.removeEventListener("webglcontextlost", fail);
          lens.dispose();
          delete el.dataset.live;
        };
      })
      .catch(fail);

    return () => {
      gone = true;
      teardown?.();
      if (states.has(id)) note(id, "waiting");
    };
  }, [id, on, armed]);

  return (
    <>
      {on && <span ref={host} className="orca-loupe" data-loupe={id} aria-hidden />}
      {children}
    </>
  );
}
