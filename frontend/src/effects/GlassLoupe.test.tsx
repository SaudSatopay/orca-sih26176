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

  it("opens no canvas and no html2canvas frame", () => {
    render(
      <GlassLoupe id="open">
        <button>Open ORCA</button>
      </GlassLoupe>,
    );
    expect(document.querySelector("canvas")).toBeNull();
    expect(document.querySelector("iframe")).toBeNull();
  });
});

describe("what made the first trial fail stays out", () => {
  const sources = import.meta.glob<string>(
    ["./glass*.{ts,tsx}", "./GlassLoupe.tsx", "../vendor/liquid-glass/index.js", "../vendor/liquid-glass/index.d.ts"],
    { eager: true, query: "?raw", import: "default" },
  );

  it("reads the glass sources", () => {
    expect(Object.keys(sources).length).toBeGreaterThanOrEqual(6);
  });

  it("html2canvas is gone and does not come back", () => {
    // The headers may name it only to say it is banned; importing it is the offence.
    const imports = /from ['"]html2canvas['"]|import\(['"]html2canvas|require\(['"]html2canvas/;
    for (const [file, text] of Object.entries(sources)) {
      expect(imports.test(text), `${file} imports html2canvas`).toBe(false);
    }
  });

  it("the vendored module writes nothing to the console", () => {
    const vendor = Object.entries(sources).find(([f]) => f.endsWith("liquid-glass/index.js"));
    expect(vendor).toBeDefined();
    expect(vendor![1]).not.toMatch(/console\./);
  });

  it("a lens draws once: the module can lose its context and copy a still", () => {
    const vendor = Object.entries(sources).find(([f]) => f.endsWith("liquid-glass/index.js"))![1];
    expect(vendor).toMatch(/WEBGL_lose_context/);
    expect(vendor).toMatch(/copyStill/);
    // No animation loop: a still is rendered on demand only.
    expect(vendor).not.toMatch(/requestAnimationFrame/);
    expect(vendor).not.toMatch(/addEventListener\(\s*['"]scroll/);
  });
});
