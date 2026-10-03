/*
 * Marquee — from Magic UI (https://magicui.design), MIT License,
 * Copyright (c) Magic UI. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: Tailwind 3 syntax, the house `cn`, the loop pauses
 * off-screen and on hidden tabs (ambient.ts watches `.animate-marquee`), and
 * under reduced motion the row simply stands still (index.css).
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../cn";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /** Reverse the direction of travel. */
  reverse?: boolean;
  /** Hold the row still while a pointer rests on it. */
  pauseOnHover?: boolean;
  children: ReactNode;
  /** Travel vertically instead of horizontally. */
  vertical?: boolean;
  /** How many copies of the content make the loop seamless. */
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-[var(--gap)] overflow-hidden [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          // copies after the first are the loop's continuation, not content
          aria-hidden={i > 0 || undefined}
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
