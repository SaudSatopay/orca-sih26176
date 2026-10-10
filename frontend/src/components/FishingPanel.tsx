import { lazy, Suspense, useId, useState, type ReactNode } from "react";

import { ink, risk } from "../tokens";
import type { AvoidZone, FishingArea, FishingOutlook, Language } from "../types";
import { useFirstSight } from "../firstSight";
import { FishGlyph, SchoolGlyph, WarnGlyph } from "./glyphs";
import { EmptySweepGlyph, NoEntryGlyph } from "./viewGlyphs";
import { Draft, DraftSheet, OfflineNotice } from "./SheetStates";
import RiskDial from "./RiskDial";
import SafetyGate from "./SafetyGate";
import { SonarDial } from "../ui/console/SonarDial";
import { GATE } from "../i18n/gate";
import { gateTempers, gateWithholds } from "../gateModel";
import { FACTORS, RATING_WORD, T } from "../i18n/fishing";
import { VERDICT } from "../i18n/riskCard";
import { returnLabel } from "../i18n/mobile";
import { hoursMin, int, minutesMin, waveM } from "../format";
import { RATING_COLOR, RATING_INK, RISK_INK } from "../risk";
import {
  CHOOSE_HARBOUR_EVENT,
  FACTOR_KEYS,
  factorScore,
  fill,
  hourReadout,
  panelState,
  speciesParts,
  splitAdvice,
  tripIsOff,
} from "./todayModel";
import "./views.css";

/**
 * The hand-drawn mark (and rough-notation) load with the first closed area,
 * not with the sheet. Its own chunk also keeps the kit's token defaults out
 * of the console chunk's imports, so the shared entry chunk, and with it the
 * phone's chunks, stay byte-identical.
 */
const Highlighter = lazy(() => import("../ui/magicui/highlighter").then((m) => ({ default: m.Highlighter })));

type Strings = Record<string, string>;

/**
 * The closed areas' heading, boxed by hand in extreme red the way a skipper
 * rings a danger on a paper chart. The words are always readable; the box
 * draws once per reading, when it first comes into view, and is simply there
 * on a later visit to the same reading (and under reduced motion).
 */
function AvoidMark({ reading, children }: { reading: string; children: ReactNode }) {
  const fresh = useFirstSight(`avoid-mark:${reading}`);
  const [drawMs] = useState(() => (fresh ? 900 : 0));
  return (
    <span data-mark="avoid">
      {/* the words, unmarked, until the mark's chunk is in */}
      <Suspense fallback={children}>
        <Highlighter
          action="box"
          color={risk.extreme}
          animationDuration={drawMs}
          padding={4}
          strokeWidth={1.5}
          multiline={false}
        >
          {children}
        </Highlighter>
      </Suspense>
    </span>
  );
}

function dayName(offset: number, t: Strings): string {
  return offset === 0 ? t.today : offset === 1 ? t.tomorrow : t.dayAfter;
}

/**
 * Today's plan for one position: what to do, where the fish are, what the
 * trip costs. `data` may be null while the first reading is on its way or
 * after it failed — the panel draws its own loading and error sheets, and
 * keeps the last reading on screen when a refresh fails.
 */
export default function FishingPanel({
  data,
  language = "en",
  onSelectArea,
  loading = false,
  error = false,
  onRetry,
  onChooseHarbour,
}: {
  data: FishingOutlook | null;
  language?: Language;
  onSelectArea?: (rank: number) => void;
  /** A reading is being fetched. */
  loading?: boolean;
  /** The newest request failed. */
  error?: boolean;
  onRetry?: () => void;
  /** Opens the harbour list; without it the panel asks the location picker itself. */
  onChooseHarbour?: () => void;
}) {
  const t = T[language] ?? T.en;
  const state = panelState({ hasData: data != null, loading, error });

  if (state === "loading" || !data) {
    if (state === "error")
      return <OfflineNotice language={language} body={t.noReading} onRetry={onRetry} busy={loading} />;
    return <PlanDraft t={t} />;
  }

  const chooseHarbour =
    onChooseHarbour ?? (() => window.dispatchEvent(new CustomEvent(CHOOSE_HARBOUR_EVENT)));
  // A day with no trip in it: the grounds fold away and nothing plans a trip.
  const off = tripIsOff(data);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {state === "stale" && <OfflineNotice language={language} onRetry={onRetry} busy={loading} />}
      <Advice data={data} language={language} t={t} off={off} />
      <Grounds
        data={data}
        language={language}
        t={t}
        off={off}
        onSelectArea={onSelectArea}
        onChooseHarbour={chooseHarbour}
      />
      {!off && <Trip data={data} t={t} />}
    </div>
  );
}

