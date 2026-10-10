import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EvidenceList from "./EvidenceList";
import { GATE } from "../i18n/gate";
import type { DataHealth } from "../types";

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

describe("the Evidence Confidence panel on the phone", () => {
  it("folds to one line on clean evidence, and opens on a tap", () => {
    const { container } = render(<EvidenceList health={[reading("wave"), reading("wind")]} language="en" />);
    const toggle = screen.getByRole("button", { name: /Evidence confidence/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveTextContent("2 of 2 critical inputs fresh");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(GATE.en.panelNote)).toBeVisible();
    expect(container).toHaveTextContent("18 min · limit 3 h");
    expect(container.querySelectorAll("[data-fresh-bar]")).toHaveLength(2);
  });

  it("opens by itself when a critical input is stale or missing, and names it", () => {
    const health = [
      reading("wave", { status: "MISSING", available: false, age_seconds: null, usable: false }),
      reading("position", { label: "Position", age_seconds: null, freshness_limit_seconds: null, max_age_seconds: null }),
      reading("current", { critical: false, status: "STALE", age_seconds: 7 * 3600, freshness_limit_seconds: 6 * 3600, max_age_seconds: 12 * 3600 }),
    ];
    const { container } = render(<EvidenceList health={health} language="en" />);
    expect(screen.getByRole("button", { name: /Evidence confidence/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("missing")).toBeVisible();
    expect(screen.getByText("bundled")).toBeVisible();
    expect(screen.getByText("out of date")).toBeVisible();
    // only the readings with an age and both limits get a bar: 7 h of 12 h
    const bars = container.querySelectorAll("[data-fresh-bar]");
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute("data-fresh-bar", "0.583");
  });

  it.each(LANGS)("speaks the reader's language (%s)", (lang) => {
    render(<EvidenceList health={[reading("wave", { status: "STALE", age_seconds: 4 * 3600 + 600 })]} language={lang} />);
    expect(screen.getByRole("button", { name: new RegExp(GATE[lang].panel) })).toBeInTheDocument();
    expect(screen.getByText(GATE[lang].status.STALE)).toBeVisible();
    expect(screen.getByText(GATE[lang].panelNote)).toBeVisible();
  });

  it("draws nothing when the answer carries no data-health records", () => {
    const { container } = render(<EvidenceList health={[]} language="en" />);
    expect(container).toBeEmptyDOMElement();
  });
});
