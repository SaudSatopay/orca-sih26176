/**
 * Glow Cursor — https://reactbits.dev/animations/glow-cursor
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: bioluminescent plankton. A soft teal light trail that
 * follows the pointer inside the Night watch band ONLY — it listens on the
 * band, clamps to the band's box and fades when the pointer leaves or rests;
 * the page cursor belongs to another effect. Changes from the original:
 * token colours (chart-300 head, chart-500 tail); no white hotspot and a
 * capped peak (45 percent) so the brightest trail pixel still leaves the
 * band's chart-100 and paper-50 copy at 4.5:1 or better; no film grain; the
 * loop sleeps once the trail has faded (zero frames while the pointer is
 * still), and the shared night stage (nightGl.ts) gives it the slot's
 * active flag and the DPR cap.
 *
 * Drawn on a 2D canvas, not WebGL: the trail is a few dozen strokes, and the
 * landing's three WebGL contexts are worth more to the sections around it
 * (EffectSlot draws those a screen ahead of the reader). The original's
 * light field is kept: each stroke is light (its colour scaled by the
 * trail's life at that point) laid down with `lighten`, so where strokes
 * cross the brightest wins, as in the shader's `strongest`; a wide stroke
 * pass, blurred, is the glow; the slot is screened onto the band (index.css),
 * so the trail only ever adds light.
 */
import { useRef } from "react";
import type { EffectProps } from "./EffectSlot";
import { chart } from "../tokens";
import { bandOf, hexToVec3, nightDpr, useNightScene } from "./nightGl";

const POINTS = 48;

const PLANKTON = {
  color: chart[300],
  secondaryColor: chart[500],
  trailLength: 40,
  trailWidth: 10,
  trailTaper: 0.85,
  followSpeed: 0.14,
  glowIntensity: 1.4,
  glowSpread: 1.3,
  /** The peak strength of the trail's light over the ink ground. */
  opacity: 0.45,
  pulseSpeed: 0.8,
  idleTimeout: 900,
  fadeDuration: 1100,
} as const;

