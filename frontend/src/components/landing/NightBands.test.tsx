import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CallBand, HalftoneSea, NightWatchBand, ThreadsBand, WarningBand } from "./NightBands";
import { BANDS } from "../../i18n/bands";
import { LABEL } from "../../i18n/agentTrace";
import { VERDICT } from "../../i18n/riskCard";
import { L10N } from "../../i18n/landing";
import { CREW } from "../../crew";
import { BAND_EFFECTS, CONTEXTS, type EffectName } from "../../effects/gate";
import type { Language } from "../../types";

/**
 * The night bands with every effect off: jsdom has no matchMedia and no
 * WebGL, which is every visitor the gate turns away. Each band must already
 * be the finished design — real headings, real copy, the poster art — and
 * mount no canvas.
 */

const LANGS: Language[] = ["en", "hi", "mr"];

function bands(language: Language) {
  return (
    <>
      <NightWatchBand language={language} />
      <HalftoneSea language={language} />
      <WarningBand language={language} />
      <ThreadsBand language={language} />
      <CallBand language={language} onEnter={() => {}} onTour={() => {}} />
    </>
  );
}

describe("the night bands, with the effects off", () => {
  it.each(LANGS)("name every band by its heading, in %s", (lang) => {
    render(bands(lang));
    const t = BANDS[lang];
    for (const title of [t.watch.title, t.halftone.title, t.warning.title, t.threads.title, t.call.title]) {
      const heading = screen.getByRole("heading", { level: 2, name: title });
      expect(screen.getByRole("region", { name: title })).toContainElement(heading);
    }
  });

  it("print the copy in the reader's language", () => {
    render(bands("mr"));
    const t = BANDS.mr;
    expect(screen.getByText(t.watch.body)).toBeInTheDocument();
    expect(screen.getByText(t.halftone.body)).toBeInTheDocument();
    expect(screen.getByText(t.warning.body)).toBeInTheDocument();
    expect(screen.getByText(t.threads.body)).toBeInTheDocument();
    for (const s of t.halftone.sources) expect(screen.getByText(s)).toBeInTheDocument();
  });

  it("mount no canvas: the posters are the design", () => {
    const { container } = render(bands("en"));
    expect(container.querySelector("canvas")).toBeNull();
    const slots = [...container.querySelectorAll<HTMLElement>("[data-effect]")];
    expect(slots.map((s) => s.dataset.effect).sort()).toEqual([...BAND_EFFECTS].sort());
    for (const s of slots) expect(s).toHaveAttribute("data-live", "0");
    // every slot but the trail (which has nothing to show at rest) carries art
    for (const s of slots.filter((s) => s.dataset.effect !== "glowcursor"))
      expect(s.childElementCount, s.dataset.effect).toBeGreaterThan(0);
  });

  it("hold at most two WebGL contexts per band", () => {
    const { container } = render(bands("en"));
    const sections = [...container.querySelectorAll<HTMLElement>("section[data-band]")];
    expect(sections.map((s) => s.dataset.band)).toEqual(["watch", "halftone", "warning", "threads", "call"]);
    for (const s of sections) {
      const names = [...s.querySelectorAll<HTMLElement>("[data-effect]")].map((e) => e.dataset.effect as EffectName);
      const contexts = names.reduce((n, name) => n + CONTEXTS[name], 0);
      expect(contexts, s.dataset.band).toBeLessThanOrEqual(2);
    }
  });

  it("are ink bands, except the halftone sea, which is paper", () => {
    const { container } = render(bands("en"));
    const tone = (band: string) => container.querySelector(`[data-band="${band}"]`)?.className ?? "";
    for (const band of ["watch", "warning", "threads", "call"]) expect(tone(band)).toContain("night-band--ink");
    expect(tone("halftone")).toContain("night-band--paper");
  });

  it("keep the decorative word and art away from assistive tech", () => {
    const { container } = render(<NightWatchBand language="en" />);
    const word = screen.getByText("ORCA");
    expect(word.closest("svg")).toHaveAttribute("aria-hidden");
    expect(word.closest("[translate]")).toHaveAttribute("translate", "no");
    for (const svg of container.querySelectorAll("svg")) expect(svg.closest("[aria-hidden]")).not.toBeNull();
  });
});

describe("the warning band", () => {
  it.each(LANGS)("says the official warning forces the product's own do-not-go verdict (%s)", (lang) => {
    render(<WarningBand language={lang} />);
    const region = screen.getByRole("region", { name: BANDS[lang].warning.title });
    expect(within(region).getByText(VERDICT[lang].HIGH)).toBeInTheDocument();
    expect(within(region).getByText(BANDS[lang].warning.authorities)).toBeInTheDocument();
    expect(within(region).getByText(BANDS[lang].warning.rule)).toBeInTheDocument();
  });
});

describe("the crew band", () => {
  it.each(LANGS)("names all ten agents, in order, in %s", (lang) => {
    render(<ThreadsBand language={lang} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(CREW.length);
    items.forEach((li, i) => expect(li).toHaveTextContent(LABEL[lang][CREW[i]]));
  });

  it("draws one poster thread per agent", () => {
    const { container } = render(<ThreadsBand language="en" />);
    expect(container.querySelectorAll('[data-effect="webthreads"] path')).toHaveLength(CREW.length);
  });
});

describe("the call strip", () => {
  it("opens the console and starts the tour, with the landing's own words", () => {
    const onEnter = vi.fn();
    const onTour = vi.fn();
    render(<CallBand language="hi" onEnter={onEnter} onTour={onTour} />);
    const open = screen.getByRole("link", { name: L10N.hi.openOrca });
    expect(open).toHaveAttribute("href", "?tab=home&lang=hi");
    fireEvent.click(open);
    expect(onEnter).toHaveBeenCalledWith("home");
    fireEvent.click(screen.getByRole("button", { name: new RegExp(L10N.hi.ctaTour) }));
    expect(onTour).toHaveBeenCalledTimes(1);
  });

  it("leaves a modified click to the browser (new tab, new window)", () => {
    const onEnter = vi.fn();
    // jsdom cannot open a tab; stop the browser default after the band has had its say
    const hold = (e: Event) => e.preventDefault();
    document.addEventListener("click", hold);
    render(<CallBand language="en" onEnter={onEnter} onTour={() => {}} />);
    fireEvent.click(screen.getByRole("link", { name: L10N.en.openOrca }), { ctrlKey: true });
    document.removeEventListener("click", hold);
    expect(onEnter).not.toHaveBeenCalled();
  });
});
