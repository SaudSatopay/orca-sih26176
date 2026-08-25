import { useEffect, useRef, useState } from "react";
import { PauseGlyph, PlayGlyph } from "./glyphs";

export interface TourStep {
  title: string;
  say: string;
  /** Question to run through the full agent pipeline for this step. */
  ask?: string;
  /** Switch view before narrating. */
  tab?: "home" | "ask" | "authority";
  /** How long to dwell after the action, in ms. */
  dwell: number;
  /** Highlighted feature name shown as a chip. */
  feature?: string;
  /** Continue the existing conversation instead of starting a fresh one. */
  followUp?: boolean;
}

/**
 * The scripted walkthrough. Runs unattended — this is both the "explain the
 * product in 3 minutes" tour and the fallback if a live demo goes wrong.
 */
export const TOUR: TourStep[] = [
  {
    title: "What ORCA is",
    say: "ORCA is not a chatbot. It is a crew of ten AI agents that read India's marine data together and return one safe, explainable decision for a fisher.",
    tab: "home",
    dwell: 7000,
    feature: "Overview",
  },
  {
    title: "It opens knowing where you are",
    say: "The moment the app opens it finds the fisher's position and reads the sea around it — no typing, no settings. He sees his answer before he asks a question.",
    tab: "home",
    dwell: 9000,
    feature: "Auto location",
  },
  {
    title: "Plain words, not weather jargon",
    say: "Everything is written the way a fisherman speaks: do not enter the red area between 2 PM and 6 PM, areas 1, 2 and 3 are your best chances, stay about three hours.",
    tab: "home",
    dwell: 10000,
    feature: "Plain language",
  },
  {
    title: "Where the fish are, within 100 km",
    say: "ORCA scores every ground within 100 kilometres for the chance of fish, and ranks them by what the trip is actually worth — a slightly better ground twice as far is usually the wrong advice.",
    tab: "home",
    dwell: 10000,
    feature: "Fishing probability",
  },
  {
    title: "How long to stay, and the next two days",
    say: "It recommends how many hours to work the ground and how long the whole trip takes, then shows whether tomorrow or the day after will be better.",
    tab: "home",
    dwell: 9000,
    feature: "Trip plan · 3-day outlook",
  },
  {
    title: "Ask in your own language",
    say: "A fisherman near Mumbai asks in Marathi whether he can go out at 6 AM tomorrow. ORCA detects the language itself — no setting to change.",
    ask: "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?",
    dwell: 9000,
    feature: "Multilingual · voice",
  },
  {
    title: "A decision, with reasons",
    say: "74 out of 100 — HIGH RISK. Every point is attributed: an active IMD fishermen warning, 2.4 metre waves, 34 km/h winds. Nothing is a black box.",
    dwell: 9000,
    feature: "Explainable risk",
  },
  {
    title: "It knows when to go instead",
    say: "The 24-hour timeline shows the safe window. ORCA does not just say no — it says conditions improve after 11:00, come back then.",
    dwell: 8000,
    feature: "Risk timeline",
  },
  {
    title: "It remembers the conversation",
    say: "He asks a follow-up: what about 12 PM? ORCA keeps the place and the day, re-checks only what changed, and the risk drops to MODERATE.",
    ask: "दुपारी १२ वाजता काय?",
    followUp: true, // must NOT reset the session — that is the whole point
    dwell: 9000,
    feature: "Context memory",
  },
  {
    title: "Official warnings always win",
    say: "Near Paradip a severe cyclone warning is in force. A deterministic rule forces EXTREME — no model and no language output can talk ORCA down from an official warning.",
    ask: "Is there a cyclone near Paradip? Can I go fishing?",
    dwell: 10000,
    feature: "Safety override",
  },
  {
    title: "Where the fish are likely to be",
    say: "Asked in Hindi near Kochi, ORCA ranks potential fishing zones from sea-surface-temperature fronts and chlorophyll — the same reasoning INCOIS uses. It never claims to see fish.",
    ask: "कोच्चि के पास मछली पकड़ने का क्षेत्र कहाँ है?",
    dwell: 10000,
    feature: "PFZ intelligence",
  },
  {
    title: "The safest route is not the shortest",
    say: "The direct track to the fishing ground cuts through a port channel and a naval exercise area. ORCA plans around them — five kilometres longer, and legal.",
    ask: "Give me the safest route to the nearest fishing zone near Mumbai",
    dwell: 11000,
    feature: "Route + geofencing",
  },
  {
    title: "Drag the boat anywhere",
    say: "The vessel marker is draggable. Drop it near a restricted area and ORCA geofences that exact position live — this is what warns a fisher before he crosses a maritime boundary.",
    dwell: 9000,
    feature: "Live geofence",
  },
  {
    title: "Ten agents, working in parallel",
    say: "The agent panel shows what actually ran: weather, ocean, fishing zones, alerts and GIS all fan out concurrently, then the risk engine waits for every one of them.",
    dwell: 9000,
    feature: "Agent crew",
  },
  {
    title: "It scales past one fisherman",
    say: "The authority view scores every landing centre on the coast with the same engine — the district administration sees the same evidence the fisher sees.",
    tab: "authority" as const,
    dwell: 10000,
    feature: "Authority dashboard",
  },
  {
    title: "Built to be trusted",
    say: "Every value carries its source, timestamp and confidence. Simulated data is always labelled. ORCA is decision support — it never replaces an official advisory.",
    tab: "home",
    dwell: 8000,
    feature: "Provenance",
  },
];

