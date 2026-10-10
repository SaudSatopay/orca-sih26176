import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChatPanel from "./ChatPanel";
import { T } from "../i18n/chat";
import {
  FakeRecognition,
  heard,
  installFakeRecognition,
  removeFakeRecognition,
} from "../test/fakeSpeech";

const t = T.en;

function openAsk() {
  const onSend = vi.fn();
  render(
    <ChatPanel
      messages={[]}
      busy={false}
      failed={false}
      language="en"
      suggestions={[]}
      onSend={onSend}
      onRetry={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: t.speak }));
  return { onSend, rec: FakeRecognition.last() };
}

beforeEach(installFakeRecognition);
afterEach(removeFakeRecognition);

describe("the desktop Ask mic", () => {
  it("sends one spoken question once, whole, even when the browser reports it word by word", () => {
    const { onSend, rec } = openAsk();
    expect(rec.started).toBe(1);
    expect(rec.lang).toBe("en-IN");

    act(() => rec.say([heard("is")]));
    act(() => rec.say([heard("is it")]));
    act(() => rec.say([heard("is it safe to go")]));
    // what has been heard so far shows in the field, but nothing is sent yet
    expect(screen.getByRole("textbox", { name: t.question })).toHaveValue("is it safe to go");
    expect(onSend).not.toHaveBeenCalled();

    act(() => rec.end());
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith("is it safe to go");
    expect(screen.getByRole("button", { name: t.speak })).toHaveAttribute("aria-pressed", "false");
  });

  it("stops listening and sends nothing when nothing was heard", () => {
    const { onSend, rec } = openAsk();
    expect(screen.getByRole("button", { name: t.stopListening })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    act(() => rec.end());
    expect(onSend).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: t.speak })).toBeInTheDocument();
  });
});
