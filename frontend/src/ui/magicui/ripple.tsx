/*
 * Ripple — from Magic UI (https://magicui.design), MIT License,
 * Copyright (c) Magic UI. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA as a sonar ping: hairline rings in chart teal, no
 * shadows, faded toward the foot. CSS keyframes only (`.animate-ripple`),
 * paused off-screen by ambient.ts, still under reduced motion.
 */
import { memo, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "../cn";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  /** Distance between rings, px. */
  step?: number;
}

export const Ripple = memo(function Ripple({
  mainCircleSize = 120,
  mainCircleOpacity = 0.28,
  numCircles = 6,
  step = 56,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 select-none [mask-image:radial-gradient(closest-side,black,transparent)]",
        className,
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * step;
        return (
          <div
            key={i}
            className="animate-ripple absolute rounded-full border border-chart-500 bg-chart-500/[0.04]"
            style={
              {
                "--i": i,
                width: size,
                height: size,
                opacity: Math.max(0.04, mainCircleOpacity - i * 0.04),
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});
