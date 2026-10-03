/*
 * Number Ticker — from Magic UI (https://magicui.design), MIT License,
 * Copyright (c) Magic UI. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: the house `cn`, lining tabular figures, the number is
 * printed in full from the first frame for anyone who asked for less motion,
 * the formatter follows the reader's locale tag, and `countOn="mount"` counts
 * only a number that is on screen as the page opens.
 */
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn, prefersReducedMotion } from "../cn";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  /** Seconds to wait once the number is in view. */
  delay?: number;
  decimalPlaces?: number;
  /** BCP 47 tag for grouping and digits; Latin digits by default. */
  locale?: string;
  /**
   * "view" (Magic UI's): count up the first time the number comes into view.
   * "mount": count up only if the number is on screen as it mounts; one the
   * reader first meets further down the page is simply there, never counting
   * while they scroll onto it.
   */
  countOn?: "view" | "mount";
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  locale = "en-IN",
  countOn = "view",
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const still = prefersReducedMotion();
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "0px" });
  /** For "mount": was the number on screen as it mounted? Read once, before the first count. */
  const seenAtMount = useRef<boolean | null>(null);

  const format = (n: number) =>
    Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(n.toFixed(decimalPlaces)));

  useEffect(() => {
    if (still) return;
    if (countOn === "mount") {
      if (seenAtMount.current == null) {
        const r = ref.current?.getBoundingClientRect();
        seenAtMount.current = !!r && r.bottom > 0 && r.top < window.innerHeight;
      }
      if (!seenAtMount.current) {
        if (ref.current) ref.current.textContent = format(direction === "down" ? startValue : value);
        return;
      }
    }
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isInView || countOn === "mount") {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);
    }
    return () => {
      if (timer !== null) clearTimeout(timer);
    };
    // `format` is rebuilt per render from `decimalPlaces` and `locale`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionValue, isInView, delay, value, direction, startValue, still, countOn]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      }),
    // `format` is rebuilt per render from the two values below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [springValue, decimalPlaces, locale],
  );

  return (
    <span ref={ref} className={cn("lining inline-block tabular-nums", className)} {...props}>
      {format(still ? value : direction === "down" ? value : startValue)}
    </span>
  );
}
