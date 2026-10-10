import type { DataDrill as Drill, Language } from "../types";
import { GATE } from "../i18n/gate";
import { DRILLS } from "../gateModel";

/**
 * The safety-gate demo: four rehearsed states of the marine feed. Pressing one
 * sets it on the server and asks the question on screen again, so the same
 * sea is answered on different evidence: Healthy (GO), Stale (CAUTION),
 * Unavailable (INSUFFICIENT DATA), Recovery (GO again, no restart).
 */
export default function DataDrill({
  active,
  busy = false,
  language = "en",
  onDrill,
}: {
  active: Drill;
  busy?: boolean;
  language?: Language;
  onDrill: (drill: Drill) => void;
}) {
  const g = GATE[language] ?? GATE.en;
  return (
    <section
      className="panel flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5"
      aria-labelledby="data-drill-title"
    >
      <h2 id="data-drill-title" className="label">
        {g.drillTitle}
      </h2>
      <div className="flex flex-wrap gap-1" role="group" aria-labelledby="data-drill-title">
        {DRILLS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onDrill(d)}
            disabled={busy}
            aria-pressed={active === d}
            className={`press min-h-7 rounded-[2px] border px-2.5 py-1 font-mono text-label font-bold transition-colors ${
              active === d ? "border-ink-900 bg-ink-900 text-paper-50" : "text-ink-500 hover:text-ink-900"
            }`}
            style={active === d ? undefined : { borderColor: "var(--rule)" }}
          >
            {g.drills[d]}
          </button>
        ))}
      </div>
      <p className="text-label leading-snug text-ink-500">{g.drillHint}</p>
    </section>
  );
}
