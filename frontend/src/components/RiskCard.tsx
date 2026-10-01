import type { Evidence, Language, RiskAssessment } from "../types";
import { useFirstSight } from "../firstSight";
import { LockGlyph } from "./glyphs";
import { RISK_COLOR, RISK_INK } from "../risk";
import { pairs } from "../crew";
import RiskDial from "./RiskDial";
import { CATEGORY, FACTOR, UI, VERDICT } from "../i18n/riskCard";

/** How many reasons get a bar of their own; the rest share one line. */
const RANKED = 4;

/**
 * The verdict: the first thing the answer column shows. The dial and the
 * stamped band on the left, the ranked reasons beside them, and under both
 * the deterministic overrides — the rules no model can talk down.
 *
 * `evidence` is accepted so the count can be announced with the verdict; the
 * ledger itself is its own panel further down the sheet.
 */
export default function RiskCard({
  risk,
  evidence,
  language = "en",
}: {
  risk: RiskAssessment;
  evidence: Evidence[];
  language?: Language;
}) {
  const ui = UI[language] ?? UI.en;
  const band = (CATEGORY[language] ?? CATEGORY.en)[risk.category] ?? risk.category;
  const names = FACTOR[language] ?? FACTOR.en;
  const color = RISK_COLOR[risk.category];
  const printed = RISK_INK[risk.category];
  const reasons = risk.factors.filter((f) => f.contribution > 0);
  const ranked = reasons.slice(0, RANKED);
  const rest = reasons.slice(RANKED);
  const max = Math.max(...ranked.map((f) => f.contribution), 1);
  const lead = ranked
    .slice(0, 2)
    .map((f) => f.detail)
    .filter(Boolean)
    .join(" · ");
  const dataMode = pairs(ui.data)[risk.mode] ?? risk.mode;
  // The stamp, the count and the bars belong to this reading. They play when
  // it arrives and stay still when the sheet is only opened again.
  const fresh = useFirstSight(`risk:${risk.generated_at}:${risk.category}:${risk.score}`);

  return (
    <section className="verdict panel rule-double overflow-hidden" aria-labelledby="verdict-words">
      <div className="verdict-body">
        <div className="flex items-center gap-5 p-5">
          <RiskDial score={risk.score} category={risk.category} label={band} size={124} fresh={fresh} />
          <div className="min-w-0 flex-1">
            <p className="label">
              {ui.verdict} · {ui.outOf.replace("{n}", String(risk.score))}
            </p>
            <h2
              id="verdict-words"
              className="mt-1 font-display text-headline font-bold leading-tight tracking-tight"
              style={{ color: printed }}
            >
              {(VERDICT[language] ?? VERDICT.en)[risk.category]}
            </h2>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
              {/* the verdict, stamped on the document */}
              <span
                key={`${risk.category}-${risk.score}`}
                className={`stamp ${fresh ? "animate-stampIn" : ""} text-label`}
                style={{ color: printed }}
              >
                {band}
              </span>
              {risk.official_warning && (
                <span
                  className={`stamp ${fresh ? "animate-stampIn" : ""} text-label text-risk-extreme`}
                  style={{ animationDelay: "120ms" }}
                >
                  {ui.warning}
                </span>
              )}
              <span className="font-mono text-label uppercase tracking-[0.14em] text-ink-400">
                {dataMode}
              </span>
            </div>
            {lead && <p className="mt-2.5 text-body leading-snug text-ink-700">{lead}</p>}
            {risk.window && (
              <p className="mt-2.5 border border-dashed border-risk-low/70 bg-risk-low/[0.07] px-3 py-2 text-body leading-snug text-risk-low">
                {ui.improves} <span className="font-display font-bold">{risk.window}</span>{" "}
                {ui.askAgain}
              </p>
            )}
          </div>
        </div>

        {/* why */}
        <div className="verdict-why px-5 py-4">
          <h3 className="label mb-2.5">{ui.why}</h3>
          <ol className="space-y-2.5">
            {ranked.map((f) => (
              <li key={f.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 text-body font-semibold leading-5 text-ink-900">
                    {names[f.key] ?? f.label}
                  </span>
                  <span
                    className="shrink-0 font-mono text-body font-bold tabular-nums leading-5"
                    style={{ color: printed }}
                  >
                    +{f.contribution.toFixed(1)}
                  </span>
                </div>
                <div className="mt-1 h-[3px] overflow-hidden bg-ink-900/10">
                  <div
                    className={`${fresh ? "grow-x" : ""} h-full`}
                    style={{ width: `${(f.contribution / max) * 100}%`, background: color }}
                  />
                </div>
                {f.detail && (
                  <p className="mt-1 text-label leading-snug text-ink-500">{f.detail}</p>
                )}
              </li>
            ))}
          </ol>
          {rest.length > 0 && (
            <p className="mt-2.5 text-label leading-snug text-ink-500">
              {ui.moreReasons}:{" "}
              {rest.map((f, i) => (
                <span key={f.key}>
                  {i > 0 && " · "}
                  {names[f.key] ?? f.label}{" "}
                  <span className="font-mono tabular-nums text-ink-700">
                    +{f.contribution.toFixed(1)}
                  </span>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* deterministic overrides — the trust moment */}
      {risk.overrides.length > 0 && (
        <div className="hatch-danger border-t border-risk-extreme/40 px-5 py-3.5">
          <h3 className="label mb-2 !text-risk-extreme">{ui.overrides}</h3>
          <ul className="space-y-1.5">
            {risk.overrides.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-body font-medium text-ink-800">
                <LockGlyph size={13} className="mt-0.5 shrink-0 text-risk-extreme" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 max-w-[75ch] text-label italic leading-relaxed text-ink-500">
            {ui.overrideNote}
          </p>
        </div>
      )}

      <p className="sr-only">
        {ui.evidence}: {evidence.length} {ui.traced}
      </p>
    </section>
  );
}
