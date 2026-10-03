/*
 * SwipeRow — from React Bits (https://reactbits.dev/micro/swipe-row),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA's phone, where it wraps a fishing-ground row:
 *   - swipe left reveals actions; nothing is ever deleted, so the full-swipe
 *     commit and the collapse are gone;
 *   - the row's own content stays a real button and a tap on it still works:
 *     the pointer is captured only once the drag is horizontal, and the click
 *     that ends a drag (or closes an open row) is swallowed;
 *   - no icon pack: the caller passes ORCA's glyphs; no colour props: the
 *     actions take a token class from swipe-row.css (`swipe-action--chart`,
 *     `swipe-action--ink`), and the stylesheet is this chunk's own, so the
 *     phone's first load carries none of it;
 *   - Motion springs one number; the transforms are written directly, so
 *     none of Motion's components ride along;
 *   - the keyboard path is a visually hidden toggle beside the row, and the
 *     drawer is `inert` while closed;
 *   - every string comes from the caller, in the reader's language;
 *   - reduced motion: the row settles with a 200 ms ease instead of a spring.
 * DOM and Motion only, no WebGL. It is loaded as its own chunk on the first
 * touch of a row (MobileApp.tsx), so the phone's first load does not carry it.
 */
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { animate, useMotionValue } from "motion/react";
import { cn, prefersReducedMotion } from "../cn";
import "./swipe-row.css";

const HYST = 10;
const FLICK = 110;
const DECEL = 0.998;
const VMAX = 1500;
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const SPRING_UI = { type: "spring" as const, duration: 0.3, bounce: 0 };

export interface SwipeAction {
  id: string;
  label: string;
  icon?: ReactNode;
  /** A token class for the action's ground and ink, from swipe-row.css (`swipe-action--chart`). */
  className?: string;
  onSelect: () => void;
}

export interface SwipeRowProps {
  children: ReactNode;
  actions: SwipeAction[];
  /** Names the row as a group. */
  label: string;
  /** The hidden toggle's name, e.g. "More for area 1". */
  toggleLabel: string;
  /** Said once the drawer opens, e.g. "2 actions shown". */
  openedLabel: string;
  actionWidth?: number;
  resistance?: number;
  snapBounce?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

type Sample = [number, number];

interface Grip {
  id: number;
  x0: number;
  y0: number;
  grab: number | null;
  moved: boolean;
  hist: Sample[];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rubber = (o: number, dim: number, c: number) => (o * dim * c) / (dim + c * Math.abs(o));
const unrubber = (y: number, dim: number, c: number) => (y * dim) / (c * Math.max(1, dim - Math.abs(y)));
const project = (v: number) => ((v / 1000) * DECEL) / (1 - DECEL);
const velocityOf = (hist: Sample[]) => {
  if (hist.length < 2) return 0;
  const a = hist[0];
  const b = hist[hist.length - 1];
  return ((b[1] - a[1]) / Math.max(1, b[0] - a[0])) * 1000;
};

export function SwipeRow({
  children,
  actions,
  label,
  toggleLabel,
  openedLabel,
  actionWidth = 88,
  resistance = 0.55,
  snapBounce = 0.2,
  className,
  onOpenChange,
}: SwipeRowProps) {
  const uid = useId();
  const A = actionWidth;
  const n = actions.length;
  const D = n * A;
  const c = clamp(resistance, 0.05, 1);
  const [open, setOpenState] = useState(false);
  const [say, setSay] = useState("");

  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const width = useRef(360);
  const grip = useRef<Grip | null>(null);
  const swallowClick = useRef(false);
  const unwatch = useRef<(() => void) | null>(null);

  // x is the surface's offset: 0 closed, -D open (the drawer is on the right).
  // Motion only springs the number; the two transforms are written here, so
  // the chunk carries Motion's animate and none of its components.
  const x = useMotionValue(0);
  const exposed = { get: () => -x.get() };
  useLayoutEffect(() => {
    const paint = (v: number) => {
      if (surface.current) surface.current.style.transform = `translateX(${v}px)`;
      if (rail.current) rail.current.style.transform = `translateX(${Math.max(0, D + v)}px)`;
    };
    paint(x.get());
    return x.on("change", paint);
  }, [x, D]);

  const map = (raw: number) => {
    const W = width.current;
    if (raw < 0) return rubber(raw, W, c);
    if (raw <= D) return raw;
    return D + rubber(raw - D, W, c);
  };
  const inv = (ex: number) => {
    const W = width.current;
    if (ex < 0) return unrubber(ex, W, c);
    if (ex <= D) return ex;
    return D + unrubber(ex - D, W, c);
  };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    width.current = el.offsetWidth || width.current;
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) width.current = w;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => unwatch.current?.(), []);
  // A closed drawer is out of reach for Tab and assistive tech (React 18
  // has no `inert` prop, so the attribute is set here).
  useEffect(() => {
    rail.current?.toggleAttribute("inert", !open);
  }, [open]);

