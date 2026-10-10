import type { SpeechRecognitionLike, SpeechResultEvent, SpeechResultLike } from "../speech";

/** One recognition result as the browser hands it over: one alternative, final by default. */
export function heard(transcript: string, isFinal = true): SpeechResultLike {
  return Object.assign([{ transcript }], { isFinal });
}

/**
 * A stand-in for the browser's recognizer. Tests drive it the way a browser
 * does: `say` fires one `result` event, `end` closes the session, `fail`
 * fires an error. Every instance made is kept in `FakeRecognition.made`.
 */
export class FakeRecognition implements SpeechRecognitionLike {
  static made: FakeRecognition[] = [];

  lang = "";
  interimResults = true;
  maxAlternatives = 5;
  onresult: SpeechRecognitionLike["onresult"] = null;
  onerror: SpeechRecognitionLike["onerror"] = null;
  onend: SpeechRecognitionLike["onend"] = null;
  started = 0;
  stopped = 0;
  aborted = 0;

  constructor() {
    FakeRecognition.made.push(this);
  }

  static last(): FakeRecognition {
    const rec = FakeRecognition.made[FakeRecognition.made.length - 1];
    if (!rec) throw new Error("no recognizer was made");
    return rec;
  }

  start() {
    this.started += 1;
  }

  stop() {
    this.stopped += 1;
  }

  abort() {
    this.aborted += 1;
  }

  /** One `result` event carrying this results list. */
  say(results: SpeechResultLike[], resultIndex = 0) {
    const e: SpeechResultEvent = { results, resultIndex };
    this.onresult?.(e);
  }

  fail(error: string) {
    this.onerror?.({ error });
  }

  end() {
    this.onend?.();
  }
}

type SpeechWindow = { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown };

/** Lets this window listen, through the fake. */
export function installFakeRecognition() {
  FakeRecognition.made = [];
  (window as unknown as SpeechWindow).webkitSpeechRecognition = FakeRecognition;
}

export function removeFakeRecognition() {
  const w = window as unknown as SpeechWindow;
  delete w.webkitSpeechRecognition;
  delete w.SpeechRecognition;
  FakeRecognition.made = [];
}
