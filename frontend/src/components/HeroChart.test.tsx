import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../api");

function reducedMotion(on: boolean) {
  window.matchMedia = ((q: string) => ({
    matches: on && q.includes("reduce"),
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

async function openHero() {
  const api = vi.mocked(await import("../api"));
  api.ask.mockRejectedValue(new Error("not under test"));
  const { default: HeroChart } = await import("./HeroChart");
  return render(<HeroChart language="en" onAsk={() => {}} />);
}

const original = window.matchMedia;
afterEach(() => {
  window.matchMedia = original;
});

describe("the hero sheet's border beam", () => {
  it("laps the sheet's neatline in chart teal, slowly, as decoration on its own layer", async () => {
    reducedMotion(false);
    const { container } = await openHero();
    const sheet = container.querySelector("figure.hero-chart")!;
    // not during the first paint and the hero's sequence…
    expect(sheet.querySelector(".border-beam-spin")).toBeNull();
    const { BEAM_AFTER_MS } = await import("./HeroChart");
    await act(() => new Promise<void>((r) => setTimeout(r, BEAM_AFTER_MS + 50)));
    // …then on, for good
    const lap = sheet.querySelector(".border-beam-spin") as HTMLElement;
    expect(lap).not.toBeNull();
    expect(lap.style.animationDuration).toBe("10s");
    // its layer is a direct child of the sheet, hidden from assistive tech and
    // never in the pointer's way; the tabs and the chart are not inside it
    const layer = sheet.querySelector(":scope > .hero-beam") as HTMLElement;
    expect(layer).not.toBeNull();
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer.className).toContain("pointer-events-none");
    expect(layer.querySelector("[role]")).toBeNull();
  });

  it("is not drawn under reduced motion", async () => {
    reducedMotion(true);
    const { container } = await openHero();
    const { BEAM_AFTER_MS } = await import("./HeroChart");
    await act(() => new Promise<void>((r) => setTimeout(r, BEAM_AFTER_MS + 50)));
    expect(container.querySelector(".border-beam-spin")).toBeNull();
  });
});
