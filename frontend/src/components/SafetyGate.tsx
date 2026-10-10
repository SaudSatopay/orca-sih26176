import { useId, useState } from "react";
import type { DataHealth, HealthStatus, Language, SafetyDecision } from "../types";
import { GATE } from "../i18n/gate";
import { useFirstSight } from "../firstSight";
import { ageText, freshCount, gateTone, shownReasons, type GateTone } from "../gateModel";
import { fill } from "./todayModel";

/** The strip's ground and rule per state: status colours, never decoration. */
const TONE_CLASS: Record<GateTone, string> = {
  go: "border-b",
  caution: "border-b border-risk-moderate/40 bg-risk-moderate/[0.07]",
  insufficient: "border-b border-dashed border-ink-400 bg-ink-900/[0.035]",
  nogo: "border-b border-risk-extreme/30 bg-risk-extreme/[0.05]",
};

const TONE_INK: Record<GateTone, string> = {
  go: "text-risk-low",
  caution: "text-risk-moderate",
  insufficient: "text-ink-700",
  nogo: "text-risk-extreme",
};

const STATUS_INK: Record<HealthStatus, string> = {
  FRESH: "text-risk-low",
  STALE: "text-risk-moderate",
  MISSING: "text-risk-extreme",
  ERROR: "text-risk-extreme",
};

/**
 * The evidence check: the safety gate's verdict on the readings behind an
 * answer. One quiet line when every critical input is fresh; the gate's
 * reasons, in the answer's language, when one is stale or missing. The
 * inputs table (source, age, limit, status) opens on request: transparency,
 * not precision ORCA does not have.
 */
export default function SafetyGate({
  decision,
  health = [],
  language = "en",
  answerLang,
}: {
  decision: SafetyDecision;
  health?: DataHealth[];
  /** The reader's language: the strip's own labels print in it. */
  language?: Language;
  /** The language the backend wrote the reasons and details in. */
  answerLang?: Language;
}) {
  const g = GATE[language] ?? GATE.en;
  const tone = gateTone(decision.state);
  const { fresh, total } = freshCount(health);
  const reasons = shownReasons(decision);
  const [open, setOpen] = useState(false);
  const tableId = useId();
  // The stamp lands when this decision first appears, not on every remount.
  const stamped = useFirstSight(`gate:${decision.timestamp}:${decision.state}:${decision.drill}`);
  const [colInput, colSource, colAge, colLimit, colStatus] = g.cols.split("|");

  return (
    <section
      className={`safety-gate ${TONE_CLASS[tone]}`}
      style={tone === "go" ? { borderColor: "var(--rule-faint)" } : undefined}
      aria-label={g.title}
      data-gate={decision.state}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-2.5">
        <span className="label">{g.title}</span>
        <span
          key={`${decision.state}-${decision.timestamp}`}
          className={`stamp ${stamped ? "animate-stampIn" : ""} text-label ${TONE_INK[tone]}`}
        >
          {g.state[decision.state]}
        </span>
        <span className="font-mono text-label uppercase tracking-[0.12em] text-ink-500">
          {g.confidence[decision.confidence]}
        </span>
        {total > 0 && (
          <span className="font-mono text-label tabular-nums text-ink-500">
            {fill(g.freshCount, { n: fresh, total })}
          </span>
        )}
        {health.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={tableId}
            className="press ml-auto font-mono text-label font-bold text-chart-700 underline-offset-2 hover:underline"
          >
            {open ? g.hide : g.show}
          </button>
        )}
      </div>

      {reasons.length > 0 && (
        <ul className="space-y-1 px-5 pb-3" lang={answerLang} aria-live="polite">
          {reasons.map((r, i) => (
            <li key={i} className="max-w-[78ch] text-body leading-snug text-ink-800">
              {r}
            </li>
          ))}
        </ul>
      )}

      {health.length > 0 && (
        <div id={tableId} hidden={!open} className="overflow-x-auto px-5 pb-3">
          <table className="w-full min-w-[560px] text-left font-mono text-label">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--rule)" }}>
                {[colInput, colSource, colAge, colLimit, colStatus].map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="py-1.5 pr-3 font-bold uppercase tracking-[0.12em] text-ink-400 last:pr-0"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-ink-800" lang={answerLang}>
              {health.map((h) => (
                <tr key={h.input} className="border-t" style={{ borderColor: "var(--rule-faint)" }}>
                  <th scope="row" className="py-1.5 pr-3 font-sans font-normal">
                    {h.label}
                    {h.critical && (
                      <span className="ml-2 font-mono uppercase tracking-[0.1em] text-ink-400">
                        {g.critical}
                      </span>
                    )}
                  </th>
                  <td className="py-1.5 pr-3 text-ink-500">{h.source}</td>
                  <td className="whitespace-nowrap py-1.5 pr-3 tabular-nums">
                    {h.age_seconds != null
                      ? ageText(h.age_seconds, language)
                      : h.available && h.freshness_limit_seconds == null
                        ? g.bundled
                        : "—"}
                  </td>
                  <td className="whitespace-nowrap py-1.5 pr-3 tabular-nums text-ink-500">
                    {h.freshness_limit_seconds != null ? ageText(h.freshness_limit_seconds, language) : "—"}
                  </td>
                  <td className={`whitespace-nowrap py-1.5 font-bold ${STATUS_INK[h.status]}`}>
                    {g.status[h.status]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
