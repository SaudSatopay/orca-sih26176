/*
 * Decrypted Text — from React Bits (https://reactbits.dev/text-animations/decrypted-text),
 * source https://reactbits.dev/r/DecryptedText-TS-TW.json. MIT + Commons
 * Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a mono label being read off the chart. The text is never
 * blank — the first frame is the final words, and while it decodes the
 * scrambled glyphs are real visible characters. Assistive tech always reads
 * the final text (a visually hidden copy) while the animated glyphs are
 * hidden from it. It decodes once: on mount, or the first time it scrolls
 * into view. No `motion` dependency (a plain span and one interval), no
 * hover or click modes. Under reduced motion, and for any text in
 * Devanagari (scrambling breaks its conjuncts and matras), it stays still.
 */
import { useEffect, useRef, useState } from "react";
import { cn, prefersReducedMotion } from "../cn";

/** Glyphs the scramble draws from: the mono face's capitals, figures and chart marks. */
const CHART_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°/+·";

/** Hindi and Marathi are written in Devanagari; they are never scrambled. */
const DEVANAGARI = /[ऀ-ॿ]/;

export interface DecryptedTextProps {
  text: string;
  /** Milliseconds per step. */
  speed?: number;
  /** Steps before every glyph is settled, when not sequential. */
  maxIterations?: number;
  /** Settle one glyph per step, in reading order. */
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  /** Scramble with the text's own letters only. */
  useOriginalCharsOnly?: boolean;
  characters?: string;
  /** Classes on settled glyphs. */
  className?: string;
  /** Classes on glyphs still scrambling. */
  encryptedClassName?: string;
  /** Classes on the wrapper. */
  parentClassName?: string;
  /**
   * Decode on mount, the first time the text comes into view, or each time
   * a mouse or pen comes over it (React Bits' own default).
   */
  animateOn?: "mount" | "view" | "hover";
  /** Milliseconds to wait before decoding starts. */
  delay?: number;
}

/** The order glyphs settle in. */
function revealOrder(len: number, from: "start" | "end" | "center"): number[] {
  const order = Array.from({ length: len }, (_, i) => i);
  if (from === "end") return order.reverse();
  if (from === "center") {
    const mid = (len - 1) / 2;
    return order.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
  }
  return order;
}

/**
 * Neighbouring glyphs in the same state share one span (the original drew a
 * span per glyph): a sequential decode is two or three text runs per frame,
 * not one element per letter.
 */
function runs(glyphs: string[], settled: boolean[]): { text: string; settled: boolean }[] {
  const out: { text: string; settled: boolean }[] = [];
  glyphs.forEach((c, i) => {
    const last = out[out.length - 1];
    if (last && last.settled === settled[i]) last.text += c;
    else out.push({ text: c, settled: settled[i] });
  });
  return out;
}

/** True when this text may be scrambled at all. */
function canDecrypt(text: string): boolean {
  return !DEVANAGARI.test(text) && !prefersReducedMotion();
}

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 12,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = CHART_GLYPHS,
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "view",
  delay = 0,
}: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // What is drawn, glyph by glyph, and which glyphs have settled. The first
  // frame is the finished text: nothing is ever blank.
  const [shown, setShown] = useState<{ glyphs: string[]; settled: boolean[] } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canDecrypt(text)) return;
    const glyphs = Array.from(text);
    const pool = useOriginalCharsOnly
      ? Array.from(new Set(glyphs.filter((c) => c.trim())))
      : Array.from(characters);
    const order = revealOrder(glyphs.length, revealDirection);
    let timer: ReturnType<typeof setInterval> | null = null;
    let wait: ReturnType<typeof setTimeout> | null = null;
    let runs = 0;
    let running = false;

    const run = () => {
      // once on mount or view; on hover, again each time, but never over itself
      if (running || (animateOn !== "hover" && runs > 0)) return;
      running = true;
      runs += 1;
      const settled = glyphs.map((c) => !c.trim());
      let step = 0;
      const scramble = () =>
        glyphs.map((c, i) => (settled[i] ? c : pool[Math.floor(Math.random() * pool.length)]));
      setShown({ glyphs: scramble(), settled: [...settled] });
      timer = setInterval(() => {
        step += 1;
        if (sequential) {
          // settle the next unsettled glyph in reading order
          const next = order.find((i) => !settled[i]);
          if (next != null) settled[next] = true;
        } else if (step >= maxIterations) {
          settled.fill(true);
        }
        if (settled.every(Boolean)) {
          if (timer) clearInterval(timer);
          timer = null;
          running = false;
          setShown(null);
          return;
        }
        setShown({ glyphs: scramble(), settled: [...settled] });
      }, speed);
    };
    const start = () => {
      if (delay > 0) wait = setTimeout(run, delay);
      else run();
    };

    let io: IntersectionObserver | null = null;
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") start();
    };
    if (animateOn === "hover") el.addEventListener("pointerenter", onEnter);
    else if (animateOn === "mount" || typeof IntersectionObserver !== "function") start();
    else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            start();
          }
        },
        { threshold: 0.1 },
      );
      io.observe(el);
    }
    return () => {
      io?.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      if (timer) clearInterval(timer);
      if (wait) clearTimeout(wait);
      setShown(null);
    };
  }, [
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    useOriginalCharsOnly,
    characters,
    animateOn,
    delay,
  ]);

  return (
    <span ref={ref} className={cn("inline-block whitespace-pre-wrap", parentClassName)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-decrypting={shown ? "" : undefined}>
        {shown ? (
          runs(shown.glyphs, shown.settled).map((r, i) => (
            <span key={i} className={r.settled ? className : encryptedClassName}>
              {r.text}
            </span>
          ))
        ) : (
          <span className={className}>{text}</span>
        )}
      </span>
    </span>
  );
}
