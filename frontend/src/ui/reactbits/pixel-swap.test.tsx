import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PixelSwap } from "./pixel-swap";

describe("PixelSwap", () => {
  it("shows one side to assistive tech at a time and swaps when told", () => {
    const { container, rerender } = render(
      <PixelSwap active={false} firstContent={<p>console</p>} secondContent={<p>phone</p>} />,
    );
    const layers = () => [...container.firstElementChild!.children].slice(0, 2);
    expect(layers()[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(layers()[1]).toHaveAttribute("aria-hidden", "true");

    // jsdom has no layout (zero-size box, no Web Animations): the swap is immediate
    rerender(<PixelSwap active firstContent={<p>console</p>} secondContent={<p>phone</p>} />);
    expect(layers()[0]).toHaveAttribute("aria-hidden", "true");
    expect(layers()[1]).not.toHaveAttribute("aria-hidden", "true");
  });
});
