import { useEffect, useRef } from "react";
import type { EffectProps } from "./EffectSlot";
import { alpha, chart, ink } from "../tokens";

/**
 * Effect 0 — the living ground. The sheet's depth contours, breathing.
 *
 * Thirty-odd isobath lines drawn on a 2D canvas, each a sum of three slow
 * sines, under a wash of marine ink pooling like the wordmark's wet ink, so
 * the whole page lies on water that is faintly swelling. Lines and washes in
 * the chart's own inks at blotting-paper opacity: the page stays paper. A 2D context, not WebGL, so it costs nothing against the
 * landing's three-context cap, and at rest between frames it costs nothing
 * at all (24 fps, paused off-tab and when the slot says so).
 *
 * The poster is the page as it already is: the static ground furniture.
 */

const LINES = 34;
const FPS = 24;
const DPR_CAP = 1.5;

/**
 * The ink wash: a few slow plumes of marine ink pooling under the engraved
 * lines, the way the wordmark's wet ink pools in its letters. Each is one
 * radial gradient on a drifting Lissajous path, multiplied onto the paper at
 * wash opacity, so the ground darkens like wet paper and never covers it.
 */
const PLUMES: { tint: "ink" | "deep" | "teal"; bx: number; r: number; ax: number; ay: number; px: number; py: number; vx: number; vy: number; peak: number }[] = [
  // `bx` anchors a plume's drift: the ink leans left, where the wash is deepest
  { tint: "ink", bx: 0.3, r: 0.52, ax: 0.26, ay: 0.22, px: 0.8, py: 2.1, vx: 0.030, vy: 0.024, peak: 0.13 },
  { tint: "deep", bx: 0.4, r: 0.42, ax: 0.3, ay: 0.26, px: 3.7, py: 0.4, vx: 0.023, vy: 0.033, peak: 0.11 },
  { tint: "teal", bx: 0.64, r: 0.62, ax: 0.24, ay: 0.3, px: 5.2, py: 4.0, vx: 0.019, vy: 0.027, peak: 0.10 },
  { tint: "ink", bx: 0.26, r: 0.38, ax: 0.3, ay: 0.2, px: 2.4, py: 5.6, vx: 0.034, vy: 0.020, peak: 0.10 },
];

/** The standing wash: the sheet is always darkest at its left edge. */
const LEFT_WASH = 0.16;

/** Per-line phase seeds, fixed so the field is stable across resizes. */
function seed(i: number): [number, number, number] {
  return [i * 0.37, 1.7 - i * 0.22, i * 0.61 + 0.4];
}

export default function GroundSwell({ active, onReady, onFail }: EffectProps) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const callbacks = useRef({ onReady, onFail });
  // The slot says when nobody is looking: the water holds its last frame.
  const activeRef = useRef(active);
  useEffect(() => {
    callbacks.current = { onReady, onFail };
    activeRef.current = active;
  });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      callbacks.current.onFail();
      el.removeChild(canvas);
      return;
    }

    const still = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      w = el.clientWidth;
      h = el.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // the wash first, so the engraving prints over wet paper
      ctx.globalCompositeOperation = "multiply";
      // the standing left-edge wash breathes a little but never leaves
      const standing = ctx.createLinearGradient(0, 0, w * 0.62, 0);
      const breath = LEFT_WASH * (0.88 + 0.12 * Math.sin(t * 0.04 * Math.PI * 2));
      standing.addColorStop(0, alpha(ink[900], breath));
      standing.addColorStop(0.55, alpha(ink[900], breath * 0.35));
      standing.addColorStop(1, alpha(ink[900], 0));
      ctx.fillStyle = standing;
      ctx.fillRect(0, 0, w * 0.62, h);
      const span = Math.max(w, h);
      for (const p of PLUMES) {
        const cx = (p.bx + p.ax * Math.sin(t * p.vx * Math.PI * 2 + p.px)) * w;
        const cy = (0.5 + p.ay * Math.sin(t * p.vy * Math.PI * 2 + p.py)) * h;
        const r = p.r * span * (0.85 + 0.15 * Math.sin(t * 0.05 * Math.PI * 2 + p.px + p.py));
        const colour = p.tint === "ink" ? ink[900] : p.tint === "deep" ? chart[700] : chart[500];
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, alpha(colour, p.peak));
        g.addColorStop(0.55, alpha(colour, p.peak * 0.45));
        g.addColorStop(1, alpha(colour, 0));
        ctx.fillStyle = g;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      const step = 14;
      for (let i = 0; i < LINES; i++) {
        const d = i / (LINES - 1);
        // lines bunch a little toward the middle of the sheet, like a shelf
        const ease = d * d * (3 - 2 * d);
        const baseY = (0.03 + 0.94 * ease) * h;
        const amp = 5 + 22 * Math.sin(Math.PI * d);
        const [p1, p2, p3] = seed(i);
        const index = i % 5 === 0; // every fifth is an index contour, as on a chart
        ctx.strokeStyle = alpha(chart[500], index ? 0.2 : 0.12);
        ctx.lineWidth = index ? 1.2 : 1;
        ctx.beginPath();
        for (let x = -step; x <= w + step; x += step) {
          const y =
            baseY +
            amp *
              (0.55 * Math.sin((x / w) * 4.1 + p1 + t * 0.14) +
                0.3 * Math.sin((x / w) * 11.7 + p2 - t * 0.09) +
                0.15 * Math.sin((x / w) * 29 + p3 + t * 0.21));
          if (x < 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (!ready.current) {
        ready.current = true;
        callbacks.current.onReady();
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 1000 / FPS) return;
      last = now;
      // The slot's `active` and the tab's visibility gate every frame; the
      // rAF itself is near-free while the guard holds the last frame.
      if (document.hidden || !activeRef.current) return;
      draw(now / 1000);
    };

    fit();
    draw(0);
    if (!still) raf = requestAnimationFrame(tick);
    const onResize = () => {
      fit();
      draw(last / 1000);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeChild(canvas);
    };
    // Mount work runs once; `activeRef` gates the frames above.
  }, []);

  return <div ref={host} className="ground-fill" data-ground />;
}
