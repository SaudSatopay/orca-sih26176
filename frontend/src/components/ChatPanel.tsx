import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Language } from "../types";

const PLACEHOLDER: Record<Language, string> = {
  en: "Ask ORCA — can I go fishing tomorrow at 6 AM?",
  hi: "ORCA से पूछें — क्या मैं कल सुबह 6 बजे जा सकता हूँ?",
  mr: "ORCA ला विचारा — मी उद्या सकाळी ६ वाजता जाऊ शकतो का?",
};

const SPEECH_LOCALE: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

// Web Speech API — no key, no server, works in Edge/Chrome.
function getRecognition(): any | null {
  const w = window as any;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

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
  const [speechSupported, setSpeechSupported] = useState(true);
  const recRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSpeechSupported(!!getRecognition());
  }, []);

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
    rec.onresult = (e: any) => {
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
    <div className="card flex h-full min-h-0 flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-bold text-ocean-100">Ask ORCA</div>
          <div className="text-[11px] text-ocean-300/80">Type or speak — English · हिंदी · मराठी</div>
        </div>
        <div className="flex gap-1 rounded-full bg-white/5 p-0.5">
          {(["en", "hi", "mr"] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => onLanguage(l)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                language === l
                  ? "bg-ocean-700 text-white"
                  : "text-ocean-300 hover:text-ocean-100"
              }`}
            >
              {l === "en" ? "EN" : l === "hi" ? "हिं" : "मरा"}
            </button>
          ))}
        </div>
      </div>

      {/* messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-ocean-300/80">
            Ask about safety, fishing zones, routes or warnings.
            <br />
            <span className="text-[11px]">ORCA keeps context — follow-ups like “what about 12 PM?” work.</span>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] animate-rise rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-ocean-700 text-white"
                  : "rounded-bl-md border border-white/10 bg-white/[0.06] text-ocean-100"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-3.5 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-ocean-300"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
              <span className="ml-1 text-[11px] text-ocean-300">agents working…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-2.5">
          {suggestions.slice(0, 4).map((s) => (
            <button key={s} className="chip" onClick={() => submit(s)} disabled={busy}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="flex items-center gap-2 border-t border-white/10 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit(text)}
          placeholder={PLACEHOLDER[language]}
          disabled={busy}
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[13px]
                     text-ocean-100 outline-none transition placeholder:text-ocean-300/50
                     focus:border-ocean-500 focus:bg-white/[0.08]"
        />
        {speechSupported && (
          <button
            onClick={toggleMic}
            title="Speak"
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg transition ${
              listening
                ? "bg-risk-extreme text-white shadow-lg shadow-red-900/40"
                : "bg-risk-high text-white hover:brightness-110"
            }`}
          >
            {listening ? "■" : "🎤"}
          </button>
        )}
        <button
          onClick={() => submit(text)}
          disabled={busy || !text.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-600 text-white
                     transition hover:bg-ocean-500 disabled:opacity-35"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
