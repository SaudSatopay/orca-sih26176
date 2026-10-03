/*
 * Spotlight Card — from React Bits (https://reactbits.dev/components/spotlight-card),
 * source https://reactbits.dev/r/SpotlightCard-TS-TW.json. MIT + Commons
 * Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a reading lamp over the chart table. The card brings no
 * surface of its own (no dark card, no radius, no padding) — it wraps a row
 * or panel that already has one. The light is a soft chart-teal pool of
 * fixed radius that follows the pointer, set through two custom properties
 * on the element (no React render per mouse move). Fine pointers only: on a
 * touch screen nothing listens and nothing is drawn. The pool sits above the
 * content with pointer events off, so every link inside stays live.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { alpha, chart } from "../../tokens";
import { cn } from "../cn";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** The light at its centre, as a CSS colour. Default: chart teal at 10 percent. */
  spotlightColor?: string;
  /** Radius of the pool of light, px. */
  radius?: number;
}

export default function SpotlightCard({
  children,
  className,
  spotlightColor = alpha(chart[500], 0.1),
  radius = 240,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.(FINE_POINTER);
    if (!mq) return;
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };

  const handlers = fine
    ? {
        onPointerMove: move,
        onPointerEnter: (e: React.PointerEvent<HTMLDivElement>) => {
          if (e.pointerType !== "mouse") return;
          move(e);
          setLit(true);
        },
        onPointerLeave: () => setLit(false),
      }
    : {};

  return (
    <div ref={ref} className={cn("spotlight relative", className)} {...handlers}>
      {children}
      {fine && (
        <div
          aria-hidden
          data-lit={lit ? "" : undefined}
          className="spotlight-pool pointer-events-none absolute inset-0 z-[5] rounded-[inherit]"
          style={
            {
              opacity: lit ? 1 : 0,
              background: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent)`,
              transition: "opacity 0.24s var(--ease-out)",
            } as CSSProperties
          }
        />
      )}
    </div>
  );
}
