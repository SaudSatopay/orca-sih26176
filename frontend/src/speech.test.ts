import { afterEach, describe, expect, it, vi } from "vitest";
import {
  askInput,
  getRecognition,
  listenOnce,
  listenProblem,
  speechRecognitionSupported,
  speechSynthesisSupported,
  transcriptOf,
} from "./speech";
import { FakeRecognition, heard } from "./test/fakeSpeech";

type SpeechWindow = {
  SpeechRecognition?: unknown;
  webkitSpeechRecognition?: unknown;
};
const w = window as unknown as SpeechWindow;

afterEach(() => {
  delete w.SpeechRecognition;
  delete w.webkitSpeechRecognition;
});

describe("how the Ask tab takes a question", () => {
  it("is typed when the browser cannot listen", () => {
    expect(askInput(false)).toBe("typed");
  });

  it("is voice when the browser can listen", () => {
    expect(askInput(true)).toBe("voice");
  });

  it("falls back to typing once the microphone has been refused", () => {
    expect(askInput(true, true)).toBe("typed");
    expect(askInput(false, true)).toBe("typed");
  });

  it("detects recognition under either name, and its absence", () => {
    expect(speechRecognitionSupported()).toBe(false);
    expect(getRecognition()).toBeNull();
    class Recognition {}
    w.webkitSpeechRecognition = Recognition;
    expect(speechRecognitionSupported()).toBe(true);
    expect(getRecognition()).toBeInstanceOf(Recognition);
    expect(askInput(speechRecognitionSupported())).toBe("voice");
  });

  it("knows jsdom cannot read aloud", () => {
    expect(speechSynthesisSupported()).toBe(false);
  });
});

describe("what a failed listening attempt is called", () => {
  it("treats the fisher's own stop as no problem", () => {
    expect(listenProblem("aborted")).toBeNull();
  });

  it("separates silence, a blocked microphone and everything else", () => {
    expect(listenProblem("no-speech")).toBe("no-speech");
    expect(listenProblem("not-allowed")).toBe("blocked");
    expect(listenProblem("service-not-allowed")).toBe("blocked");
    expect(listenProblem("audio-capture")).toBe("blocked");
    expect(listenProblem("network")).toBe("failed");
    expect(listenProblem(undefined)).toBe("failed");
  });
});

describe("the best transcript of a results list", () => {
  it("takes a growing (Android-style) transcript as a replacement, not more words", () => {
    expect(transcriptOf([heard("is"), heard("is it"), heard("is it safe to go")])).toBe(
      "is it safe to go",
    );
  });

  it("ignores a shorter repeat of what it already has", () => {
    expect(transcriptOf([heard("is it safe to go"), heard("is it")])).toBe("is it safe to go");
    expect(transcriptOf([heard("Is it safe to go"), heard("is IT")])).toBe("Is it safe to go");
    // the same words again, in another case, are one question, not two
    expect(transcriptOf([heard("Is it safe"), heard("is it SAFE")])).toBe("is it SAFE");
  });

  it("joins distinct (desktop-style) segments with one space", () => {
    expect(transcriptOf([heard("is it safe "), heard(" to go at six")])).toBe(
      "is it safe to go at six",
    );
  });

  it("is empty when nothing was heard", () => {
    expect(transcriptOf([])).toBe("");
    expect(transcriptOf([heard("  "), Object.assign([], { isFinal: true })])).toBe("");
  });
});

