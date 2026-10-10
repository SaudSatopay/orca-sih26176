import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RiskAssessment, SafetyDecision } from "../types";
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

describe("the safety gate on the verdict", () => {
  const goa = (at: string): RiskAssessment => ({
    score: 9,
    category: "LOW",
    factors: [{ key: "wave", label: "Wave height", factor: 0.3, weight: 0.25, contribution: 7.5, detail: "Wave height not available" }],
    overrides: [],
    official_warning: false,
    go: true,
    window: null,
    sources: [],
    generated_at: at,
    mode: "DEMO",
  });
  const decision = (state: SafetyDecision["state"]): SafetyDecision => ({
    state,
    confidence: state === "GO" ? "normal" : state === "CAUTION" ? "degraded" : "insufficient",
    headline: "",
    reasons: state === "GO" ? ["All 4 critical inputs are fresh."] : ["Wave height: no reading."],
    blocking_inputs: state === "INSUFFICIENT_DATA" ? ["wave"] : [],
    stale_inputs: state === "CAUTION" ? ["wave"] : [],
    risk_go: true,
    drill: "healthy",
    timestamp: `t-${state}`,
  });

  it("withholds the score and the go stamp when a critical input is missing", () => {
    render(<RiskCard risk={goa("a")} evidence={[]} language="en" decision={decision("INSUFFICIENT_DATA")} />);
    expect(screen.queryByRole("img", { name: /9 \/ 100/ })).not.toBeInTheDocument();
    expect(screen.queryByText("Safe to go")).not.toBeInTheDocument();
    expect(screen.getByText("No score — ORCA will not guess")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Follow the official advisory" })).toBeInTheDocument();
    // the points would rest on a reading that never arrived
    expect(screen.queryByText("+7.5")).not.toBeInTheDocument();
  });

  it("keeps the number but marks it unconfirmed on stale evidence", () => {
    render(<RiskCard risk={goa("b")} evidence={[]} language="en" decision={decision("CAUTION")} />);
    expect(screen.getByRole("img", { name: "9 / 100 · LOW" })).toBeInTheDocument();
    expect(screen.getByText(/unconfirmed/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Check the latest bulletin before you go" })).toBeInTheDocument();
    expect(screen.getAllByText("Caution — data stale").length).toBeGreaterThan(0);
  });

  it("leaves a fresh GO verdict exactly as it was, with the evidence check above it", () => {
    render(<RiskCard risk={goa("c")} evidence={[]} language="en" decision={decision("GO")} />);
    expect(screen.getByRole("img", { name: "9 / 100 · LOW" })).toBeInTheDocument();
    expect(screen.getByText("Safe to go", { selector: ".stamp" })).toBeInTheDocument();
    expect(screen.getByText("Evidence fresh")).toBeInTheDocument();
  });
});
