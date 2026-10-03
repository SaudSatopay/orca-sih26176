import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CrewWorking from "./CrewWorking";
import { SonarDial } from "../ui/console/SonarDial";

afterEach(() => vi.useRealTimers());

const marks = (c: HTMLElement) =>
  [...c.querySelectorAll<HTMLElement>(".status-mark")].map((m) => m.dataset.status);

describe("the crew reads the sea", () => {
  it("gives every agent a status mark that morphs pending → running → reported", () => {
    vi.useFakeTimers();
    const { container } = render(<CrewWorking language="en" />);
    // ten agents: the first phase (intent, planner) is called, the rest stand by
    expect(marks(container)).toEqual(["running", "running", ...Array(8).fill("pending")]);
    act(() => vi.advanceTimersByTime(600));
    expect(marks(container).slice(0, 7)).toEqual(["done", "done", ...Array(5).fill("running")]);
    act(() => vi.advanceTimersByTime(3000));
    // the last phase holds the watch until the answer lands
    expect(marks(container)).toEqual([...Array(9).fill("done"), "running"]);
  });

  it("keeps the marks out of the accessibility tree: the row's words carry the status", () => {
    const { container } = render(<CrewWorking language="hi" />);
    for (const m of container.querySelectorAll(".status-mark")) expect(m).toHaveAttribute("aria-hidden", "true");
  });
});

describe("the empty verdict slot listens", () => {
  it("sends sonar rings out from the dashed dial, as decoration", () => {
    const { container } = render(<SonarDial />);
    const sonar = container.querySelector("[data-sonar]")!;
    expect(sonar).toHaveAttribute("aria-hidden", "true");
    expect(sonar.querySelectorAll(".animate-ripple")).toHaveLength(4);
    expect(sonar.querySelector("svg circle[stroke-dasharray]")).not.toBeNull();
  });
});
