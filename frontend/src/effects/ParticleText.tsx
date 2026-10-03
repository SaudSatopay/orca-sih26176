/**
 * Particle Text — https://reactbits.dev/text-animations/particle-text
 * MIT + Commons Clause, Copyright (c) 2026 David Haz — see src/ui/LICENSES.md
 *
 * Adapted for ORCA: the Night watch band's wordmark. "ORCA" in Fraunces
 * Black gathers out of drifting paper-and-teal motes the first time the
 * band is seen and scatters from the pointer. The component itself is
 * vendored at src/ui/reactbits/particle-text.tsx; this module is the slot's
 * lazy chunk and maps the slot's contract (active, onReady) onto it. A 2D
 * canvas: it holds no WebGL context.
 */
import type { EffectProps } from "./EffectSlot";
import ParticleTextCanvas from "../ui/reactbits/particle-text";
import { chart, paper } from "../tokens";

const MOTES = {
  word: "ORCA",
  color: paper[50],
  highlightColor: chart[300],
  /** About one mote in four glows teal, like plankton among the paper. */
  highlightShare: 0.28,
  /** Set by the box: the word fills about four fifths of the band's word slot. */
  fontScale: 0.8,
  fontWeight: 900,
  fontFamily: '"Fraunces Variable", Georgia, serif',
  particleSize: 1.6,
  density: 3,
  scatter: 160,
  gatherDuration: 1500,
  stagger: 380,
  pointerRepel: 34,
  repelRadius: 110,
  idleDrift: 0.6,
} as const;

const sizeFor = (_w: number, h: number) => h * MOTES.fontScale;

export default function ParticleText({ active, onReady }: EffectProps) {
  return (
    <ParticleTextCanvas
      text={MOTES.word}
      color={MOTES.color}
      highlightColor={MOTES.highlightColor}
      highlightShare={MOTES.highlightShare}
      fontSize={sizeFor}
      fontWeight={MOTES.fontWeight}
      fontFamily={MOTES.fontFamily}
      particleSize={MOTES.particleSize}
      density={MOTES.density}
      scatter={MOTES.scatter}
      gatherDuration={MOTES.gatherDuration}
      stagger={MOTES.stagger}
      pointerRepel={MOTES.pointerRepel}
      repelRadius={MOTES.repelRadius}
      idleDrift={MOTES.idleDrift}
      active={active}
      onReady={onReady}
    />
  );
}
