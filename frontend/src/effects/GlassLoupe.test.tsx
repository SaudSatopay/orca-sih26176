import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import GlassLoupe from "./GlassLoupe";

function Tabs({ onPick }: { onPick: (id: string) => void }) {
  const [on, setOn] = useState("a");
  return (
    <div role="tablist" aria-label="Questions">
      {["a", "b"].map((id) => (
        <button
          key={id}
          role="tab"
          aria-selected={on === id}
          tabIndex={on === id ? 0 : -1}
          onClick={() => {
            setOn(id);
            onPick(id);
          }}
        >
          {id}
        </button>
      ))}
    </div>
  );
}

describe("the chart loupe, with the effect off", () => {
  // jsdom has no matchMedia and no WebGL: this is every visitor the gate turns away.

  it("renders its children untouched: same markup, nothing added", () => {
    const bare = render(<Tabs onPick={() => {}} />);
    const expected = bare.container.innerHTML;
    bare.unmount();

    const wrapped = render(
      <GlassLoupe id="tabs">
        <Tabs onPick={() => {}} />
      </GlassLoupe>,
    );
    expect(wrapped.container.innerHTML).toBe(expected);
    expect(wrapped.container.querySelector(".orca-loupe")).toBeNull();
    expect(wrapped.container.querySelector("canvas")).toBeNull();
  });

  it("keeps the control a real control: roles, roving tabindex and clicks", () => {
    const onPick = vi.fn();
    render(
      <GlassLoupe id="tabs">
        <Tabs onPick={onPick} />
      </GlassLoupe>,
    );
    const tabs = screen.getAllByRole("tab");
    expect(screen.getByRole("tablist", { name: "Questions" })).toBeInTheDocument();
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1]);
    const second = tabs[1];
    fireEvent.click(second);
    expect(onPick).toHaveBeenCalledWith("b");
    // the same element, not a remounted copy
    expect(screen.getAllByRole("tab")[1]).toBe(second);
    expect(second).toHaveAttribute("aria-selected", "true");
  });

  it("keeps a button a button", () => {
    const onEnter = vi.fn();
    render(
      <GlassLoupe id="open">
        <button onClick={onEnter}>Open ORCA</button>
      </GlassLoupe>,
    );
    const button = screen.getByRole("button", { name: "Open ORCA" });
    expect(button.tagName).toBe("BUTTON");
    expect(button.parentElement?.querySelector("[aria-hidden]")).toBeNull();
    fireEvent.click(button);
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("does not fetch the lens or html2canvas", () => {
    render(
      <GlassLoupe id="open">
        <button>Open ORCA</button>
      </GlassLoupe>,
    );
    expect(window.__orcaFx?.effects.glass).toBe("poster");
    expect(document.querySelector("iframe")).toBeNull();
  });
});
