import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Language } from "../types";
import { BoatGlyph, CourseArrow, MicGlyph, SchoolGlyph, StopGlyph } from "./glyphs";
import { PLACEHOLDER, T } from "../i18n/chat";
import {
  getRecognition,
  SPEECH_LOCALE,
  speechRecognitionSupported,
  type SpeechRecognitionLike,
} from "../speech";

export default function ChatPanel({
  messages,
  busy,
  language,
  suggestions,
  onSend,
  onLanguage,
}: {
  messages: ChatMessage[];
  busy: boolean;
  language: Language;
  suggestions: string[];
  onSend: (text: string) => void;
  onLanguage: (lang: Language) => void;
}) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported] = useState(speechRecognitionSupported);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const submit = (value: string) => {
    const v = value.trim();
    if (!v || busy) return;
    onSend(v);
    setText("");
  };

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
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

  return (
    <div className="panel rule-double flex h-full min-h-0 flex-col">
      {/* header */}
      <div className="hd !py-3">
        <div>
          <div className="font-display text-subtitle font-bold text-ink-900">
            {(T[language] ?? T.en).title}
          </div>
          <div className="mt-0.5 text-readout text-ink-400">{(T[language] ?? T.en).sub}</div>
        </div>
        <div className="flex gap-1">
          {(["en", "hi", "mr"] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => onLanguage(l)}
              className={`rounded-[2px] border px-2.5 py-1 font-mono text-readout font-bold transition ${
                language === l
                  ? "border-ink-900 bg-ink-900 text-paper-50"
                  : "text-ink-400 hover:text-ink-800"
              }`}
              style={language === l ? undefined : { borderColor: "var(--rule)" }}
            >
              {l === "en" ? "EN" : l === "hi" ? "हिं" : "मरा"}
            </button>
          ))}
        </div>
      </div>

      {/* messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div
            className="flex flex-col items-center gap-2.5 border border-dashed px-4 py-7 text-center text-body text-ink-500"
            style={{ borderColor: "var(--rule-strong)" }}
          >
            <span className="flex items-end gap-3">
              <BoatGlyph size={26} className="text-ink-300" />
              <SchoolGlyph size={30} className="swim text-chart-300" />
            </span>
            <div>
              {(T[language] ?? T.en).emptyMain}
              <br />
              <span className="text-readout text-ink-400">{(T[language] ?? T.en).emptySub}</span>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] animate-rise ${m.role === "user" ? "text-right" : ""}`}>
              <div className="label mb-1 !text-micro !tracking-[0.2em]">
                {m.role === "user" ? (T[language] ?? T.en).you : "ORCA"}
              </div>
              <div
                className={`inline-block rounded-[3px] px-3.5 py-2.5 text-left text-body leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-none bg-ink-900 text-paper-50"
                    : "rounded-bl-none border bg-paper-bright text-ink-800"
                }`}
                style={
                  m.role === "user"
                    ? undefined
                    : { borderColor: "var(--rule)", background: "var(--paper-bright)" }
                }
              >
                {m.text}
              </div>
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-2 rounded-[3px] rounded-bl-none border px-3.5 py-2.5"
              style={{ borderColor: "var(--rule)", background: "var(--paper-bright)" }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-700"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
              <span className="ml-1 font-mono text-label uppercase tracking-[0.14em] text-ink-400">
                {(T[language] ?? T.en).busy}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* suggestions */}
      {suggestions.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 border-t px-4 py-2.5"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          {suggestions.slice(0, 4).map((s) => (
            <button key={s} className="chip !py-1 !text-readout" onClick={() => submit(s)} disabled={busy}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div
        className="flex items-center gap-2 border-t p-3"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit(text)}
          placeholder={PLACEHOLDER[language]}
          disabled={busy}
          className="field min-w-0 flex-1"
        />
        {speechSupported && (
          <button
            onClick={toggleMic}
            title="Speak"
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-[2px] border transition hover:-translate-y-px ${
              listening
                ? "border-risk-extreme bg-risk-extreme text-paper-50"
                : "border-ink-900 bg-paper-50 text-ink-900 hover:bg-ink-900 hover:text-paper-50"
            }`}
            style={listening ? { animation: "inkblink 1.2s ease-in-out infinite" } : undefined}
          >
            {listening ? <StopGlyph size={12} /> : <MicGlyph size={17} />}
          </button>
        )}
        <button
          onClick={() => submit(text)}
          disabled={busy || !text.trim()}
          title="Send"
          className="group grid h-10 w-10 shrink-0 place-items-center rounded-[2px] bg-ink-900 text-paper-50 transition hover:-translate-y-px hover:bg-ink-700 disabled:opacity-35"
        >
          <CourseArrow size={17} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
