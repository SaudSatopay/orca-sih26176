import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AMBIENT_SELECTOR } from "../../ambient";
import { risk } from "../../tokens";
import { GlowingBadge } from "./glowing-badge";

describe("glowing badge (Unlumen, adapted)", () => {
  it("a badge in use pings with a loop the ambient watcher pauses", () => {
    const { container } = render(<GlowingBadge tone={risk.low} pulse>In use</GlowingBadge>);
    const dot = container.querySelector(".pulse-dot")!;
    expect(dot).not.toHaveClass("pulse-dot--still");
    expect(AMBIENT_SELECTOR.split(",")).toContain(".pulse-dot");
    expect(container.firstElementChild).toHaveAttribute("data-pulse");
  });

  it("a standby badge keeps its dot still", () => {
    const { container } = render(<GlowingBadge tone={risk.low}>Standby</GlowingBadge>);
    expect(container.querySelector(".pulse-dot")).toHaveClass("pulse-dot--still");
    expect(container.firstElementChild).not.toHaveAttribute("data-pulse");
  });

  it("prints its words in ink and hides the glow and dot from assistive tech", () => {
    const { container } = render(<GlowingBadge tone={risk.high}>Demo</GlowingBadge>);
    expect(screen.getByText("Demo")).toHaveClass("text-ink-800");
    expect(container.querySelectorAll("[aria-hidden]")).toHaveLength(2);
  });
});
