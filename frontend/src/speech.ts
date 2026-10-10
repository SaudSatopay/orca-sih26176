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

/** One recognition result: its alternatives, best first. */
export interface SpeechResultLike extends ArrayLike<{ transcript: string }> {
  isFinal?: boolean;
}

export interface SpeechResultEvent {
  /** The first entry of `results` this event changed. */
  resultIndex?: number;
  results: ArrayLike<SpeechResultLike>;
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

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * Adds one piece of heard text to what was heard so far. Browsers disagree on
 * how they report one utterance: Android Chrome re-sends it as it grows ("is",
 * "is it", "is it safe"), desktop Chrome sends distinct segments. A piece that
 * starts with the text so far replaces it; a shorter repeat is dropped;
 * anything else is a new segment, joined with a space.
 */
function addHeard(soFar: string, next: string): string {
  const piece = squash(next);
  if (!piece) return soFar;
  if (!soFar) return piece;
  const a = soFar.toLowerCase();
  const b = piece.toLowerCase();
  if (b.startsWith(a)) return piece;
  if (a.startsWith(b)) return soFar;
  return `${soFar} ${piece}`;
}

/** The best transcript of a results list: each result's first alternative, merged. */
export function transcriptOf(results: ArrayLike<SpeechResultLike>): string {
  let text = "";
  for (let i = 0; i < results.length; i += 1) {
    text = addHeard(text, results[i]?.[0]?.transcript ?? "");
  }
  return text;
}

export interface ListenHandlers {
  /** What has been heard so far, while still listening. */
  onPartial?: (text: string) => void;
  /** The whole question, once, when listening is over. */
  onFinal: (text: string) => void;
  /** Listening ended on its own and nothing was heard. */
  onNothing?: () => void;
  /** The recognizer failed (a Web Speech error code); nothing is sent. */
  onError?: (code: string | undefined) => void;
  /** Listening is over, whatever the outcome. Called once. */
  onEnd?: () => void;
}

export interface ListenSession {
  /** The fisher's STOP: the browser hands over what it heard, and that is sent. */
  stop(): void;
  /** Walk away: nothing more is sent or reported. */
  abort(): void;
}

/**
 * Wires a recognizer to take exactly one question. Every result event only
 * updates the best transcript; the question is sent once, when the recognizer
 * ends. It is not sent on the first "final" result, because Android Chrome
 * marks each growing transcript final and that would send "is". The caller
 * sets `lang` and calls `start()`.
 */
export function listenOnce(rec: SpeechRecognitionLike, h: ListenHandlers): ListenSession {
  let best = "";
  let done = false; // the question was sent, or listening failed or was abandoned
  let stopped = false; // the fisher pressed STOP
  let ended = false;
  let released = false; // the recognizer has been told to let go of the microphone

  // Listening is over: let go of the recognizer. iOS Safari keeps the
  // microphone open (the orange dot) for as long as a recognizer holds its
  // audio session, even after `end`; aborting an ended recognizer is a no-op
  // elsewhere. Nothing of ours stays attached to it.
  const release = () => {
    if (released) return;
    released = true;
    rec.onresult = null;
    rec.onerror = null;
    rec.onend = null;
    try {
      rec.abort?.();
    } catch {
      /* already gone */
    }
  };

  const finish = () => {
    if (ended) return;
    ended = true;
    h.onEnd?.();
    release();
  };

  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    if (done) return;
    const next = addHeard(best, transcriptOf(e.results));
    if (next === best) return;
    best = next;
    h.onPartial?.(best);
  };
  rec.onerror = (e) => {
    if (done) return;
    done = true;
    h.onError?.(e?.error);
    finish();
  };
  rec.onend = () => {
    if (!done) {
      done = true;
      if (best) h.onFinal(best);
      else if (!stopped) h.onNothing?.();
    }
    finish();
  };

  return {
    stop() {
      stopped = true;
      rec.stop();
    },
    abort() {
      done = true;
      if (rec.abort) rec.abort();
      else rec.stop();
      released = true; // aborted already: the end that follows lets go of nothing more
    },
  };
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
