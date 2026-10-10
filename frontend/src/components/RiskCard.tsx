import type {
  AgentTrace,
  DataHealth,
  Evidence,
  Language,
  RiskAssessment,
  SafetyDecision,
} from "../types";
import { useFirstSight } from "../firstSight";
import { LockGlyph } from "./glyphs";
import { RISK_COLOR, RISK_INK } from "../risk";
import { CREW_SIZE, PHASES, pairs } from "../crew";
import RiskDial from "./RiskDial";
import SafetyGate from "./SafetyGate";
import { CATEGORY, FACTOR, INSTRUCTION, UI, VERDICT } from "../i18n/riskCard";
import { GATE } from "../i18n/gate";
import { T as TRACE_T } from "../i18n/agentTrace";
import { LANG_NAME } from "../i18n/app";
import { gateTempers, gateWithholds, scoreUnconfirmed } from "../gateModel";
import { BorderBeam } from "../ui/magicui/border-beam";
import { SonarDial } from "../ui/console/SonarDial";
import { ink } from "../tokens";

/** How many reasons get a bar of their own; the rest share one line. */
const RANKED = 4;

/**
 * One fixed scale for every "why" bar, on every answer: the largest factor
 * weight in /api/config is 0.25 (wave and cyclone), so no reading can add
 * more than 25 of the 100 points. +3.4 in a LOW answer now fills a seventh
 * of the track, not the whole of it.
 */
const MAX_CONTRIBUTION = 25;

/** The arrival beam: seconds per lap round the card, and how many laps. */
const BEAM_LAP_S = 2.2;
const BEAM_LAPS = 2;

/**
 * The verdict: the first thing the answer column shows. The dial and the
 * stamped verdict on the left, the ranked reasons beside them, and under both
 * the deterministic overrides — the rules no model can talk down.
 *
 * Labels speak the reader's language; the backend's own sentences (factor
 * details, overrides) keep the answer's language, marked with `lang=`.
 */
