import { Fragment, lazy, useEffect, useRef, useState } from "react";
import * as api from "../api";
import type { Language } from "../types";
import { CourseArrow, FishGlyph, LockGlyph, WarnGlyph } from "./glyphs";
import { Draft } from "./SheetStates";
import { ERRORS } from "../i18n/errors";
import { CREW_TEXT, L10N, PROVIDER_TEXT } from "../i18n/system";
import { PORTS } from "../ports";
import { chart, ink, risk } from "../tokens";
import { measurement } from "../format";
import { fill } from "./todayModel";
import { useMediaQuery } from "../layout";
import { BeamGap } from "../ui/console/BeamGap";
import { AnimatedList } from "../ui/unlumen/animated-list";
import { GlowingBadge } from "../ui/unlumen/glowing-badge";
import { GlSlot } from "../ui/console/GlSlot";

/** The contour band's chunk (and ogl) is fetched only where GlSlot allows it. */
const Topography = lazy(() => import("../ui/reactbits/topography"));
import "./views.css";

/**
 * The engine room — the whole machine on one sheet, running.
 *
 * Three stories, told in order: what data comes in and what we do with it
 * (the part judges ask about), the crew that reasons over it, and the safety
 * law that no model output can undo. At the bottom, the machine is shown
 * actually running: a live feed cycling through the coast, port by port,
 * with provenance on every reading.
 */

type FeedRow = {
  port: string;
  state: string;
  mode: string;
  /** The provider id as the backend reports it: named at render, per language. */
  source: string;
  latency: number;
  wave: string;
  wind: string;
  sst: string;
  vis: string;
  at: string;
};

const POLL_MS = 7000;
/** How long the reading that has just entered the log stays marked. */
const NEWEST_MS = 1800;

const rowKey = (r: FeedRow) => `${r.port}-${r.at}`;

function fmt(m?: api.Measurement | null): string {
  // The one format for every quantity: "deg C" prints as "°C" (S5, X5).
  return measurement(m?.value, m?.unit);
}

/** The crew's pipeline at desktop width: phase, gap, phase, gap… */
const CREW_COLUMNS = "minmax(0,1fr) 72px minmax(0,1.7fr) 72px minmax(0,1.2fr) 72px minmax(0,1fr)";

