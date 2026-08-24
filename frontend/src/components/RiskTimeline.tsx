import { useEffect, useMemo, useState } from "react";
import * as api from "../api";
import type { Language, Location, TimelinePoint } from "../types";
import { RISK_COLOR } from "./RiskDial";

const L: Record<Language, Record<string, string>> = {
  en: {
    title: "When is it safe to go?",
    sub: "Risk hour by hour for the next 24 hours",
    best: "Best window",
    none: "No low-risk window in the next 24 hours",
    now: "now",
    loading: "Reading the next 24 hours…",
  },
  hi: {
    title: "कब जाना सुरक्षित है?",
    sub: "अगले 24 घंटों का घंटेवार जोखिम",
    best: "सर्वोत्तम समय",
    none: "अगले 24 घंटों में कोई सुरक्षित समय नहीं",
    now: "अभी",
    loading: "अगले 24 घंटे पढ़ रहे हैं…",
  },
  mr: {
    title: "कधी जाणे सुरक्षित आहे?",
    sub: "पुढील २४ तासांचा तासागणिक धोका",
    best: "सर्वोत्तम वेळ",
    none: "पुढील २४ तासांत सुरक्षित वेळ नाही",
    now: "आत्ता",
    loading: "पुढील २४ तास वाचत आहे…",
  },
};

/** Longest run of hours at or below `limit`, returned as [startHour, endHour]. */
function bestWindow(points: TimelinePoint[], limit = 50): [number, number] | null {
  let best: [number, number] | null = null;
  let start: number | null = null;
  points.forEach((p, i) => {
    const safe = p.score <= limit && !p.warning;
    if (safe && start === null) start = i;
    const ending = !safe || i === points.length - 1;
    if (ending && start !== null) {
      const end = safe ? i : i - 1;
      if (!best || end - start > best[1] - best[0]) best = [start, end];
      start = null;
    }
  });
  return best;
}

export default function RiskTimeline({
  location,
  language = "en",
}: {
  location: Location | null;
  language?: Language;
}) {
  const [points, setPoints] = useState<TimelinePoint[] | null>(null);
  const t = L[language] ?? L.en;

  useEffect(() => {
    if (!location) return;
    let alive = true;
    setPoints(null);
    api
      .riskTimeline(location.latitude, location.longitude, 24)
      .then((d) => alive && setPoints(d.points))
      .catch(() => alive && setPoints([]));
    return () => {
      alive = false;
    };
  }, [location?.latitude, location?.longitude]);

  const window = useMemo(() => (points ? bestWindow(points) : null), [points]);

  if (!location) return null;
  if (!points) return <div className="card p-5 text-sm text-ocean-300">{t.loading}</div>;
  if (!points.length) return null;

  const W = 720;
  const H = 150;
  const padX = 8;
  const padTop = 12;
  const padBottom = 26;
  const plotH = H - padTop - padBottom;
  const stepX = (W - padX * 2) / (points.length - 1);
  const x = (i: number) => padX + i * stepX;
  const y = (score: number) => padTop + plotH * (1 - score / 100);

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${padTop + plotH} L${padX},${padTop + plotH} Z`;

  const nowIdx = 0; // the series starts at the current hour
  const peak = points.reduce((a, b) => (b.score > a.score ? b : a), points[0]);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-4">
        <div>
          <h3 className="text-sm font-bold text-ocean-100">{t.title}</h3>
          <p className="mt-0.5 text-[11px] text-ocean-300/75">{t.sub}</p>
        </div>
        {window ? (
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-bold text-emerald-200">
            {t.best}: {String(points[window[0]].hour).padStart(2, "0")}:00 –{" "}
            {String((points[window[1]].hour + 1) % 24).padStart(2, "0")}:00
          </span>
        ) : (
          <span className="rounded-full bg-risk-extreme/20 px-3 py-1 text-[11px] font-bold text-red-200">
            {t.none}
          </span>
        )}
      </div>

      <div className="px-3 pb-3 pt-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 150 }}>
          <defs>
            <linearGradient id="riskArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7FB2E5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7FB2E5" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* risk bands */}
          {[
            { from: 0, to: 25, color: RISK_COLOR.LOW },
            { from: 25, to: 50, color: RISK_COLOR.MODERATE },
            { from: 50, to: 79, color: RISK_COLOR.HIGH },
            { from: 79, to: 100, color: RISK_COLOR.EXTREME },
          ].map((b) => (
            <rect
              key={b.from}
              x={padX}
              y={y(b.to)}
              width={W - padX * 2}
              height={Math.max(0, y(b.from) - y(b.to))}
              fill={b.color}
              opacity={0.07}
            />
          ))}

          {/* safe window highlight */}
          {window && (
            <rect
              x={x(window[0]) - stepX / 2}
              y={padTop}
              width={(window[1] - window[0] + 1) * stepX}
              height={plotH}
              fill="#1E7A4D"
              opacity={0.16}
              rx={6}
            />
          )}

          <path d={area} fill="url(#riskArea)" />
          <path d={line} fill="none" stroke="#BBD6F2" strokeWidth={2.5} strokeLinejoin="round" />

          {/* per-hour dots coloured by category */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(p.score)}
              r={p.warning ? 3.6 : 2.6}
              fill={RISK_COLOR[p.category]}
              stroke={p.warning ? "#fff" : "none"}
              strokeWidth={p.warning ? 1.2 : 0}
            >
              <title>
                {String(p.hour).padStart(2, "0")}:00 — {p.score}/100 {p.category}
                {p.wave_height_m != null ? ` · wave ${p.wave_height_m} m` : ""}
                {p.wind_speed_kmh != null ? ` · wind ${p.wind_speed_kmh} km/h` : ""}
                {p.warning ? " · official warning" : ""}
              </title>
            </circle>
          ))}

          {/* now marker */}
          <line
            x1={x(nowIdx)}
            y1={padTop - 4}
            x2={x(nowIdx)}
            y2={padTop + plotH}
            stroke="#7FB2E5"
            strokeWidth={1.4}
            strokeDasharray="4 4"
          />
          <text x={x(nowIdx) + 5} y={padTop + 6} fill="#7FB2E5" fontSize="10" fontWeight="600">
            {t.now}
          </text>

          {/* peak label */}
          <text
            x={Math.min(W - 60, Math.max(30, x(points.indexOf(peak))))}
            y={Math.max(14, y(peak.score) - 7)}
            fill={RISK_COLOR[peak.category]}
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
          >
            {peak.score}
          </text>

          {/* hour axis */}
          {points.map((p, i) =>
            i % 4 === 0 ? (
              <text
                key={`t${i}`}
                x={x(i)}
                y={H - 8}
                fill="#7C8199"
                fontSize="9.5"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {String(p.hour).padStart(2, "0")}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
}
