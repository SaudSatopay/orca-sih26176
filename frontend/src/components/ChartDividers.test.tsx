/// <reference types="vite/client" />
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContourDivider, WaveDivider } from "./ChartDividers";
import source from "./ChartDividers.tsx?raw";

describe("WaveDivider", () => {
  it("is decoration: hidden from assistive tech, nothing focusable, no text", () => {
    const { container } = render(<WaveDivider />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.querySelector("a, button, [tabindex]")).toBeNull();
    expect(root.textContent).toBe("");
  });

  it("layers three to five wave bands as thin washes that span any width", () => {
    const { container } = render(<WaveDivider />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("preserveAspectRatio", "none");
    expect(svg).toHaveClass("w-full");
    const bands = [...container.querySelectorAll("path[data-band]")];
    expect(bands.length).toBeGreaterThanOrEqual(3);
    expect(bands.length).toBeLessThanOrEqual(5);
    // every band runs edge to edge and closes along the foot
    const [, top, width, height] = svg.getAttribute("viewBox")!.split(" ").map(Number);
    bands.forEach((b) => {
      const d = b.getAttribute("d")!;
      expect(d.startsWith("M0 ")).toBe(true);
      expect(d).toContain(`L${width} `);
      expect(d.endsWith(`V${top + height}H0Z`)).toBe(true);
    });
    // back to front, each band is a little stronger than the one behind it
    const strengths = bands.map((p) => Number(p.getAttribute("fill-opacity")));
    expect(strengths).toEqual([...strengths].sort((a, b) => a - b));
    expect(Math.max(...strengths)).toBeLessThanOrEqual(0.2);
  });

  it("takes its colour from the accent token and passes className through", () => {
    const { container } = render(<WaveDivider className="mt-12" />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass("mt-12", "text-chart-500");
    container
      .querySelectorAll("path")
      .forEach((p) => expect(p).toHaveAttribute("fill", "currentColor"));
  });

  it("needs no ids, so two dividers on one page cannot collide", () => {
    const { container } = render(
      <>
        <WaveDivider />
        <WaveDivider />
      </>,
    );
    expect(container.querySelectorAll("[id]").length).toBe(0);
  });
});

describe("ContourDivider", () => {
  it("is decoration: hidden from assistive tech, nothing focusable", () => {
    const { container } = render(<ContourDivider className="my-10" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("my-10", "text-chart-500");
    expect(root.querySelector("a, button, [tabindex]")).toBeNull();
  });

  it("draws nested contours that keep a hairline at any width", () => {
    const { container } = render(<ContourDivider />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("preserveAspectRatio", "none");
    const lines = svg.querySelectorAll("path");
    expect(lines.length).toBeGreaterThanOrEqual(5);
    lines.forEach((l) => {
      expect(l).toHaveAttribute("vector-effect", "non-scaling-stroke");
      expect(l).toHaveAttribute("stroke", "currentColor");
      expect(l).toHaveAttribute("fill", "none");
    });
  });

  it("carries one or two italic soundings, set as numerals outside the stretched drawing", () => {
    const { container } = render(<ContourDivider />);
    const soundings = container.querySelectorAll(".sounding");
    expect(soundings.length).toBeGreaterThanOrEqual(1);
    expect(soundings.length).toBeLessThanOrEqual(2);
    soundings.forEach((s) => {
      expect(s.textContent).toMatch(/^\d{1,2}$/);
      expect(s.closest("svg")).toBeNull();
    });
  });
});

describe("ChartDividers source", () => {
  it("is static and spells no colour: the page already has a moving sea", () => {
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(source).not.toMatch(/rgba?\(|hsla?\(/);
    expect(source).not.toMatch(/animat|transition|<animate|keyframes/i);
  });
});
