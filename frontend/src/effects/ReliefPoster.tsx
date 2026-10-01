import { createContext, useContext, useId, useMemo, type ReactNode } from "react";
import type { Language } from "../types";
import { RELIEF } from "../i18n/relief";
import { HERO } from "../i18n/hero";
import {
  BUOYS,
  CHANNEL_AREA,
  HARBOUR,
  NO_LEAN,
  RESTRICTED_AREA,
  SOUNDINGS,
  TINT_WASH,
  VIEW,
  coastline,
  course,
  depthAt,
  directTrack,
  outline,
  project,
  reliefChart,
  type Lean,
  type Point,
} from "./bathymetry";

/**
 * Effect 2 — the relief sheet's poster, and the ink both drawings share.
 *
 * The poster is the design: a finished, static, top-down chart of the sea bed
 * off Mumbai in the house language. Most visitors only ever see this (a
 * window under 1024 px, a touch device, reduced motion), so nothing here
 * waits on the 3D sheet.
 *
 * `ReliefInk` is everything printed over the sea bed: the hatched areas, the
 * tracks, the buoys and every word. It draws through `project()`, so with no
 * lean it is the poster's overprint, and given the 3D sheet's lean it lies on
 * the relief. Words therefore stay in the DOM in both drawings.
 */

const LanguageContext = createContext<Language>("en");

/** The 3D sheet is mounted by the slot with no props of ours; it reads the language from here. */
export function ReliefLanguage({ language, children }: { language: Language; children: ReactNode }) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

const f = (n: number) => n.toFixed(1);

function pathOf(points: readonly Point[], lean: Lean, closed = false): string {
  let d = "";
  points.forEach(([u, v], n) => {
    const [x, y] = project(u, v, lean);
    d += `${n === 0 ? "M" : "L"}${f(x)} ${f(y)}`;
  });
  return closed ? `${d}Z` : d;
}

const HALO = { paintOrder: "stroke" } as const;

/** The overprint: areas, tracks, buoys and words, lying on the sheet at a lean. */
export function ReliefInk({ lean = NO_LEAN }: { lean?: Lean }) {
  const language = useContext(LanguageContext);
  const t = RELIEF[language] ?? RELIEF.en;
  const hero = HERO[language] ?? HERO.en;
  const chart = reliefChart();
  const at = (x: number, y: number) => project(x / VIEW.w, y / VIEW.h, lean);
  const track = (units: number) => (t.tracked ? units : 0);

  const fixed = useMemo(
    () => ({
      course: course(),
      direct: directTrack(),
      restricted: outline(RESTRICTED_AREA),
      channel: outline(CHANNEL_AREA, 5),
      soundings: SOUNDINGS.map((s) => ({ ...s, depth: Math.round(depthAt(s.x / VIEW.w, s.y / VIEW.h)) })),
    }),
    [],
  );

  const [nx, ny] = at(302, 222);
  const [cx, cy] = at(402, 239);
  const [dx, dy] = at(262, 274);
  const [sx, sy] = at(266, 137);
  const [mx, my] = at(522, 150);
  const [shx, shy] = at(165, 72);
  const [bkx, bky] = at(146, 297);
  const [hx, hy] = at(HARBOUR.x, HARBOUR.y);

  return (
    <g>
      {/* the areas the direct track would cross */}
      <path
        d={pathOf(fixed.restricted, lean, true)}
        fill="url(#hatch-critical)"
        className="stroke-risk-extreme"
        strokeWidth="1.3"
        strokeDasharray="7 4"
      />
      <path
        d={pathOf(fixed.channel, lean, true)}
        fill="url(#hatch-warning)"
        className="stroke-risk-high"
        strokeWidth="1.1"
        strokeDasharray="6 4"
      />

      {/* spot depths */}
      {fixed.soundings.map((s) => {
        const [x, y] = at(s.x, s.y);
        return (
          <text key={`${s.x}-${s.y}`} x={f(x)} y={f(y)} textAnchor="middle" className="sounding fill-chart-600" fontSize="10.5" opacity="0.8">
            {s.depth}
          </text>
        );
      })}

      {/* each contour says how deep it is */}
      {chart.labels.map((l) => {
        const [x, y] = project(l.u, l.v, lean);
        return (
          <text
            key={`${l.level}-${l.u}`}
            x={f(x)}
            y={f(y + 3.2)}
            textAnchor="middle"
            className="sounding fill-ink-700 stroke-paper-50"
            strokeWidth="3.2"
            strokeLinejoin="round"
            style={HALO}
            fontSize="9.5"
          >
            {l.level}
          </text>
        );
      })}

      {/* what the sea bed is called */}
      <text x={f(shx)} y={f(shy)} textAnchor="middle" className="fill-ink-500 font-display italic" fontSize="9.5" letterSpacing={track(0.6)}>
        {t.shoal}
      </text>
      <text x={f(bkx)} y={f(bky)} textAnchor="middle" className="fill-ink-500 font-display italic" fontSize="9.5" letterSpacing={track(0.6)}>
        {t.bank}
      </text>
      <text x={f(mx)} y={f(my)} textAnchor="middle" className="fill-ink-500 font-display italic" fontSize="13" letterSpacing={track(2.5)}>
        {t.place}
      </text>

      <text
        x={f(nx)}
        y={f(ny)}
        textAnchor="middle"
        className="fill-risk-extreme stroke-paper-50 font-mono font-bold uppercase"
        strokeWidth="2.6"
        strokeLinejoin="round"
        style={HALO}
        fontSize="8"
        letterSpacing={track(1.2)}
      >
        {hero.naval}
      </text>
      <text
        x={f(cx)}
        y={f(cy)}
        textAnchor="middle"
        className="fill-risk-high stroke-paper-50 font-mono font-bold uppercase"
        strokeWidth="2.6"
        strokeLinejoin="round"
        style={HALO}
        fontSize="7.5"
        letterSpacing={track(1)}
      >
        {hero.channel}
      </text>

      {/* the direct track: shorter, and wrong */}
      <path d={pathOf(fixed.direct, lean)} className="stroke-ink-400" strokeWidth="1.5" strokeDasharray="2 6" fill="none" opacity="0.8" />
      <text
        x={f(dx)}
        y={f(dy)}
        className="fill-ink-500 stroke-paper-50 font-mono"
        strokeWidth="2.6"
        strokeLinejoin="round"
        style={HALO}
        fontSize="8.5"
        letterSpacing={track(0.6)}
      >
        {hero.direct} · 31.0 {t.km}
      </text>

      {/* the plotted course: cased in paper so it reads over the contours, and its dashes run */}
      <path d={pathOf(fixed.course, lean)} className="stroke-paper-50" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
      <path
        d={pathOf(fixed.course, lean)}
        className="route-live stroke-risk-low"
        strokeWidth="3"
        strokeDasharray="10 6"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x={f(sx)}
        y={f(sy)}
        className="fill-risk-low stroke-paper-50 font-mono font-bold uppercase"
        strokeWidth="2.6"
        strokeLinejoin="round"
        style={HALO}
        fontSize="9"
        letterSpacing={track(1)}
      >
        {hero.safest} · 36.4 {t.km}
      </text>

      {/* the harbour the boat leaves from */}
      <circle cx={f(hx)} cy={f(hy)} r="5.5" className="fill-ink-900 stroke-paper-50" strokeWidth="1.8" />

      {/* the grounds, numbered by rank */}
      {BUOYS.map((b) => {
        const [x, y] = at(b.x, b.y);
        const lead = b.n === 1;
        return (
          <g key={b.n} transform={`translate(${f(x)} ${f(y)})`}>
            <circle r={lead ? 13 : 10} className="fill-paper-50 stroke-risk-low" strokeWidth={lead ? 3.4 : 2.6} />
            <text y={lead ? 4.8 : 3.9} textAnchor="middle" className="fill-ink-900 font-display font-extrabold" fontSize={lead ? 13.5 : 11}>
              {b.n}
            </text>
          </g>
        );
      })}

      {/* north */}
      <g transform="translate(556 286)" opacity="0.85">
        <circle r="17" className="fill-paper-50 stroke-ink-900" strokeWidth="1.1" fillOpacity="0.6" />
        <path d="M0 -14 L3.6 4.5 L0 8 L-3.6 4.5 Z" className="fill-ink-900" />
        <text y="-20.5" textAnchor="middle" className="fill-ink-900 font-mono" fontSize="7.5">
          {t.north}
        </text>
      </g>
    </g>
  );
}

