/*
 * PixelSwap — from React Bits (https://reactbits.dev/animations/pixel-swap),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: controlled only (the caller owns which side shows, so
 * the two labelled buttons and the timer live outside), the house easing,
 * square pixels with no spin, refs written in effects rather than during
 * render, and under reduced motion the swap is immediate. Both layers stay
 * in the document; the hidden one is `aria-hidden`.
 *
 * When both sides are pictures (`images`), each fragment is a pixel-sized
 * window with the picture as its background, instead of a clone of the whole
 * layer: a hundred small layers rather than a hundred full-size ones, which
 * is what keeps the swap smooth on a modest GPU.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn, prefersReducedMotion } from "../cn";

export type PixelSwapPattern = "random" | "center" | "edges" | "left-to-right" | "diagonal" | "spiral";

export interface PixelSwapProps {
  firstContent: ReactNode;
  secondContent: ReactNode;
  /** false shows the first content, true the second. */
  active: boolean;
  pixelSize?: number;
  /** Start scale of a pixel, as a share of its finished size. */
  pixelScale?: number;
  fade?: boolean;
  duration?: number;
  pixelDuration?: number;
  pattern?: PixelSwapPattern;
  randomness?: number;
  easing?: string;
  /**
   * The two sides as pictures, drawn `object-fit: cover` in the frame. The
   * fragments then show the picture directly (the fast path).
   */
  images?: readonly [{ src: string; aspect: number }, { src: string; aspect: number }];
  onComplete?: (active: boolean) => void;
  className?: string;
}

interface Pixel {
  id: number;
  left: number;
  top: number;
  offset: number;
}

interface Grid {
  pixels: Pixel[];
  size: number;
  width: number;
  height: number;
}

// Every pixel is a window onto its own copy of the incoming content, so the
// grid stays bounded however small the pixel size.
const MAX_PIXELS = 220;
const KEYFRAME_STEPS = 14;

const PATTERNS: Record<PixelSwapPattern, (x: number, y: number) => number | null> = {
  random: () => null,
  center: (x, y) => Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2,
  edges: (x, y) => Math.min(x, 1 - x, y, 1 - y) * 2,
  "left-to-right": (x) => x,
  diagonal: (x, y) => (x + y) / 2,
  spiral: (x, y) => {
    const angle = (Math.atan2(y - 0.5, x - 0.5) + Math.PI) / (Math.PI * 2);
    const radius = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
    return (angle + radius) % 1;
  },
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const noise = (seed: number): number => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** A `cubic-bezier(…)` string as a function of progress. */
function makeEasing(value: string): (progress: number) => number {
  const match = /cubic-bezier\(([^)]+)\)/.exec(value);
  const points = match ? match[1].split(",").map(Number) : [0.23, 1, 0.32, 1];
  const [x1, y1, x2, y2] = points.length === 4 && !points.some(Number.isNaN) ? points : [0.23, 1, 0.32, 1];
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  return (progress: number) => {
    let t = progress;
    for (let i = 0; i < 5; i += 1) {
      const slope = (3 * ax * t + 2 * bx) * t + cx;
      if (!slope) break;
      t -= (((ax * t + bx) * t + cx) * t - progress) / slope;
    }
    t = clamp(t, 0, 1);
    return ((ay * t + by) * t + cy) * t;
  };
}

function buildGrid(width: number, height: number, pixelSize: number, pattern: PixelSwapPattern, randomness: number): Grid {
  let size = pixelSize;
  let columns = Math.max(1, Math.ceil(width / size));
  let rows = Math.max(1, Math.ceil(height / size));
  if (columns * rows > MAX_PIXELS) {
    size = Math.ceil(size * Math.sqrt((columns * rows) / MAX_PIXELS));
    columns = Math.max(1, Math.ceil(width / size));
    rows = Math.max(1, Math.ceil(height / size));
  }
  // Overhang the box so edge pixels stay square instead of being cut short.
  const originX = (width - columns * size) / 2;
  const originY = (height - rows * size) / 2;
  const order = PATTERNS[pattern] ?? PATTERNS.random;
  const mix = clamp(randomness, 0, 1);
  const pixels: Pixel[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const x = columns <= 1 ? 0.5 : column / (columns - 1);
      const y = rows <= 1 ? 0.5 : row / (rows - 1);
      const base = order(x, y);
      const random = noise(index + 1);
      pixels.push({
        id: index,
        left: originX + column * size,
        top: originY + row * size,
        offset: base === null ? random : base * (1 - mix) + random * mix,
      });
    }
  }
  return { pixels, size, width, height };
}

// One shared pair of keyframe lists for the whole grid: the window's
// transform and its exact inverse, so revealed content never drifts.
function buildKeyframes(ease: (p: number) => number, startScale: number, fade: boolean) {
  const outer: Keyframe[] = [];
  const inner: Keyframe[] = [];
  for (let step = 0; step <= KEYFRAME_STEPS; step += 1) {
    const progress = step / KEYFRAME_STEPS;
    const eased = ease(progress);
    const scale = startScale + (1 - startScale) * eased;
    outer.push({ offset: progress, opacity: fade ? Math.min(1, eased * 1.6) : 1, transform: `scale(${scale})` });
    inner.push({ offset: progress, transform: `scale(${1 / scale})` });
  }
  return { outer, inner };
}

