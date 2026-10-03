import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RiskAssessment } from "../types";
import RiskCard from "./RiskCard";

afterEach(() => vi.useRealTimers());

const reading = (at: string): RiskAssessment => ({
  score: 92,
  category: "EXTREME",
  factors: [{ key: "cyclone", label: "Cyclone", factor: 1, weight: 0.25, contribution: 25, detail: "Cyclone alert" }],
  overrides: [],
  official_warning: true,
  go: false,
  window: null,
  sources: [],
  generated_at: at,
  mode: "DEMO",
});

describe("a verdict lands with a beam", () => {
  it("runs a teal light round the card when a fresh verdict arrives, then takes it away", () => {
    vi.useFakeTimers();
    const { container } = render(<RiskCard risk={reading("2026-10-03T06:00:00")} evidence={[]} language="en" />);
    expect(container.querySelector(".verdict .border-beam-spin")).not.toBeNull();
    // the verdict itself is on screen from the first frame, beam or no beam
    expect(screen.getByRole("img", { name: "92 / 100 · EXTREME" })).toBeInTheDocument();
    expect(screen.getByText("Official warning", { selector: ".stamp" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6000));
    expect(container.querySelector(".border-beam-spin")).toBeNull();
  });

  it("does not run again when the same verdict is only opened again", () => {
    const first = render(<RiskCard risk={reading("2026-10-03T07:00:00")} evidence={[]} language="en" />);
    first.unmount();
    const again = render(<RiskCard risk={reading("2026-10-03T07:00:00")} evidence={[]} language="en" />);
    expect(again.container.querySelector(".border-beam-spin")).toBeNull();
  });
});
