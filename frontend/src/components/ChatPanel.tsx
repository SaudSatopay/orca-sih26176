import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Language } from "../types";
import { splitAnswer } from "../answer";
import { CompassMark, CourseArrow, MicGlyph, StopGlyph, WarnGlyph } from "./glyphs";
import { PLACEHOLDER, T } from "../i18n/chat";
import { ERRORS } from "../i18n/errors";
import {
  getRecognition,
  SPEECH_LOCALE,
  speechRecognitionSupported,
  type SpeechRecognitionLike,
} from "../speech";

/**
 * The conversation. The fisher's question sits on the fisher's side, in their
 * words, set as a quotation; ORCA's answer sits on ORCA's side as prose at a
 * reading measure, with where the readings came from set apart beneath it.
 */
export default function ChatPanel({
  messages,
  busy,
  failed,
  language,
  suggestions,
  onSend,
  onRetry,
}: {
  messages: ChatMessage[];
  busy: boolean;
  /** The last question could not be answered: /api/chat did not respond. */
  failed: boolean;
  language: Language;
  suggestions: string[];
  onSend: (text: string) => void;
  onRetry: () => void;
}) {
  const t = T[language] ?? T.en;
  const err = ERRORS[language] ?? ERRORS.en;
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported] = useState(speechRecognitionSupported);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Messages already in the log when it was opened do not rise again.
  const [atMount] = useState(() => new Set(messages.map((m) => m.id)));

  // Bring the newest exchange into view by scrolling the log itself, never the
  // page (the page belongs to the verdict). The question goes to the top of
  // the log, so a long answer is read from its first line, under the words
  // that asked for it.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const asked = log.querySelectorAll<HTMLElement>("[data-asked]");
    const last = asked[asked.length - 1];
    log.scrollTop = last ? last.offsetTop - log.offsetTop - 16 : 0;
  }, [messages, busy, failed]);

  const submit = (value: string) => {
    const v = value.trim();
    if (!v || busy) return;
    onSend(v);
    setText("");
  };

  const stopMic = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const toggleMic = () => {
    if (listening) {
      stopMic();
      return;
    }
    const rec = getRecognition();
    if (!rec) return;
    rec.lang = SPEECH_LOCALE[language];
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript;
      setText(said);
      setListening(false);
      submit(said);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const empty = messages.length === 0 && !busy && !failed;

  return (
    <section
      className="panel rule-double flex h-full min-h-0 flex-col"
      aria-labelledby="ask-title"
      onKeyDown={(e) => {
        if (e.key === "Escape" && listening) {
          e.stopPropagation();
          stopMic();
        }
      }}
    >
      <div className="hd !block !py-3">
        <h2 id="ask-title" className="font-display text-lead font-bold text-ink-900">
          {t.title}
        </h2>
        <p className="mt-0.5 text-label text-ink-500">{t.sub}</p>
      </div>

      {/* the log */}
      <div
        ref={logRef}
        role="log"
        aria-label={t.log}
        aria-busy={busy}
        tabIndex={empty ? undefined : 0}
        className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-auto px-4 py-4 max-lg:max-h-[60vh]"
      >
        {empty && (
          <div className="flex h-full flex-col justify-end gap-3 pb-1">
            <p className="font-display text-lead font-bold leading-snug text-ink-900">
              {t.emptyMain}
            </p>
            <ul className="space-y-1.5">
              {t.canAsk.split("|").map((line) => (
                <li key={line} className="flex items-baseline gap-2.5 text-body text-ink-700">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 -translate-y-px rotate-45 bg-chart-500" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="wave-rule w-20" aria-hidden />
            <p className="max-w-[46ch] text-body leading-relaxed text-ink-500">{t.emptySub}</p>
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} data-asked className={`flex ${atMount.has(m.id) ? "" : "animate-rise"} flex-col items-end pl-8`}>
              <div className="label mb-1 !text-label">{t.youAsked}</div>
              <p className="rounded-[3px] rounded-br-none bg-ink-900 px-3.5 py-2.5 font-display text-body font-medium leading-snug text-paper-50">
                {m.text}
              </p>
            </div>
          ) : (
            <Answer key={m.id} text={m.text} arriving={!atMount.has(m.id)} />
          ),
        )}

        {busy && (
          <div className="flex items-center gap-3" role="status">
            <CompassMark size={22} className="shrink-0 text-ink-900" />
            <span className="wave-rule w-12 shrink-0" aria-hidden />
            <span className="font-mono text-label uppercase tracking-[0.12em] text-ink-500">
              {t.busy}
            </span>
          </div>
        )}

        {failed && !busy && (
          <div role="alert" className="panel-tint hatch-danger animate-rise p-4">
            <div className="flex items-start gap-3">
              <WarnGlyph size={17} className="mt-0.5 shrink-0 text-risk-extreme" />
              <div className="min-w-0">
                <h3 className="font-display text-lead font-bold leading-snug text-ink-900">
                  {err.offlineTitle}
                </h3>
                <p className="mt-1 text-body leading-relaxed text-ink-700">{err.offlineBody}</p>
                <button className="btn-line mt-3" onClick={onRetry}>
                  {err.retry}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* follow-ups */}
      {suggestions.length > 0 && (
        <div className="border-t px-4 py-2.5" style={{ borderColor: "var(--rule-faint)" }}>
          <div className="label mb-1.5 !text-label">{t.follow}</div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s}
                className="chip !py-1 !text-label disabled:opacity-50"
                onClick={() => submit(s)}
                disabled={busy}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* the question */}
      <form
        className="flex items-center gap-2 border-t p-3"
        style={{ borderColor: "var(--rule-faint)" }}
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          name="question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={listening ? t.listening : PLACEHOLDER[language]}
          aria-label={t.question}
          // Read-only, not disabled, while the crew works: a disabled field
          // drops keyboard focus on the floor.
          readOnly={busy}
          aria-disabled={busy}
          enterKeyHint="send"
          autoComplete="off"
          className="field min-w-0 flex-1"
        />
        {speechSupported && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={listening ? t.stopListening : t.speak}
            aria-pressed={listening}
            title={listening ? t.stopListening : t.speak}
            className={`press relative grid h-10 w-10 shrink-0 place-items-center rounded-[2px] border ${
              listening
                ? "border-risk-extreme bg-risk-extreme text-paper-50"
                : "border-ink-900 bg-paper-50 text-ink-900 hover:bg-ink-900 hover:text-paper-50"
            }`}
          >
            {/* the ring carries the listening state; the control stays fully legible */}
            {listening && <span className="mic-wave" aria-hidden />}
            {listening ? <StopGlyph size={12} /> : <MicGlyph size={17} />}
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !text.trim()}
          aria-label={t.send}
          title={t.send}
          className="press group grid h-10 w-10 shrink-0 place-items-center rounded-[2px] bg-ink-900 text-paper-50 hover:bg-ink-700 disabled:cursor-not-allowed disabled:bg-ink-400"
        >
          <CourseArrow size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </form>
    </section>
  );
}

/** ORCA's side: the verdict sentence, the advice, then the provenance apart. */
function Answer({ text, arriving }: { text: string; arriving: boolean }) {
  const { lead, body, sources, note } = splitAnswer(text);
  return (
    <article className={`${arriving ? "animate-rise " : ""}pr-4`}>
      <div className="mb-1.5 flex items-center gap-2">
        <CompassMark size={22} className="shrink-0 text-ink-900" />
        <span className="label !text-label !text-ink-700">ORCA</span>
      </div>
      <div className="max-w-[62ch]">
        {lead && (
          <p className="font-display text-lead font-bold leading-snug text-ink-900">{lead}</p>
        )}
        {body && (
          <p className={`text-body leading-relaxed text-ink-800 ${lead ? "mt-1.5" : ""}`}>{body}</p>
        )}
        {(sources || note) && (
          <footer
            className="mt-3 space-y-1 border-t border-dashed pt-2.5 font-mono text-label leading-relaxed text-ink-500"
            style={{ borderColor: "var(--rule)" }}
          >
            {sources && <p>{sources}</p>}
            {note && <p className="font-semibold text-risk-high">{note}</p>}
          </footer>
        )}
      </div>
    </article>
  );
}
