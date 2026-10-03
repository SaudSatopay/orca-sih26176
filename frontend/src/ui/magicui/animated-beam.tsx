/*
 * Animated Beam — from Magic UI (https://magicui.design), MIT License,
 * Copyright (c) Magic UI. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the house `cn`, colours from the tokens, the travelling
 * light only runs while the beam is on screen, and under reduced motion the
 * course is drawn still (the path is the information; the light is the
 * decoration).
 */
import { useEffect, useId, useState, type RefObject } from "react";
import { motion, useInView } from "motion/react";
import { chart, ink } from "../../tokens";
import { cn, prefersReducedMotion } from "../cn";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  /** Dash the resting course like a plotted track. */
  dashed?: boolean;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  repeat?: number;
  repeatDelay?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 4,
  delay = 0,
  pathColor = ink[400],
  pathWidth = 1.5,
  pathOpacity = 0.35,
  dashed = true,
  gradientStartColor = chart[500],
  gradientStopColor = chart[300],
  repeat = Infinity,
  repeatDelay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useId().replace(/:/g, "");
  const [pathD, setPathD] = useState("");
  const [box, setBox] = useState({ width: 0, height: 0 });
  const inView = useInView(containerRef as RefObject<Element>, { margin: "120px" });
  const still = prefersReducedMotion();

  const coords = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"], y1: ["0%", "0%"], y2: ["0%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"], y1: ["0%", "0%"], y2: ["0%", "0%"] };

  useEffect(() => {
    const update = () => {
      const c = containerRef.current;
      const a = fromRef.current;
      const b = toRef.current;
      if (!c || !a || !b) return;
      const rc = c.getBoundingClientRect();
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      setBox({ width: rc.width, height: rc.height });
      const sx = ra.left - rc.left + ra.width / 2 + startXOffset;
      const sy = ra.top - rc.top + ra.height / 2 + startYOffset;
      const ex = rb.left - rc.left + rb.width / 2 + endXOffset;
      const ey = rb.top - rc.top + rb.height / 2 + endYOffset;
      setPathD(`M ${sx},${sy} Q ${(sx + ex) / 2},${sy - curvature} ${ex},${ey}`);
    };
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
    if (containerRef.current) ro?.observe(containerRef.current);
    update();
    return () => ro?.disconnect();
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      aria-hidden
      fill="none"
      width={box.width}
      height={box.height}
      className={cn("pointer-events-none absolute left-0 top-0", className)}
      viewBox={`0 0 ${box.width} ${box.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
        strokeDasharray={dashed ? "4 5" : undefined}
      />
      {!still && inView && (
        <>
          <path d={pathD} strokeWidth={pathWidth + 0.5} stroke={`url(#${id})`} strokeLinecap="round" />
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={coords}
              transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat, repeatDelay }}
            >
              <stop stopColor={gradientStartColor} stopOpacity="0" />
              <stop stopColor={gradientStartColor} />
              <stop offset="32.5%" stopColor={gradientStopColor} />
              <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
}
