import { useEffect, useState } from "react";
import { RISK_BANDS, RISK_COLOR, RISK_INK } from "../risk";
import type { RiskCategory } from "../types";
import { alpha, ink, paper } from "../tokens";

/** The OS "reduce motion" setting: the dial then opens on its reading. */
function prefersStill(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The risk gauge, drawn like a ship's instrument: a fine tick ring, an ink
 * arc, threshold marks at the band edges, and a serif numeral that counts up
 * so the verdict lands with weight.
 */
export default function RiskDial({
  score,
  category,
  size = 138,
  label,
  fresh = true,
}: {
  score: number;
  category: RiskCategory;
  size?: number;
  /** The band in the reader's language, for assistive tech; defaults to the category. */
  label?: string;
  /** False when this reading has been on screen before: the dial opens on its score. */
  fresh?: boolean;
}) {
  const still = prefersStill();
  const [shown, setShown] = useState(fresh ? 0 : score);
  const color = RISK_COLOR[category];
  const c = size / 2;
  const rArc = c - 13;
  const circumference = 2 * Math.PI * rArc;

  useEffect(() => {
    const from = shown;
    // Nothing to count: reduced motion, or the dial already reads this score.
    if (still || from === score) return;
    const duration = 750;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      // rAF's timestamp can predate the performance.now() captured above, which
      // made t negative and briefly rendered a negative score. Clamp both ends.
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (score - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // FAIL-SAFE: requestAnimationFrame is suspended while a tab is hidden or
    // not compositing, which would leave the dial reading 0 for a 92/100
    // EXTREME verdict. The animation is decoration; the number is safety
    // information, so it must land whether or not any frame is ever painted.
    const settle = window.setTimeout(() => setShown(score), duration + 120);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, still]);

  /** What the dial reads now: the count while it runs, the score itself under reduced motion. */
  const value = still ? score : shown;

  // Outer instrument ticks: a mark every 2 points, a major every 10.
  const ticks = Array.from({ length: 50 }, (_, i) => {
    const a = (i / 50) * 2 * Math.PI - Math.PI / 2;
    const major = i % 5 === 0;
    const r1 = major ? c - 5.5 : c - 3.5;
    return {
      x1: c + r1 * Math.cos(a),
      y1: c + r1 * Math.sin(a),
      x2: c + (c - 1) * Math.cos(a),
      y2: c + (c - 1) * Math.sin(a),
      major,
    };
  });

  // Band thresholds marked on the ring, as an instrument prints its red-lines.
  const thresholds = RISK_BANDS.slice(0, -1).map(({ max: v, category }) => {
    const col = RISK_COLOR[category];
    const a = (v / 100) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: c + (c - 8) * Math.cos(a),
      y1: c + (c - 8) * Math.sin(a),
      x2: c + (c - 1) * Math.cos(a),
      y2: c + (c - 1) * Math.sin(a),
      col,
    };
  });

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      // The count-up is decoration; assistive tech gets the final reading at once.
      role="img"
      aria-label={`${score} / 100 · ${label ?? category}`}
    >
      <svg width={size} height={size} aria-hidden>
        {ticks.map((tk, i) => (
          <line
            key={i}
            x1={tk.x1}
            y1={tk.y1}
            x2={tk.x2}
            y2={tk.y2}
            stroke={ink[900]}
            strokeWidth={tk.major ? 1.3 : 0.6}
            opacity={tk.major ? 0.7 : 0.35}
          />
        ))}
        {thresholds.map((th, i) => (
          <line
            key={`t${i}`}
            x1={th.x1}
            y1={th.y1}
            x2={th.x2}
            y2={th.y2}
            stroke={th.col}
            strokeWidth={2.4}
          />
        ))}
        <circle cx={c} cy={c} r={rArc} fill={paper[50]} stroke={alpha(ink[900], 0.2)} strokeWidth={7} />
        <circle
          cx={c}
          cy={c}
          r={rArc}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          transform={`rotate(-90 ${c} ${c})`}
        />
        <circle cx={c} cy={c} r={rArc - 6.5} fill="none" stroke={alpha(ink[900], 0.3)} strokeWidth={0.8} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div
            className="font-display text-dial font-black tabular-nums tracking-tight"
            style={{ color: RISK_INK[category] }}
          >
            {Math.max(0, value)}
          </div>
          <div className="mt-1 font-mono text-label font-semibold uppercase tracking-[0.2em] text-ink-400">
            / 100
          </div>
        </div>
      </div>
    </div>
  );
}
