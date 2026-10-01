import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { riskBand } from "../risk";
import type { RiskAssessment } from "../types";
import RiskCard from "./RiskCard";
import RiskDial from "./RiskDial";

// The worst case the dial is built for: a hidden tab or a projector output
// where requestAnimationFrame never fires. Only the timeout is left to run.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.stubGlobal("requestAnimationFrame", () => 0);
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

/** Let the count-up finish: its fail-safe timeout lands the number at 870 ms. */
function settle() {
  act(() => {
    vi.advanceTimersByTime(1000);
  });
}

describe("RiskDial", () => {
  it("names the score and band for 70 before any animation frame has run", () => {
    render(<RiskDial score={70} category={riskBand(70)} />);
    expect(screen.getByRole("img", { name: "70 / 100 · HIGH" })).toBeInTheDocument();
  });

  it("lands on 70 even if no animation frame is ever painted", () => {
    const { container } = render(<RiskDial score={70} category="HIGH" />);
    settle();
    expect(container).toHaveTextContent("70");
    expect(container).toHaveTextContent("/ 100");
  });

  it("opens on its reading under reduced motion: no count to wait for", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce") }));
    const { container } = render(<RiskDial score={70} category="HIGH" />);
    expect(container).toHaveTextContent("70/ 100");
  });

  it("opens on its reading when that reading has been on screen before", () => {
    const { container } = render(<RiskDial score={70} category="HIGH" fresh={false} />);
    expect(container).toHaveTextContent("70/ 100");
  });

  it("moves the arc with the numeral: the arc has no transition of its own", () => {
    const { container } = render(<RiskDial score={70} category="HIGH" />);
    const arc = container.querySelector("circle[stroke-dasharray]");
    expect(arc?.getAttribute("style") ?? "").not.toContain("transition");
  });

  it("lands on the rehearsed 9 and 92 as well", () => {
    const low = render(<RiskDial score={9} category="LOW" />);
    settle();
    expect(low.container).toHaveTextContent("9/ 100");
    low.unmount();
    const extreme = render(<RiskDial score={92} category="EXTREME" />);
    settle();
    expect(extreme.container).toHaveTextContent("92/ 100");
  });
});

describe("RiskCard", () => {
  const risk: RiskAssessment = {
    score: 70,
    category: "HIGH",
    factors: [
      { key: "warning", label: "Official warning", factor: 1, weight: 0.3, contribution: 30, detail: "IMD fishermen warning" },
    ],
    overrides: ["Fishermen warning in force: score raised to 70"],
    official_warning: true,
    go: false,
    window: null,
    sources: [],
    generated_at: "2026-10-01T06:00:00",
    mode: "DEMO",
  };

  it("shows 70, the HIGH stamp and the verdict in words", () => {
    render(<RiskCard risk={risk} evidence={[]} language="en" />);
    settle();
    expect(screen.getByRole("img", { name: "70 / 100 · HIGH" })).toHaveTextContent("70");
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("High risk — not recommended")).toBeInTheDocument();
    expect(screen.getByText("Official warning", { selector: ".stamp" })).toBeInTheDocument();
  });

  it("says the same verdict in Hindi and Marathi", () => {
    const hi = render(<RiskCard risk={risk} evidence={[]} language="hi" />);
    expect(screen.getByText("जोखिम अधिक है — जाने की सलाह नहीं")).toBeInTheDocument();
    hi.unmount();
    render(<RiskCard risk={risk} evidence={[]} language="mr" />);
    expect(screen.getByText("धोका जास्त आहे — जाऊ नका")).toBeInTheDocument();
  });
});
