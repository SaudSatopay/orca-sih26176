import { useEffect, useRef, type RefObject } from "react";

/**
 * The night bands' shared engine room. Every band effect is one canvas and
 * one loop with the same manners, so they live here once:
 *
 *   - nothing is drawn while the slot says the band is out of view or the tab
 *     is hidden, and the loop is cancelled (zero frames at rest, not a guard
 *     inside a running rAF);
 *   - the clock only advances while drawing, so a band picks up where it
 *     stopped instead of jumping;
 *   - device pixel ratio capped at 1.5, at most 60 frames a second;
 *   - the first real frame calls `onReady`, a lost context calls `onFail`;
 *   - on unmount the context is released by hand (`WEBGL_lose_context`), so
 *     the landing's three-context budget is returned the moment a band goes.
 */

export const NIGHT_DPR_CAP = 1.5;
const FRAME_MS = 1000 / 60;

/** A token's `#RRGGBB` as the 0–1 triple a shader uniform takes. */
export function hexToVec3(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1, 7), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function nightDpr(): number {
  return Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, NIGHT_DPR_CAP);
}

export function prefersStill(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Give a WebGL context back to the browser now rather than at collection. */
export function releaseContext(gl: WebGLRenderingContext | WebGL2RenderingContext | null | undefined): void {
  try {
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    // already gone
  }
}

/** What an effect hands the stage: one canvas and how to draw and size it. */
export interface Scene {
  canvas: HTMLCanvasElement;
  /** `t` is seconds of drawn time, `dt` the step since the last frame. */
  draw: (t: number, dt: number) => void;
  /** The host's CSS box changed. */
  resize: (width: number, height: number) => void;
  /** Free buffers, listeners and the context. */
  dispose: () => void;
  /**
   * Keep drawing while active. A scene that settles (an entrance done, a
   * still sea) returns false and the loop sleeps until `wake` is called.
   */
  moving?: () => boolean;
  /**
   * True once a draw put the real picture on screen. A scene that waits for
   * something (a traced shape, a font) says so, and the poster stays until
   * it is true. Defaults to true after the first draw.
   */
  drawn?: () => boolean;
}

/**
 * Mount `create(host, wake)` once, then run it at the slot's word. `wake`
 * restarts the loop of a scene that sleeps between interactions.
 */
export function useNightScene(
  host: RefObject<HTMLElement>,
  { active, onReady, onFail }: { active: boolean; onReady: () => void; onFail: () => void },
  create: (host: HTMLElement, wake: () => void) => Scene | null,
): void {
  const callbacks = useRef({ onReady, onFail });
  const activeRef = useRef(active);
  const control = useRef<{ start: () => void; stop: () => void } | null>(null);
  useEffect(() => {
    callbacks.current = { onReady, onFail };
  });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let scene: Scene | null = null;
    try {
      scene = create(el, () => control.current?.start());
    } catch {
      scene = null;
    }
    if (!scene) {
      callbacks.current.onFail();
      return;
    }
    const s = scene;
    const still = prefersStill();
    let raf = 0;
    let last = 0;
    let clock = 0;
    let ready = false;
    let gone = false;

    const lost = (e: Event) => {
      e.preventDefault();
      if (gone) return;
      stop();
      callbacks.current.onFail();
    };
    s.canvas.addEventListener("webglcontextlost", lost);

    const frame = (now: number) => {
      raf = 0;
      if (gone || !activeRef.current) return;
      if (last && now - last < FRAME_MS - 2) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock += dt;
      s.draw(clock, dt);
      if (!ready && (s.drawn?.() ?? true)) {
        ready = true;
        // one more frame so the pixels are really on screen
        requestAnimationFrame(() => {
          if (!gone) callbacks.current.onReady();
        });
      }
      if (!still && (s.moving?.() ?? true)) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (gone || raf || !activeRef.current) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    control.current = { start, stop };

    const fit = () => {
      const r = el.getBoundingClientRect();
      s.resize(Math.max(1, Math.floor(r.width)), Math.max(1, Math.floor(r.height)));
      // a resized buffer is blank: draw once even if the scene had settled
      if (ready && activeRef.current && !raf) start();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    start();

    return () => {
      gone = true;
      stop();
      control.current = null;
      ro.disconnect();
      s.canvas.removeEventListener("webglcontextlost", lost);
      s.dispose();
      s.canvas.remove();
    };
    // Mount work runs once; `activeRef` gates every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeRef.current = active;
    if (active) control.current?.start();
    else control.current?.stop();
  }, [active]);
}

/** Seen from inside a slot: the band section the effect decorates. */
export function bandOf(el: HTMLElement): HTMLElement {
  return el.closest<HTMLElement>("[data-band]") ?? el;
}