export default function SystemPanel({
  mode,
  language = "en",
}: {
  mode: string;
  language?: Language;
}) {
  const t = L10N[language] ?? L10N.en;
  const err = ERRORS[language] ?? ERRORS.en;
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [tick, setTick] = useState(0);
  const [scanning, setScanning] = useState(true);
  // The visible pause for the 7 s rotation (WCAG 2.2.2): Hold stops the tick.
  const [held, setHeld] = useState(false);
  const heldRef = useRef(false);
  useEffect(() => {
    heldRef.current = held;
  }, [held]);
  // Seconds until the next try, shown while the feed is not answering.
  const [retryIn, setRetryIn] = useState(POLL_MS / 1000);
  const portIdx = useRef(0);
  const shownRef = useRef<FeedRow | null>(null);
  // The reading that has just entered the log: washed in teal for a moment.
  const [newestKey, setNewestKey] = useState<string | null>(null);
  // The pipeline's beams run at desktop width, where the flow is a row; the
  // stacked flow below it keeps its drop lines.
  const wide = useMediaQuery("(min-width: 1024px)");

  // Cycle the coastline: one port per poll, newest reading on top. The tick
  // rests while the sheet is held or the tab is hidden.
  useEffect(() => {
    let alive = true;
    const read = async () => {
      if (heldRef.current || document.hidden) return;
      const port = PORTS[portIdx.current % PORTS.length];
      portIdx.current += 1;
      try {
        const f = await api.forecast(port.lat, port.lon);
        if (!alive) return;
        const row: FeedRow = {
          port: port.name,
          state: port.state,
          mode: f.ocean.mode,
          source: f.ocean.source,
          latency: (f.ocean.latency_ms ?? 0) + (f.weather.latency_ms ?? 0),
          wave: fmt(f.ocean.measurements?.wave_height),
          wind: fmt(f.weather.measurements?.wind_speed),
          sst: fmt(f.ocean.measurements?.sst),
          vis: fmt(f.weather.measurements?.visibility),
          at: new Date().toLocaleTimeString("en-IN", { hour12: false }),
        };
        // The reading on show steps down into the log, marked as its newest.
        const previous = shownRef.current;
        shownRef.current = row;
        setRows((r) => [row, ...r].slice(0, 6));
        if (previous) setNewestKey(rowKey(previous));
        setTick((n) => n + 1);
        setScanning(true);
      } catch {
        if (alive) {
          setScanning(false);
          setRetryIn(POLL_MS / 1000);
        }
      }
    };
    read();
    const timer = setInterval(read, POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  // "Next try in {n} s" counts down while the feed is not answering (S5).
  useEffect(() => {
    if (scanning) return;
    const id = setInterval(() => {
      if (heldRef.current) return;
      setRetryIn((n) => (n <= 1 ? POLL_MS / 1000 : n - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [scanning]);

  const latest = rows[0];
  // The mark on the reading that has just entered the log lasts a moment.
  useEffect(() => {
    if (!newestKey) return;
    const id = window.setTimeout(() => setNewestKey(null), NEWEST_MS);
    return () => window.clearTimeout(id);
  }, [newestKey]);
  const sourceName = (id: string) => (id === "OPEN_METEO" ? "Open-Meteo" : t.demoStore);

  // Provider status follows the data edition (S1): in DEMO the live providers
  // stand by, verified, and the demo store is the one in use; reversed in LIVE.
  const demo = mode !== "LIVE";
  const pText = PROVIDER_TEXT[language] ?? PROVIDER_TEXT.en;
  const liveStatus = demo ? t.standbyVerified : t.inUse;
  const providers = [
    { name: "Open-Meteo Marine", color: demo ? ink[500] : risk.low, live: !demo, ...pText[0], status: liveStatus },
    { name: "Open-Meteo Forecast", color: demo ? ink[500] : risk.low, live: !demo, ...pText[1], status: liveStatus },
    { name: "INCOIS · IMD · MOSDAC", color: risk.moderate, live: false, ...pText[2] },
    { name: "OBIS · Map of Life", color: chart[600], live: false, ...pText[3] },
    { name: t.demoStore, color: demo ? chart[600] : ink[500], live: demo, ...pText[4], status: demo ? t.inUse : t.standby },
  ];

  const crew = CREW_TEXT[language] ?? CREW_TEXT.en;
  const feedHeads = [t.hPort, t.wave, t.wind, t.sst, t.vis, t.hSource, t.hMode, t.hLatency, t.hAt];
  const headClass = "py-2 text-left text-label font-bold uppercase tracking-[0.14em] text-ink-500";

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/* ---------------- intro ---------------- */}
      <section className="panel rule-double overflow-hidden">
        <div className="hd flex-wrap">
          <span className="label">{t.engineRoom}</span>
          <span className="font-mono text-label text-chart-700">{t.configNote}</span>
        </div>
        <div className="relative px-5 py-4">
          {/* a living bathymetric chart under the title: depth contours in
              chart teal drifting on the paper, desktop only (GlSlot) */}
          <GlSlot className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,transparent_22%,black_68%)]">
            <Topography />
          </GlSlot>
          <h2 className="relative font-display text-headline font-bold leading-snug text-ink-900 [text-wrap:balance]">
            {t.title}
          </h2>
          <p className="relative mt-1.5 max-w-[62ch] text-body leading-relaxed text-ink-700">{t.intro}</p>
        </div>
      </section>

      {/* ---------------- the data intake ---------------- */}
      <section className="panel overflow-hidden">
        <div className="hd">
          <h3 className="label">{t.s1}</h3>
        </div>
        <div className="flex flex-wrap gap-3 px-4 py-4">
          {providers.map((p) => (
            <div
              key={p.name}
              className="min-w-0 flex-1 basis-[260px] rounded-[2px] border bg-paper-100 px-4 py-3"
              style={{ borderColor: "var(--rule)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`pulse-dot shrink-0 ${p.live ? "" : "pulse-dot--still"}`}
                  style={{ background: p.color, color: p.color }}
                  aria-hidden
                />
                <h4 className="min-w-0 font-display text-body font-bold leading-tight text-ink-900">
                  {p.name}
                </h4>
              </div>
              {/* the dot, the rule and the glow carry the status colour; the
                  words stay in ink. The provider in use pings. */}
              <div className="mt-2">
                <GlowingBadge tone={p.color} pulse={p.live}>
                  {p.status}
                </GlowingBadge>
              </div>
              <p className="mt-2 text-label leading-relaxed text-ink-700">{p.gives}</p>
              <p className="mt-1 text-label italic leading-snug text-ink-500">{p.note}</p>
            </div>
          ))}
        </div>

        {/* the flow into the cache: each beam spans the gap it joins, the
            second a beat after the first — fetch, cache, then the crew */}
        <div className="flex flex-col items-center gap-1.5 px-4 pb-4 lg:flex-row lg:gap-0">
          <div className="shrink-0 text-center font-mono text-label uppercase tracking-[0.12em] text-ink-700 lg:pr-3 lg:text-right">
            {t.oneFetch}
            <br />
            <span className="text-ink-500">{t.perProvider}</span>
          </div>
          <BeamGap on={wide} className="hidden flex-1 lg:flex" />
          <span className="v-connector-down !m-0 lg:hidden" aria-hidden />
          <div className="min-w-0 rounded-[2px] border-2 border-chart-600 bg-chart-100/40 px-4 py-3 text-center lg:max-w-[520px] lg:flex-[3_1_0]">
            <h4 className="font-display text-lead font-bold text-ink-900">{t.cacheTitle}</h4>
            <p className="mt-1 text-label leading-relaxed text-ink-700">{t.cacheBody}</p>
            <p className="mt-1.5 font-mono text-label uppercase tracking-[0.1em] text-chart-700">
              {t.cacheMeta}
            </p>
          </div>
          <BeamGap on={wide} delay={0.9} className="hidden flex-1 lg:flex" />
          <span className="v-connector-down !m-0 lg:hidden" aria-hidden />
          <div className="shrink-0 text-center font-mono text-label uppercase tracking-[0.12em] text-ink-700 lg:pl-3 lg:text-left">
            {t.everyAgent}
            <br />
            <span className="text-ink-500">{t.fromMemory}</span>
          </div>
        </div>

        <p
          className="border-t px-4 py-2.5 text-label italic leading-relaxed text-ink-700"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          {t.degrade}
        </p>
      </section>

      {/* ---------------- the crew ---------------- */}
      <section className="panel overflow-hidden">
        <div className="hd flex-wrap">
          <h3 className="label">{t.s2}</h3>
          <span className="font-mono text-label text-ink-500">{t.s2note}</span>
        </div>
        {/* One DOM, two layouts: stacked with drop lines when narrow; at desktop
            a grid whose middle row holds the agents and the beams between
            them, so the signal runs phase to phase in the order of the work. */}
        <div
          className="flex flex-col px-4 py-4 lg:grid lg:gap-y-2"
          style={{ gridTemplateColumns: CREW_COLUMNS }}
        >
          {crew.map((c, i) => (
            <Fragment key={c.phase}>
              {i > 0 && (
                <>
                  <span className="v-connector-down lg:hidden" aria-hidden />
                  <BeamGap
                    on={wide}
                    delay={(i - 1) * 0.5}
                    className="mx-1 hidden lg:flex"
                    style={{ gridColumn: i * 2, gridRow: 2 }}
                  />
                </>
              )}
              <div
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                style={{ gridColumn: i * 2 + 1, gridRow: 1 }}
              >
                <h4 className="font-display text-lead font-bold text-ink-900">{c.phase}</h4>
                {c.agents.length > 2 && (
                  <span className="flex items-center gap-1.5 font-mono text-label font-bold uppercase tracking-[0.08em] text-chart-700">
                    <svg width="7" height="10" viewBox="0 0 7 10" aria-hidden>
                      <path d="M1.5 1 V9 M5.5 1 V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    {fill(t.concurrent, { n: c.agents.length })}
                  </span>
                )}
              </div>
              <ul
                className="mt-2 flex flex-wrap content-center gap-1.5 lg:mt-0"
                style={{ gridColumn: i * 2 + 1, gridRow: 2 }}
              >
                {c.agents.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-1.5 rounded-[2px] border bg-paper-100 px-2 py-1 font-mono text-label font-semibold text-ink-800"
                    style={{ borderColor: "var(--rule)" }}
                  >
                    {/* Still between readings (S3): nothing runs between polls,
                        so the chips do not ping. Only the provider in use and
                        the feed's own dot pulse. */}
                    <span
                      className="pulse-dot pulse-dot--still !h-[6px] !w-[6px]"
                      style={{ background: chart[500], color: chart[500] }}
                      aria-hidden
                    />
                    {a}
                  </li>
                ))}
              </ul>
              <p
                className="mt-2 text-label italic leading-snug text-ink-700 lg:mt-0"
                style={{ gridColumn: i * 2 + 1, gridRow: 3 }}
              >
                {c.note}
              </p>
            </Fragment>
          ))}
        </div>
      </section>

      {/* ---------------- the safety law ---------------- */}
      <section className="panel hatch-danger overflow-hidden border-risk-extreme/50">
        <div className="hd border-risk-extreme/25">
          <h3 className="label flex items-center gap-2 !text-risk-extreme">
            <WarnGlyph size={13} /> {t.s3}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
          <span className="stamp text-body text-risk-extreme">{t.stamp}</span>
          <ul className="min-w-0 space-y-1 font-mono text-label text-ink-800">
            <li>{t.law1}</li>
            <li>{t.law2}</li>
            <li>{t.law3}</li>
          </ul>
          <p className="min-w-0 max-w-[44ch] flex-1 basis-[260px] text-label italic leading-relaxed text-ink-800">
            <LockGlyph size={12} className="mr-1 inline text-risk-extreme" />
            {t.lawNote}
          </p>
        </div>
      </section>

      {/* ---------------- the gate: know when not to decide ---------------- */}
      <section className="panel overflow-hidden" data-gate-law>
        <div className="hd">
          <h3 className="label">{t.sGate}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
          <span className="stamp text-body text-ink-800">{t.gateStamp}</span>
          <ul className="min-w-0 space-y-1 font-mono text-label text-ink-800">
            <li>{t.gate1}</li>
            <li>{t.gate2}</li>
            <li>{t.gate3}</li>
          </ul>
          <p className="min-w-0 max-w-[44ch] flex-1 basis-[260px] text-label italic leading-relaxed text-ink-800">
            {t.gateNote}
          </p>
        </div>
      </section>

      {/* ---------------- where it goes ---------------- */}
      <section className="panel overflow-hidden">
        <div className="hd">
          <h3 className="label">{t.s4}</h3>
        </div>
        <div className="v-cells sm:grid-cols-3">
          {[
            { h: t.outVerdict, d: t.outVerdictD },
            { h: t.outPlan, d: t.outPlanD },
            { h: t.outLedger, d: t.outLedgerD },
          ].map((x) => (
            <div key={x.h} className="px-5 py-4">
              <div className="flex items-center gap-2">
                <CourseArrow size={13} className="shrink-0 text-chart-600" />
                <h4 className="font-display text-lead font-bold text-ink-900">{x.h}</h4>
              </div>
              <p className="mt-1.5 text-body leading-relaxed text-ink-700">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ---------------- the live feed: the log, last and unnumbered ---------------- */}
      <section className="panel rule-double overflow-hidden">
        <div className="hd flex-wrap">
          <h3 className="label flex items-center gap-2.5">
            <span
              className={`pulse-dot ${scanning && !held ? "" : "pulse-dot--still"}`}
              style={{
                background: scanning ? risk.low : risk.extreme,
                color: scanning ? risk.low : risk.extreme,
              }}
              aria-hidden
            />
            {t.reading}
          </h3>
          <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="font-mono text-label tabular-nums text-ink-500">
              {t.onePort} {POLL_MS / 1000} s · {mode} {t.flipNote}
            </span>
            {/* the visible pause WCAG 2.2.2 asks for: the rotation can be held */}
            <button
              type="button"
              onClick={() => setHeld((h) => !h)}
              aria-pressed={held}
              className="btn-line shrink-0 !px-2.5 !py-1 !text-label"
            >
              {held ? t.resume : t.hold}
            </button>
          </span>
        </div>

        {!scanning && (
          <div
            role="alert"
            className="hatch-danger flex items-start gap-2.5 border-b px-4 py-3"
            style={{ borderColor: "var(--rule-faint)" }}
          >
            <WarnGlyph size={16} className="mt-0.5 shrink-0 text-risk-extreme" />
            <p className="min-w-0 text-body leading-relaxed text-ink-800">
              <span className="font-display font-bold text-ink-900">{err.offlineTitle}.</span>{" "}
              {latest ? err.offlineBody : fill(t.feedRetry, { n: retryIn })}
            </p>
          </div>
        )}

        {latest ? (
          <div className="v-cells grid-cols-2 border-b sm:grid-cols-6" style={{ borderColor: "var(--rule-faint)" }}>
            <div className="col-span-2 px-4 py-3">
              <div className="label">{t.nowReading}</div>
              {/* the port's name steps in with each reading; the figures never hide */}
              <div
                key={tick}
                className="v-enter mt-0.5 font-display text-title font-bold leading-tight text-ink-900"
              >
                {latest.port}
              </div>
              <div className="font-mono text-label text-ink-500">
                {latest.state} · {latest.at} IST
              </div>
            </div>
            {[
              { k: t.wave, v: latest.wave },
              { k: t.wind, v: latest.wind },
              { k: t.sst, v: latest.sst },
              { k: t.vis, v: latest.vis },
            ].map((x) => (
              <div key={x.k} className="px-3 py-3">
                <div className="label truncate">{x.k}</div>
                <div className="mt-1 font-mono text-lead font-bold tabular-nums text-ink-900">{x.v}</div>
              </div>
            ))}
          </div>
        ) : (
          scanning && (
            <div
              role="status"
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-4"
              style={{ borderColor: "var(--rule-faint)" }}
            >
              <span className="text-body italic text-ink-700">{t.hailing}</span>
              <span className="flex min-w-0 flex-1 basis-[240px] gap-2" aria-hidden>
                <Draft h={26} />
                <Draft h={26} />
                <Draft h={26} />
                <Draft h={26} />
              </span>
            </div>
          )
        )}

        {/* the log: earlier readings only — the first tick shows its reading
            once, in the cells above, and the table starts at the second (S5) */}
        {rows.length > 1 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse font-mono text-label">
              <caption className="sr-only">{t.feedCaption}</caption>
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--rule)" }}>
                  {feedHeads.map((h, i) => (
                    <th key={h} scope="col" className={`${headClass} ${i === 0 ? "pl-4 pr-3" : "px-3"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              {/* each reading pushes in at the top on a short spring and the
                  log makes room; the newest is washed in teal for a moment */}
              <AnimatedList
                as="tbody"
                items={rows.slice(1)}
                itemKey={rowKey}
                itemProps={(r) => ({
                  className: `border-b transition-colors duration-700 last:border-0 ${
                    rowKey(r) === newestKey ? "bg-chart-100/70" : ""
                  }`,
                  style: { borderColor: "var(--rule-faint)" },
                  "data-newest": rowKey(r) === newestKey ? "" : undefined,
                })}
                renderItem={(r) => (
                  <>
                    <th scope="row" className="py-2 pl-4 pr-3 text-left font-sans font-bold text-ink-900">
                      {r.port}
                    </th>
                    <td className="px-3 py-2 tabular-nums text-ink-800">{r.wave}</td>
                    <td className="px-3 py-2 tabular-nums text-ink-800">{r.wind}</td>
                    <td className="px-3 py-2 tabular-nums text-ink-800">{r.sst}</td>
                    <td className="px-3 py-2 tabular-nums text-ink-800">{r.vis}</td>
                    <td className="px-3 py-2 font-sans text-ink-700">{sourceName(r.source)}</td>
                    <td className="px-3 py-2">
                      <span
                        className="border px-1.5 py-px text-label font-bold tracking-[0.08em] text-ink-800"
                        style={{ borderColor: r.mode === "LIVE" ? risk.low : risk.moderate }}
                      >
                        {r.mode}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-ink-700">{r.latency} ms</td>
                    <td className="px-3 py-2 tabular-nums text-ink-700">{r.at}</td>
                  </>
                )}
              />
            </table>
          </div>
        )}

        <p
          className="flex items-start gap-2 border-t px-4 py-2.5 text-label italic leading-relaxed text-ink-700"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          <FishGlyph size={16} className="swim mt-0.5 shrink-0 text-chart-500" />
          <span className="min-w-0">{t.feedNote}</span>
        </p>
      </section>

    </div>
  );
}