/** The glow layer is blurred anyway: half the pixels draw it just as well. */
const GLOW_SCALE = 0.5;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export default function GlowCursor(props: EffectProps) {
  const host = useRef<HTMLDivElement>(null);
  useNightScene(host, props, (el, wake) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const glowCanvas = document.createElement("canvas");
    const glow = glowCanvas.getContext("2d");
    if (!ctx || !glow) return null;
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { display: "block", width: "100%", height: "100%", opacity: "0" });
    el.appendChild(canvas);
    /** Canvas filters (blur) are missing in older engines: the glow is then a wide, dim stroke. */
    const blurs = typeof ctx.filter === "string";

    const head3 = hexToVec3(PLANKTON.color);
    const tail3 = hexToVec3(PLANKTON.secondaryColor);
    /** The trail's light at `progress` (0 head, 1 tail), scaled by `k`. */
    const light = (progress: number, k: number) => {
      const c = [0, 1, 2].map((i) => Math.round(clamp(mix(head3[i], tail3[i], progress) * k, 0, 1) * 255));
      return `rgb(${c[0]} ${c[1]} ${c[2]})`;
    };

    const points = Array.from({ length: POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    let dpr = 1;
    let seeded = false;
    let inside = false;
    let fade = 0;
    let lastInput = 0;

    // The band, not the window: the trail lives and dies at its edges.
    const band = bandOf(el);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const r = el.getBoundingClientRect();
      const x = clamp(e.clientX - r.left, 0, r.width);
      const y = clamp(e.clientY - r.top, 0, r.height);
      if (!seeded) {
        for (const p of points) {
          p.x = x;
          p.y = y;
        }
        head.x = x;
        head.y = y;
        seeded = true;
      }
      target.x = x;
      target.y = y;
      inside = true;
      lastInput = performance.now();
      wake();
    };
    const onLeave = () => {
      inside = false;
      lastInput = performance.now();
      wake();
    };
    band.addEventListener("pointermove", onMove);
    band.addEventListener("pointerenter", onMove);
    band.addEventListener("pointerleave", onLeave);

    /**
     * Lay the trail down as light: one stroke per link, its width tapering
     * and its light falling off toward the tail, pulsing gently along it.
     */
    const strokeTrail = (c: CanvasRenderingContext2D, t: number, widen: number, strength: number) => {
      const n = PLANKTON.trailLength;
      const taper = PLANKTON.trailTaper;
      c.globalCompositeOperation = "lighten";
      c.lineCap = "round";
      c.lineJoin = "round";
      for (let i = 0; i < n - 1; i++) {
        const progress = i / (n - 1);
        const life = Math.pow(1 - progress, mix(0.55, 1.25, taper));
        const pulse = 1 + Math.sin(t * PLANKTON.pulseSpeed * 3 - progress * 11) * 0.12;
        const w = PLANKTON.trailWidth * mix(1, 0.25, Math.pow(progress, mix(0.55, 1.6, taper)));
        c.strokeStyle = light(progress, clamp(life * pulse * strength, 0, 1));
        c.lineWidth = w * widen;
        c.beginPath();
        c.moveTo(points[i].x, points[i].y);
        c.lineTo(points[i + 1].x, points[i + 1].y);
        c.stroke();
      }
      c.globalCompositeOperation = "source-over";
    };

    return {
      canvas,
      resize(w, h) {
        dpr = nightDpr();
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        glowCanvas.width = Math.max(1, Math.round(w * dpr * GLOW_SCALE));
        glowCanvas.height = Math.max(1, Math.round(h * dpr * GLOW_SCALE));
      },
      draw(t, dt) {
        const step = Math.min(dt * 60, 3);
        if (seeded) {
          const headEase = 1 - Math.pow(1 - PLANKTON.followSpeed, step);
          const chainEase = 1 - Math.pow(1 - (0.28 + PLANKTON.followSpeed * 0.35), step);
          head.x += (target.x - head.x) * headEase;
          head.y += (target.y - head.y) * headEase;
          points[0].x = head.x;
          points[0].y = head.y;
          for (let i = 1; i < POINTS; i++) {
            points[i].x += (points[i - 1].x - points[i].x) * chainEase;
            points[i].y += (points[i - 1].y - points[i].y) * chainEase;
          }
        }
        const resting = !inside || performance.now() - lastInput > PLANKTON.idleTimeout;
        const goal = seeded && !resting ? 1 : 0;
        fade += (goal - fade) * Math.min(1, ((16.667 * step) / PLANKTON.fadeDuration) * 7);
        if (fade < 0.002 && goal === 0) fade = 0;
        canvas.style.opacity = String(PLANKTON.opacity * fade);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!seeded || fade === 0) return;

        // The glow: the trail wide and dim, blurred once, as the original's
        // beam falls off around the line.
        const spread = 0.8 + PLANKTON.glowSpread * 1.4;
        const g = dpr * GLOW_SCALE;
        glow.setTransform(1, 0, 0, 1, 0, 0);
        glow.clearRect(0, 0, glowCanvas.width, glowCanvas.height);
        glow.setTransform(g, 0, 0, g, 0, 0);
        strokeTrail(glow, t, blurs ? spread : spread * 0.6, PLANKTON.glowIntensity * 0.55);
        if (blurs) ctx.filter = `blur(${(PLANKTON.trailWidth * spread * 0.5 * dpr).toFixed(1)}px)`;
        ctx.drawImage(glowCanvas, 0, 0, canvas.width, canvas.height);
        if (blurs) ctx.filter = "none";

        // The core: a soft shoulder, then the line itself, brightest at the head.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        strokeTrail(ctx, t, 1.8, 0.5);
        strokeTrail(ctx, t, 0.8, 1);
      },
      // Asleep once the trail has gone dark and nothing is moving it.
      moving: () => fade > 0 || (inside && performance.now() - lastInput <= PLANKTON.idleTimeout),
      dispose() {
        band.removeEventListener("pointermove", onMove);
        band.removeEventListener("pointerenter", onMove);
        band.removeEventListener("pointerleave", onLeave);
        glowCanvas.width = 0;
        glowCanvas.height = 0;
      },
    };
  });
  return <div ref={host} className="nb-fill" />;
}
