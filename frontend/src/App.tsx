import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as api from "./api";
import { locationAlreadyAllowed } from "./locate";
import { useAmbientMotion } from "./ambient";
import ChatPanel from "./components/ChatPanel";
import ConditionsStrip from "./components/ConditionsStrip";
import ErrorBoundary from "./components/ErrorBoundary";
import EvidenceLedger from "./components/EvidenceLedger";
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
import { NoEntryGlyph } from "./components/viewGlyphs";
import GuidedTour from "./components/GuidedTour";
import Landing from "./components/Landing";
import LocationPicker, {
  type PickedLocation,
} from "./components/LocationPicker";
import MarineMap from "./components/MarineMap";
import PFZList from "./components/PFZList";
import RiskCard from "./components/RiskCard";
import ScenarioDeck from "./components/ScenarioDeck";
import RiskTimeline from "./components/RiskTimeline";
import { useDocumentMeta } from "./documentMeta";
import type {
  ChatMessage,
  ChatResponse,
  FishingOutlook,
  MarineAlert,
  Language,
  Location,
  ZoneFeature,
} from "./types";
import {
  LANG_NAME,
  LANG_SHORT,
  MODE_LABEL,
  SCENARIOS,
  TAB_LABEL,
  UI,
  VIEW_TITLE,
  type AppTab,
} from "./i18n/app";
import { CATEGORY } from "./i18n/riskCard";
import { TOUR } from "./i18n/tour";
import { useFittedHeight, useMediaQuery, usePageTop } from "./layout";
import { tripIsOff } from "./components/todayModel";
import { PORTS } from "./ports";
import { RISK_INK } from "./risk";
import { SPEECH_LOCALE } from "./speech";
import { initialLanguage, readBootParams } from "./boot";
import { ink, risk } from "./tokens";
import { GlowingBadge } from "./ui/unlumen/glowing-badge";
import { SonarDial } from "./ui/console/SonarDial";

// The sheets that carry the motion library load as their own chunks, so the
// App chunk (which also carries the landing) stays light. They are fetched
// once the page goes idle, so a press on their tab finds them ready.
const loadAuthority = () => import("./components/AuthorityPanel");
const loadSystem = () => import("./components/SystemPanel");
const loadCrew = () => import("./components/CrewWorking");
const loadTrace = () => import("./components/AgentTrace");
const AuthorityPanel = lazy(loadAuthority);
const SystemPanel = lazy(loadSystem);
const CrewWorking = lazy(loadCrew);
const AgentTracePanel = lazy(loadTrace);

function prefetchSheets() {
  const go = () => {
    void loadCrew().catch(() => {});
    void loadTrace().catch(() => {});
    void loadAuthority().catch(() => {});
    void loadSystem().catch(() => {});
  };
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  };
  if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 4000 });
  else window.setTimeout(go, 2500);
}

const SESSION = "demo";
const RADIUS_KM = 100;
const DEFAULT_PORT = PORTS[0]; // Mumbai — used only if location is unavailable
const LANGUAGES: Language[] = ["en", "hi", "mr"];
const TABS: AppTab[] = ["home", "ask", "authority", "system"];
/** From here up the Ask sheet has two columns and a sticky one. */
const TWO_COLUMNS = "(min-width: 1024px)";
/** Today's plan needs more room beside the chart, so it pairs up a little later. */
const TODAY_COLUMNS = "(min-width: 1100px)";
/** The sheet's bottom gutter at that width (Tailwind `lg:p-6`). */
const GUTTER = 24;

/** "landing" is the front door; every deep link (?tab, ?demo, ?tour, ?at) skips it. */
type Tab = AppTab | "landing";

/** The deep link this page was opened with — read once, before first render. */
const BOOT = readBootParams(window.location.search);

/**
 * Every sheet is an address. The URL for a view keeps the params that name
 * this reading (`m`, `lang`, `at`) and drops the one-shot ones (`demo`,
 * `tour`), so a copied link reopens the same sheet in the same edition.
 */
function urlFor(next: AppTab | "landing"): URL {
  const url = new URL(window.location.href);
  ["demo", "tour"].forEach((k) => url.searchParams.delete(k));
  if (next === "landing") url.searchParams.delete("tab");
  else url.searchParams.set("tab", next);
  return url;
}
const BOOT_SCENARIO = BOOT.demo
  ? SCENARIOS.find((x) => x.id === BOOT.demo || x.n === BOOT.demo)
  : undefined;