export default function RiskCard({
  risk,
  evidence,
  language = "en",
  answerLang,
  trace,
  elapsed,
  decision,
  health,
}: {
  risk: RiskAssessment;
  evidence: Evidence[];
  /** The reader's language: every label prints in it. */
  language?: Language;
  /** The language the answer itself was written in. */
  answerLang?: Language;
  /** The crew that produced this verdict, for the one-line foot. */
  trace?: AgentTrace[];
  elapsed?: number;
  /** The safety gate's verdict on the evidence behind this one. */
  decision?: SafetyDecision | null;
  health?: DataHealth[];
}) {
  const ui = UI[language] ?? UI.en;
  const gate = GATE[language] ?? GATE.en;
  // Insufficient data: ORCA gives no score and no stamp it cannot stand
  // behind. Caution: the verdict stands, marked as resting on old evidence.
  const withheld = gateWithholds(decision);
  const tempered = gateTempers(decision);
  const band = (CATEGORY[language] ?? CATEGORY.en)[risk.category] ?? risk.category;
  const names = FACTOR[language] ?? FACTOR.en;
  const color = RISK_COLOR[risk.category];
  const printed = withheld ? ink[700] : tempered ? RISK_INK.MODERATE : RISK_INK[risk.category];
  const reasons = risk.factors.filter((f) => f.contribution > 0);
  const ranked = reasons.slice(0, RANKED);
  const rest = reasons.slice(RANKED);
  const lead = ranked
    .slice(0, 2)
    .map((f) => f.detail)
    .filter(Boolean)
    .join(" · ");
  const dataMode = pairs(ui.data)[risk.mode] ?? risk.mode;
  const spoke = answerLang && answerLang !== language ? LANG_NAME[answerLang] : null;
  const crewT = TRACE_T[language] ?? TRACE_T.en;
  // The roster's fan-out width, the same ∥5 the trace badge prints.
  const gatherWide = PHASES.find((p) => p.key === "gather")?.agents.length ?? 5;
  // The stamp, the count and the bars belong to this reading. They play when
  // it arrives and stay still when the sheet is only opened again.
  // A new gate decision on the same sea (a drill changed) is a fresh verdict too.
  const fresh = useFirstSight(
    `risk:${risk.generated_at}:${risk.category}:${risk.score}:${decision?.state ?? ""}:${decision?.timestamp ?? ""}`,
  );
  // A fresh verdict is announced by a teal light running the card's neatline
  // twice, then gone. It decorates a verdict already on screen; opening the
  // same verdict again runs nothing.
  const beaming = useFirstSight(
    `risk-beam:${risk.generated_at}:${risk.category}:${risk.score}`,
    BEAM_LAP_S * BEAM_LAPS * 1000,
  );

  return (
    <section className="verdict panel rule-double overflow-hidden" aria-labelledby="verdict-words">
      {beaming && (
        // two laps of light round the fresh verdict, above its contents
        <div className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit]">
          <BorderBeam duration={BEAM_LAP_S} arc={90} borderWidth={3} />
        </div>
      )}
      {decision && (
        <SafetyGate
          key={decision.timestamp}
          decision={decision}
          health={health}
          language={language}
          answerLang={answerLang}
        />
      )}
      <div className="verdict-body">
        <div className="flex items-start gap-5 p-5">
          {withheld ? (
            <div className="flex shrink-0 flex-col items-center gap-2" style={{ width: 124 }}>
              <SonarDial size={124} />
              <span className="text-center font-mono text-label leading-snug text-ink-500">
                {gate.noScore}
              </span>
            </div>
          ) : (
            <RiskDial score={risk.score} category={risk.category} label={band} size={124} fresh={fresh} />
          )}
          <div className="min-w-0 flex-1">
            {withheld ? (
              <p className="label">
                {ui.verdict} · <span style={{ color: printed }}>{gate.state.INSUFFICIENT_DATA}</span>
              </p>
            ) : (
              <p className="label">
                {ui.verdict} · <span style={{ color: printed }}>{band}</span> ·{" "}
                <span className="tabular-nums">{risk.score}/100</span>
                {scoreUnconfirmed(decision) && <> · {gate.unconfirmed}</>}
              </p>
            )}
            <h2
              id="verdict-words"
              className="mt-1 font-display text-headline font-bold leading-tight tracking-tight"
              style={{ color: printed }}
            >
              {withheld
                ? gate.instruction.INSUFFICIENT_DATA
                : tempered
                  ? gate.instruction.CAUTION
                  : (INSTRUCTION[language] ?? INSTRUCTION.en)[risk.category]}
            </h2>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
              {/* the verdict, stamped on the document — the one verdict vocabulary;
                  on weak evidence the gate's word takes the stamp */}
              <span
                key={`${risk.category}-${risk.score}-${decision?.state ?? ""}`}
                className={`stamp ${fresh ? "animate-stampIn" : ""} text-label`}
                style={{ color: printed }}
              >
                {withheld
                  ? gate.state.INSUFFICIENT_DATA
                  : tempered
                    ? gate.state.CAUTION
                    : (VERDICT[language] ?? VERDICT.en)[risk.category]}
              </span>
              {/* No delay on the second stamp: without a fill-mode a delayed
                  stamp would sit at rest, jump out to 1.3x and land. The two
                  stamps land together. */}
              {risk.official_warning && (
                <span className={`stamp ${fresh ? "animate-stampIn" : ""} text-label text-risk-extreme`}>
                  {ui.warning}
                </span>
              )}
              {spoke && (
                <span className="chip !cursor-default !py-0.5 !text-label" lang={answerLang}>
                  {ui.answeredIn.replace("{lang}", spoke)}
                </span>
              )}
              <span className="font-mono text-label uppercase tracking-[0.14em] text-ink-400">
                {dataMode}
              </span>
            </div>
            {lead && !withheld && (
              <p className="mt-2.5 text-body leading-snug text-ink-700" lang={answerLang}>
                {lead}
              </p>
            )}
            {risk.window && (
              <p className="mt-2.5 border border-dashed border-risk-low/70 bg-risk-low/[0.07] px-3 py-2 text-body leading-snug text-risk-low">
                {ui.improves} <span className="font-display font-bold">{risk.window}</span>{" "}
                {ui.askAgain}
              </p>
            )}
          </div>
        </div>

        {/* why — not drawn when the gate withholds the score: the points
            would rest on an input that never arrived */}
        {!withheld && (
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
                  {/* Length by transform so a follow-up answer retargets the
                      bar instead of snapping it. One fixed scale on every
                      answer: the track's end is the 25-point maximum weight. */}
                  <div
                    className={`${fresh ? "grow-x" : ""} h-full`}
                    style={{
                      transform: `scaleX(${Math.min(1, f.contribution / MAX_CONTRIBUTION)})`,
                      transformOrigin: "left center",
                      transition: "transform 400ms var(--ease-out)",
                      background: color,
                    }}
                  />
                </div>
                {f.detail && (
                  <p className="mt-1 text-label leading-snug text-ink-500" lang={answerLang}>
                    {f.detail}
                  </p>
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
        )}
      </div>

      {/* deterministic overrides — the trust moment */}
      {risk.overrides.length > 0 && (
        <div className="hatch-danger border-t border-risk-extreme/40 px-5 py-3.5">
          <h3 className="label mb-2 !text-risk-extreme">{ui.overrides}</h3>
          <ul className="space-y-1.5" lang={answerLang}>
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

      {/* the crew's one-line foot: the proof stays with the verdict */}
      {trace && trace.length > 0 && (
        <a
          href="#crew-trace"
          className="block border-t px-5 py-2.5 font-mono text-label leading-snug text-ink-500 underline-offset-2 hover:text-chart-700 hover:underline"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          {crewT.understand} · {crewT.gather} ∥{gatherWide} ·{" "}
          {crewT.decide} · {crewT.explain} — {CREW_SIZE} {crewT.agents},{" "}
          <span className="tabular-nums">{elapsed ?? 0}</span> ms
        </a>
      )}

      <p className="sr-only">
        {ui.evidence}: {evidence.length} {ui.traced}
      </p>
    </section>
  );
}