export default function GuidedTour({
  step,
  paused,
  onPause,
  onNext,
  onPrev,
  onExit,
}: {
  step: number;
  paused: boolean;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}) {
  const s = TOUR[step];
  const [progress, setProgress] = useState(0);
  const startedAt = useRef<number>(Date.now());

  // Progress bar driven by wall-clock, not rAF, so it still advances when the
  // window is not compositing.
  useEffect(() => {
    startedAt.current = Date.now();
    setProgress(0);
    if (paused) return;
    const id = window.setInterval(() => {
      setProgress(Math.min(1, (Date.now() - startedAt.current) / s.dwell));
    }, 100);
    return () => window.clearInterval(id);
  }, [step, paused, s.dwell]);

  if (!s) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] flex justify-center p-4">
      <div
        className="panel rule-double pointer-events-auto w-full max-w-3xl shadow-2xl"
        style={{ background: "var(--paper-bright)" }}
      >
        {/* progress */}
        <div className="h-[3px] bg-ink-900/10">
          <div
            className="h-full bg-ink-900 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-start gap-4 px-5 py-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[2px] bg-ink-900 font-display text-[16px] font-black text-paper-50">
            {step + 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-[16px] font-bold text-ink-900">{s.title}</h3>
              {s.feature && (
                <span className="border border-chart-500/50 bg-chart-100/50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-chart-700">
                  {s.feature}
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] tabular-nums text-ink-400">
                {step + 1} / {TOUR.length}
              </span>
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-700">{s.say}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onPrev}
              disabled={step === 0}
              title="Previous"
              className="btn-square !h-8 !w-8 disabled:opacity-30"
            >
              ‹
            </button>
            <button
              onClick={onPause}
              title={paused ? "Resume" : "Pause"}
              className="grid h-9 w-9 place-items-center rounded-[2px] bg-ink-900 text-paper-50 transition hover:bg-ink-700"
            >
              {paused ? <PlayGlyph size={12} /> : <PauseGlyph size={12} />}
            </button>
            <button onClick={onNext} title="Next" className="btn-square !h-8 !w-8">
              ›
            </button>
            <button
              onClick={onExit}
              title="Exit tour"
              className="btn-square !h-8 !w-8 hover:!border-risk-extreme hover:!bg-risk-extreme"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
