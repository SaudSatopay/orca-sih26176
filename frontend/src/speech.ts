import type { Language } from "./types";

export const SPEECH_LOCALE: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

/** The slice of the Web Speech recognition API that ORCA uses. */
export interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export interface SpeechResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

function recognitionCtor(): RecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Whether this browser can listen at all (Edge and Chrome can; no key, no server). */
export function speechRecognitionSupported(): boolean {
  return typeof window !== "undefined" && recognitionCtor() !== null;
}

/** Web Speech API — no key, no server, works in Edge/Chrome. */
export function getRecognition(): SpeechRecognitionLike | null {
  const Ctor = recognitionCtor();
  return Ctor ? new Ctor() : null;
}