/** The finished chart, top-down: tints, contours, coast and the overprint. */
export default function ReliefPoster({ language }: { language: Language }) {
  const t = RELIEF[language] ?? RELIEF.en;
  const id = useId();
  const chart = reliefChart();

  const base = useMemo(() => {
    const coast = coastline();
    return {
      tints: chart.tints.map((tint) => ({
        level: tint.level,
        d: tint.regions.map((r) => pathOf(r.points, NO_LEAN, true)).join(""),
      })),
      lines: chart.lines.map((line) => ({ level: line.level, d: pathOf(line.points, NO_LEAN, line.closed) })),
      land: `${pathOf(coast, NO_LEAN)}L${VIEW.w} ${VIEW.h}L${VIEW.w} 0Z`,
      coast: pathOf(coast, NO_LEAN),
    };
  }, [chart]);

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="relief-poster absolute inset-0 h-full w-full"
      role="img"
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-desc`}
    >
      <title id={`${id}-name`}>{t.chartName}</title>
      <desc id={`${id}-desc`}>{t.chartDesc}</desc>

      {/* paper, then one wash of sea per level: the shallower, the bluer */}
      <rect width={VIEW.w} height={VIEW.h} className="fill-paper-50" />
      {base.tints.map((tint) => (
        <path key={tint.level} d={tint.d} fillRule="evenodd" className="fill-chart-500" opacity={TINT_WASH} />
      ))}

      {/* graticule */}
      {[66, 132, 198, 264].map((y) => (
        <line key={y} x1="0" y1={y} x2={VIEW.w} y2={y} className="stroke-chart-500" strokeWidth="0.5" opacity="0.2" />
      ))}
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2={VIEW.h} className="stroke-chart-500" strokeWidth="0.5" opacity="0.2" />
      ))}

      {/* each layer of paper shades the one below it: a soft line just seaward of every contour */}
      <g transform="translate(-1.5 1.3)" opacity="0.09">
        {base.lines.map((line, n) => (
          <path key={n} d={line.d} fill="none" className="stroke-ink-900" strokeWidth="3.4" strokeLinejoin="round" />
        ))}
      </g>

      {/* contours in ink; every other level is drawn heavier, as an index line */}
      {base.lines.map((line, n) => (
        <path
          key={n}
          d={line.d}
          fill="none"
          className="stroke-ink-500"
          strokeWidth={line.level % 20 === 10 ? 1.15 : 0.75}
          strokeLinejoin="round"
          opacity={line.level % 20 === 10 ? 0.8 : 0.62}
        />
      ))}

      {/* the coast */}
      <path d={base.land} className="fill-paper-200" />
      <path d={base.coast} className="stroke-chart-500" strokeWidth="5" fill="none" opacity="0.14" />
      <path d={base.coast} className="stroke-ink-500" strokeWidth="1.2" fill="none" />

      <ReliefLanguage language={language}>
        <ReliefInk />
      </ReliefLanguage>
    </svg>
  );
}