/* ------------------------------------------------------------------ advice */

function Advice({
  data,
  language,
  t,
  off,
}: {
  data: FishingOutlook;
  language: Language;
  t: Strings;
  off: boolean;
}) {
  const titleId = useId();
  const parts = splitAdvice(data);
  const severe = data.safety.category === "HIGH" || data.safety.category === "EXTREME";
  const d = data.duration;
  const words = RATING_WORD[language] ?? RATING_WORD.en;
  // The dial counts up when this reading arrives, not on every visit.
  const fresh = useFirstSight(`advice:${data.generated_at}:${data.decision?.state ?? ""}`);
  // The safety gate: on missing evidence there is no score and no go stamp;
  // on stale evidence the verdict stands, stamped with caution. The sentence
  // under the stamp is already the gate's (the backend replaced advice[0]).
  const gate = GATE[language] ?? GATE.en;
  const withheld = gateWithholds(data.decision);
  const tempered = gateTempers(data.decision);
  const verdictWord = withheld
    ? gate.state.INSUFFICIENT_DATA
    : tempered
      ? gate.state.CAUTION
      : (VERDICT[language] ?? VERDICT.en)[data.safety.category];
  const verdictInk = withheld ? ink[700] : tempered ? RISK_INK.MODERATE : RISK_INK[data.safety.category];

  // Closed areas: the backend's sentence, paired with the area's own facts.
  // If the advice could not be cut into blocks, the areas still get their rows.
  const prohibitions: { text: string; zone: AvoidZone | null }[] = parts.structured
    ? parts.prohibitions
    : data.avoid.map((zone) => ({ text: zone.name, zone }));

  // A best hour is only a plan when the trip itself is on.
  const showBest = data.best_window != null && !off && (d ? d.feasible : !severe);
  const figures: { k: string; v: string; note?: string; alert?: boolean }[] = [];
  if (showBest && data.best_window)
    figures.push({
      k: t.bestTime,
      v: `${hourReadout(data.best_window.from_hour)}–${hourReadout(data.best_window.to_hour)}`,
    });
  if (d?.feasible && !off) {
    figures.push({ k: t.stay, v: hoursMin(d.recommended_hours) });
    if (d.return_by) {
      // The day the clock time belongs to, as the phone already says it (T5).
      const back = returnLabel(language, d.return_by, data.generated_at);
      const note = [
        back?.day,
        d.return_reason_wave_m != null ? `${t.returnWhy} ${waveM(d.return_reason_wave_m)}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      figures.push({
        k: t.returnBy,
        v: d.return_by,
        note: note || undefined,
        alert: true,
      });
    }
  }

  // Sentences the figures do not already say.
  const planNotes = !parts.structured
    ? parts.plan
    : d && (!d.feasible || d.limited_by_weather)
      ? parts.plan.slice(-1)
      : [];
  if (!parts.structured && d && !d.feasible && planNotes.length === 0) planNotes.push(t.notWorth);
  if (!parts.structured && d?.feasible && d.limited_by_weather && planNotes.length === 0)
    planNotes.push(t.weatherShortens);
  const planWarns = d != null && (!d.feasible || d.limited_by_weather);

  const hasPlan = parts.where.length > 0 || figures.length > 0 || planNotes.length > 0;

  return (
    <section className="panel rule-double overflow-hidden" aria-labelledby={titleId}>
      <div className="hd">
        <h2 id={titleId} className="label">
          {t.advice}
        </h2>
        <span className="shrink-0 font-mono text-label tabular-nums text-ink-500">
          {data.generated_at.slice(11, 16)} IST · {data.mode}
        </span>
      </div>

      {data.decision && (
        <SafetyGate decision={data.decision} health={data.data_health} language={language} answerLang={language} />
      )}

      {/* the verdict leads: dial, stamp, then the plain instruction (L1) */}
      <div
        className={`flex flex-wrap items-center gap-x-5 gap-y-3 px-5 pb-4 pt-4 ${severe ? "hatch-danger" : ""}`}
        data-fresh={fresh ? "" : undefined}
      >
        {withheld ? (
          <div className="flex shrink-0 flex-col items-center gap-1.5" style={{ width: 96 }}>
            <SonarDial size={96} />
            <span className="text-center font-mono text-label leading-snug text-ink-500">{gate.noScore}</span>
          </div>
        ) : (
          <RiskDial score={data.safety.score} category={data.safety.category} size={96} fresh={fresh} />
        )}
        <div className="min-w-0 flex-1 basis-[240px]">
          <span className="stamp" style={{ color: verdictInk }}>
            {verdictWord}
          </span>
          {tempered && (
            <span className="ml-2.5 font-mono text-label uppercase tracking-[0.12em] text-ink-500">
              {data.safety.score}/100 · {gate.unconfirmed}
            </span>
          )}
          <p
            className={`mt-2.5 font-display text-headline font-bold leading-[1.15] [text-wrap:balance] ${
              severe ? "text-risk-extreme" : "text-ink-900"
            }`}
          >
            {parts.verdict}
          </p>
          {parts.sea && <p className="mt-2 text-lead leading-snug text-ink-700">{parts.sea}</p>}
          {parts.notices.map((line) => (
            <p key={line} className="mt-2.5 flex items-start gap-2 text-body font-semibold leading-snug text-ink-900">
              <WarnGlyph size={15} className="mt-0.5 shrink-0 text-risk-extreme" />
              <span className="min-w-0">{line}</span>
            </p>
          ))}
        </div>
      </div>

      {/* do not: drawn as the chart draws a danger area */}
      {prohibitions.length > 0 && (
        <div className="border-t px-5 py-3.5" style={{ borderColor: "var(--rule-faint)" }}>
          <h3 className="label flex items-center gap-2 !text-risk-extreme">
            <NoEntryGlyph size={13} /> <AvoidMark reading={data.generated_at}>{t.avoid}</AvoidMark>
          </h3>
          <ul className="mt-2.5 space-y-2">
            {prohibitions.map(({ text, zone }, i) => {
              // Every closed row carries its tag: ALWAYS CLOSED, or CLOSED NOW (T6).
              const tag = zone ? (!zone.window ? t.always : zone.active_now ? t.closedNow : null) : null;
              return (
                <li key={`${i}-${text}`} className="v-prohibit">
                  <NoEntryGlyph size={18} className="mt-px shrink-0 text-risk-extreme" />
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-semibold leading-snug text-ink-900">{text}</p>
                    {zone && (
                      <p className="mt-1 font-mono text-label leading-snug text-ink-700">
                        {zone.window && zone.name !== text ? `${zone.name} · ` : ""}
                        {int(zone.distance_km)} km {t.away}
                        {zone.window && (
                          <>
                            {" · "}
                            <span className="whitespace-nowrap">
                              {t.closedBetween} {zone.window.replace("-", "–")}
                            </span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                  {tag && (
                    <span className="shrink-0 self-center whitespace-nowrap border border-risk-extreme bg-paper-50 px-1.5 py-0.5 font-mono text-label font-bold uppercase tracking-[0.1em] text-risk-extreme">
                      {tag}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* the plan: where, when, how long, back by */}
      {hasPlan && (
        <div className="border-t px-5 py-3.5" style={{ borderColor: "var(--rule-faint)" }}>
          <h3 className="label">{t.plan}</h3>
          {parts.where.map((line) => (
            <p key={line} className="mt-2 max-w-[62ch] text-body leading-relaxed text-ink-800">
              {line}
            </p>
          ))}
          {figures.length > 0 && (
            <dl className="v-figures mt-3">
              {figures.map((f) => (
                <div key={f.k}>
                  <dt className={`label ${f.alert ? "!text-risk-extreme" : ""}`}>{f.k}</dt>
                  <dd className="mt-1 font-mono text-lead font-bold tabular-nums leading-tight text-ink-900">
                    {f.v}
                  </dd>
                  {f.note && <dd className="mt-0.5 text-label leading-snug text-ink-500">{f.note}</dd>}
                </div>
              ))}
            </dl>
          )}
          {planNotes.map((line) => (
            <p
              key={line}
              className={`mt-2.5 flex max-w-[62ch] items-start gap-2 text-body leading-relaxed ${
                planWarns ? "font-semibold text-ink-900" : "text-ink-800"
              }`}
            >
              {planWarns && <WarnGlyph size={14} className="mt-0.5 shrink-0 text-risk-high" />}
              <span className="min-w-0">{line}</span>
            </p>
          ))}
        </div>
      )}

      {/* the next days as a strip, not as sentences */}
      {data.forecast.length > 1 && (
        <div className="border-t" style={{ borderColor: "var(--rule-faint)" }}>
          <h3 className="label px-5 pt-3.5">{t.forecast}</h3>
          <ol
            className="mt-2.5 grid border-t"
            style={{
              borderColor: "var(--rule-faint)",
              gridTemplateColumns: `repeat(${data.forecast.length}, minmax(0, 1fr))`,
            }}
          >
            {data.forecast.map((f, i) => (
              <li
                key={f.day_offset}
                className={`min-w-0 px-2.5 py-3 text-center ${i > 0 ? "border-l" : ""} ${
                  f.official_warning ? "hatch-danger" : f.day_offset === 0 ? "bg-chart-100/40" : ""
                }`}
                style={{ borderColor: "var(--rule-faint)" }}
              >
                <div className="label truncate !tracking-[0.1em]">{dayName(f.day_offset, t)}</div>
                <div
                  className="sounding mt-1.5 text-numeral leading-none"
                  style={{ color: RATING_INK[f.rating] }}
                >
                  {f.probability}
                  <span className="text-body text-ink-500">%</span>
                </div>
                <div className="mt-1 text-label font-semibold leading-tight text-ink-800">
                  {words[f.rating]}
                </div>
                {/* the trend line is reserved even on Today, so cells share baselines (T6) */}
                <div className="mt-1.5 min-h-[2lh] font-mono text-label leading-snug text-ink-500">
                  {waveM(f.wave_height_m)} {t.waves}
                  {f.day_offset > 0 && (
                    <>
                      <br />
                      {f.calmer ? t.calmer : t.rougher}
                    </>
                  )}
                </div>
                {/* a warned day offers no best hour (C4) */}
                {!f.official_warning && (
                  <div className="mt-1 font-mono text-label leading-snug text-ink-500">
                    {t.bestAt} {hourReadout(f.best_hour)}
                  </div>
                )}
                {f.official_warning && (
                  <div className="mt-1.5 inline-flex items-center gap-1 border border-risk-extreme bg-paper-50 px-1.5 py-0.5 text-risk-extreme">
                    <WarnGlyph size={10} />
                    <span className="font-mono text-label font-bold uppercase tracking-[0.08em]">
                      {t.warning}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* the promise we never break, quiet at the foot */}
      {parts.disclaimer && (
        <p
          className="border-t px-5 py-2.5 text-label leading-relaxed text-ink-400"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          {parts.disclaimer}
        </p>
      )}
    </section>
  );
}

/* ----------------------------------------------------------------- grounds */

function Grounds({
  data,
  language,
  t,
  off,
  onSelectArea,
  onChooseHarbour,
}: {
  data: FishingOutlook;
  language: Language;
  t: Strings;
  /** A do-not-go day: the grounds fold away and stop selling the trip (C4). */
  off: boolean;
  onSelectArea?: (rank: number) => void;
  onChooseHarbour: () => void;
}) {
  const titleId = useId();
  const top = data.areas.slice(0, 3);
  const km = Math.round(data.radius_km);
  // Folded by default on a no-go day; opened only on purpose.
  const [opened, setOpened] = useState(false);
  const show = !off || opened;
  // The factor meters draw when this reading arrives, not on every visit.
  const fresh = useFirstSight(`grounds:${data.generated_at}`);

  return (
    <section className="panel overflow-hidden" aria-labelledby={titleId} data-fresh={fresh ? "" : undefined}>
      {off ? (
        <button
          type="button"
          aria-expanded={opened}
          onClick={() => setOpened((o) => !o)}
          className="hd hatch-danger w-full cursor-pointer text-left"
        >
          <span id={titleId} className="label flex items-center gap-2 !text-risk-extreme">
            <NoEntryGlyph size={13} className="shrink-0" /> {t.notToday}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="v-chevron shrink-0 self-center text-risk-extreme" aria-hidden>
            <path d="M1.5 3.5 L5 7 L8.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <div className="hd">
          <h2 id={titleId} className="label flex items-center gap-2">
            {t.areas}
            <SchoolGlyph size={26} className="swim text-chart-500" />
          </h2>
          <span className="shrink-0 font-mono text-label tabular-nums text-ink-500">
            {language === "en" ? `${t.within} ${km} km` : `${km} km ${t.within}`}
          </span>
        </div>
      )}

      {!show ? null : top.length === 0 ? (
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3 px-5 py-5">
          <EmptySweepGlyph className="shrink-0 text-chart-500" />
          <div className="min-w-0 flex-1 basis-[200px]">
            <p className="font-display text-lead font-bold leading-snug text-ink-900">
              {fill(t.emptyTitle, { km })}
            </p>
            <p className="mt-1 max-w-[52ch] text-body leading-relaxed text-ink-700">{t.emptyBody}</p>
            <button type="button" onClick={onChooseHarbour} className="btn-line mt-3">
              {t.chooseHarbour}
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3.5">
          <ol className="space-y-2">
            {top.map((a) => (
              <li key={a.id}>
                <GroundCard area={a} language={language} t={t} muted={off} onSelect={onSelectArea} />
              </li>
            ))}
          </ol>
          <p className="mt-2.5 text-label leading-relaxed text-ink-400">
            {t.factorsCaption}. {data.method}
          </p>
        </div>
      )}
    </section>
  );
}

function GroundCard({
  area: a,
  language,
  t,
  muted = false,
  onSelect,
}: {
  area: FishingArea;
  language: Language;
  t: Strings;
  /** A no-go day: no trip stamp, percentages quiet in ink (C4). */
  muted?: boolean;
  onSelect?: (rank: number) => void;
}) {
  const names = FACTORS[language] ?? FACTORS.en;
  const words = RATING_WORD[language] ?? RATING_WORD.en;
  const color = RATING_COLOR[a.rating];
  const factors = FACTOR_KEYS.map((key) => ({ key, score: factorScore(a.factors?.[key]) })).filter(
    (f): f is { key: (typeof FACTOR_KEYS)[number]; score: number } => f.score != null,
  );
  const species = (a.likely_species ?? []).map(speciesParts);

  return (
    <button type="button" onClick={() => onSelect?.(a.rank)} className="v-card">
      <span className="sr-only">{fill(t.showOnChart, { rank: a.rank })}. </span>
      <span className="flex items-center gap-3.5">
        {/* the buoy: identical symbology to the chart's markers */}
        <span className="relative shrink-0" style={{ color }} aria-hidden>
          <span className="v-buoy-ping" />
          <span
            className="grid h-11 w-11 place-items-center rounded-full border-[3.5px] bg-paper-50 font-display text-title font-extrabold text-ink-900 shadow-sm"
            style={{ borderColor: color }}
          >
            {a.rank}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-mono text-lead font-bold tabular-nums leading-none text-ink-900">
              {Math.round(a.distance_km)}
              <span className="ml-1 text-label">km</span>
            </span>
            <span className="font-mono text-label font-semibold text-ink-500">{a.bearing}</span>
            {a.recommended && !muted && (
              <span className="stamp !px-1.5 !py-0.5 !text-label text-risk-low">{t.bestTrip}</span>
            )}
          </span>
          {species.length > 0 && (
            <span
              className="mt-1.5 flex items-start gap-2 text-body leading-snug"
              title={`${t.likely}: ${t.likelyNote}`}
            >
              <FishGlyph size={13} className="mt-0.5 shrink-0 text-chart-600" />
              <span className="sr-only">{t.likely}: </span>
              <span className="flex min-w-0 flex-wrap gap-x-2.5 gap-y-0.5">
                {species.map((s) => (
                  <span key={s.local} className="min-w-0">
                    <span className="font-semibold text-ink-900">{s.local}</span>
                    {s.gloss && <span className="text-ink-500"> {s.gloss}</span>}
                  </span>
                ))}
              </span>
            </span>
          )}
        </span>

        <span className="shrink-0 text-right">
          <span
            className={`sounding block text-headline leading-none ${muted ? "text-ink-500" : ""}`}
            style={muted ? undefined : { color: RATING_INK[a.rating] }}
          >
            {a.probability}
            <span className="text-body text-ink-500">%</span>
          </span>
          <span className="mt-1 block max-w-[92px] text-label leading-tight text-ink-500">
            <span className="sr-only">{words[a.rating]}: </span>
            {t.chance}
          </span>
        </span>
      </span>

      {/* the five model factors behind the number: nothing is a black box */}
      {factors.length > 0 && (
        <span
          className="v-factors"
          role="img"
          aria-label={`${t.factorsAria}: ${factors
            .map((f) => `${names[f.key].full} ${f.score}`)
            .join(", ")}`}
        >
          {factors.map((f) => (
            <span key={f.key} className="v-factor" title={`${names[f.key].full}: ${f.score} / 100`}>
              <span className="v-factor-label">{names[f.key].short}</span>
              <span className="v-factor-track">
                <span className="v-factor-fill" style={{ width: `${f.score}%` }} />
              </span>
              <span className="v-factor-value">{f.score}</span>
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------- trip */

function Trip({ data, t }: { data: FishingOutlook; t: Strings }) {
  const titleId = useId();
  const d = data.duration;
  if (!d?.feasible) return null;
  const e = data.economics;
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  // "Stay there" lives in the Advice plan; the Trip row holds the travel figures (T5).
  const time = [
    { k: t.travel, v: minutesMin(d.travel_each_way_minutes), u: "", hero: false },
    { k: t.total, v: hoursMin(d.total_trip_hours), u: "", hero: false },
  ];
  const worth = e
    ? [
        { k: t.fuel, v: inr(e.fuel_cost_inr), u: `${e.fuel_litres} L`, hero: false },
        { k: t.catch, v: `${e.catch_kg_low}–${e.catch_kg_high}`, u: "kg", hero: false },
        { k: t.revenue, v: inr(e.revenue_inr), u: "", hero: false },
        { k: t.profit, v: inr(e.profit_inr), u: "", hero: true },
      ]
    : [];

  return (
    <section className="panel overflow-hidden" aria-labelledby={titleId}>
      <div className="hd">
        <h2 id={titleId} className="label">
          {t.trip}
        </h2>
      </div>
      <dl className="v-figures v-figures--flush">
        {time.map((x) => (
          <div key={x.k} className={x.hero ? "bg-risk-low/[0.07]" : ""}>
            <dt className="label">{x.k}</dt>
            <dd
              className={`mt-1 font-mono text-title font-bold tabular-nums leading-none ${
                x.hero ? "text-risk-low" : "text-ink-900"
              }`}
            >
              {x.v}
              {x.u && <span className="ml-1 text-label font-semibold text-ink-500">{x.u}</span>}
            </dd>
          </div>
        ))}
      </dl>

      {e && (
        <>
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-t px-4 pb-0.5 pt-2.5"
            style={{ borderColor: "var(--rule-faint)" }}
          >
            <h3 className="label">{t.econ}</h3>
            <span className="text-label text-ink-500">{t.econNote}</span>
          </div>
          <dl className="v-figures v-figures--flush">
            {worth.map((x) => (
              <div key={x.k} className={x.hero ? "bg-risk-low/[0.07]" : ""}>
                {/* two label lines reserved: a wrapped label never drops its figure (T6) */}
                <dt className="label min-h-[2lh]">{x.k}</dt>
                <dd
                  className={`mt-1 font-mono text-title font-bold tabular-nums leading-none ${
                    x.hero ? "text-risk-low" : "text-ink-900"
                  }`}
                >
                  {x.v}
                  {x.u && <span className="ml-1 text-label font-semibold text-ink-500">{x.u}</span>}
                </dd>
              </div>
            ))}
          </dl>
          <p
            className="border-t px-4 py-2 font-mono text-label leading-relaxed text-ink-400"
            style={{ borderColor: "var(--rule-faint)" }}
          >
            {e.assumptions}
          </p>
        </>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------- draft */

/** The plan while it is still being read: the same blocks, as construction lines. */
function PlanDraft({ t }: { t: Strings }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <DraftSheet label={t.advice} status={t.loading} className="rule-double">
        <div className="space-y-2.5 px-5 py-4">
          <Draft w="78%" h={24} />
          <Draft w="92%" h={13} />
          <Draft w="64%" h={13} />
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 pb-4">
          <Draft h={48} />
          <Draft h={48} />
          <Draft h={48} />
        </div>
      </DraftSheet>
      <DraftSheet label={t.areas}>
        <div className="space-y-2 px-4 py-3.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3.5">
              <Draft w={44} h={44} className="shrink-0 !rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Draft w="46%" h={14} />
                <Draft w="82%" h={10} />
              </div>
              <Draft w={52} h={28} className="shrink-0" />
            </div>
          ))}
        </div>
      </DraftSheet>
    </div>
  );
}
