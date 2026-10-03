/*
 * Highlighter — from Magic UI (https://magicui.design), MIT License,
 * Copyright (c) Magic UI. See src/ui/LICENSES.md. Draws with rough-notation
 * (MIT).
 *
 * Adapted for ORCA: a hand-drawn mark on the chart — underline, box, circle —
 * in a token colour. The words are always readable; the mark draws once,
 * when it first comes into view, and appears without drawing under reduced
 * motion.
 */
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { annotate } from "rough-notation";
import { chart } from "../../tokens";
import { prefersReducedMotion } from "../cn";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  /** Wait until the words are on screen before drawing. */
  isView?: boolean;
}

export function Highlighter({
  children,
  action = "underline",
  color = chart[500],
  strokeWidth = 1.6,
  animationDuration = 700,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = true,
}: HighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const show = !isView || inView;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!show || !el) return;
    const still = prefersReducedMotion();
    const a = annotate(el, {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      animate: !still,
      iterations,
      padding,
      multiline,
    });
    a.show();
    // Redraw at the new size, without animating again.
    const ro =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(() => {
            a.hide();
            (a as unknown as { animate: boolean }).animate = false;
            a.show();
          })
        : null;
    ro?.observe(el);
    return () => {
      a.remove();
      ro?.disconnect();
    };
  }, [show, action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

  return (
    <span ref={ref} className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
