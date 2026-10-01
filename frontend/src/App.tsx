import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as api from "./api";
import AgentTracePanel from "./components/AgentTrace";
import AuthorityPanel from "./components/AuthorityPanel";
import ChatPanel from "./components/ChatPanel";
import ConditionsStrip from "./components/ConditionsStrip";
import FishingPanel from "./components/FishingPanel";
import {
  ChartDefs,
  CompassMark,
  PlayGlyph,
  SpeakerGlyph,
  SpeakerOffGlyph,
  StopGlyph,
  WarnGlyph,
} from "./components/glyphs";
import GuidedTour from "./components/GuidedTour";
import Landing from "./components/Landing";
import LocationPicker, { type PickedLocation } from "./components/LocationPicker";
import MarineMap from "./components/MarineMap";
import PFZList from "./components/PFZList";
import RiskCard from "./components/RiskCard";
import SystemPanel from "./components/SystemPanel";
import RiskTimeline from "./components/RiskTimeline";
import type {
  ChatMessage,
  ChatResponse,
  FishingOutlook,
  Language,
  Location,
  ZoneFeature,
} from "./types";
import { SCENARIOS, TAB_LABEL, UI, type AppTab } from "./i18n/app";
import { TOUR } from "./i18n/tour";
import { PORTS } from "./ports";
import { RISK_COLOR } from "./risk";
import { SPEECH_LOCALE } from "./speech";
import { readBootParams } from "./boot";
import { ink, risk } from "./tokens";

const SESSION = "demo";
const RADIUS_KM = 100;
const DEFAULT_PORT = PORTS[0]; // Mumbai — used only if location is unavailable

/** "landing" is the front door; every deep link (?tab, ?demo, ?tour, ?at) skips it. */
type Tab = AppTab | "landing";

/** The deep link this page was opened with — read once, before first render. */
const BOOT = readBootParams(window.location.search);
const BOOT_SCENARIO = BOOT.demo
  ? SCENARIOS.find((x) => x.id === BOOT.demo || x.n === BOOT.demo)
  : undefined;

