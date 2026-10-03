import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AgentTrace } from "../types";
import AgentTracePanel from "./AgentTrace";

const trace: AgentTrace[] = [
  { agent: "intent", status: "ok", latency_ms: 1, summary: "Mumbai, today", source: "", mode: "DEMO" },
  { agent: "risk", status: "ok", latency_ms: 2, summary: "28 / 100", source: "", mode: "DEMO" },
];

describe("tooltips that explain the crew", () => {
  it("focusing an agent's name shows one line on what it does, and describes the name by it", () => {
    render(<AgentTracePanel trace={trace} elapsed={5} language="en" />);
    const name = screen.getByText("Risk engine");
    expect(name).toHaveAttribute("tabindex", "0");
    fireEvent.focus(name);
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent(/Weighs every reading into a 0–100 score/);
    expect(name).toHaveAttribute("aria-describedby", tip.id);
  });

  it("Escape puts the tooltip away", async () => {
    render(<AgentTracePanel trace={trace} elapsed={5} language="en" />);
    const name = screen.getByText("Intent");
    fireEvent.focus(name);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.keyDown(name, { key: "Escape" });
    expect(name).not.toHaveAttribute("aria-describedby");
  });

  it("hovering shows it too, in the reader's language", () => {
    render(<AgentTracePanel trace={trace} elapsed={5} language="mr" />);
    fireEvent.mouseEnter(screen.getByText("रिस्क इंजिन"), { clientX: 100, clientY: 100 });
    expect(screen.getByRole("tooltip")).toHaveTextContent(/0–100 गुणांत तोलतो/);
  });
});
