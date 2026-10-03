import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DecryptedText from "./decrypted-text";
import { fakeMedia } from "./media.test-helper";

const original = window.matchMedia;
beforeEach(() => fakeMedia({}));
afterEach(() => {
  window.matchMedia = original;
  vi.useRealTimers();
});

const drawn = (el: Element) => el.querySelector("[aria-hidden='true']")!.textContent;

describe("decrypted text", () => {
  it("is the finished words from the first frame, and assistive tech always reads them", () => {
    const { container } = render(<DecryptedText text="Index of sheets" animateOn="view" />);
    expect(drawn(container)).toBe("Index of sheets");
    expect(container.querySelector(".sr-only")!.textContent).toBe("Index of sheets");
  });

  it("decodes once on mount: scrambled glyphs are visible text, never a blank, and it lands", () => {
    vi.useFakeTimers();
    const { container } = render(<DecryptedText text="SIH26176 · ISRO" animateOn="mount" speed={30} />);
    const seen: string[] = [];
    for (let i = 0; i < 20; i++) {
      act(() => {
        vi.advanceTimersByTime(30);
      });
      seen.push(drawn(container)!);
    }
    for (const frame of seen) expect(Array.from(frame)).toHaveLength(Array.from("SIH26176 · ISRO").length);
    expect(seen.some((f) => f !== "SIH26176 · ISRO")).toBe(true);
    expect(drawn(container)).toBe("SIH26176 · ISRO");
    // the screen-reader copy never scrambles
    expect(container.querySelector(".sr-only")!.textContent).toBe("SIH26176 · ISRO");
  });

  it("never scrambles Devanagari, and stands still under reduced motion", () => {
    vi.useFakeTimers();
    const hi = render(<DecryptedText text="शीटों की सूची" animateOn="mount" />);
    act(() => {
      vi.advanceTimersByTime(40);
    });
    expect(drawn(hi.container)).toBe("शीटों की सूची");
    hi.unmount();
    fakeMedia({ reduce: true });
    const still = render(<DecryptedText text="HOW ORCA DECIDES" animateOn="mount" />);
    act(() => {
      vi.advanceTimersByTime(40);
    });
    expect(drawn(still.container)).toBe("HOW ORCA DECIDES");
  });
});
