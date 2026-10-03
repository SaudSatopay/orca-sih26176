/*
 * Border Beam — from Magic UI (https://magicui.design), MIT License,
 * Copyright (c) Magic UI. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the light sweeps the neatline as a conic gradient that
 * ROTATES behind a mask cut to the border ring — transform only, composited,
 * no JS loop (the original runs `offset-distance` from script, which the
 * house motion doctrine does not allow). It pauses off-screen with the other
 * ambient loops (`.border-beam-spin`) and is not drawn under reduced motion.
 * Colours default to chart teal.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { chart } from "../../tokens";
import { cn, prefersReducedMotion } from "../cn";

interface BorderBeamProps {
  /** Arc of the light, degrees of the sweep. */
  arc?: number;
  /** Seconds for one lap. */
  duration?: number;
  /** Seconds into the lap to start (staggers several beams). */
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  reverse?: boolean;
  /** Width of the ring the light travels in, px. */
  borderWidth?: number;
}

export function BorderBeam({
  className,
  arc = 60,
  delay = 0,
  duration = 8,
  colorFrom = chart[500],
  colorTo = chart[300],
  reverse = false,
  borderWidth = 1.5,
}: BorderBeamProps) {
  const ring = useRef<HTMLDivElement>(null);
  // The sweep is a square on the ring's centre, as wide as its diagonal, so
  // it covers every corner at every angle.
  const [side, setSide] = useState(0);
  useLayoutEffect(() => {
    const el = ring.current;
    if (!el) return;
    const measure = () =>
      setSide(Math.ceil(Math.hypot(el.offsetWidth, el.offsetHeight)));
    measure();
    const ro =
      typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  if (prefersReducedMotion()) return null;

  // Show only the ring the border occupies: two opaque layers, one clipped to
  // the padding box, excluded from the other.
  const mask: CSSProperties = {
    borderWidth,
    borderStyle: "solid",
    borderColor: "transparent",
    maskImage: "linear-gradient(black, black), linear-gradient(black, black)",
    maskClip: "padding-box, border-box",
    maskComposite: "exclude",
    WebkitMaskImage:
      "linear-gradient(black, black), linear-gradient(black, black)",
    WebkitMaskClip: "padding-box, border-box",
    WebkitMaskComposite: "xor",
  };
  const stop = 360 - arc;
  // Two boxes. The outer one clips to the element's whole box, so the
  // oversize sweep never widens the page. The inner one is the ring: it must
  // NOT clip, because overflow clips at the padding edge, which is exactly
  // the part its mask throws away (the light would never show).
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <div
        ref={ring}
        className="absolute inset-0 rounded-[inherit]"
        style={mask}
      >
        <div
          className={cn(
            "border-beam-spin absolute left-1/2 top-1/2",
            className,
          )}
          style={{
            width: side,
            height: side,
            marginLeft: -side / 2,
            marginTop: -side / 2,
            background: `conic-gradient(from 0deg, transparent 0deg ${stop}deg, ${colorTo} ${stop + arc * 0.6}deg, ${colorFrom} 360deg)`,
            animationDuration: `${duration}s`,
            animationDelay: `${-delay}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        />
      </div>
    </div>
  );
}
