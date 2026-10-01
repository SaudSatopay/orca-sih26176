import { lazy, useId } from "react";
import type { Language } from "../types";
import { RELIEF } from "../i18n/relief";
import { EffectSlot } from "../effects/EffectSlot";
import ReliefPoster, { ReliefLanguage } from "../effects/ReliefPoster";
import { LEVELS, tintOf } from "../effects/bathymetry";
import "../effects/relief.css";

// Its own chunk (three, fiber, one drei line), fetched only when the slot
// mounts it: effects/gate.ts decides whether this browser gets more than the poster.
const ReliefSheet = lazy(() => import("../effects/ReliefSheet"));

/** Band edges under the depth key: 0, 5, 10 … 50. */
const EDGES = [0, ...LEVELS];

/**
 * Effect 2 — the sea bed under the hero's chart, as a paper relief.
 *
 * The same water the hero plots its course across, drawn by depth: the poster
 * is the finished chart, and on a wide window with a mouse the slot lifts it
 * into a 3D sheet. The relief is synthetic and says so beside the drawing.
 */
export default function ReliefSection({ language }: { language: Language }) {
  const t = RELIEF[language] ?? RELIEF.en;
  const id = useId();

  return (
    <section aria-labelledby={`${id}-title`} className="panel mt-5 overflow-hidden">
      <div className="hd">
        <span className="label">{t.kicker}</span>
      </div>

      <div className="grid items-center gap-x-7 gap-y-5 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 lg:pl-1">
          <h2
            id={`${id}-title`}
            className="font-display text-headline font-semibold leading-tight tracking-tight text-ink-900"
            style={{ textWrap: "balance" }}
          >
            {t.title}
          </h2>
          <p className="mt-3 max-w-[520px] text-body leading-relaxed text-ink-700" style={{ textWrap: "pretty" }}>
            {t.body}
          </p>

          {/* the key: depth washes, then the three marks printed on the sheet */}
          <div className="mt-4 max-w-[420px]">
            <div className="label flex items-baseline justify-between gap-3">
              <span>{t.depthKey}</span>
              <span className="normal-case tracking-normal">
                {t.shallow} → {t.deep}
              </span>
            </div>
            <div
              className="relief-key mt-1.5 grid grid-cols-7 overflow-hidden rounded-[2px] border bg-paper-50"
              style={{ borderColor: "var(--rule)" }}
              aria-hidden
            >
              {EDGES.map((edge, band) => (
                <i key={edge} style={{ opacity: tintOf(band) }} />
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 font-mono text-micro font-semibold tabular-nums text-ink-500" aria-hidden>
              {EDGES.map((edge) => (
                <span key={edge}>{edge}</span>
              ))}
            </div>
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-readout leading-tight text-ink-700">
            <li className="flex items-center gap-2">
              <svg width="26" height="8" viewBox="0 0 26 8" aria-hidden className="shrink-0">
                <path d="M2 4 H24" className="stroke-risk-low" strokeWidth="3" strokeDasharray="7 4.5" strokeLinecap="round" />
              </svg>
              {t.course}
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden className="shrink-0">
                <rect x="0.7" y="0.7" width="14.6" height="10.6" fill="url(#hatch-critical)" className="stroke-risk-extreme" strokeWidth="1.2" strokeDasharray="4 2.5" />
              </svg>
              {t.restricted}
            </li>
            <li className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="shrink-0">
                <circle cx="7" cy="7" r="5.2" className="fill-paper-50 stroke-risk-low" strokeWidth="2.2" />
              </svg>
              {t.ground}
            </li>
          </ul>

          {/* simulated values are always labelled */}
          <p
            className="mt-4 max-w-[520px] border-t pt-2.5 font-mono text-label font-semibold leading-relaxed text-ink-500"
            style={{ borderColor: "var(--rule-faint)" }}
          >
            {t.honesty}
          </p>
        </div>

        <ReliefLanguage language={language}>
          <EffectSlot
            name="relief"
            Effect={ReliefSheet}
            className="relief-frame chart-frame"
            poster={<ReliefPoster language={language} />}
          />
        </ReliefLanguage>
      </div>
    </section>
  );
}
