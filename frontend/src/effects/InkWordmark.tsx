import { lazy, type CSSProperties } from "react";
import type { Language } from "../types";
import { L10N } from "../i18n/landing";
import { EffectSlot } from "./EffectSlot";
import { WORD } from "./inkRamp";
import "./ink.css";

// Its own chunk (the shader library and the live canvas), fetched only when
// the slot mounts it: effects/gate.ts decides whether this browser gets more
// than the poster.
const InkLive = lazy(() => import("./InkLive"));

/**
 * The poster — all that most visitors ever get, and the whole design: the
 * wordmark printed flat in the heading ink. Plain SVG text (real, selectable,
 * read by screen readers), set with the same measured geometry the live
 * canvas draws with (inkRamp.ts), so the wet ink lands exactly on it.
 */
function InkPoster() {
  return (
    <svg
      className="ink-poster"
      viewBox={`0 0 ${WORD.w} ${WORD.h}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x={WORD.x}
        y={WORD.baseline}
        fontSize={WORD.size}
        className="font-display font-black fill-ink-900"
      >
        {WORD.text}
      </text>
    </svg>
  );
}

/** The reserved box: the poster and the live canvas share it, so the swap moves nothing. */
const BOX: CSSProperties = { aspectRatio: `${WORD.w} / ${WORD.h}` };

/**
 * The wordmark itself, poster-first, at whatever size its container gives it
 * (`.ink-word` in the cartouche, `.ink-word-mast` in the landing's masthead).
 * One component so the foot and the masthead can never drift apart.
 */
export function InkMark({ className = "ink-word" }: { className?: string }) {
  return (
    <div translate="no">
      <EffectSlot
        name="ink"
        Effect={InkLive}
        className={className}
        style={BOX}
        effectClassName="ink-live"
        // The shader's start-up is two long tasks; above the fold they
        // would land in the load window. The printed mark is the design
        // until the visitor first moves, scrolls, touches or types.
        armOn="interaction"
        poster={<InkPoster />}
      />
    </div>
  );
}

/**
 * Effect 1 — the closing cartouche: the title block of the chart folio,
 * at the foot of the landing. The ORCA wordmark set large, the sea-surface
 * rule beneath it, and the name written out in the fisher's language. On a
 * wide window with a mouse, `?fx=ink` lifts the mark into live wet ink
 * (InkLive.tsx); everyone else keeps this finished block.
 */
export default function InkCartouche({ language }: { language: Language }) {
  const t = L10N[language] ?? L10N.en;
  return (
    <section className="ink-cartouche mt-16 text-center" aria-label={WORD.text}>
      {/* the mark is the mark in every language */}
      <InkMark />
      <div className="wave-rule mx-auto mt-5 max-w-[300px]" aria-hidden />
      <p className="label mt-4">{t.folioTagline}</p>
    </section>
  );
}
