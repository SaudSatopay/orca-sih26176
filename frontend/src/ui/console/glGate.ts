import { readEffectEnv, type EffectEnv } from "../../effects/gate";

/**
 * Who gets a WebGL decoration on the console.
 *
 * The console's two WebGL pieces (the System sheet's contour band, the Ask
 * sheet's radar sweep) are decoration on a sheet that is already complete
 * without them. They follow the landing's effects contract: a wide desktop
 * window with a fine pointer, no reduced motion, no data saver, WebGL
 * working, and `?fx=none` switches them off. The phone never sees them (its
 * chunk graph does not reach this file). The two never share a sheet, so the
 * console holds at most one live context at a time.
 */
export function consoleGlAllowed(
  env: Pick<EffectEnv, "wide" | "finePointer" | "reducedMotion" | "saveData" | "webgl">,
): boolean {
  return env.wide && env.finePointer && !env.reducedMotion && !env.saveData && env.webgl;
}

let cached: boolean | null = null;

/**
 * Read once per page load. The cheap media checks go first, so a narrow or
 * touch window never opens the throwaway context that probes for WebGL.
 */
export function consoleGlHere(): boolean {
  if (cached != null) return cached;
  const mq = (q: string) => typeof window !== "undefined" && !!window.matchMedia?.(q).matches;
  if (!mq("(min-width: 1024px)") || !mq("(hover: hover) and (pointer: fine)")) return (cached = false);
  return (cached = consoleGlAllowed(readEffectEnv()));
}

/** Test seam. */
export function forgetConsoleGl(): void {
  cached = null;
}

/** At most this many frames a second for a console decoration. */
export const GL_FPS = 30;
/** Device pixel ratio cap for a console decoration. */
export const GL_DPR = 1.5;

/**
 * Drives a decoration's frames: at most `GL_FPS` a second, and none at all
 * while `el` is off-screen or the tab is hidden. Returns the stop function.
 */
export function runWhileSeen(el: Element, draw: (seconds: number) => void): () => void {
  let raf = 0;
  let seen = true;
  let shown = !document.hidden;
  let last = -Infinity;
  const t0 = performance.now();
  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    if (t - last < 1000 / GL_FPS - 2) return;
    last = t;
    draw((t - t0) / 1000);
  };
  const start = () => {
    if (seen && shown && raf === 0) raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf !== 0) cancelAnimationFrame(raf);
    raf = 0;
  };
  const io = new IntersectionObserver(([e]) => {
    seen = e.isIntersecting;
    if (seen) start();
    else stop();
  });
  io.observe(el);
  const onVisibility = () => {
    shown = !document.hidden;
    if (shown) start();
    else stop();
  };
  document.addEventListener("visibilitychange", onVisibility);
  start();
  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/** `#RRGGBB` (a token) as 0–1 floats for a shader uniform. */
export function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
