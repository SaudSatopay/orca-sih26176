import { afterEach, describe, expect, it } from "vitest";
import {
  askInput,
  getRecognition,
  listenProblem,
  speechRecognitionSupported,
  speechSynthesisSupported,
} from "./speech";

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
