import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AMBIENT_SELECTOR } from "../ambient";
import { Marquee } from "./magicui/marquee";
import { NumberTicker } from "./magicui/number-ticker";
import { Ripple } from "./magicui/ripple";

/** Every loop the kit can start must be one the ambient watcher can pause. */
describe("the vendored UI kit", () => {
  it("registers each of its loops with the ambient watcher", () => {
    const watched = AMBIENT_SELECTOR.split(",");
    for (const cls of [".animate-marquee", ".animate-marquee-vertical", ".animate-ripple", ".border-beam-spin"])
      expect(watched).toContain(cls);
  });

  it("marquee: the first copy is the content, the rest are hidden from assistive tech", () => {
    const { container } = render(
      <Marquee repeat={3}>
        <span>Paradip 92</span>
      </Marquee>,
    );
    const copies = container.firstElementChild!.children;
    expect(copies).toHaveLength(3);
    expect(copies[0]).not.toHaveAttribute("aria-hidden");
    expect(copies[1]).toHaveAttribute("aria-hidden", "true");
    expect(copies[2]).toHaveAttribute("aria-hidden", "true");
  });

  it("number ticker: renders a number from the first frame, never a blank", () => {
    const { container } = render(<NumberTicker value={92} />);
    expect(container.textContent).toMatch(/^\d+$/);
  });

  it("ripple: decoration only", () => {
    const { container } = render(<Ripple numCircles={3} />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".animate-ripple")).toHaveLength(3);
  });
});
