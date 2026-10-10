import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SafetyGate from "./SafetyGate";
import { GATE } from "../i18n/gate";
import type { DataHealth, GateState, SafetyDecision } from "../types";

const LANGS = ["en", "hi", "mr"] as const;

function reading(input: string, over: Partial<DataHealth> = {}): DataHealth {
  return {
    input,
    label: input === "wave" ? "Wave height" : input,
    source: "ORCA demo dataset",
    feed: "marine",
    available: true,
    observed_at: "2026-10-01T13:42:00+05:30",
    age_seconds: 18 * 60,
    freshness_limit_seconds: 3 * 3600,
    max_age_seconds: 6 * 3600,
    status: "FRESH",
    critical: true,
    usable: true,
    detail: "18 min old (limit 3 h)",
    mode: "DEMO",
    ...over,
  };
}

function decision(state: GateState, over: Partial<SafetyDecision> = {}): SafetyDecision {
  return {
    state,
    confidence: state === "GO" ? "normal" : state === "CAUTION" ? "degraded" : "insufficient",
    headline: "headline",
    reasons: ["All 4 critical inputs are fresh."],
    blocking_inputs: [],
    stale_inputs: [],
    risk_go: state !== "NO_GO",
    drill: "healthy",
    timestamp: `2026-10-01T14:00:00+05:30-${state}`,
    ...over,
  };
}

describe("the evidence check on a verdict", () => {
  it.each(LANGS)("stamps every gate state in the reader's language (%s)", (lang) => {
    for (const state of ["GO", "CAUTION", "NO_GO", "INSUFFICIENT_DATA"] as const) {
      const { unmount } = render(
        <SafetyGate decision={decision(state)} health={[reading("wave")]} language={lang} />,
      );
      expect(screen.getByText(GATE[lang].state[state])).toBeInTheDocument();
      unmount();
    }
  });

  it("counts fresh critical inputs, never the supporting ones", () => {
    const health = [
      reading("wave"),
      reading("wind"),
      reading("warnings", { status: "STALE", usable: true }),
      reading("rain", { critical: false }),
    ];
    render(<SafetyGate decision={decision("GO")} health={health} language="en" />);
    expect(screen.getByText("2 of 3 critical inputs fresh")).toBeInTheDocument();
  });

  it("prints why when the evidence is missing, and drops nothing", () => {
    const d = decision("INSUFFICIENT_DATA", {
      blocking_inputs: ["wave"],
      reasons: [
        "Wave height: no reading — the marine forecast feed did not respond.",
        "ORCA will not clear a trip on missing or out-of-date evidence.",
      ],
    });
    render(<SafetyGate decision={d} health={[reading("wave", { status: "MISSING" })]} language="en" />);
    expect(
      screen.getByText("Wave height: no reading — the marine forecast feed did not respond."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ORCA will not clear a trip on missing or out-of-date evidence."),
    ).toBeInTheDocument();
  });

  it("keeps a clean GO to one line, but still says a feed reconnected", () => {
    const d = decision("GO", {
      reasons: [
        "The marine forecast feed reconnected 1 min ago — readings are fresh again.",
        "All 4 critical inputs are fresh.",
      ],
    });
    render(<SafetyGate decision={d} health={[reading("wave")]} language="en" />);
    expect(screen.getByText(/reconnected 1 min ago/)).toBeInTheDocument();
    expect(screen.queryByText("All 4 critical inputs are fresh.")).not.toBeInTheDocument();
  });

  it("opens the inputs table with source, age, limit and status", () => {
    const health = [
      reading("wave", { status: "STALE", age_seconds: 4 * 3600 + 600 }),
      reading("position", {
        label: "Position and restricted zones",
        age_seconds: null,
        freshness_limit_seconds: null,
        max_age_seconds: null,
      }),
    ];
    render(<SafetyGate decision={decision("CAUTION")} health={health} language="en" />);
    const toggle = screen.getByRole("button", { name: "Show the inputs" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const table = screen.getByRole("table");
    expect(table).toHaveTextContent("4 h 10 min");
    expect(table).toHaveTextContent("3 h");
    expect(table).toHaveTextContent("out of date");
    expect(table).toHaveTextContent("bundled");
  });

  it("names every button in all three languages", () => {
    for (const lang of LANGS) {
      const { unmount } = render(
        <SafetyGate decision={decision("GO")} health={[reading("wave")]} language={lang} />,
      );
      expect(screen.getByRole("button", { name: GATE[lang].show })).toBeInTheDocument();
      unmount();
    }
  });
});
