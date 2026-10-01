import { useId } from "react";
import type { AvoidZone, FishingArea, FishingOutlook, Language } from "../types";
import { FishGlyph, SchoolGlyph, WarnGlyph } from "./glyphs";
import { EmptySweepGlyph, NoEntryGlyph } from "./viewGlyphs";
import { Draft, DraftSheet, OfflineNotice } from "./SheetStates";
import { FACTORS, RATING_WORD, T } from "../i18n/fishing";
import { RATING_COLOR, RATING_INK } from "../risk";
import {
  CHOOSE_HARBOUR_EVENT,
  FACTOR_KEYS,
  factorScore,
  fill,
  hourReadout,
  panelState,
  speciesParts,
  splitAdvice,
} from "./todayModel";
import "./views.css";

type Strings = Record<string, string>;

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

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {state === "stale" && <OfflineNotice language={language} onRetry={onRetry} busy={loading} />}
      <Advice data={data} language={language} t={t} />
      <Grounds
        data={data}
        language={language}
        t={t}
        onSelectArea={onSelectArea}
        onChooseHarbour={chooseHarbour}
      />
      <Trip data={data} t={t} />
    </div>
  );
}

/* ------------------------------------------------------------------ advice */

function Advice({ data, language, t }: { data: FishingOutlook; language: Language; t: Strings }) {
  const titleId = useId();
  const parts = splitAdvice(data);
  const severe = data.safety.category === "HIGH" || data.safety.category === "EXTREME";
  const d = data.duration;
  const words = RATING_WORD[language] ?? RATING_WORD.en;

  // Closed areas: the backend's sentence, paired with the area's own facts.
  // If the advice could not be cut into blocks, the areas still get their rows.
  const prohibitions: { text: string; zone: AvoidZone | null }[] = parts.structured
    ? parts.prohibitions
    : data.avoid.map((zone) => ({ text: zone.name, zone }));

  // A best hour is only a plan when the trip itself is on.
  const showBest = data.best_window != null && (d ? d.feasible : !severe);
  const figures: { k: string; v: string; note?: string; alert?: boolean }[] = [];
  if (showBest && data.best_window)
    figures.push({
      k: t.bestTime,
      v: `${hourReadout(data.best_window.from_hour)}–${hourReadout(data.best_window.to_hour)}`,
    });
  if (d?.feasible) {
    figures.push({ k: t.stay, v: `${d.recommended_hours} ${t.hours}` });
    if (d.return_by)
      figures.push({
        k: t.returnBy,
        v: d.return_by,
        note: d.return_reason_wave_m != null ? `${t.returnWhy} ${d.return_reason_wave_m} m` : undefined,
        alert: true,
      });
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

      {/* the verdict leads */}
      <div className={`px-5 pb-4 pt-4 ${severe ? "hatch-danger" : ""}`}>
        <p
          className={`font-display text-headline font-bold leading-[1.15] [text-wrap:balance] ${
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

      {/* do not: drawn as the chart draws a danger area */}
      {prohibitions.length > 0 && (
        <div className="border-t px-5 py-3.5" style={{ borderColor: "var(--rule-faint)" }}>
          <h3 className="label flex items-center gap-2 !text-risk-extreme">
            <NoEntryGlyph size={13} /> {t.avoid}
          </h3>
          <ul className="mt-2.5 space-y-2">
            {prohibitions.map(({ text, zone }, i) => (
              <li key={`${i}-${text}`} className="v-prohibit">
                <NoEntryGlyph size={18} className="mt-px shrink-0 text-risk-extreme" />
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold leading-snug text-ink-900">{text}</p>
                  {zone && (
                    <p className="mt-1 font-mono text-label leading-snug text-ink-700">
                      {zone.window && zone.name !== text ? `${zone.name} · ` : ""}
                      {Math.round(zone.distance_km)} km {t.away} ·{" "}
                      {zone.window
                        ? `${t.closedBetween} ${zone.window.replace("-", "–")}`
                        : t.always}
                    </p>
                  )}
                </div>
                {zone?.window && zone.active_now && (
                  <span className="shrink-0 self-center border border-risk-extreme bg-paper-50 px-1.5 py-0.5 font-mono text-label font-bold uppercase tracking-[0.1em] text-risk-extreme">
                    {t.closedNow}
                  </span>
                )}
              </li>
            ))}
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
                <div className="mt-1.5 font-mono text-label leading-snug text-ink-500">
                  {f.wave_height_m} m {t.waves}
                  {f.day_offset > 0 && (
                    <>
                      <br />
                      {f.calmer ? t.calmer : t.rougher}
                    </>
                  )}
                </div>
                <div className="mt-1 font-mono text-label leading-snug text-ink-500">
                  {t.bestAt} {hourReadout(f.best_hour)}
                </div>
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
  onSelectArea,
  onChooseHarbour,
}: {
  data: FishingOutlook;
  language: Language;
  t: Strings;
  onSelectArea?: (rank: number) => void;
  onChooseHarbour: () => void;
}) {
  const titleId = useId();
  const top = data.areas.slice(0, 3);
  const km = Math.round(data.radius_km);

  return (
    <section className="panel overflow-hidden" aria-labelledby={titleId}>
      <div className="hd">
        <h2 id={titleId} className="label flex items-center gap-2">
          {t.areas}
          <SchoolGlyph size={26} className="swim text-chart-500" />
        </h2>
        <span className="shrink-0 font-mono text-label tabular-nums text-ink-500">
          {language === "en" ? `${t.within} ${km} km` : `${km} km ${t.within}`}
        </span>
      </div>

      {top.length === 0 ? (
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
                <GroundCard area={a} language={language} t={t} onSelect={onSelectArea} />
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
  onSelect,
}: {
  area: FishingArea;
  language: Language;
  t: Strings;
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
            {a.recommended && (
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
            className="sounding block text-headline leading-none"
            style={{ color: RATING_INK[a.rating] }}
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

  const time = [
    { k: t.stay, v: `${d.recommended_hours}`, u: t.hours, hero: true },
    { k: t.travel, v: `${d.travel_each_way_minutes}`, u: t.min, hero: false },
    { k: t.total, v: `${d.total_trip_hours}`, u: t.hours, hero: false },
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
              <span className="ml-1 text-label font-semibold text-ink-500">{x.u}</span>
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
