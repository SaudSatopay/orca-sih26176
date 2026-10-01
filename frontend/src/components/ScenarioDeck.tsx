import type { Language } from "../types";
import { SCENARIOS, UI } from "../i18n/app";

/**
 * The five rehearsed questions. Before anything has been asked they are the
 * obvious first action: one ruled bank, each cell showing the question in the
 * language it is asked in. Once a conversation is running they fold down to a
 * row of chips, still one press away.
 *
 * The same five buttons serve both states, so a press is never lost to a
 * remount half-way through.
 */
export default function ScenarioDeck({
  language,
  open,
  busy,
  onRun,
}: {
  language: Language;
  /** Expanded: nothing has been asked yet. */
  open: boolean;
  busy: boolean;
  onRun: (ask: string) => void;
}) {
  const ui = UI[language] ?? UI.en;

  return (
    <section className={open ? "deck panel overflow-hidden" : "deck"} aria-labelledby="deck-title">
      <div className={open ? "hd !items-center" : "sr-only"}>
        <div className="min-w-0">
          <h2 id="deck-title" className="font-display text-lead font-bold text-ink-900">
            {open ? ui.deckLead : ui.scenarios}
          </h2>
          <p className="mt-0.5 text-label leading-relaxed text-ink-500">{ui.deckSub}</p>
        </div>
      </div>

      <div className={open ? "deck-grid" : "flex flex-wrap items-center gap-2"}>
        {!open && (
          <span className="label mr-1" aria-hidden>
            {ui.scenarios}
          </span>
        )}
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => onRun(s.ask)}
            disabled={busy}
            title={open ? undefined : s.ask}
            className={
              open
                ? "cell-press group flex min-w-0 items-start gap-3 px-4 py-3.5 text-left disabled:cursor-not-allowed disabled:opacity-50"
                : "chip disabled:opacity-50"
            }
          >
            <span
              className={`grid shrink-0 place-items-center rounded-full bg-ink-900 font-display font-bold leading-none text-paper-50 ${
                open ? "mt-0.5 h-6 w-6 text-body" : "h-[18px] w-[18px] text-label"
              }`}
              aria-hidden
            >
              {s.n}
            </span>
            {open ? (
              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-lead font-bold leading-snug text-ink-900">
                    {s.label[language] ?? s.label.en}
                  </span>
                  <span className="font-mono text-label uppercase tracking-wide text-ink-500">
                    {s.hint}
                  </span>
                </span>
                <span lang={s.askLang} className="mt-1 block text-body leading-snug text-ink-700">
                  {s.ask}
                </span>
                {/* a Devanagari question carries a one-line gloss for readers
                    of another language, so no card is a mystery */}
                {s.gloss && language !== s.askLang && (
                  <span className="mt-0.5 block text-label leading-snug text-ink-500">
                    {s.gloss[language] ?? s.gloss.en}
                  </span>
                )}
              </span>
            ) : (
              <>
                <span className="font-semibold">{s.label[language] ?? s.label.en}</span>
                <span className="font-mono text-label uppercase tracking-wide opacity-75">
                  {s.hint}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