  const setOpen = (next: boolean) => {
    if (next === open) return;
    setOpenState(next);
    setSay(next ? openedLabel : "");
    onOpenChange?.(next);
  };
  const settle = (target: number, v = 0) => {
    if (prefersReducedMotion()) {
      animate(x, -target, { duration: 0.2, ease: EASE_OUT });
      return;
    }
    animate(
      x,
      -target,
      Math.abs(v) >= FLICK
        ? { type: "spring", duration: 0.4, bounce: snapBounce, velocity: -clamp(v, -VMAX, VMAX) }
        : { ...SPRING_UI, velocity: -v },
    );
  };

  const move = (e: PointerEvent) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    if (g.grab === null) {
      const dx = e.clientX - g.x0;
      const dy = e.clientY - g.y0;
      if (Math.abs(dx) < HYST || Math.abs(dx) < Math.abs(dy)) return;
      // A horizontal drag: from here on the row owns the pointer.
      g.grab = -(g.x0 + Math.sign(dx) * HYST) - inv(exposed.get());
      g.moved = true;
      try {
        surface.current?.setPointerCapture(e.pointerId);
      } catch {
        /* the pointer may already be gone */
      }
      root.current?.setAttribute("data-dragging", "");
    }
    const ex = map(-e.clientX - g.grab);
    x.set(-ex);
    g.hist.push([performance.now(), ex]);
    if (g.hist.length > 4) g.hist.shift();
  };
  const up = (e: PointerEvent) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    unwatch.current?.();
    unwatch.current = null;
    root.current?.removeAttribute("data-dragging");
    try {
      surface.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* not captured */
    }
    if (!g.moved) {
      // A tap on an open row closes it and goes no further.
      if (open) {
        swallowClick.current = true;
        setOpen(false);
        settle(0);
      }
      return;
    }
    swallowClick.current = true;
    const ex = exposed.get();
    const v = velocityOf(g.hist);
    const target = Math.abs(v) >= FLICK ? (v > 0 ? D : 0) : ex + project(v) > D / 2 ? D : 0;
    setOpen(target === D);
    settle(target, v);
  };
  const live = useRef({ move, up });
  useLayoutEffect(() => {
    live.current = { move, up };
  });

  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (n === 0 || grip.current || e.button !== 0) return;
    x.stop();
    swallowClick.current = false;
    grip.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, grab: null, moved: false, hist: [] };
    const onMove = (ev: PointerEvent) => live.current.move(ev);
    const onUp = (ev: PointerEvent) => live.current.up(ev);
    unwatch.current?.();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    unwatch.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  };
  const swallow = (e: ReactMouseEvent) => {
    if (!swallowClick.current) return;
    swallowClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const act = (a: SwipeAction) => {
    a.onSelect();
    setOpen(false);
    x.set(0);
  };
  const toggle = (next: boolean) => {
    x.set(next ? -D : 0);
    setOpen(next);
  };
  const onToggleKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (n === 0) return;
    if (e.key === "ArrowLeft" && !open) {
      e.preventDefault();
      toggle(true);
    } else if ((e.key === "ArrowRight" || e.key === "Escape") && open) {
      e.preventDefault();
      toggle(false);
    }
  };

  const railId = `${uid}-rail`;
  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      className={cn("swipe-row", className)}
      data-open={open ? "" : undefined}
    >
      <div ref={rail} id={railId} className="swipe-rail" style={{ width: D }} aria-hidden={!open}>
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            className={cn("swipe-action", a.className)}
            style={{ width: A }}
            onClick={() => act(a)}
          >
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
      <div ref={surface} className="swipe-surface" onPointerDown={down} onClickCapture={swallow}>
        {children}
      </div>
      <button
        type="button"
        className="swipe-toggle swipe-sr"
        aria-expanded={open}
        aria-controls={railId}
        aria-keyshortcuts="ArrowLeft"
        onKeyDown={onToggleKey}
        onClick={(e) => {
          // Keyboard and assistive tech only: a pointer swipes instead.
          if (e.detail !== 0) return;
          toggle(!open);
        }}
      >
        {toggleLabel}
      </button>
      <span className="swipe-sr" aria-live="polite">
        {say}
      </span>
    </div>
  );
}

export default SwipeRow;
