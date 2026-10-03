/*
 * Circular Text — from React Bits (https://reactbits.dev/text-animations/circular-text),
 * source https://reactbits.dev/r/CircularText-TS-TW.json. MIT + Commons
 * Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the lettering of a compass rose. Mono capitals in the
 * marine ink, set on the ring with the original's per-letter rotation, and
 * the whole ring turning slowly. The turn is a CSS loop on transform
 * (`.border-beam-spin`, already registered with the ambient watcher, so it
 * rests off-screen and on a hidden tab) instead of the original's script-driven
 * `motion` controls; there is no hover mode. Under reduced motion the ring
 * stands still. It is decoration: hidden from assistive tech, never
 * translated, and whatever sits in its centre is passed as children.
 */
import type { CSSProperties, ReactNode } from "react";
import { cn } from "../cn";

interface CircularTextProps {
  text: string;
  /** Seconds per revolution. */
  spinDuration?: number;
  /** Diameter, px. */
  size?: number;
  className?: string;
  /** Classes on each letter. */
  letterClassName?: string;
  /** What sits in the middle of the ring. */
  children?: ReactNode;
}

export default function CircularText({
  text,
  spinDuration = 40,
  size = 184,
  className,
  letterClassName,
  children,
}: CircularTextProps) {
  const letters = Array.from(text);
  return (
    <div
      aria-hidden
      translate="no"
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="circular-text border-beam-spin absolute inset-0 rounded-full"
        style={{ animationDuration: `${spinDuration}s` } as CSSProperties}
      >
        {letters.map((letter, i) => (
          <span
            key={i}
            className={cn("absolute inset-0 text-center", letterClassName)}
            style={{ transform: `rotate(${(360 / letters.length) * i}deg)` }}
          >
            {letter}
          </span>
        ))}
      </div>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  );
}
