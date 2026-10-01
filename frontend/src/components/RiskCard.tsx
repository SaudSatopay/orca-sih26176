import { useState } from "react";
import type { Evidence, Language, RiskAssessment } from "../types";
import { LockGlyph } from "./glyphs";
import { RISK_COLOR } from "../risk";
import RiskDial from "./RiskDial";
import { UI, VERDICT } from "../i18n/riskCard";

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
  const [colValue, colReading, colSource, colUpdated] = ui.cols.split("|");
  const [showEvidence, setShowEvidence] = useState(false);
  const color = RISK_COLOR[risk.category];
  const top = risk.factors.filter((f) => f.contribution > 0).slice(0, 5);
  const max = Math.max(...top.map((f) => f.contribution), 1);

  return (
    <div className="panel rule-double overflow-hidden">
      <div className="flex items-center gap-5 p-5">
        <RiskDial score={risk.score} category={risk.category} />
        <div className="min-w-0 flex-1">
          <div
            className="font-display text-figure font-bold leading-tight tracking-tight"
            style={{ color }}
          >
            {(VERDICT[language] ?? VERDICT.en)[risk.category]}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            {/* the verdict, stamped on the document */}
            <span
              key={`${risk.category}-${risk.score}`}
              className="stamp animate-stampIn text-readout"
              style={{ color }}
            >
              {risk.category}
            </span>
            {risk.official_warning && (
              <span className="stamp animate-stampIn text-readout text-risk-extreme" style={{ animationDelay: "120ms" }}>
                {ui.warning}
              </span>
            )}
            <span className="font-mono text-label uppercase tracking-[0.14em] text-ink-400">
              {risk.mode} data
            </span>
          </div>
          {risk.window && (
            <div className="mt-3 border border-dashed border-risk-low/70 bg-risk-low/[0.07] px-3 py-2 text-body text-risk-low">
              {ui.improves} <span className="font-display font-bold">{risk.window}</span>{" "}
              {ui.askAgain}
            </div>
          )}
        </div>
      </div>

      {/* why */}
      <div className="border-t px-5 py-4" style={{ borderColor: "var(--rule-faint)" }}>
        <div className="label mb-3">{ui.why}</div>
        <ul className="space-y-2.5">
          {top.map((f) => (
            <li key={f.key}>
              <div className="flex items-baseline justify-between gap-3 text-prose leading-5">
                <span className="font-medium text-ink-800">{f.label}</span>
                <span className="shrink-0 font-mono text-small leading-4 font-bold tabular-nums" style={{ color }}>
                  +{f.contribution.toFixed(1)}
                </span>
              </div>
              <div className="mt-1.5 h-[3px] overflow-hidden bg-ink-900/10">
                <div
                  className="grow-x h-full transition-all duration-700"
                  style={{ width: `${(f.contribution / max) * 100}%`, background: color }}
                />
              </div>
              <div className="mt-1 text-readout leading-relaxed text-ink-400">{f.detail}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* deterministic overrides — the trust moment */}
      {risk.overrides.length > 0 && (
        <div className="hatch-danger border-t border-risk-extreme/40 px-5 py-3.5">
          <div className="label mb-2 !text-risk-extreme">{ui.overrides}</div>
          <ul className="space-y-1.5">
            {risk.overrides.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-small font-medium text-ink-800">
                <LockGlyph size={13} className="mt-0.5 shrink-0 text-risk-extreme" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-readout italic leading-relaxed text-ink-500">{ui.overrideNote}</p>
        </div>
      )}

      {/* evidence */}
      <div className="border-t px-5 py-3" style={{ borderColor: "var(--rule-faint)" }}>
        <button
          onClick={() => setShowEvidence((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="label">
            {ui.evidence} · {evidence.length} {ui.traced}
          </span>
          <span className="font-mono text-readout text-chart-600">
            {showEvidence ? ui.hide : ui.show}
          </span>
        </button>

        {showEvidence && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left font-mono text-readout">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--rule)" }}>
                  <th className="pb-1.5 pr-3 text-micro font-bold uppercase tracking-[0.12em] text-ink-400">{colValue}</th>
                  <th className="pb-1.5 pr-3 text-micro font-bold uppercase tracking-[0.12em] text-ink-400">{colReading}</th>
                  <th className="pb-1.5 pr-3 text-micro font-bold uppercase tracking-[0.12em] text-ink-400">{colSource}</th>
                  <th className="pb-1.5 text-micro font-bold uppercase tracking-[0.12em] text-ink-400">{colUpdated}</th>
                </tr>
              </thead>
              <tbody className="text-ink-800">
                {evidence.map((e, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--rule-faint)" }}>
                    <td className="py-1.5 pr-3 font-sans">{e.label}</td>
                    <td className="py-1.5 pr-3 font-bold tabular-nums">{e.value}</td>
                    <td className="py-1.5 pr-3 text-ink-500">{e.source}</td>
                    <td className="py-1.5 tabular-nums text-ink-500">
                      {e.timestamp?.slice(0, 16).replace("T", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
