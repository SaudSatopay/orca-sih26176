import { useEffect, useRef, useState } from "react";

export interface TourStep {
  title: string;
  say: string;
  /** Question to run through the full agent pipeline for this step. */
  ask?: string;
  /** Switch view before narrating. */
  tab?: "fisher" | "authority";
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
    dwell: 7000,
    feature: "Overview",
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
    tab: "authority",
    dwell: 10000,
    feature: "Authority dashboard",
  },
  {
    title: "Built to be trusted",
    say: "Every value carries its source, timestamp and confidence. Simulated data is always labelled. ORCA is decision support — it never replaces an official advisory.",
    tab: "fisher",
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
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-ocean-300/25 bg-ocean-950/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {/* progress */}
        <div className="h-1 overflow-hidden rounded-t-2xl bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-ocean-500 to-teal-500 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-start gap-4 px-5 py-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ocean-700 to-teal-700 font-mono text-sm font-bold text-white">
            {step + 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-white">{s.title}</h3>
              {s.feature && (
                <span className="rounded-full bg-ocean-700/50 px-2.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-ocean-100">
                  {s.feature}
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] text-ocean-300/70">
                {step + 1} / {TOUR.length}
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ocean-100/90">{s.say}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onPrev}
              disabled={step === 0}
              title="Previous"
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-ocean-200 transition hover:bg-white/10 disabled:opacity-30"
            >
              ‹
            </button>
            <button
              onClick={onPause}
              title={paused ? "Resume" : "Pause"}
              className="grid h-9 w-9 place-items-center rounded-lg bg-ocean-700 text-white transition hover:bg-ocean-600"
            >
              {paused ? "▶" : "❚❚"}
            </button>
            <button
              onClick={onNext}
              title="Next"
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-ocean-200 transition hover:bg-white/10"
            >
              ›
            </button>
            <button
              onClick={onExit}
              title="Exit tour"
              className="ml-1 grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-ocean-300 transition hover:bg-red-500/25 hover:text-red-200"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
