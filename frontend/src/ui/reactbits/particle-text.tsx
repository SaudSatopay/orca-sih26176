/**
 * Particle Text — https://reactbits.dev/text-animations/particle-text
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: a word assembling out of drifting motes, like plankton
 * gathering under a lamp, and scattering from the pointer. Changes from the
 * original: React 18 + Tailwind 3, token colours passed in by the caller
 * (no defaults spelled here); an `active` switch so the loop stops entirely
 * while the word is out of view (and the assembly waits until it is first
 * seen); `onReady` after the first drawn frame; device pixel ratio capped at
 * 1.5, at most 60 frames a second; the per-particle shadow glow removed (it
 * cost a blur per mote per frame); decorative only — the caller sets the
 * real heading in the DOM, so the canvas is hidden from assistive tech.
 */
import { useEffect, useRef, type CSSProperties } from "react";

export interface ParticleTextProps {
  text: string;
  /** The motes' colour… */
  color: string;
  /** …and the colour of a scattered share of them (`highlightShare`). */
  highlightColor: string;
  /** Share of motes in the highlight colour, picked at random, never by position. */
  highlightShare?: number;
  /** Font size in CSS px, or a function of the box it is set in. */
  fontSize: number | ((width: number, height: number) => number);
  fontFamily: string;
  fontWeight?: number | string;
  particleSize?: number;
  density?: number;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  /** In view and on a visible tab: the loop runs only while this is true. */
  active?: boolean;
  /** Called once, after the first frame with the word on it. */
  onReady?: () => void;
  className?: string;
  style?: CSSProperties;
}

type Rgb = { r: number; g: number; b: number };
type Target = { x: number; y: number; alpha: number };
type Particle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  seed: number;
  depth: number;
  delay: number;
};

const DPR_CAP = 1.5;
const FRAME_MS = 1000 / 60;

const hexToRgb = (hex: string): Rgb | null => {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount),
});

const rgbToCss = (rgb: Rgb): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const waitForFonts = async (font: string): Promise<void> => {
  if (!("fonts" in document)) return;
  try {
    await document.fonts.load(font);
  } catch {
    // the fallback face will do
  }
  await document.fonts.ready;
};

