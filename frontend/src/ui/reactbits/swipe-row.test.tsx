import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SwipeRow } from "./swipe-row";

function row() {
  const tap = vi.fn();
  const map = vi.fn();
  const hear = vi.fn();
  render(
    <SwipeRow
      label="Area 1"
      toggleLabel="More for area 1"
      openedLabel="2 actions shown"
      actions={[
        { id: "map", label: "Show on map", onSelect: map },
        { id: "hear", label: "Hear it", onSelect: hear },
      ]}
    >
      <button type="button" onClick={tap}>
        31 km
      </button>
    </SwipeRow>,
  );
  return { tap, map, hear };
}

describe("SwipeRow", () => {
  it("keeps the row's own button: a tap still lands", () => {
    const { tap } = row();
    const btn = screen.getByRole("button", { name: "31 km" });
    fireEvent.pointerDown(btn, { button: 0, pointerId: 1, clientX: 200, clientY: 20 });
    fireEvent.pointerUp(window, { pointerId: 1, clientX: 200, clientY: 20 });
    fireEvent.click(btn);
    expect(tap).toHaveBeenCalledTimes(1);
  });

  it("names the row and hides the closed drawer from the keyboard", () => {
    row();
    expect(screen.getByRole("group", { name: "Area 1" })).toBeInTheDocument();
    // a closed drawer is inert and hidden from assistive tech
    expect(screen.queryByRole("button", { name: "Show on map" })).not.toBeInTheDocument();
    const rail = document.getElementById(
      screen.getByRole("button", { name: "More for area 1" }).getAttribute("aria-controls")!,
    )!;
    expect(rail).toHaveAttribute("inert");
  });

  it("opens from the keyboard and runs an action", () => {
    const { map, hear, tap } = row();
    const toggle = screen.getByRole("button", { name: "More for area 1" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(toggle, { key: "ArrowLeft" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("2 actions shown")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hear it" }));
    expect(hear).toHaveBeenCalledTimes(1);
    expect(map).not.toHaveBeenCalled();
    expect(tap).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes with Escape", () => {
    row();
    const toggle = screen.getByRole("button", { name: "More for area 1" });
    fireEvent.keyDown(toggle, { key: "ArrowLeft" });
    fireEvent.keyDown(toggle, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
