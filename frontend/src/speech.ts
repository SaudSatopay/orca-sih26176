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
  onerror: ((e: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort?(): void;
}

export interface SpeechResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

/** `error` is one of the Web Speech error codes ("no-speech", "not-allowed"…). */
export interface SpeechErrorEvent {
  error?: string;
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

/** Whether this browser can read an answer aloud. */
export function speechSynthesisSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance === "function"
  );
}

/**
 * How the Ask tab takes a question. Many browsers cannot listen (Firefox, most
 * in-app browsers): they get the typed field as the way in, said plainly,
 * never a microphone that does nothing. A phone that can listen but has had
 * its microphone refused falls back to typing for the rest of the visit.
 */
export type AskInput = "voice" | "typed";

export function askInput(canListen: boolean, micBlocked = false): AskInput {
  return canListen && !micBlocked ? "voice" : "typed";
}

/** What went wrong with a listening attempt, in the terms the fisher is told. */
export type ListenProblem = "no-speech" | "blocked" | "failed";

/**
 * Maps a Web Speech error code to what the phone says about it. `aborted` is
 * the fisher's own STOP, so it is not a problem at all.
 */
export function listenProblem(code: string | undefined): ListenProblem | null {
  switch (code) {
    case "aborted":
      return null;
    case "no-speech":
      return "no-speech";
    case "not-allowed":
    case "service-not-allowed":
    case "audio-capture":
      return "blocked";
    default:
      return "failed";
  }
}
