import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimateDigits } from "./unlumen/animate-digits";
import { SplitFlapText } from "./reactbits/split-flap-text";
import { graphemes } from "./reactbits/graphemes";

describe("animate digits (Unlumen, adapted)", () => {
  it("prints the new score at once when it changes; only the old digit is on its way out", () => {
    const { container, rerender } = render(<AnimateDigits value="40" />);
    rerender(<AnimateDigits value="72" />);
    // the value assistive tech reads is the new one, in the same render
    expect(screen.getByText("72", { selector: ".sr-only" })).toBeInTheDocument();
    const shown = container.querySelector("[aria-hidden]")!;
    // the new digits are there, and no element carrying them starts transparent
    expect(shown.textContent).toContain("7");
    expect(shown.textContent).toContain("2");
    for (const el of shown.querySelectorAll<HTMLElement>("span"))
      if (el.textContent === "7" || el.textContent === "2") expect(el.style.opacity || "1").not.toBe("0");
  });

  it("keeps a units digit in its place when the number gains a place", () => {
    const { container, rerender } = render(<AnimateDigits value="9" />);
    rerender(<AnimateDigits value="10" />);
    expect(container.querySelector(".sr-only")).toHaveTextContent("10");
  });
});

describe("split flap text (React Bits, adapted)", () => {
  it("never splits a Devanagari conjunct across two tiles", () => {
    expect(graphemes("किनारी")).toEqual(["कि", "ना", "री"]);
    expect(graphemes("तटीय")).toEqual(["त", "टी", "य"]);
  });

  it("reads as its text from the first frame, with tiles as decoration", () => {
    const { container } = render(<SplitFlapText text="Coastal risk board" play />);
    expect(screen.getByText("Coastal risk board")).toHaveClass("sr-only");
    expect(container.querySelector(".split-flap-row")).toHaveAttribute("aria-hidden", "true");
    // one tile per letter, a gap per space
    expect(container.querySelectorAll(".split-flap-tile")).toHaveLength(16);
    expect(container.querySelectorAll(".split-flap-gap")).toHaveLength(2);
    expect(container.querySelector(".split-flap-row")!.textContent).toContain("C");
  });
});
