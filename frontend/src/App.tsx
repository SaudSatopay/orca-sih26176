import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as api from "./api";
import AgentTracePanel from "./components/AgentTrace";
import AuthorityPanel from "./components/AuthorityPanel";
import ChatPanel from "./components/ChatPanel";
import ConditionsStrip from "./components/ConditionsStrip";
import FishingPanel from "./components/FishingPanel";
import GuidedTour, { TOUR } from "./components/GuidedTour";
import LocationPicker, { PORTS, type PickedLocation } from "./components/LocationPicker";
import MarineMap from "./components/MarineMap";
import PFZList from "./components/PFZList";
import RiskCard from "./components/RiskCard";
import RiskTimeline from "./components/RiskTimeline";
import type {
  ChatMessage,
  ChatResponse,
  FishingOutlook,
  Language,
  Location,
  ZoneFeature,
} from "./types";

const SESSION = "demo";
const RADIUS_KM = 100;
const DEFAULT_PORT = PORTS[0]; // Mumbai — used only if location is unavailable

type Tab = "home" | "ask" | "authority";

const SCENARIOS: { id: string; n: string; label: string; ask: string; hint: string }[] = [
  { id: "safe", n: "1", label: "Safe", ask: "Is it safe to go fishing tomorrow morning near Goa?", hint: "Goa · LOW" },
  { id: "danger", n: "2", label: "Rough", ask: "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?", hint: "Mumbai · मराठी" },
  { id: "cyclone", n: "3", label: "Cyclone", ask: "Is there a cyclone near Paradip? Can I go fishing?", hint: "Paradip · EXTREME" },
  { id: "pfz", n: "4", label: "Fishing zones", ask: "कोच्चि के पास मछली पकड़ने का क्षेत्र कहाँ है?", hint: "Kochi · हिंदी" },
  { id: "route", n: "5", label: "Safe route", ask: "Give me the safest route to the nearest fishing zone near Mumbai", hint: "Mumbai · geofence" },
];

