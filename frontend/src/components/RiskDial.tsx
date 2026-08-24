import { useEffect, useState } from "react";
import type { RiskCategory } from "../types";

export const RISK_COLOR: Record<RiskCategory, string> = {
  LOW: "#1E7A4D",
  MODERATE: "#B8860B",
  HIGH: "#C55A11",
  EXTREME: "#B3372B",
};

/** Animated 0-100 dial. The number counts up so the verdict lands with weight. */
export default function RiskDial({
  score,
  category,
  size = 132,
}: {
  score: number;
  category: RiskCategory;
  size?: number;
}) {
  const [shown, setShown] = useState(0);
  const color = RISK_COLOR[category];
  const stroke = 11;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    const duration = 750;
    let raf = 0;
    const start = performance.now();
    const from = shown;

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
  }, [score]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(127,178,229,0.18)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - shown / 100)}
          style={{ transition: "stroke-dashoffset .12s linear" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div className="text-[34px] font-extrabold tabular-nums" style={{ color }}>
            {Math.max(0, shown)}
          </div>
          <div className="mt-0.5 text-[11px] font-medium text-ocean-300">/100</div>
        </div>
      </div>
    </div>
  );
}