/** While a sheet's chunk arrives: the drafted frame, never a blank page. */
function SheetDraft() {
  return <div className="panel min-h-[60vh]" aria-busy="true" />;
}

export default function App() {
  const [tab, setTab] = useState<Tab>(
    BOOT.tab ?? (BOOT_SCENARIO ? "ask" : BOOT.at ? "home" : "landing"),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latest, setLatest] = useState<ChatResponse | null>(null);
  // A deep-linked scenario first-paints with the deck folded and the crew
  // already working, so the sheet never jumps when the timer fires (CLS).
  const [busy, setBusy] = useState(BOOT_SCENARIO != null);
  /** The question /api/chat could not answer, kept so it can be sent again. */
  const [unanswered, setUnanswered] = useState<string | null>(null);
  // The reader's language: an explicit choice, else the deep link, else what
  // the browser said at boot. The chrome never follows an answer's language —
  // the answer speaks its own inside the panels, marked with lang=.
  const [langChoice, setLangChoice] = useState<Language | null>(BOOT.lang);
  const [detected] = useState<Language>(() =>
    initialLanguage(window.location.search, navigator.languages),
  );
  const language = langChoice ?? detected;
  const [zones, setZones] = useState<ZoneFeature[]>([]);
  const [mode, setMode] = useState<string>("DEMO");
  const [switching, setSwitching] = useState(false);
  const [speak, setSpeak] = useState(true);

  // ---- fisher's own position + outlook ----
  // ?at=lat,lon pins the starting position (demos, judge-tap re-creation);
  // it must win over geolocation, so GPS is skipped entirely when present.
  const [place, setPlace] = useState<PickedLocation | null>(
    BOOT.at ? { ...BOOT.at, label: "", source: "map" } : null,
  );
  const [outlook, setOutlook] = useState<FishingOutlook | null>(null);
  // The newest outlook request failed. The reading on screen, if any, is kept
  // only when it is for this same position (see the effect below).
  const [outlookErr, setOutlookErr] = useState(false);
  const outlookAt = useRef<{ latitude: number; longitude: number } | null>(
    null,
  );
  // Official warnings in force here, so the home chart can draw them.
  const [homeAlerts, setHomeAlerts] = useState<MarineAlert[]>([]);
  // Which request the outlook on screen answers. "Loading" and the focused
  // ground are derived from it, so a new position or language resets both
  // without an effect having to.
  const [settled, setSettled] = useState<{
    place: PickedLocation;
    language: Language;
  } | null>(null);
  const loadingOutlook =
    place != null &&
    !(settled?.place === place && settled.language === language);
  const [focus, setFocus] = useState<{
    rank: number;
    place: PickedLocation | null;
    language: Language;
  } | null>(null);
  const focusRank =
    focus && focus.place === place && focus.language === language
      ? focus.rank
      : null;

  // ---- guided tour ----
  const [tourOn, setTourOn] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourPaused, setTourPaused] = useState(false);
  const tourActionDone = useRef(-1);

  // Bumped whenever the conversation is restarted (a scenario, the tour). A
  // reply that was asked for under an older number is stale and is dropped.
  const conversation = useRef(0);

  // ---- the document and the sheet ----
  const ui = UI[language] ?? UI.en;
  const inConsole = tab !== "landing";
  useDocumentMeta(
    language,
    inConsole ? (VIEW_TITLE[language] ?? VIEW_TITLE.en)[tab] : null,
  );
  useAmbientMotion();

  // The ground is a fixed layer on both surfaces (index.css, `.sheet-ground`);
  // the mark tells the body to stand down so the two never double up.
  useEffect(() => {
    document.documentElement.dataset.surface = inConsole
      ? "console"
      : "landing";
    return () => {
      delete document.documentElement.dataset.surface;
    };
  }, [inConsole]);

  // From 1024 px the left column is sticky and exactly as tall as the room
  // under the title block, so the page scrolls as one sheet and nothing
  // scrolls inside anything else.
  const askColumns = useMediaQuery(TWO_COLUMNS);
  const todayColumns = useMediaQuery(TODAY_COLUMNS);
  const twoColumns = tab === "home" ? todayColumns : askColumns;
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetTop = usePageTop(sheetRef, tab);
  const stickyHeight = twoColumns
    ? `calc(100dvh - ${sheetTop + GUTTER}px)`
    : undefined;
  const mapSlotRef = useRef<HTMLDivElement>(null);
  const todayMapHeight = useFittedHeight(
    mapSlotRef,
    ".leaflet-container",
    // only once the column itself has been sized to the room under the header
    todayColumns && tab === "home" && sheetTop > 0,
    280,
    680,
  );

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
      .then((d) => {
        if (!alive) return;
        outlookAt.current = {
          latitude: place.latitude,
          longitude: place.longitude,
        };
        setOutlook(d);
        setOutlookErr(false);
      })
      .catch(() => {
        if (!alive) return;
        // A reading for somewhere else must never stand in for here: the last
        // one stays on screen only if it answers this same position.
        const kept = outlookAt.current;
        if (
          !kept ||
          kept.latitude !== place.latitude ||
          kept.longitude !== place.longitude
        ) {
          setOutlook(null);
        }
        setOutlookErr(true);
      })
      .finally(() => alive && setSettled({ place, language }));
    api
      .alerts(place.latitude, place.longitude, language)
      .then((d) => alive && setHomeAlerts(d.marine_alerts))
      .catch(() => alive && setHomeAlerts([]));
    return () => {
      alive = false;
    };
  }, [place, language]);

  // ------------------------------------------------------------- chat
  const send = async (text: string, again = false) => {
    const mine = conversation.current;
    const stale = () => mine !== conversation.current;
    setUnanswered(null);
    setBusy(true);
    // A retry answers the question already on screen; it is not asked twice.
    if (!again)
      setMessages((m) => [...m, { id: `${Date.now()}-u`, role: "user", text }]);
    try {
      const res = await api.ask({
        message: text,
        language: langChoice ?? undefined,
        sessionId: SESSION,
      });
      if (stale()) return;
      setLatest(res);
      setMode(res.mode);
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-o`,
          role: "orca",
          text: res.answer,
          response: res,
        },
      ]);
      // Speech needs a gesture first: a deep link that asks by itself stays
      // silent rather than lean on a browser allowance that is going away.
      if (speak && navigator.userActivation?.hasBeenActive !== false) {
        try {
          const u = new SpeechSynthesisUtterance(
            res.answer.split(". ").slice(0, 2).join(". "),
          );
          u.lang = SPEECH_LOCALE[res.language] ?? SPEECH_LOCALE.en;
          u.rate = 0.98;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        } catch {
          /* TTS unavailable — non-fatal */
        }
      }
    } catch {
      if (stale()) return;
      // The last answer stays where it is; the conversation says what failed
      // and offers the same question again.
      setUnanswered(text);
    } finally {
      if (!stale()) setBusy(false);
    }
  };

  // ------------------------------------------------- views are addresses
  // One function for every sheet change: pushState, so Back walks the
  // sheets instead of leaving ORCA, and `m`, `lang` and `at` survive.
  const go = useCallback((next: Tab) => {
    setTab(next);
    window.history.pushState(null, "", urlFor(next));
  }, []);

  useEffect(() => {
    // Back and Forward re-read the address the same way boot does, so a
    // demo or pinned-position entry restores the sheet it showed.
    const onPop = () => {
      const b = readBootParams(window.location.search);
      setTab(b.tab ?? (b.demo ? "ask" : b.at ? "home" : "landing"));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Focus follows the view: after a sheet change the new <main> takes focus
  // (it has tabIndex -1), so a keyboard or screen reader lands on what just
  // opened, not at the top of the document. The tour drives the tabs itself
  // and keeps its own focus.
  const wasTab = useRef(tab);
  useEffect(() => {
    if (wasTab.current !== tab && !tourOn)
      document
        .querySelector<HTMLElement>("main")
        ?.focus({ preventScroll: true });
    wasTab.current = tab;
  }, [tab, tourOn]);

  const runScenario = async (ask: string) => {
    const mine = ++conversation.current;
    // Only a real view change earns a history entry: a scenario run from the
    // Ask sheet itself (or the boot deep link) stays on the address it has.
    if (tab !== "ask") go("ask");
    await api.resetSession(SESSION).catch(() => {});
    if (mine !== conversation.current) return; // a newer run has taken over
    setMessages([]);
    setLatest(null);
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

  // Escape closes what is open; the tour is the one thing the shell opens.
  useEffect(() => {
    if (!tourOn) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTourOn(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourOn]);

  const startTour = async () => {
    const mine = ++conversation.current;
    await api.resetSession(SESSION).catch(() => {});
    if (mine !== conversation.current) return;
    setBusy(false);
    setUnanswered(null);
    setMessages([]);
    setLatest(null);
    setTab("home");
    tourActionDone.current = -1;
    setTourStep(0);
    setTourPaused(false);
    setTourOn(true);
  };

  // ---------------------------------------------------------------- boot
  useEffect(() => {
    prefetchSheets();
  }, []);

  useEffect(() => {
    api
      .zones()
      .then((z) => setZones(z.features))
      .catch(() => setZones([]));
    api
      .health()
      .then((h) => setMode(h.data_mode))
      .catch(() => setMode("DEMO"));

    // The app must be useful the moment it opens: find the fisher, then load
    // safety, grounds and warnings without them touching anything.
    const fallback = () =>
      setPlace({
        latitude: DEFAULT_PORT.lat,
        longitude: DEFAULT_PORT.lon,
        label: DEFAULT_PORT.name,
        source: "default",
      });

    let alive = true;
    if (BOOT.at) {
      // position already pinned by the link — GPS is not asked
    } else if (!("geolocation" in navigator)) {
      fallback();
    } else {
      // Found without a prompt if the fisher has allowed it before; otherwise
      // the default harbour now, and "Use my location" asks when pressed
      // (locate.ts). No permission prompt is ever raised by loading the page.
      void locationAlreadyAllowed().then((allowed) => {
        if (!alive) return;
        if (!allowed) return fallback();
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            alive &&
            setPlace({
              latitude: +pos.coords.latitude.toFixed(4),
              longitude: +pos.coords.longitude.toFixed(4),
              label: "",
              source: "gps",
            }),
          () => alive && fallback(),
          { enableHighAccuracy: true, timeout: 7000, maximumAge: 300_000 },
        );
      });
    }

    // The timers are cleared on unmount, so StrictMode's mount-unmount-mount
    // in development fires the scenario once, not twice.
    const timers: number[] = [];
    if (BOOT_SCENARIO)
      timers.push(window.setTimeout(() => runScenario(BOOT_SCENARIO.ask), 250));
    if (BOOT.tour) timers.push(window.setTimeout(() => startTour(), 500));
    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
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
    setPlace({ latitude: lat, longitude: lon, label: "", source: "map" });
  }, []);

  const suggestions = useMemo(() => latest?.suggestions ?? [], [latest]);
  const tabLabels = TAB_LABEL[language] ?? TAB_LABEL.en;
  const modeLabel = (MODE_LABEL[language] ?? MODE_LABEL.en)[mode] ?? mode;
  const bands = CATEGORY[language] ?? CATEGORY.en;

  // A position found by GPS or tapped on the chart is named in the reader's
  // language, at render, so switching language renames it.
  const shownPlace = useMemo(
    () =>
      place
        ? {
            ...place,
            label:
              place.label ||
              (place.source === "gps" ? ui.yourLocation : ui.selectedPoint),
          }
        : null,
    [place, ui.yourLocation, ui.selectedPoint],
  );

  // A do-not-go day quiets the chart: buoys to paper rings, no percentages.
  const tripOff = useMemo(
    () => (outlook ? tripIsOff(outlook) : false),
    [outlook],
  );

  // Stable identity: the chart's redraw effect depends on `origin`, so this
  // object may only change when a reading it shows changes — never because
  // an unrelated piece of state (voice, the tour) re-rendered the app.
  const homeOrigin = useMemo<Location | null>(
    () =>
      place
        ? {
            name: outlook?.location.name ?? shownPlace?.label ?? "",
            latitude: place.latitude,
            longitude: place.longitude,
            state: outlook?.location.state ?? null,
          }
        : null,
    [place, outlook?.location.name, outlook?.location.state, shownPlace?.label],
  );

  // The same frozen empty list for every chart prop that has no reading yet
  // (MarineMap defaults its own; these are the call sites that passed [] inline).
  const NONE = useMemo(() => [] as never[], []);

  if (tab === "landing") {
    return (
      <>
        <ChartDefs />
        <Landing
          mode={mode}
          language={language}
          onLanguage={setLangChoice}
          onEnter={go}
          onTour={startTour}
          onScenario={runScenario}
        />
      </>
    );
  }

  const cell =
    "flex flex-1 flex-col justify-center border-l px-5 py-3 xl:flex-none";
  const cellRule = { borderColor: "var(--rule-faint)" };
  const readings = [
    {
      k: ui.safety,
      v: outlook ? `${outlook.safety.score}` : "—",
      s: outlook
        ? (bands[outlook.safety.category] ?? outlook.safety.category)
        : "",
      color: outlook ? RISK_INK[outlook.safety.category] : undefined,
    },
    {
      k: ui.waves,
      v: outlook ? `${outlook.safety.wave_height_m ?? "—"}` : "—",
      s: "m",
    },
    {
      k: ui.wind,
      v: outlook ? `${Math.round(outlook.safety.wind_speed_kmh ?? 0)}` : "—",
      s: "km/h",
    },
    {
      k: ui.areas,
      v: outlook ? `${outlook.areas.length}` : "—",
      s: ui.inRadius.replace("{km}", String(outlook?.radius_km ?? RADIUS_KM)),
    },
  ];

  return (
    <div
      data-sheet-root
      className="relative mx-auto flex min-h-full max-w-[1580px] flex-col gap-4 p-4 lg:p-6"
    >
      <a href="#sheet" className="skip-link">
        {ui.skip}
      </a>
      <ChartDefs />
      <div className="sheet-ground" aria-hidden />
      <div className="sea-drift" aria-hidden>
        <i />
      </div>
      <div className="fish-drift" aria-hidden />

      {/* ---------------- title block, drafted like a chart's cartouche ---------------- */}
      <header className="panel rule-double">
        <div className="flex flex-wrap items-stretch">
          {/* identity — a real address: following it returns to the front page */}
          <a
            href={urlFor("landing").search || "/"}
            onClick={(e) => {
              if (
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey ||
                e.button !== 0
              )
                return;
              e.preventDefault();
              go("landing");
            }}
            title={ui.frontPage}
            className="cell-press flex min-w-0 flex-1 items-center gap-4 py-3.5 pl-5 pr-6 text-left"
          >
            <CompassMark size={46} className="shrink-0 text-ink-900" />
            <span className="min-w-0">
              <span
                translate="no"
                className="block font-display text-numeral font-black leading-none tracking-tight text-ink-900"
              >
                ORCA
              </span>
              <span className="mt-1 hidden font-mono text-label font-semibold uppercase tracking-[0.18em] text-chart-600 lg:block">
                {ui.tagline}
              </span>
              <span className="sr-only">. {ui.frontPage}</span>
            </span>
          </a>

          {/* title-block cells: they join the identity row from 768 px, so
              the masthead holds two rows, not three, on a projector */}
          <div
            className="flex min-w-0 basis-full items-stretch border-t md:basis-auto md:border-t-0"
            style={cellRule}
          >
            <div
              className={`${cell} hidden border-l-0 xl:flex xl:border-l`}
              style={cellRule}
            >
              <span className="label">{ui.chartNo}</span>
              <span className="mt-1 font-mono text-body font-bold text-ink-800">
                SIH26176
              </span>
            </div>

            <button
              onClick={toggleMode}
              disabled={switching}
              title={ui.modeHint}
              className={`${cell} cell-press text-left max-md:border-l-0 disabled:opacity-60`}
              style={cellRule}
            >
              <span className="label">{ui.dataEdition}</span>
              {/* the edition in force glows in its status colour and pings:
                  green for live sources, orange for the demo store */}
              <span className="mt-1 flex items-center gap-1.5">
                <GlowingBadge
                  tone={mode === "LIVE" ? risk.low : risk.high}
                  pulse={!switching}
                  className="!text-body !tracking-normal"
                  textClassName={
                    mode === "LIVE" ? "text-risk-low" : "text-risk-high"
                  }
                >
                  {switching ? ui.modeSwitching : modeLabel}
                </GlowingBadge>
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 12"
                  className="text-ink-400"
                  aria-hidden
                >
                  <path
                    d="M1 3.5 H12 M9.5 1 L12 3.5 L9.5 6 M13 8.5 H2 M4.5 6 L2 8.5 L4.5 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sr-only">. {ui.modeHint}</span>
            </button>

            <button
              onClick={() => setSpeak((v) => !v)}
              aria-pressed={speak}
              title={ui.voiceHint}
              className={`${cell} cell-press text-left`}
              style={cellRule}
            >
              <span className="label">{ui.voice}</span>
              <span className="mt-1 flex items-center gap-1.5 font-mono text-body font-bold uppercase text-ink-800">
                {speak ? (
                  <SpeakerGlyph />
                ) : (
                  <SpeakerOffGlyph className="text-ink-400" />
                )}
                {speak ? ui.voiceOn : ui.voiceOff}
              </span>
              <span className="sr-only">. {ui.voiceHint}</span>
            </button>

            <div
              className={`${cell} !px-4`}
              style={cellRule}
              role="group"
              aria-label={ui.lang}
            >
              <span className="label" aria-hidden>
                {ui.lang}
              </span>
              <span className="mt-1 flex gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLangChoice(l)}
                    aria-pressed={language === l}
                    title={LANG_NAME[l]}
                    lang={l}
                    className={`press min-h-7 rounded-[2px] border px-2.5 font-mono text-label font-bold ${
                      language === l
                        ? "border-ink-900 bg-ink-900 text-paper-50"
                        : "text-ink-500 hover:bg-paper-150 hover:text-ink-900"
                    }`}
                    style={
                      language === l
                        ? undefined
                        : { borderColor: "var(--rule)" }
                    }
                  >
                    <span aria-hidden>{LANG_SHORT[l]}</span>
                    <span className="sr-only">{LANG_NAME[l]}</span>
                  </button>
                ))}
              </span>
            </div>

            <div
              className="flex items-center border-l px-4 py-3"
              style={cellRule}
            >
              <button
                onClick={() => (tourOn ? setTourOn(false) : startTour())}
                className="btn-ink whitespace-nowrap"
              >
                {tourOn ? <StopGlyph size={11} /> : <PlayGlyph size={11} />}
                {tourOn ? ui.stopTour : ui.tour}
              </button>
            </div>
          </div>
        </div>

        {/* folio tabs */}
        <nav
          aria-label={ui.views}
          className="flex items-end gap-6 overflow-x-auto border-t px-5"
          style={cellRule}
        >
          {TABS.map((x) => (
            // Real links: each sheet has an address that keeps m, lang and at,
            // so it can be opened in a new tab or copied. A plain press swaps
            // the sheet in place and writes the same address into history.
            <a
              key={x}
              href={urlFor(x).search}
              onClick={(e) => {
                if (
                  e.metaKey ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  e.altKey ||
                  e.button !== 0
                )
                  return;
                e.preventDefault();
                go(x);
              }}
              aria-current={tab === x ? "page" : undefined}
              className={`tab mt-2 ${tab === x ? "tab-on" : ""}`}
            >
              {tabLabels[x]}
            </a>
          ))}
          <span
            className="label ml-auto hidden shrink-0 pb-2.5 !tracking-[0.12em] !text-chart-600 xl:block"
            aria-hidden
          >
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

      {/* One short rise per view change: transform only, so nothing on the
          sheet is ever invisible while it runs (or if it never does). */}
      <main
        id="sheet"
        key={tab}
        tabIndex={-1}
        className="flex min-h-0 flex-1 animate-rise flex-col gap-4"
      >
        <h1 className="sr-only">
          {(VIEW_TITLE[language] ?? VIEW_TITLE.en)[tab]}
        </h1>

        {/* ================= TODAY : location + today's plan ================= */}
        {tab === "home" && (
          <ErrorBoundary language={language}>
            <div
              ref={sheetRef}
              className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1.35fr)_minmax(400px,1fr)] min-[1100px]:items-start"
            >
              {/* The chart column stays with the reader while the plan scrolls.
                  It is as tall as the room under the title block; on a short
                  window it keeps a floor so the chart stays a chart, and the
                  whole column is in view once the page has scrolled a little. */}
              <div
                className="flex min-w-0 flex-col gap-4 min-[1100px]:sticky min-[1100px]:top-4 min-[1100px]:min-h-[min(calc(100dvh-2rem),640px)]"
                style={{ height: stickyHeight }}
              >
                <LocationPicker
                  current={shownPlace}
                  language={language}
                  onPick={setPlace}
                />

                <dl
                  className="panel grid shrink-0 grid-cols-2 sm:grid-cols-4"
                  aria-busy={loadingOutlook}
                >
                  {readings.map((x, i) => (
                    <div
                      key={x.k}
                      className={`min-w-0 px-4 py-3 ${i > 0 ? "sm:border-l" : ""} ${
                        i % 2 ? "max-sm:border-l" : ""
                      } ${i > 1 ? "max-sm:border-t" : ""}`}
                      style={cellRule}
                    >
                      <dt className="label truncate">{x.k}</dt>
                      <dd
                        className="mt-1 truncate font-mono text-headline font-bold tabular-nums leading-none text-ink-900"
                        style={x.color ? { color: x.color } : undefined}
                      >
                        {x.v}
                        <span
                          className={`ml-1.5 text-label font-semibold ${x.color ? "" : "text-ink-500"}`}
                        >
                          {x.s}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div ref={mapSlotRef} className="min-h-0 min-[1100px]:flex-1">
                  {/* The chart is drawn once its height is known, so it is laid
                      out a single time at the size it will keep. */}
                  {todayColumns && todayMapHeight === undefined ? (
                    <div className="chart-sheet h-full" aria-hidden />
                  ) : (
                    <ErrorBoundary language={language}>
                      <MarineMap
                        origin={homeOrigin}
                        zones={zones}
                        pfz={NONE}
                        areas={outlook?.areas ?? NONE}
                        radiusKm={outlook?.radius_km ?? RADIUS_KM}
                        routes={outlook?.routes ?? NONE}
                        geofence={NONE}
                        alerts={homeAlerts}
                        language={language}
                        severe={tripOff}
                        onPickLocation={pickLocation}
                        focusRank={focusRank}
                        heightPx={todayMapHeight}
                      />
                    </ErrorBoundary>
                  )}
                </div>
              </div>

              <div className="min-w-0 space-y-4">
                {/* The panel draws its own states: a drafted sheet while the
                    first reading is on its way, the offline notice when it
                    fails, and the last reading kept under that notice. */}
                {place && (
                  <FishingPanel
                    data={outlook}
                    loading={loadingOutlook}
                    error={outlookErr && !loadingOutlook}
                    onRetry={() => setPlace({ ...place })}
                    language={language}
                    onSelectArea={(rank) => setFocus({ rank, place, language })}
                  />
                )}
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* ================= ASK : the answer leads ================= */}
        {tab === "ask" && (
          <ErrorBoundary language={language}>
            <ScenarioDeck
              language={language}
              open={messages.length === 0 && !latest && !busy}
              busy={busy}
              onRun={runScenario}
            />

            <div ref={sheetRef} className="ask-sheet">
              <div
                data-area="talk"
                className="min-w-0 lg:sticky lg:top-4 lg:min-h-[min(calc(100dvh-2rem),440px)]"
                style={{ height: stickyHeight }}
              >
                <ChatPanel
                  messages={messages}
                  busy={busy}
                  failed={unanswered !== null}
                  hasAnswer={latest !== null}
                  language={language}
                  answerLang={latest?.language}
                  suggestions={suggestions}
                  onSend={send}
                  onRetry={() => unanswered && send(unanswered, true)}
                />
              </div>

              <div className="ask-answer">
                {/* The verdict slot: first in the column, first on a narrow
                    sheet. One occupant at a time — pending note, the working
                    crew, or the verdict — inside one reserved height, so the
                    chart below never jumps while they hand over. */}
                <div
                  data-area="verdict"
                  data-settled={
                    messages.length > 0 || busy || latest ? "" : undefined
                  }
                  className="min-w-0 space-y-4"
                >
                  {busy && (
                    <Suspense fallback={null}>
                      <CrewWorking language={language} />
                    </Suspense>
                  )}

                  {!busy && latest?.risk && (
                    <RiskCard
                      risk={latest.risk}
                      evidence={latest.evidence}
                      language={language}
                      answerLang={latest.language}
                      trace={latest.trace}
                      elapsed={latest.elapsed_ms}
                    />
                  )}

                  {!latest && !busy && (
                    <div
                      className="panel-tint flex items-center gap-5 border-dashed p-5"
                      style={{ borderColor: "var(--rule-strong)" }}
                    >
                      <SonarDial />
                      <div className="min-w-0">
                        <h2 className="font-display text-lead font-bold leading-snug text-ink-900">
                          {ui.pendingTitle}
                        </h2>
                        <p className="mt-1 max-w-[62ch] text-body leading-relaxed text-ink-700">
                          {ui.pendingBody}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <ErrorBoundary language={language}>
                  <MarineMap
                    origin={latest?.intent.location ?? null}
                    zones={zones}
                    pfz={latest?.pfz ?? NONE}
                    routes={latest?.routes ?? NONE}
                    geofence={latest?.geofence ?? NONE}
                    alerts={latest?.alerts ?? NONE}
                    language={language}
                  />
                </ErrorBoundary>

                {latest && (
                  <ConditionsStrip
                    res={latest}
                    language={language}
                    answerLang={latest.language}
                  />
                )}

                {latest && latest.alerts.length > 0 && (
                  <section className="panel hatch-danger overflow-hidden border-risk-extreme/60">
                    <div className="hd border-risk-extreme/25">
                      <h2 className="label flex items-center gap-2 !text-risk-extreme">
                        <WarnGlyph size={13} /> {ui.warnings}
                      </h2>
                    </div>
                    <div
                      className="space-y-3 px-4 py-3.5"
                      lang={latest.language}
                    >
                      {latest.alerts.map((a, i) => (
                        <div key={i} className="max-w-[78ch]">
                          <h3 className="font-display text-lead font-bold leading-snug text-risk-extreme">
                            {a.headline}
                          </h3>
                          <p className="mt-1 text-body leading-relaxed text-ink-700">
                            {a.detail}
                          </p>
                          <p className="mt-1 font-mono text-label uppercase tracking-wide text-ink-500">
                            {a.source} · {a.severity}
                            {a.valid_till
                              ? ` · ${ui.validTill} ${a.valid_till}`
                              : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {latest && (
                  <RiskTimeline
                    location={latest.intent.location}
                    language={language}
                  />
                )}

                {latest && <PFZList zones={latest.pfz} language={language} />}

                {latest && latest.routes.length > 0 && (
                  <section className="panel overflow-hidden">
                    <div className="hd">
                      <h2 className="label">{ui.courses}</h2>
                    </div>
                    <div className="space-y-2 px-4 py-3.5">
                      {latest.routes.map((r) => {
                        // The optimiser counts every restricted polygon a
                        // course enters; a crossing course is marked, never
                        // set as a neutral option.
                        const crossings = Math.round(
                          r.penalties?.restricted_zones ?? 0,
                        );
                        return (
                          <div
                            key={r.name}
                            className={`rounded-[2px] border px-3.5 py-3 ${
                              r.recommended
                                ? "border-risk-low/70 bg-risk-low/[0.06]"
                                : crossings > 0
                                  ? "hatch-danger border-risk-extreme/50 bg-paper-100"
                                  : "bg-paper-100"
                            }`}
                            style={
                              r.recommended || crossings > 0
                                ? undefined
                                : { borderColor: "var(--rule)" }
                            }
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                              <h3 className="flex items-center gap-2.5 font-display text-body font-bold text-ink-900">
                                {/* course symbology, drawn as plotted */}
                                <svg
                                  width="26"
                                  height="8"
                                  className="shrink-0"
                                  aria-hidden
                                >
                                  <line
                                    x1="1"
                                    y1="4"
                                    x2="25"
                                    y2="4"
                                    stroke={r.recommended ? risk.low : ink[400]}
                                    strokeWidth="2"
                                    strokeDasharray={
                                      r.recommended ? "7 4" : "2 4"
                                    }
                                  />
                                </svg>
                                <span lang={latest.language}>{r.name}</span>
                                {r.recommended && (
                                  // a finding, not a verdict: the flat boxed
                                  // tag — the stamp belongs to verdicts only
                                  <span className="border border-risk-low bg-paper-50 px-1.5 py-0.5 font-mono text-label font-bold uppercase tracking-[0.1em] text-risk-low">
                                    {ui.recommended}
                                  </span>
                                )}
                                {crossings > 0 && (
                                  <span className="flex items-center gap-1.5 font-mono text-label font-bold uppercase tracking-[0.08em] text-risk-extreme">
                                    <NoEntryGlyph
                                      size={13}
                                      className="shrink-0"
                                    />
                                    {crossings === 1
                                      ? ui.crossesOne
                                      : ui.crossesMany.replace(
                                          "{n}",
                                          String(crossings),
                                        )}
                                  </span>
                                )}
                              </h3>
                              <span className="shrink-0 font-mono text-label tabular-nums text-ink-500">
                                {r.distance_km} km · {Math.round(r.eta_minutes)}{" "}
                                min
                              </span>
                            </div>
                            <p
                              lang={latest.language}
                              className="mt-1 max-w-[78ch] pl-9 text-label leading-relaxed text-ink-500"
                            >
                              {r.notes}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {latest && (
                  <EvidenceLedger
                    evidence={latest.evidence}
                    language={language}
                    answerLang={latest.language}
                  />
                )}

                {latest && (
                  <Suspense fallback={null}>
                    <AgentTracePanel
                      trace={latest.trace}
                      elapsed={latest.elapsed_ms}
                      language={language}
                      answerLang={latest.language}
                    />
                  </Suspense>
                )}

                {latest && (
                  <p
                    lang={latest.language}
                    className="max-w-[78ch] px-1 pb-2 font-mono text-label leading-relaxed text-ink-500"
                  >
                    {latest.disclaimer}
                  </p>
                )}
              </div>
            </div>
          </ErrorBoundary>
        )}

        {tab === "authority" && (
          <ErrorBoundary language={language}>
            <Suspense fallback={<SheetDraft />}>
              <AuthorityPanel language={language} />
            </Suspense>
          </ErrorBoundary>
        )}

        {tab === "system" && (
          <ErrorBoundary language={language}>
            <Suspense fallback={<SheetDraft />}>
              <SystemPanel mode={mode} language={language} />
            </Suspense>
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}
