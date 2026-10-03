/*
 * Split Flap Text — from React Bits (https://reactbits.dev/text-animations/split-flap-text),
 * MIT + Commons Clause, Copyright (c) 2026 David Haz. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a board's name set as a departures board, once. Ink on
 * paper tiles with a hairline hinge, in the house mono, no gradients or
 * heavy shadows. It plays one settle (scrambled letters flipping into the
 * name) when `play` is true and never loops; the name is printed for
 * assistive tech from the first frame and the tiles are decoration. Tiles
 * are grapheme clusters, so a Devanagari conjunct is one tile and is never
 * split; Hindi and Marathi flip through the name's own letters. The
 * original's inline <style> moved to split-flap-text.css: transform-only
 * keyframes, no fill-mode, none at all under reduced motion.
 */
import { useEffect, useState } from "react";
import { cn, prefersReducedMotion } from "../cn";
import { graphemes } from "./graphemes";
import "./split-flap-text.css";

const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface Tile {
  current: string;
  next: string;
  flipping: boolean;
  tick: number;
}

const still = (chars: string[]): Tile[] => chars.map((c) => ({ current: c, next: c, flipping: false, tick: 0 }));

export interface SplitFlapTextProps {
  text: string;
  /** Settle into the text once, from scrambled letters. */
  play?: boolean;
  /** ms per flip */
  flipMs?: number;
  /** ms between one tile starting and the next */
  staggerMs?: number;
  /** scrambled letters each tile passes through before it lands */
  flips?: number;
  className?: string;
}

export function SplitFlapText({ text, play = false, flipMs = 80, staggerMs = 45, flips = 5, className }: SplitFlapTextProps) {
  const chars = graphemes(text.toUpperCase());
  const target = chars.join("\u0000");
  const [motionOk] = useState(() => play && !prefersReducedMotion());
  const [tiles, setTiles] = useState<Tile[]>(() => still(chars));
  const [settledFor, setSettledFor] = useState<string | null>(motionOk ? null : target);

  // A new text after the settle (a language change) is set at once.
  if (settledFor !== null && settledFor !== target) {
    setSettledFor(target);
    setTiles(still(chars));
  }

  useEffect(() => {
    if (!motionOk) return;
    const letters = graphemes(target.split("\u0000").join(""));
    const pool = /^[A-Z\s]*$/.test(letters.join("")) ? LATIN.split("") : [...new Set(letters.filter((c) => c.trim()))];
    const pick = () => pool[Math.floor(Math.random() * pool.length)] ?? " ";
    const goal = target.split("\u0000");
    const plans = goal.map((c, i) => ({
      seq: c.trim() ? [...Array.from({ length: flips }, pick), c] : [c],
      start: i * staggerMs,
      step: -1,
    }));
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const elapsed = now - t0;
      let more = false;
      const updates: [number, Tile][] = [];
      plans.forEach((p, i) => {
        const local = elapsed - p.start;
        const step = Math.floor(local / flipMs);
        if (local < 0) {
          more = true;
          return;
        }
        if (step < p.seq.length) {
          more = true;
          if (step !== p.step) {
            p.step = step;
            const from = step === 0 ? goal[i] : p.seq[step - 1];
            updates.push([i, { current: from, next: p.seq[step], flipping: true, tick: step + 1 }]);
          }
        } else if (p.step !== Infinity) {
          p.step = Infinity;
          updates.push([i, { current: goal[i], next: goal[i], flipping: false, tick: 0 }]);
        }
      });
      if (updates.length)
        setTiles((prev) => {
          const out = [...prev];
          for (const [i, t] of updates) out[i] = t;
          return out;
        });
      if (more) raf = requestAnimationFrame(frame);
      else setSettledFor(target);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      setTiles(still(goal));
    };
  }, [motionOk, target, flipMs, staggerMs, flips]);

  return (
    <span className={cn("split-flap", className)} style={{ ["--flip-ms" as string]: `${flipMs}ms` }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="split-flap-row">
        {tiles.map((t, i) =>
          t.current.trim() === "" && t.next.trim() === "" ? (
            <span key={i} className="split-flap-gap" />
          ) : (
            <span key={i} className="split-flap-tile">
              {/* the top half shows the letter coming, the bottom the letter going */}
              <span className="split-flap-half split-flap-half--top">
                <span className="split-flap-char">{t.flipping ? t.next : t.current}</span>
              </span>
              <span className="split-flap-half split-flap-half--bottom">
                <span className="split-flap-char">{t.current}</span>
              </span>
              {t.flipping && (
                <>
                  <span key={`f${t.tick}`} className="split-flap-flap split-flap-flap--front">
                    <span className="split-flap-char">{t.current}</span>
                  </span>
                  <span key={`b${t.tick}`} className="split-flap-flap split-flap-flap--back">
                    <span className="split-flap-char">{t.next}</span>
                  </span>
                </>
              )}
              {/* sizes the tile to its letter */}
              <span className="split-flap-sizer">{t.current}</span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}
