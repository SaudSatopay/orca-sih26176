import { useId, useState } from "react";
import type { DataHealth, Language } from "../types";
import { GATE } from "../i18n/gate";
import { freshCount } from "../gateModel";
import { fill } from "./todayModel";
import FreshnessBar from "./FreshnessBar";
import { STATUS_INK, freshnessLabel, freshnessScale } from "./evidence";

/**
 * The Evidence Confidence panel on the phone: the same source, freshness and
 * status per input as the console's, stacked for a narrow screen. Folded to
 * one line on clean evidence; open by itself when a critical input is stale
 * or missing. Transparency, not precision.
 */
export default function EvidenceList({
  health = [],
  language,
  answerLang,
}: {
  health?: DataHealth[];
  /** The reader's language: the panel's own labels print in it. */
  language: Language;
  /** The language the backend wrote the labels and sources in. */
  answerLang?: Language;
}) {
  const g = GATE[language] ?? GATE.en;
  const troubled = health.some((h) => h.critical && h.status !== "FRESH");
  const [open, setOpen] = useState(troubled);
  const listId = useId();
  if (health.length === 0) return null;
  const { fresh, total } = freshCount(health);

  return (
    <div className="border-t px-4 pb-2 pt-1" style={{ borderColor: "var(--rule-faint)" }} data-panel="evidence-confidence">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={listId}
        className="press flex min-h-11 w-full items-center justify-between gap-3 text-left"
      >
        <span className="label">{g.panel}</span>
        <span className="flex items-center gap-2 font-mono text-label tabular-nums text-ink-500">
          {total > 0 && fill(g.freshCount, { n: fresh, total })}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
            className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M1.5 3.5 L5 7 L8.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div id={listId} hidden={!open}>
        <p className="text-body leading-snug text-ink-500">{g.panelNote}</p>
        <ul className="mt-1" lang={answerLang}>
          {health.map((h) => {
            const { age, limit } = freshnessLabel(h, language);
            const scale = freshnessScale(h);
            return (
              <li key={h.input} className="border-b py-2 last:border-b-0" style={{ borderColor: "var(--rule-faint)" }}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 text-body font-semibold leading-snug text-ink-900">
                    {h.label}
                    {h.critical && (
                      <span className="ml-1.5 font-mono text-label font-normal uppercase tracking-[0.1em] text-ink-400">
                        {g.critical}
                      </span>
                    )}
                  </span>
                  <span className={`shrink-0 font-mono text-label font-bold ${STATUS_INK[h.status]}`} lang={language}>
                    {g.status[h.status]}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-label leading-snug text-ink-500">{h.source}</p>
                <p className="mt-0.5 font-mono text-label tabular-nums text-ink-700" lang={language}>
                  {age}
                  {limit && <span className="text-ink-500"> · {limit}</span>}
                </p>
                {scale && <FreshnessBar {...scale} />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
