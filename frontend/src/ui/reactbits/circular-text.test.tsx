import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AMBIENT_SELECTOR } from "../../ambient";
import CircularText from "./circular-text";

describe("circular text", () => {
  it("letters the ring as decoration, untranslated, turning on a loop the ambient watcher pauses", () => {
    const { container } = render(<CircularText text="ORCA · " spinDuration={40} />);
    const ring = container.firstElementChild!;
    expect(ring).toHaveAttribute("aria-hidden", "true");
    expect(ring).toHaveAttribute("translate", "no");
    const spin = ring.querySelector(".border-beam-spin") as HTMLElement;
    expect(AMBIENT_SELECTOR.split(",")).toContain(".border-beam-spin");
    expect(spin.style.animationDuration).toBe("40s");
    expect(spin.children).toHaveLength(Array.from("ORCA · ").length);
  });
});