export default function App() {
  const [tab, setTab] = useState<Tab>(
    BOOT.tab ?? (BOOT_SCENARIO ? "ask" : BOOT.at ? "home" : "landing"),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latest, setLatest] = useState<ChatResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [langChoice, setLangChoice] = useState<Language | null>(BOOT.lang);
  const [detected, setDetected] = useState<Language>("en");
  const language = langChoice ?? detected;
  const [zones, setZones] = useState<ZoneFeature[]>([]);
  const [mode, setMode] = useState<string>("DEMO");
  const [switching, setSwitching] = useState(false);
  const [speak, setSpeak] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- fisher's own position + outlook ----
  // ?at=lat,lon pins the starting position (demos, judge-tap re-creation);
  // it must win over geolocation, so GPS is skipped entirely when present.
  const [place, setPlace] = useState<PickedLocation | null>(
    BOOT.at ? { ...BOOT.at, label: "Selected point", source: "map" } : null,
  );
  const [outlook, setOutlook] = useState<FishingOutlook | null>(null);
  // Which request the outlook on screen answers. "Loading" and the focused
  // ground are derived from it, so a new position or language resets both
  // without an effect having to.
  const [settled, setSettled] = useState<{ place: PickedLocation; language: Language } | null>(null);
  const loadingOutlook =
    place != null && !(settled?.place === place && settled.language === language);
  const [focus, setFocus] = useState<{
    rank: number;
    place: PickedLocation | null;
    language: Language;
  } | null>(null);
  const focusRank = focus && focus.place === place && focus.language === language ? focus.rank : null;

  // ---- guided tour ----
  const [tourOn, setTourOn] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourPaused, setTourPaused] = useState(false);
  const tourActionDone = useRef(-1);

  // Bumped whenever the conversation is restarted (a scenario, the tour). A
  // reply that was asked for under an older number is stale and is dropped.
  const conversation = useRef(0);

  // ---------------------------------------------------- outlook on position
  useEffect(() => {
    if (!place) return;
    let alive = true;
    api
      .fishingOutlook(place.latitude, place.longitude, {
        radiusKm: RADIUS_KM,
        days: 3,
        lang: language,
      })
      .then((d) => alive && setOutlook(d))
      .catch(() => alive && setOutlook(null))
      .finally(() => alive && setSettled({ place, language }));
    return () => {
      alive = false;
    };
  }, [place, language]);

  // ------------------------------------------------------------- chat
  const send = async (text: string) => {
    const mine = conversation.current;
    const stale = () => mine !== conversation.current;
    setError(null);
    setBusy(true);
    setMessages((m) => [...m, { id: `${Date.now()}-u`, role: "user", text }]);
    try {
      const res = await api.ask({
        message: text,
        language: langChoice ?? undefined,
        sessionId: SESSION,
      });
      if (stale()) return;
      setLatest(res);
      setDetected(res.language);
      setMode(res.mode);
      setMessages((m) => [
        ...m,
        { id: `${Date.now()}-o`, role: "orca", text: res.answer, response: res },
      ]);
      if (speak) {
        try {
          const u = new SpeechSynthesisUtterance(res.answer.split(". ").slice(0, 2).join(". "));
          u.lang = SPEECH_LOCALE[res.language] ?? SPEECH_LOCALE.en;
          u.rate = 0.98;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        } catch {
          /* TTS unavailable — non-fatal */
        }
      }
    } catch (e) {
      if (stale()) return;
      setError(String(e));
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-e`,
          role: "orca",
          text: "I could not reach the ORCA backend. Is it running on port 8000?",
        },
      ]);
    } finally {
      if (!stale()) setBusy(false);
    }
  };

  const runScenario = async (ask: string) => {
    const mine = ++conversation.current;
    setTab("ask");
    await api.resetSession(SESSION).catch(() => {});
    if (mine !== conversation.current) return; // a newer run has taken over
    setMessages([]);
    setLatest(null);
    setLangChoice(null);
    await send(ask);
  };

  // ------------------------------------------------------------- tour
  useEffect(() => {
    if (!tourOn || tourPaused) return;
    const s = TOUR[tourStep];
    if (!s) return;
    let cancelled = false;
    let timer = 0;

    (async () => {
      if (tourActionDone.current !== tourStep) {
        tourActionDone.current = tourStep;
        if (s.tab) setTab(s.tab as Tab);
        if (s.ask) {
          if (s.followUp) await send(s.ask);
          else await runScenario(s.ask);
        }
      }
      if (cancelled) return;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        if (tourStep + 1 < TOUR.length) setTourStep(tourStep + 1);
        else setTourOn(false);
      }, s.dwell);
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourOn, tourStep, tourPaused]);

  const startTour = async () => {
    const mine = ++conversation.current;
    await api.resetSession(SESSION).catch(() => {});
    if (mine !== conversation.current) return;
    setBusy(false);
    setMessages([]);
    setLatest(null);
    setLangChoice(null);
    setTab("home");
    tourActionDone.current = -1;
    setTourStep(0);
    setTourPaused(false);
    setTourOn(true);
  };

  // ---------------------------------------------------------------- boot
  useEffect(() => {
    api.zones().then((z) => setZones(z.features)).catch(() => setZones([]));
    api.health().then((h) => setMode(h.data_mode)).catch(() => setMode("DEMO"));

    // The app must be useful the moment it opens: find the fisher, then load
    // safety, grounds and warnings without them touching anything.
    const fallback = () =>
      setPlace({
        latitude: DEFAULT_PORT.lat,
        longitude: DEFAULT_PORT.lon,
        label: DEFAULT_PORT.name,
        source: "default",
      });

    if (BOOT.at) {
      // position already pinned by the link — GPS is not asked
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setPlace({
            latitude: +pos.coords.latitude.toFixed(4),
            longitude: +pos.coords.longitude.toFixed(4),
            label: "Your location",
            source: "gps",
          }),
        fallback,
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 300_000 },
      );
    } else {
      fallback();
    }

    // The timers are cleared on unmount, so StrictMode's mount-unmount-mount
    // in development fires the scenario once, not twice.
    const timers: number[] = [];
    if (BOOT_SCENARIO) timers.push(window.setTimeout(() => runScenario(BOOT_SCENARIO.ask), 250));
    if (BOOT.tour) timers.push(window.setTimeout(() => startTour(), 500));
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Runs once: the deep link is read at load and never again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gotoStep = (n: number) => {
    tourActionDone.current = -1;
    setTourStep(Math.max(0, Math.min(TOUR.length - 1, n)));
  };

  const toggleMode = async () => {
    const next = mode === "LIVE" ? "DEMO" : "LIVE";
    setSwitching(true);
    try {
      const r = await api.setMode(next);
      setMode(r.data_mode);
      if (place) setPlace({ ...place }); // re-fetch the outlook under the new mode
    } catch {
      /* keep current mode */
    } finally {
      setSwitching(false);
    }
  };

  const pickLocation = useCallback((lat: number, lon: number) => {
    setPlace({ latitude: lat, longitude: lon, label: "Selected point", source: "map" });
  }, []);

  const suggestions = useMemo(() => latest?.suggestions ?? [], [latest]);
  const tabLabels = TAB_LABEL[language] ?? TAB_LABEL.en;
  const ui = UI[language] ?? UI.en;

  const homeOrigin: Location | null = place
    ? {
        name: outlook?.location.name ?? place.label,
        latitude: place.latitude,
        longitude: place.longitude,
        state: outlook?.location.state ?? null,
      }
    : null;

  if (tab === "landing") {
    return (
      <>
        <ChartDefs />
        <Landing
          mode={mode}
          language={language}
          onLanguage={setLangChoice}
          onEnter={setTab}
          onTour={startTour}
          onScenario={runScenario}
        />
      </>
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-[1580px] flex-col gap-4 p-4 lg:p-6">
      <ChartDefs />
      <div className="sea-drift" aria-hidden />
      <div className="fish-drift" aria-hidden />

      {/* ---------------- title block, drafted like a chart's cartouche ---------------- */}
      <header className="panel rule-double">
        <div className="flex flex-wrap items-stretch">
          {/* identity — clicking it returns to the front page */}
          <button
            onClick={() => setTab("landing")}
            title="Back to the front page"
            className="flex items-center gap-4 py-3.5 pl-5 pr-6 text-left"
          >
            <CompassMark size={46} className="shrink-0 text-ink-900" />
            <div>
              <h1 className="font-display text-display font-black leading-none tracking-tight text-ink-900">
                ORCA
              </h1>
              <p className="mt-1 font-mono text-micro font-semibold uppercase tracking-[0.18em] text-chart-600">
                Marine EcOsystem Reasoning · Collaborative Agents
              </p>
            </div>
          </button>

          {/* title-block cells */}
          <div className="ml-auto flex flex-wrap items-stretch">
            <div className="hidden flex-col justify-center border-l px-5 py-3 sm:flex" style={{ borderColor: "var(--rule-faint)" }}>
              <span className="label">{ui.chartNo}</span>
              <span className="mt-1 font-mono text-body font-bold text-ink-800">SIH26176</span>
            </div>

            <button
              onClick={toggleMode}
              disabled={switching}
              title="Switch between cached demo data and live public providers"
              className="group flex flex-col justify-center border-l px-5 py-3 text-left transition hover:bg-paper-150 disabled:opacity-50"
              style={{ borderColor: "var(--rule-faint)" }}
            >
              <span className="label">{ui.dataEdition}</span>
              <span
                className={`mt-1 font-mono text-body font-bold ${
                  mode === "LIVE" ? "text-risk-low" : "text-risk-high"
                }`}
              >
                {switching ? "…" : mode}
                <span className="ml-1.5 text-ink-400 transition group-hover:text-ink-700">⇄</span>
              </span>
            </button>

            <button
              onClick={() => setSpeak((v) => !v)}
              title="Speak answers aloud"
              className="flex flex-col justify-center border-l px-5 py-3 text-left transition hover:bg-paper-150"
              style={{ borderColor: "var(--rule-faint)" }}
            >
              <span className="label">{ui.voice}</span>
              <span className="mt-1 flex items-center gap-1.5 font-mono text-body font-bold text-ink-800">
                {speak ? <SpeakerGlyph /> : <SpeakerOffGlyph className="text-ink-300" />}
                {speak ? "ON" : "OFF"}
              </span>
            </button>

            <div
              className="flex flex-col justify-center border-l px-4 py-3"
              style={{ borderColor: "var(--rule-faint)" }}
            >
              <span className="label">{ui.lang}</span>
              <span className="mt-1 flex gap-1">
                {(["en", "hi", "mr"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLangChoice(l)}
                    className={`rounded-[2px] border px-1.5 py-0.5 font-mono text-label font-bold transition ${
                      language === l
                        ? "border-ink-900 bg-ink-900 text-paper-50"
                        : "text-ink-400 hover:text-ink-800"
                    }`}
                    style={language === l ? undefined : { borderColor: "var(--rule)" }}
                  >
                    {l === "en" ? "EN" : l === "hi" ? "हिं" : "मरा"}
                  </button>
                ))}
              </span>
            </div>

            <div className="flex items-center border-l px-4" style={{ borderColor: "var(--rule-faint)" }}>
              <button onClick={() => (tourOn ? setTourOn(false) : startTour())} className="btn-ink">
                {tourOn ? <StopGlyph size={11} /> : <PlayGlyph size={11} />}
                {tourOn ? ui.stopTour : ui.tour}
              </button>
            </div>
          </div>
        </div>

        {/* folio tabs */}
        <nav
          className="flex items-end gap-6 border-t px-5"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          {(["home", "ask", "authority", "system"] as AppTab[]).map((x) => (
            <button
              key={x}
              onClick={() => setTab(x)}
              className={`tab mt-2 ${tab === x ? "tab-on" : ""}`}
            >
              {tabLabels[x]}
            </button>
          ))}
          <span className="label ml-auto hidden pb-2.5 !tracking-[0.12em] !text-chart-500 md:block">
            {ui.marginalia}
          </span>
        </nav>
      </header>

      {tourOn && (
        <GuidedTour
          step={tourStep}
          language={language}
          paused={tourPaused}
          onPause={() => setTourPaused((p) => !p)}
          onNext={() => gotoStep(tourStep + 1)}
          onPrev={() => gotoStep(tourStep - 1)}
          onExit={() => setTourOn(false)}
        />
      )}

      {error && (
        <div className="panel hatch-danger flex items-center gap-3 border-signal/60 px-4 py-2.5 text-small text-risk-extreme">
          <WarnGlyph size={15} className="shrink-0" />
          <span>
            {error} — start the backend with{" "}
            <code className="font-mono font-bold">uvicorn app.main:app --port 8000</code>
          </span>
        </div>
      )}

      {/* ================= HOME : location + today's plan ================= */}
      {tab === "home" && (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.35fr_minmax(370px,1fr)]">
          <div className="space-y-4">
            <LocationPicker current={place} language={language} onPick={setPlace} />

            <MarineMap
              origin={homeOrigin}
              zones={zones}
              pfz={[]}
              areas={outlook?.areas ?? []}
              radiusKm={outlook?.radius_km ?? RADIUS_KM}
              routes={outlook?.routes ?? []}
              geofence={[]}
              language={language}
              onPickLocation={pickLocation}
              focusRank={focusRank}
            />

            {outlook && (
              <div className="panel grid grid-cols-2 sm:grid-cols-4">
                {[
                  {
                    k: ui.safety,
                    v: `${outlook.safety.score}`,
                    s: outlook.safety.category,
                    color: RISK_COLOR[outlook.safety.category],
                  },
                  {
                    k: ui.waves,
                    v: `${outlook.safety.wave_height_m ?? "—"}`,
                    s: "m",
                  },
                  {
                    k: ui.wind,
                    v: `${Math.round(outlook.safety.wind_speed_kmh ?? 0)}`,
                    s: "km/h",
                  },
                  {
                    k: ui.areas,
                    v: `${outlook.areas.length}`,
                    s: ui.inRadius.replace("{km}", String(outlook.radius_km)),
                  },
                ].map((x, i) => (
                  <div
                    key={x.k}
                    className={`group px-4 py-3 transition-colors hover:bg-chart-100/40 ${i > 0 ? "border-l" : ""}`}
                    style={{ borderColor: "var(--rule-faint)" }}
                  >
                    <div className="label truncate">{x.k}</div>
                    <div
                      className={`mt-1 font-mono text-figure font-bold tabular-nums leading-none text-ink-900 ${
                        x.color ? "" : "transition-colors group-hover:text-chart-600"
                      }`}
                      style={x.color ? { color: x.color } : undefined}
                    >
                      {x.v}
                      <span className={`ml-1.5 text-label font-semibold ${x.color ? "" : "opacity-70"}`}>
                        {x.s}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 lg:h-[calc(100vh-235px)] lg:overflow-y-auto lg:pr-1">
            {loadingOutlook && !outlook && (
              <div className="panel p-6 text-center text-prose leading-5 italic text-ink-400">
                {ui.readingSea}
              </div>
            )}
            {outlook && (
              <FishingPanel
                data={outlook}
                language={language}
                onSelectArea={(rank) => setFocus({ rank, place, language })}
              />
            )}
          </div>
        </div>
      )}

      {/* ================= ASK : the conversational view ================= */}
      {tab === "ask" && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label mr-1">{ui.scenarios}</span>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => runScenario(s.ask)}
                disabled={busy}
                title={s.ask}
                className="chip disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="grid w-[18px] shrink-0 place-items-center rounded-full bg-ink-900 font-display text-label font-bold leading-none text-paper-50" style={{ height: 18 }}>
                  {s.n}
                </span>
                <span className="font-semibold">{s.label[language] ?? s.label.en}</span>
                <span className="font-mono text-label uppercase tracking-wide opacity-75">{s.hint}</span>
              </button>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(350px,1fr)_1.6fr]">
            <div className="min-h-[540px] lg:h-[calc(100vh-280px)]">
              <ChatPanel
                messages={messages}
                busy={busy}
                language={language}
                suggestions={suggestions}
                onSend={send}
                onLanguage={setLangChoice}
              />
            </div>

            <div className="space-y-4 lg:h-[calc(100vh-280px)] lg:overflow-y-auto lg:pr-1">
              {latest && <ConditionsStrip res={latest} language={latest.language} />}

              <MarineMap
                origin={latest?.intent.location ?? null}
                zones={zones}
                pfz={latest?.pfz ?? []}
                routes={latest?.routes ?? []}
                geofence={latest?.geofence ?? []}
                alerts={latest?.alerts ?? []}
                language={language}
              />

              {latest?.risk && (
                <RiskCard
                  risk={latest.risk}
                  evidence={latest.evidence}
                  language={latest.language}
                />
              )}

              {latest && (
                <RiskTimeline location={latest.intent.location} language={latest.language} />
              )}

              {latest && latest.alerts.length > 0 && (
                <div className="panel hatch-danger overflow-hidden border-risk-extreme/60">
                  <div className="hd border-risk-extreme/25">
                    <span className="label flex items-center gap-2 !text-risk-extreme">
                      <WarnGlyph size={13} /> {ui.warnings}
                    </span>
                  </div>
                  <div className="px-4 py-3.5">
                    {latest.alerts.map((a, i) => (
                      <div key={i} className="mb-3 last:mb-0">
                        <div className="font-display text-lead font-bold leading-snug text-risk-extreme">
                          {a.headline}
                        </div>
                        <div className="mt-1 text-small leading-relaxed text-ink-700">
                          {a.detail}
                        </div>
                        <div className="mt-1 font-mono text-label uppercase tracking-wide text-ink-400">
                          {a.source} · {a.severity}
                          {a.valid_till ? ` · ${ui.validTill} ${a.valid_till}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {latest && <PFZList zones={latest.pfz} language={latest.language} />}

              {latest && latest.routes.length > 0 && (
                <div className="panel overflow-hidden">
                  <div className="hd">
                    <span className="label">{ui.courses}</span>
                  </div>
                  <div className="space-y-2 px-4 py-3.5">
                    {latest.routes.map((r) => (
                      <div
                        key={r.name}
                        className={`rounded-[2px] border px-3.5 py-3 ${
                          r.recommended ? "border-risk-low/70 bg-risk-low/[0.06]" : "bg-paper-100"
                        }`}
                        style={r.recommended ? undefined : { borderColor: "var(--rule)" }}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="flex items-center gap-2.5 font-display text-prose font-bold text-ink-900">
                            {/* course symbology, drawn as plotted */}
                            <svg width="26" height="8" aria-hidden>
                              <line
                                x1="1"
                                y1="4"
                                x2="25"
                                y2="4"
                                stroke={r.recommended ? risk.low : ink[400]}
                                strokeWidth="2"
                                strokeDasharray={r.recommended ? "7 4" : "2 4"}
                              />
                            </svg>
                            {r.name}
                            {r.recommended && (
                              <span className="stamp !px-1.5 !py-0.5 !text-micro text-risk-low">
                                {ui.recommended}
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 font-mono text-readout tabular-nums text-ink-500">
                            {r.distance_km} km · {Math.round(r.eta_minutes)} min
                          </span>
                        </div>
                        <div className="mt-1 pl-[36px] text-readout leading-relaxed text-ink-500">
                          {r.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {latest && (
                <AgentTracePanel trace={latest.trace} elapsed={latest.elapsed_ms} language={latest.language} />
              )}

              {latest && (
                <p className="px-1 pb-2 font-mono text-label leading-relaxed text-ink-400">
                  {latest.disclaimer}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "authority" && <AuthorityPanel language={language} />}

      {tab === "system" && <SystemPanel mode={mode} language={language} />}
    </div>
  );
}