export function PixelSwap({
  firstContent,
  secondContent,
  active,
  pixelSize = 64,
  pixelScale = 0.35,
  fade = true,
  duration = 1100,
  pixelDuration = 420,
  pattern = "random",
  randomness = 0,
  easing = "cubic-bezier(0.23, 1, 0.32, 1)",
  images,
  onComplete,
  className,
}: PixelSwapProps) {
  const [shown, setShown] = useState(active);
  const [swap, setSwap] = useState<{ to: boolean; grid: Grid } | null>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  const boxRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pixelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animations = useRef<Animation[]>([]);
  const timer = useRef(0);

  const grid = useMemo(
    () => buildGrid(box.width, box.height, Math.max(8, Math.round(pixelSize)), pattern, randomness),
    [box.width, box.height, pixelSize, pattern, randomness],
  );

  // The inputs of a transition already in flight are a snapshot, so an
  // unrelated prop change never rebuilds it halfway.
  const settings = useRef({ duration, pixelDuration, pixelScale, fade, easing, images, onComplete, grid });
  useLayoutEffect(() => {
    settings.current = { duration, pixelDuration, pixelScale, fade, easing, images, onComplete, grid };
  });

  useEffect(() => {
    const box = boxRef.current;
    if (box == null) return;
    const measure = () => {
      const width = box.clientWidth;
      const height = box.clientHeight;
      if (!width || !height) return;
      setBox((now) => (now.width === width && now.height === height ? now : { width, height }));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const stop = useCallback(() => {
    animations.current.forEach((a) => a.cancel());
    animations.current = [];
    pixelRefs.current.forEach((p) => p?.replaceChildren());
    window.clearTimeout(timer.current);
    timer.current = 0;
  }, []);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    if (swap || active === shown) return;
    setSwap({ to: active, grid: settings.current.grid });
  }, [active, shown, swap]);

  useEffect(() => {
    if (swap == null) return;
    const s = settings.current;
    const { grid: frozen, to } = swap;
    const finish = () => {
      stop();
      setShown(to);
      setSwap(null);
      s.onComplete?.(to);
    };
    const source = layerRefs.current[to ? 1 : 0];
    const canAnimate = typeof Element !== "undefined" && typeof Element.prototype.animate === "function";
    if (!source || !frozen.pixels.length || !canAnimate || prefersReducedMotion()) {
      finish();
      return;
    }
    const total = Math.max(200, s.duration);
    const pixelMs = clamp(s.pixelDuration, 60, total);
    const spread = Math.max(0, total - pixelMs);
    const frames = buildKeyframes(makeEasing(s.easing), clamp(s.pixelScale, 0.05, 1), s.fade);

    const picture = s.images?.[to ? 1 : 0];
    // Where the picture sits in the frame under `object-fit: cover`.
    const cover = picture
      ? (() => {
          const { width: w, height: h } = frozen;
          const bw = w / h > picture.aspect ? w : h * picture.aspect;
          const bh = w / h > picture.aspect ? w / picture.aspect : h;
          return { bw, bh, x: (w - bw) / 2, y: (h - bh) / 2 };
        })()
      : null;

    frozen.pixels.forEach((pixel, index) => {
      const el = pixelRefs.current[index];
      if (!el) return;
      const timing: KeyframeAnimationOptions = {
        duration: pixelMs,
        delay: pixel.offset * spread,
        easing: "linear",
        fill: "both",
      };
      if (picture && cover) {
        // The fast path: a pixel-sized window onto the picture, counter-scaled
        // about its own centre so the picture never drifts.
        const tile = document.createElement("div");
        tile.style.position = "absolute";
        tile.style.inset = "0";
        tile.style.backgroundImage = `url("${picture.src}")`;
        tile.style.backgroundSize = `${cover.bw}px ${cover.bh}px`;
        tile.style.backgroundPosition = `${cover.x - pixel.left}px ${cover.y - pixel.top}px`;
        tile.style.backgroundRepeat = "no-repeat";
        el.replaceChildren(tile);
        animations.current.push(el.animate(frames.outer, timing), tile.animate(frames.inner, timing));
        return;
      }
      // Clone the rendered layer rather than render the content through
      // React once per pixel: the same picture at a fraction of the cost.
      const content = document.createElement("div");
      content.style.position = "absolute";
      content.style.left = `${-pixel.left}px`;
      content.style.top = `${-pixel.top}px`;
      content.style.width = `${frozen.width}px`;
      content.style.height = `${frozen.height}px`;
      content.style.transformOrigin = `${pixel.left + frozen.size / 2}px ${pixel.top + frozen.size / 2}px`;
      const clone = source.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.removeAttribute("aria-hidden");
      clone.querySelectorAll("img").forEach((img) => img.removeAttribute("loading"));
      content.appendChild(clone);
      el.replaceChildren(content);
      animations.current.push(el.animate(frames.outer, timing), content.animate(frames.inner, timing));
    });
    timer.current = window.setTimeout(finish, total);
    return stop;
  }, [stop, swap]);

  const incoming = swap?.to ? 1 : 0;
  const layer = (content: ReactNode, index: number) => {
    const isShown = index === (shown ? 1 : 0);
    return (
      <div
        key={index}
        ref={(el) => {
          layerRefs.current[index] = el;
        }}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: isShown ? 2 : 1, visibility: isShown && !(swap && index === incoming) ? undefined : "hidden" }}
        aria-hidden={!isShown}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      ref={boxRef}
      className={cn("relative w-full overflow-hidden", className)}
      // its own stacking context, so the fragments never paint over the page
      style={{ zIndex: 0 }}
      data-active={shown}
      data-transitioning={swap != null}
    >
      {layer(firstContent, 0)}
      {layer(secondContent, 1)}
      {swap && (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 3 }} aria-hidden="true">
          {swap.grid.pixels.map((pixel, index) => (
            <div
              key={pixel.id}
              ref={(el) => {
                pixelRefs.current[index] = el;
              }}
              className="absolute overflow-hidden"
              style={{
                left: pixel.left,
                top: pixel.top,
                width: swap.grid.size,
                height: swap.grid.size,
                opacity: 0,
                contain: "paint",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PixelSwap;