export default function ParticleText({
  text,
  color,
  highlightColor,
  highlightShare = 0.3,
  fontSize,
  fontFamily,
  fontWeight = 800,
  particleSize = 2,
  density = 4,
  scatter = 180,
  gatherDuration = 1600,
  stagger = 420,
  pointerRepel = 40,
  repelRadius = 120,
  idleDrift = 0.7,
  active = true,
  onReady,
  className = "",
  style,
}: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const readyRef = useRef(onReady);
  const kick = useRef<(() => void) | null>(null);
  useEffect(() => {
    readyRef.current = onReady;
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let particles: Particle[] = [];
    let raf = 0;
    let resizeFrame = 0;
    let buildId = 0;
    let gathering = false;
    let gatherPending = false;
    let gatherStart = 0;
    let lastFrame = 0;
    let announced = false;
    let reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { active: false, x: 0, y: 0, smoothX: 0, smoothY: 0 };

    const startGather = (fromScatter: boolean): void => {
      if (!particles.length) return;
      const spread = reducedMotion ? 0 : scatter;
      for (const p of particles) {
        if (fromScatter) {
          const angle = p.seed * Math.PI * 2;
          const distance = spread * (0.35 + p.depth * 0.75);
          p.x = p.targetX + Math.cos(angle) * distance + (p.depth - 0.5) * spread * 0.55;
          p.y = p.targetY + Math.sin(angle) * distance + (p.seed - 0.5) * spread * 0.55;
        }
        p.startX = p.x;
        p.startY = p.y;
        p.delay = reducedMotion ? 0 : p.seed * stagger;
      }
      gatherStart = performance.now();
      gathering = true;
    };

    const render = (now: number): void => {
      raf = 0;
      if (!activeRef.current) return;
      if (lastFrame && now - lastFrame < FRAME_MS - 2) {
        raf = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;
      // The assembly waits for its audience: it starts the first time the
      // word is really on screen.
      if (gatherPending) {
        gatherPending = false;
        startGather(false);
      }
      ctx.clearRect(0, 0, width, height);
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;
      let complete = true;
      for (const p of particles) {
        let baseX = p.targetX;
        let baseY = p.targetY;
        let progress = 1;
        if (gathering) {
          const local = (now - gatherStart - p.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = p.startX + (p.targetX - p.startX) * eased;
          baseY = p.startY + (p.targetY - p.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion && idleDrift > 0) {
          const driftTime = now * 0.001;
          baseX += Math.sin(driftTime * 0.9 + p.seed * 10) * idleDrift * p.depth;
          baseY += Math.cos(driftTime * 0.75 + p.depth * 10) * idleDrift * p.depth;
        }
        if (pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < repelRadius) {
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
            baseX += (dx / distance) * force;
            baseY += (dy / distance) * force;
          }
        }
        const follow = reducedMotion ? 1 : 0.22;
        p.x += (baseX - p.x) * follow;
        p.y += (baseY - p.y) * follow;
        ctx.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (gathering && complete) gathering = false;
      if (!announced && particles.length) {
        announced = true;
        requestAnimationFrame(() => readyRef.current?.());
      }
      if (!reducedMotion || gathering) raf = requestAnimationFrame(render);
    };

    const ensureLoop = (): void => {
      if (!raf && activeRef.current && particles.length) {
        lastFrame = 0;
        raf = requestAnimationFrame(render);
      }
    };
    kick.current = ensureLoop;

    const sampleText = async (): Promise<void> => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width <= 0 || height <= 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let resolvedSize = typeof fontSize === "function" ? fontSize(width, height) : fontSize;
      let font = `${fontWeight} ${resolvedSize}px ${fontFamily}`;
      await waitForFonts(font);
      if (currentBuild !== buildId) return;

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;
      const content = String(text || " ");
      const maxTextWidth = width * 0.92;
      offCtx.font = font;
      let metrics = offCtx.measureText(content);
      const measuredWidth = Math.max(1, metrics.width);
      if (measuredWidth > maxTextWidth) {
        resolvedSize = Math.max(18, resolvedSize * (maxTextWidth / measuredWidth));
        font = `${fontWeight} ${resolvedSize}px ${fontFamily}`;
        await waitForFonts(font);
        if (currentBuild !== buildId) return;
        offCtx.font = font;
        metrics = offCtx.measureText(content);
      }
      const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
      const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);
      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || resolvedSize * 0.78);
      const descent = Math.ceil(metrics.actualBoundingBoxDescent || resolvedSize * 0.22);
      const padding = Math.max(12, Math.ceil(resolvedSize * 0.08));
      offscreen.width = Math.max(1, left + right) + padding * 2;
      offscreen.height = Math.max(1, ascent + descent) + padding * 2;
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.font = font;
      offCtx.textAlign = "left";
      offCtx.textBaseline = "alphabetic";
      // any opaque ink: only the coverage is read back
      offCtx.fillStyle = color;
      offCtx.fillText(content, padding - left, padding + ascent);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const targets: Target[] = [];
      const step = Math.max(2, Math.floor(density));
      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const a = imageData.data[(y * offscreen.width + x) * 4 + 3];
          if (a > 40) {
            targets.push({
              x: width / 2 - offscreen.width / 2 + x,
              y: height / 2 - offscreen.height / 2 + y,
              alpha: a / 255,
            });
          }
        }
      }

      const maxParticles = Math.max(900, Math.min(4200, Math.floor((width * height) / 90)));
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      const baseRgb = hexToRgb(color);
      const highlightRgb = hexToRgb(highlightColor);
      const selected = targets.filter((_, index) => index % stride === 0);
      particles = selected.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        // Specks, not a sweep: a left-to-right blend would be gradient text.
        const speck = ((index * 7919 + 104729) % 1000) / 1000 < highlightShare;
        const particleColor =
          baseRgb && highlightRgb ? rgbToCss(mixRgb(baseRgb, highlightRgb, speck ? 1 : 0)) : color;
        const angle = seed * Math.PI * 2;
        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);
        const startX = target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45;
        const startY = target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45;
        return {
          x: reducedMotion ? target.x : startX,
          y: reducedMotion ? target.y : startY,
          startX,
          startY,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.6, particleSize * (0.75 + target.alpha * 0.45)),
          color: particleColor,
          seed,
          depth,
          delay: seed * stagger,
        };
      });
      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;
      if (reducedMotion) {
        for (const p of particles) {
          p.x = p.targetX;
          p.y = p.targetY;
          p.startX = p.targetX;
          p.startY = p.targetY;
          p.delay = 0;
        }
        gathering = false;
      } else if (!announced) {
        // first build: gather when first seen
        gatherPending = true;
      }
      ensureLoop();
    };

    const queueSample = (): void => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        void sampleText();
      });
    };
    const onMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = (): void => {
      pointer.active = false;
    };
    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onMotion = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;
      void sampleText();
    };
    motionQuery?.addEventListener("change", onMotion);
    canvas.addEventListener("pointerenter", onMove);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(queueSample);
    ro.observe(container);
    void sampleText();

    return () => {
      buildId += 1;
      kick.current = null;
      ro.disconnect();
      motionQuery?.removeEventListener("change", onMotion);
      canvas.removeEventListener("pointerenter", onMove);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
    };
  }, [
    text,
    color,
    highlightColor,
    highlightShare,
    fontSize,
    fontFamily,
    fontWeight,
    particleSize,
    density,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
  ]);

  useEffect(() => {
    activeRef.current = active;
    if (active) kick.current?.();
  }, [active]);

  return (
    <div ref={containerRef} className={`relative block h-full w-full overflow-hidden ${className}`} style={style} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