describe("listening for one question", () => {
  function listen() {
    const rec = new FakeRecognition();
    const h = { onPartial: vi.fn(), onFinal: vi.fn(), onNothing: vi.fn(), onError: vi.fn(), onEnd: vi.fn() };
    const session = listenOnce(rec, h);
    return { rec, h, session };
  }

  it("asks for final results only, one alternative", () => {
    const { rec } = listen();
    expect(rec.interimResults).toBe(false);
    expect(rec.maxAlternatives).toBe(1);
  });

  it("sends a growing Android transcript once, whole, when listening ends", () => {
    const { rec, h } = listen();
    rec.say([heard("is")]);
    rec.say([heard("is it")]);
    rec.say([heard("is it safe to go")]);
    expect(h.onFinal).not.toHaveBeenCalled();
    expect(h.onPartial).toHaveBeenLastCalledWith("is it safe to go");
    rec.end();
    expect(h.onFinal).toHaveBeenCalledTimes(1);
    expect(h.onFinal).toHaveBeenCalledWith("is it safe to go");
    expect(h.onNothing).not.toHaveBeenCalled();
    expect(h.onEnd).toHaveBeenCalledTimes(1);
  });

  it("does not repeat words when the growing transcripts share one results list", () => {
    const { rec, h } = listen();
    rec.say([heard("is")]);
    rec.say([heard("is"), heard("is it")], 1);
    rec.say([heard("is"), heard("is it"), heard("is it safe to go")], 2);
    rec.end();
    expect(h.onFinal).toHaveBeenCalledTimes(1);
    expect(h.onFinal).toHaveBeenCalledWith("is it safe to go");
  });

  it("sends a desktop single final result once", () => {
    const { rec, h } = listen();
    rec.say([heard("can I go at 6")]);
    rec.end();
    expect(h.onFinal).toHaveBeenCalledTimes(1);
    expect(h.onFinal).toHaveBeenCalledWith("can I go at 6");
  });

  it("joins distinct segments, whether they arrive in one list or across events", () => {
    const one = listen();
    one.rec.say([heard("is it safe"), heard("to go at six")]);
    one.rec.end();
    expect(one.h.onFinal).toHaveBeenCalledWith("is it safe to go at six");

    const across = listen();
    across.rec.say([heard("is it safe")]);
    across.rec.say([heard("to go at six")], 0);
    across.rec.end();
    expect(across.h.onFinal).toHaveBeenCalledTimes(1);
    expect(across.h.onFinal).toHaveBeenCalledWith("is it safe to go at six");
  });

  it("sends nothing when nothing was heard, and says so", () => {
    const { rec, h } = listen();
    rec.say([heard("   ")]);
    rec.end();
    expect(h.onFinal).not.toHaveBeenCalled();
    expect(h.onNothing).toHaveBeenCalledTimes(1);
    expect(h.onEnd).toHaveBeenCalledTimes(1);
  });

  it("ignores anything the recognizer fires after the question was sent", () => {
    const { rec, h } = listen();
    rec.say([heard("is it safe")]);
    rec.end();
    rec.say([heard("is it safe to go")]);
    rec.end();
    expect(h.onFinal).toHaveBeenCalledTimes(1);
    expect(h.onFinal).toHaveBeenCalledWith("is it safe");
  });

  it("on the fisher's STOP, sends what was heard once, and is silent if that was nothing", () => {
    const spoke = listen();
    spoke.rec.say([heard("is it safe")]);
    spoke.session.stop();
    expect(spoke.rec.stopped).toBe(1);
    // the browser hands over its last words, then ends
    spoke.rec.say([heard("is it safe to go")]);
    spoke.rec.end();
    expect(spoke.h.onFinal).toHaveBeenCalledTimes(1);
    expect(spoke.h.onFinal).toHaveBeenCalledWith("is it safe to go");

    const silent = listen();
    silent.session.stop();
    silent.rec.end();
    expect(silent.h.onFinal).not.toHaveBeenCalled();
    expect(silent.h.onNothing).not.toHaveBeenCalled();
    expect(silent.h.onEnd).toHaveBeenCalledTimes(1);
  });

  it("reports an error and sends nothing, then still ends once", () => {
    const { rec, h } = listen();
    rec.say([heard("is it")]);
    rec.fail("network");
    rec.end();
    expect(h.onError).toHaveBeenCalledWith("network");
    expect(h.onFinal).not.toHaveBeenCalled();
    expect(h.onNothing).not.toHaveBeenCalled();
    expect(h.onEnd).toHaveBeenCalledTimes(1);
  });

  it("sends nothing at all once abandoned", () => {
    const { rec, h, session } = listen();
    rec.say([heard("is it safe")]);
    session.abort();
    expect(rec.aborted).toBe(1);
    rec.end();
    expect(h.onFinal).not.toHaveBeenCalled();
    expect(h.onNothing).not.toHaveBeenCalled();
  });
});
