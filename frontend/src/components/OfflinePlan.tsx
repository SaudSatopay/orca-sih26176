import type { Language } from "../types";
import { ERRORS } from "../i18n/errors";
import { OFFLINE } from "../i18n/offline";
import { clockLabel, parseClock } from "../i18n/mobile";
import { ageText } from "../gateModel";
import { planAgeSeconds, type SavedPlan } from "../offline";
import { WarnGlyph } from "./glyphs";

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));

/** "from 2:05 PM, 2 h 10 min ago" — in the reader's language. */
function planWords(plan: SavedPlan, now: number, language: Language) {
  const at = parseClock(plan.data.generated_at);
  return {
    t: at ? clockLabel(language, at.hour, at.minute) : "—",
    age: ageText(planAgeSeconds(plan, now), language),
  };
}

const button =
  "m-press m-btn-line min-h-[44px] rounded-[2px] px-4 font-mono text-body font-bold uppercase tracking-[0.1em]";

/**
 * Today with no connection: says so, then whose plan is on screen and how old
 * it is. With nothing saved on the phone, it says that plainly.
 */
export function OfflinePlanNotice({
  language,
  plan,
  now,
  demo,
  onRetry,
}: {
  language: Language;
  plan: SavedPlan | null;
  now: number;
  /** The `?offline=` demo link cut the connection on purpose. */
  demo: boolean;
  onRetry: () => void;
}) {
  const o = OFFLINE[language] ?? OFFLINE.en;
  return (
    <div role="alert" className="panel-tint flex items-start gap-3 px-3.5 py-3" data-testid="offline-plan">
      <WarnGlyph size={20} className="mt-0.5 shrink-0 text-risk-high" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-lead font-bold leading-snug text-ink-900">{o.title}</p>
        {plan ? (
          <>
            <p className="mt-1 text-body leading-relaxed text-ink-700">{fill(o.lastPlan, planWords(plan, now, language))}</p>
            <p className="mt-1.5 font-mono text-label text-ink-500">{o.rejudged}</p>
          </>
        ) : (
          <p className="mt-1 text-body leading-relaxed text-ink-700">{o.noPlan}</p>
        )}
        {demo && <p className="mt-1.5 font-mono text-label text-ink-500">{o.demo}</p>}
        <button type="button" onClick={onRetry} className={`${button} mt-2.5`}>
          {(ERRORS[language] ?? ERRORS.en).retry}
        </button>
      </div>
    </div>
  );
}

/**
 * An Ask question with no connection. ORCA does not guess an answer; it points
 * to the last plan and its age, or says there is none.
 */
export function AskOfflineNotice({
  language,
  plan,
  now,
  todayLabel,
  onOpenPlan,
  onRetry,
}: {
  language: Language;
  plan: SavedPlan | null;
  now: number;
  todayLabel: string;
  onOpenPlan: () => void;
  onRetry: () => void;
}) {
  const o = OFFLINE[language] ?? OFFLINE.en;
  return (
    <div role="alert" className="panel-tint flex items-start gap-3 px-3.5 py-3" data-testid="ask-offline">
      <WarnGlyph size={20} className="mt-0.5 shrink-0 text-risk-high" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-lead font-bold leading-snug text-ink-900">{o.title}</p>
        <p className="mt-1 text-body leading-relaxed text-ink-700">{o.askOffline}</p>
        <p className="mt-1 text-body leading-relaxed text-ink-700">
          {plan ? fill(o.askLastPlan, { ...planWords(plan, now, language), tab: todayLabel }) : o.noPlan}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {plan && (
            <button type="button" onClick={onOpenPlan} className={button}>
              {o.openPlan}
            </button>
          )}
          <button type="button" onClick={onRetry} className={button}>
            {(ERRORS[language] ?? ERRORS.en).retry}
          </button>
        </div>
      </div>
    </div>
  );
}
