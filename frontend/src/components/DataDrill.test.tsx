import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DataDrill from "./DataDrill";
import { GATE } from "../i18n/gate";

describe("the data drill", () => {
  it("offers the four rehearsed states and says which one is on", () => {
    render(<DataDrill active="stale" onDrill={() => {}} language="en" />);
    for (const name of ["Healthy", "Stale", "Unavailable", "Recovery"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Stale" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Healthy" })).toHaveAttribute("aria-pressed", "false");
  });

  it("hands the pressed drill to the app", () => {
    const onDrill = vi.fn();
    render(<DataDrill active="healthy" onDrill={onDrill} language="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Unavailable" }));
    expect(onDrill).toHaveBeenCalledWith("unavailable");
  });

  it("holds still while a drill is being applied", () => {
    render(<DataDrill active="healthy" busy onDrill={() => {}} language="en" />);
    expect(screen.getByRole("button", { name: "Recovery" })).toBeDisabled();
  });

  it.each(["hi", "mr"] as const)("speaks %s", (lang) => {
    render(<DataDrill active="healthy" onDrill={() => {}} language={lang} />);
    expect(screen.getByRole("heading", { name: GATE[lang].drillTitle })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: GATE[lang].drills.recovery })).toBeInTheDocument();
  });
});
