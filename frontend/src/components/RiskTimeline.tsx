import { useEffect, useMemo, useRef, useState } from "react";
import * as api from "../api";
import type { Language, Location, TimelinePoint } from "../types";
import { RISK_BANDS, RISK_COLOR, RISK_INK } from "../risk";
import { L } from "../i18n/riskTimeline";
import { CATEGORY } from "../i18n/riskCard";
import { chart, ink, paper, risk, typePx } from "../tokens";

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
  // The series is kept with the position it was read for, so a new position
  // shows the loading state until its own series arrives.
  const [loaded, setLoaded] = useState<{ lat: number; lon: number; points: TimelinePoint[] } | null>(
    null,
  );
  // The chart fills its panel: the viewBox is drawn at the measured width, so
  // there is no letterbox at any panel size. Text is set in px of the viewBox,
  // which equals CSS px because width and viewBox agree.
  const frameRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(0);
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setMeasured(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  });
  const t = L[language] ?? L.en;
  const band = CATEGORY[language] ?? CATEGORY.en;
  const lat = location?.latitude;
  const lon = location?.longitude;
  const points = loaded && loaded.lat === lat && loaded.lon === lon ? loaded.points : null;

  useEffect(() => {
    if (lat == null || lon == null) return;
    let alive = true;
    api
      .riskTimeline(lat, lon, 24)
      .then((d) => alive && setLoaded({ lat, lon, points: d.points }))
      .catch(() => alive && setLoaded({ lat, lon, points: [] }));
    return () => {
      alive = false;
    };
  }, [lat, lon]);

  const window = useMemo(() => (points ? bestWindow(points) : null), [points]);

  if (!location) return null;
  if (!points)
    return (
      <div className="panel flex items-center gap-3 p-5 text-body leading-5 text-ink-500" role="status">
        <span className="wave-rule w-12 shrink-0" aria-hidden />
        {t.loading}
      </div>
    );
  if (!points.length) return null;

  // Drawn at the panel's own width: no letterbox, one CSS px per viewBox unit.
  const W = Math.max(measured, 320);
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
    <section className="panel overflow-hidden">
      <div className="hd !items-center">
        <div className="min-w-0">
          <h2 className="font-display text-lead font-bold text-ink-900">{t.title}</h2>
          <p className="mt-0.5 text-label text-ink-500">{t.sub}</p>
        </div>
        {window ? (
          <span className="shrink-0 border border-dashed border-risk-low/70 bg-risk-low/[0.07] px-2.5 py-1 font-mono text-label font-bold tabular-nums text-risk-low">
            {t.best}: {String(points[window[0]].hour).padStart(2, "0")}:00–
            {String((points[window[1]].hour + 1) % 24).padStart(2, "0")}:00
          </span>
        ) : (
          // A finding, not a verdict: the flat boxed tag, never the stamp.
          <span className="shrink-0 border border-risk-extreme bg-paper-50 px-1.5 py-0.5 font-mono text-label font-bold uppercase tracking-[0.1em] text-risk-extreme">
            {t.none}
          </span>
        )}
      </div>

      <div ref={frameRef} className="px-3 pb-3 pt-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 150 }}
          role="img"
          aria-label={t.chart
            .replace("{peak}", String(peak.score))
            .replace("{hour}", String(peak.hour).padStart(2, "0"))}
        >
          <defs>
            <linearGradient id="riskArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chart[500]} stopOpacity="0.22" />
              <stop offset="100%" stopColor={chart[500]} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* risk bands */}
          {RISK_BANDS.map((b) => ({
            from: b.from,
            to: b.max,
            color: RISK_COLOR[b.category],
          })).map((b) => (
            <rect
              key={b.from}
              x={padX}
              y={y(b.to)}
              width={W - padX * 2}
              height={Math.max(0, y(b.from) - y(b.to))}
              fill={b.color}
              opacity={0.055}
            />
          ))}

          {/* band names, written in the margin at the right edge */}
          {RISK_BANDS.map((b) => (
            <text
              key={`bn${b.category}`}
              x={W - padX - 4}
              y={(y(b.from) + y(b.max)) / 2 + 3.5}
              fill={ink[400]}
              fontSize={typePx.label}
              fontWeight="600"
              textAnchor="end"
              letterSpacing="0.08em"
              fontFamily="'Spline Sans Mono Variable', monospace"
            >
              {band[b.category] ?? b.category}
            </text>
          ))}

          {/* hour grid, as chart graticule */}
          {points.map((_, i) =>
            i % 4 === 0 && i > 0 ? (
              <line
                key={`g${i}`}
                x1={x(i)}
                y1={padTop}
                x2={x(i)}
                y2={padTop + plotH}
                stroke={ink[900]}
                strokeWidth="0.5"
                opacity="0.12"
              />
            ) : null,
          )}

          {/* safe window highlight */}
          {window && (
            <rect
              x={x(window[0]) - stepX / 2}
              y={padTop}
              width={(window[1] - window[0] + 1) * stepX}
              height={plotH}
              fill={risk.low}
              opacity={0.1}
            />
          )}
          {window && (
            <rect
              x={x(window[0]) - stepX / 2}
              y={padTop}
              width={(window[1] - window[0] + 1) * stepX}
              height={plotH}
              fill="none"
              stroke={risk.low}
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity={0.55}
            />
          )}

          <path d={area} fill="url(#riskArea)" />
          <path d={line} fill="none" stroke={ink[900]} strokeWidth={2} strokeLinejoin="round" />

          {/* per-hour dots coloured by category */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(p.score)}
              r={p.warning ? 3.8 : 2.7}
              fill={RISK_COLOR[p.category]}
              stroke={p.warning ? paper[50] : "none"}
              strokeWidth={p.warning ? 1.4 : 0}
            >
              <title>
                {String(p.hour).padStart(2, "0")}:00 — {p.score}/100 {band[p.category] ?? p.category}
                {p.wave_height_m != null ? ` · ${t.wave} ${p.wave_height_m} m` : ""}
                {p.wind_speed_kmh != null ? ` · ${t.wind} ${p.wind_speed_kmh} km/h` : ""}
                {p.warning ? ` · ${t.warning}` : ""}
              </title>
            </circle>
          ))}

          {/* now marker */}
          <line
            x1={x(nowIdx)}
            y1={padTop - 4}
            x2={x(nowIdx)}
            y2={padTop + plotH}
            stroke={chart[500]}
            strokeWidth={1.3}
            strokeDasharray="4 4"
          />
          <text
            x={x(nowIdx) + 5}
            y={padTop + 6}
            fill={chart[500]}
            fontSize={typePx.label}
            fontWeight="700"
            fontFamily="'Spline Sans Mono Variable', monospace"
          >
            {t.now} · {points[nowIdx].score}
          </text>

          {/* peak label — a sounding above the worst hour */}
          <text
            x={Math.min(W - 60, Math.max(30, x(points.indexOf(peak))))}
            y={Math.max(14, y(peak.score) - 7)}
            fill={RISK_INK[peak.category]}
            fontSize={typePx.body}
            fontWeight="700"
            fontStyle="italic"
            textAnchor="middle"
            fontFamily="'Fraunces Variable', Georgia, serif"
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
                fill={ink[400]}
                fontSize={typePx.label}
                textAnchor="middle"
                fontFamily="'Spline Sans Mono Variable', monospace"
              >
                {String(p.hour).padStart(2, "0")}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </section>
  );
}