const TAB_LABEL: Record<Language, Record<Tab, string>> = {
  en: { home: "Today", ask: "Ask ORCA", authority: "Authority" },
  hi: { home: "आज", ask: "ORCA से पूछें", authority: "प्रशासन" },
  mr: { home: "आज", ask: "ORCA ला विचारा", authority: "प्रशासन" },
};

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latest, setLatest] = useState<ChatResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [langChoice, setLangChoice] = useState<Language | null>(null);
  const [detected, setDetected] = useState<Language>("en");
  const language = langChoice ?? detected;
  const [zones, setZones] = useState<ZoneFeature[]>([]);
  const [mode, setMode] = useState<string>("DEMO");
  const [switching, setSwitching] = useState(false);
  const [speak, setSpeak] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- fisher's own position + outlook ----
  const [place, setPlace] = useState<PickedLocation | null>(null);
  const [outlook, setOutlook] = useState<FishingOutlook | null>(null);
  const [loadingOutlook, setLoadingOutlook] = useState(false);
  const [focusRank, setFocusRank] = useState<number | null>(null);

  // ---- guided tour ----
  const [tourOn, setTourOn] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourPaused, setTourPaused] = useState(false);
  const tourActionDone = useRef(-1);

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

    if (navigator.geolocation) {
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

    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("demo");
    if (wanted) {
      const s = SCENARIOS.find((x) => x.id === wanted || x.n === wanted);
      if (s) setTimeout(() => runScenario(s.ask), 250);
    }
    if (params.get("tour") === "1") setTimeout(() => startTour(), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------- outlook on position
  useEffect(() => {
    if (!place) return;
    let alive = true;
    setLoadingOutlook(true);
    setFocusRank(null);
    api
      .fishingOutlook(place.latitude, place.longitude, {
        radiusKm: RADIUS_KM,
        days: 3,
        lang: language,
      })
      .then((d) => alive && setOutlook(d))
      .catch(() => alive && setOutlook(null))
      .finally(() => alive && setLoadingOutlook(false));
    return () => {
      alive = false;
    };
  }, [place?.latitude, place?.longitude, language]);

  // ------------------------------------------------------------- chat
  const send = async (text: string) => {
    setError(null);
    setBusy(true);
    setMessages((m) => [...m, { id: `${Date.now()}-u`, role: "user", text }]);
    try {
      const res = await api.ask({
        message: text,
        language: langChoice ?? undefined,
        sessionId: SESSION,
      });
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
          u.lang = res.language === "mr" ? "mr-IN" : res.language === "hi" ? "hi-IN" : "en-IN";
          u.rate = 0.98;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        } catch {
          /* TTS unavailable — non-fatal */
        }
      }
    } catch (e) {
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
      setBusy(false);
    }
  };

  const runScenario = async (ask: string) => {
    setTab("ask");
    await api.resetSession(SESSION).catch(() => {});
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
    await api.resetSession(SESSION).catch(() => {});
    setMessages([]);
    setLatest(null);
    setLangChoice(null);
    setTab("home");
    tourActionDone.current = -1;
    setTourStep(0);
    setTourPaused(false);
    setTourOn(true);
  };

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

  const homeOrigin: Location | null = place
    ? {
        name: outlook?.location.name ?? place.label,
        latitude: place.latitude,
        longitude: place.longitude,
        state: outlook?.location.state ?? null,
      }
    : null;

  return (
    <div className="mx-auto flex min-h-full max-w-[1580px] flex-col gap-4 p-4 lg:p-6">
      {/* ---------------- header ---------------- */}
      <header className="card flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
        <div className="flex items-center gap-3.5">
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ocean-900 via-ocean-700 to-teal-700 text-xl shadow-lg shadow-ocean-950/60">
            🐋
            <span className="pointer-events-none absolute -inset-1 rounded-2xl border border-ocean-300/25 animate-ping2" />
          </div>
          <div>
            <h1 className="text-[19px] font-extrabold leading-none tracking-tight text-white">
              ORCA
            </h1>
            <p className="mt-1.5 text-[11px] leading-none text-ocean-300">
              Marine EcOsystem Reasoning with Collaborative Agents
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-ocean-300">
            SIH26176
          </span>

          <button
            onClick={toggleMode}
            disabled={switching}
            title="Switch between cached demo data and live public providers"
            className={`rounded-full px-3 py-1.5 font-mono text-[10px] font-bold transition disabled:opacity-50 ${
              mode === "LIVE"
                ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                : "bg-amber-500/20 text-amber-200 hover:bg-amber-500/30"
            }`}
          >
            {switching ? "…" : `${mode} DATA`} <span className="opacity-55">⇄</span>
          </button>

          <button
            onClick={() => (tourOn ? setTourOn(false) : startTour())}
            title="Play the automatic walkthrough of every feature"
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${
              tourOn
                ? "bg-teal-500/25 text-teal-100 hover:bg-teal-500/35"
                : "bg-gradient-to-r from-ocean-700 to-teal-700 text-white hover:brightness-110"
            }`}
          >
            {tourOn ? "■ Stop tour" : "▶ Tour"}
          </button>

          <button
            onClick={() => setSpeak((v) => !v)}
            title="Speak answers aloud"
            className={`grid h-8 w-8 place-items-center rounded-full text-sm transition ${
              speak ? "bg-ocean-700 text-white" : "bg-white/5 text-ocean-300 hover:text-ocean-100"
            }`}
          >
            {speak ? "🔊" : "🔇"}
          </button>

          <div className="seg">
            {(["home", "ask", "authority"] as Tab[]).map((x) => (
              <button
                key={x}
                onClick={() => setTab(x)}
                className={`seg-btn ${tab === x ? "seg-btn-on" : "seg-btn-off"}`}
              >
                {tabLabels[x]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {tourOn && (
        <GuidedTour
          step={tourStep}
          paused={tourPaused}
          onPause={() => setTourPaused((p) => !p)}
          onNext={() => gotoStep(tourStep + 1)}
          onPrev={() => gotoStep(tourStep - 1)}
          onExit={() => setTourOn(false)}
        />
      )}

      {error && (
        <div className="card border-red-400/30 bg-red-500/10 px-4 py-2.5 text-[12px] text-red-100">
          {error} — start the backend with{" "}
          <code className="font-mono">uvicorn app.main:app --port 8000</code>
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
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  {
                    k: language === "mr" ? "सुरक्षा" : language === "hi" ? "सुरक्षा" : "Safety",
                    v: `${outlook.safety.score}`,
                    s: outlook.safety.category,
                  },
                  {
                    k: language === "mr" ? "लाटा" : language === "hi" ? "लहरें" : "Waves",
                    v: `${outlook.safety.wave_height_m ?? "—"}`,
                    s: "m",
                  },
                  {
                    k: language === "mr" ? "वारा" : language === "hi" ? "हवा" : "Wind",
                    v: `${Math.round(outlook.safety.wind_speed_kmh ?? 0)}`,
                    s: "km/h",
                  },
                  {
                    k: language === "mr" ? "जागा" : language === "hi" ? "जगहें" : "Areas",
                    v: `${outlook.areas.length}`,
                    s: `in ${outlook.radius_km} km`,
                  },
                ].map((x) => (
                  <div key={x.k} className="card-flat px-3 py-2.5">
                    <div className="label truncate">{x.k}</div>
                    <div className="mt-0.5 font-mono text-[19px] font-extrabold tabular-nums text-ocean-100">
                      {x.v}
                      <span className="ml-1 text-[10px] font-semibold opacity-65">{x.s}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 lg:h-[calc(100vh-215px)] lg:overflow-y-auto lg:pr-1">
            {loadingOutlook && !outlook && (
              <div className="card p-6 text-center text-sm text-ocean-300">
                {language === "mr"
                  ? "तुमच्या ठिकाणाची माहिती घेत आहे…"
                  : language === "hi"
                    ? "आपके स्थान की जानकारी ले रहे हैं…"
                    : "Reading the sea at your location…"}
              </div>
            )}
            {outlook && (
              <FishingPanel
                data={outlook}
                language={language}
                onSelectArea={(rank) => setFocusRank(rank)}
              />
            )}
          </div>
        </div>
      )}

      {/* ================= ASK : the conversational view ================= */}
      {tab === "ask" && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label mr-1">Demo</span>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => runScenario(s.ask)}
                disabled={busy}
                title={s.ask}
                className="chip disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="mr-1.5 font-mono text-[10px] text-ocean-300">{s.n}</span>
                <span className="font-semibold">{s.label}</span>
                <span className="ml-1.5 text-[10px] opacity-55">{s.hint}</span>
              </button>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(350px,1fr)_1.6fr]">
            <div className="min-h-[540px] lg:h-[calc(100vh-260px)]">
              <ChatPanel
                messages={messages}
                busy={busy}
                language={language}
                suggestions={suggestions}
                onSend={send}
                onLanguage={setLangChoice}
              />
            </div>

            <div className="space-y-4 lg:h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-1">
              {latest && <ConditionsStrip res={latest} language={latest.language} />}

              <MarineMap
                origin={latest?.intent.location ?? null}
                zones={zones}
                pfz={latest?.pfz ?? []}
                routes={latest?.routes ?? []}
                geofence={latest?.geofence ?? []}
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
                <div className="card border-risk-extreme/40 bg-risk-extreme/10 p-4">
                  <div className="label mb-2 text-red-200/80">Official marine warnings</div>
                  {latest.alerts.map((a, i) => (
                    <div key={i} className="mb-2.5 last:mb-0">
                      <div className="text-[13px] font-bold text-red-100">{a.headline}</div>
                      <div className="mt-0.5 text-[11px] leading-relaxed text-red-200/80">
                        {a.detail}
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-red-200/60">
                        {a.source} · {a.severity}
                        {a.valid_till ? ` · valid till ${a.valid_till}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {latest && <PFZList zones={latest.pfz} language={latest.language} />}

              {latest && latest.routes.length > 0 && (
                <div className="card p-4">
                  <div className="label mb-2.5">Route options</div>
                  <div className="space-y-2">
                    {latest.routes.map((r) => (
                      <div
                        key={r.name}
                        className={`rounded-xl border px-3 py-2.5 ${
                          r.recommended
                            ? "border-emerald-400/40 bg-emerald-400/10"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[13px] font-bold text-ocean-100">
                            {r.name}
                            {r.recommended && (
                              <span className="ml-2 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                                RECOMMENDED
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ocean-300">
                            {r.distance_km} km · {Math.round(r.eta_minutes)} min
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] leading-relaxed text-ocean-300/85">
                          {r.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {latest && <AgentTracePanel trace={latest.trace} elapsed={latest.elapsed_ms} />}

              {latest && (
                <p className="px-1 pb-2 text-[11px] leading-relaxed text-ocean-300/60">
                  {latest.disclaimer}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "authority" && <AuthorityPanel />}
    </div>
  );
}
