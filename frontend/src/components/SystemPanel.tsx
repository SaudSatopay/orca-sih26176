import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import * as api from "../api";
import type { Language } from "../types";
import { CourseArrow, FishGlyph, LockGlyph, WarnGlyph } from "./glyphs";
import { Draft } from "./SheetStates";
import { ERRORS } from "../i18n/errors";
import { CREW_TEXT, L10N, PROVIDER_TEXT } from "../i18n/system";
import { PORTS } from "../ports";
import { chart, ink, risk } from "../tokens";
import { fill } from "./todayModel";
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

function fmt(m?: api.Measurement | null): string {
  if (!m || m.value == null) return "—";
  return `${m.value} ${m.unit}`;
}

/** Three signals riding a connector between two things in the pipeline. */
function Connector({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`v-connector ${className}`} style={style} aria-hidden>
      <i />
      <i />
      <i />
    </div>
  );
}

/** The crew's pipeline at desktop width: phase, gap, phase, gap… */
const CREW_COLUMNS = "minmax(0,1fr) 56px minmax(0,1.7fr) 56px minmax(0,1.2fr) 56px minmax(0,1fr)";

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
  const portIdx = useRef(0);

  // Cycle the coastline: one port per poll, newest reading on top.
  useEffect(() => {
    let alive = true;
    const read = async () => {
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
        setRows((r) => [row, ...r].slice(0, 6));
        setTick((n) => n + 1);
        setScanning(true);
      } catch {
        if (alive) setScanning(false);
      }
    };
    read();
    const timer = setInterval(read, POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const latest = rows[0];
  const sourceName = (id: string) => (id === "OPEN_METEO" ? "Open-Meteo" : t.demoStore);

  const pText = PROVIDER_TEXT[language] ?? PROVIDER_TEXT.en;
  const providers = [
    { name: "Open-Meteo Marine", color: risk.low, live: true, ...pText[0] },
    { name: "Open-Meteo Forecast", color: risk.low, live: true, ...pText[1] },
    { name: "INCOIS · IMD · MOSDAC", color: risk.moderate, live: false, ...pText[2] },
    { name: "OBIS · Map of Life", color: chart[600], live: false, ...pText[3] },
    { name: t.demoStore, color: ink[500], live: false, ...pText[4] },
  ];

  const crew = CREW_TEXT[language] ?? CREW_TEXT.en;
  const feedHeads = [t.hPort, t.wave, t.wind, t.sst, t.vis, t.hSource, t.hMode, t.hLatency, t.hAt];
  const headClass = "py-2 text-left text-micro font-bold uppercase tracking-[0.14em] text-ink-500";

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/* ---------------- intro ---------------- */}
      <section className="panel rule-double overflow-hidden">
        <div className="hd flex-wrap">
          <span className="label">{t.engineRoom}</span>
          <span className="font-mono text-label text-chart-700">{t.configNote}</span>
        </div>
        <div className="px-5 py-4">
          <h2 className="font-display text-headline font-bold leading-snug text-ink-900 [text-wrap:balance]">
            {t.title}
          </h2>
          <p className="mt-1.5 max-w-[78ch] text-body leading-relaxed text-ink-700">{t.intro}</p>
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
              className="min-w-0 flex-1 basis-[220px] rounded-[2px] border bg-paper-100 px-4 py-3"
              style={{ borderColor: "var(--rule)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`pulse-dot shrink-0 ${p.live ? "" : "pulse-dot--still"}`}
                  style={{ background: p.color, color: p.color }}
                  aria-hidden
                />
                <h4 className="min-w-0 font-display text-prose font-bold leading-tight text-ink-900">
                  {p.name}
                </h4>
              </div>
              {/* the dot and the rule carry the status colour; the words stay in ink */}
              <div
                className="mt-2 inline-block border px-1.5 py-px font-mono text-micro font-bold uppercase tracking-[0.12em] text-ink-800"
                style={{ borderColor: p.color }}
              >
                {p.status}
              </div>
              <p className="mt-2 text-readout leading-relaxed text-ink-700">{p.gives}</p>
              <p className="mt-1 text-label italic leading-snug text-ink-500">{p.note}</p>
            </div>
          ))}
        </div>

        {/* the flow into the cache: each connector spans the gap it joins */}
        <div className="flex flex-col items-center gap-1.5 px-4 pb-4 md:flex-row md:gap-3">
          <div className="shrink-0 text-center font-mono text-label uppercase tracking-[0.12em] text-ink-700 md:text-right">
            {t.oneFetch}
            <br />
            <span className="text-ink-500">{t.perProvider}</span>
          </div>
          <Connector className="hidden md:block" />
          <span className="v-connector-down !m-0 md:hidden" aria-hidden />
          <div className="min-w-0 rounded-[2px] border-2 border-chart-600 bg-chart-100/40 px-4 py-3 text-center md:max-w-[520px] md:flex-[3_1_0]">
            <h4 className="font-display text-lead font-bold text-ink-900">{t.cacheTitle}</h4>
            <p className="mt-1 text-readout leading-relaxed text-ink-700">{t.cacheBody}</p>
            <p className="mt-1.5 font-mono text-micro uppercase tracking-[0.1em] text-chart-700">
              {t.cacheMeta}
            </p>
          </div>
          <Connector className="hidden md:block" />
          <span className="v-connector-down !m-0 md:hidden" aria-hidden />
          <div className="shrink-0 text-center font-mono text-label uppercase tracking-[0.12em] text-ink-700 md:text-left">
            {t.everyAgent}
            <br />
            <span className="text-ink-500">{t.fromMemory}</span>
          </div>
        </div>

        <p
          className="border-t px-4 py-2.5 text-readout italic leading-relaxed text-ink-700"
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
            a grid whose middle row holds the agents and the connectors between
            them, so every signal runs chip to chip. */}
        <div
          className="flex flex-col px-4 py-4 lg:grid lg:gap-y-2"
          style={{ gridTemplateColumns: CREW_COLUMNS }}
        >
          {crew.map((c, i) => (
            <Fragment key={c.phase}>
              {i > 0 && (
                <>
                  <span className="v-connector-down lg:hidden" aria-hidden />
                  <Connector
                    className="mx-2 hidden self-center lg:block"
                    style={{ gridColumn: i * 2, gridRow: 2 }}
                  />
                </>
              )}
              <div
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                style={{ gridColumn: i * 2 + 1, gridRow: 1 }}
              >
                <h4 className="font-display text-subtitle font-bold text-ink-900">{c.phase}</h4>
                {c.agents.length > 2 && (
                  <span className="flex items-center gap-1.5 font-mono text-micro font-bold uppercase tracking-[0.08em] text-chart-700">
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
                {c.agents.map((a, j) => (
                  <li
                    key={a}
                    className="flex items-center gap-1.5 rounded-[2px] border bg-paper-100 px-2 py-1 font-mono text-label font-semibold text-ink-800"
                    style={{ borderColor: "var(--rule)" }}
                  >
                    <span
                      className="pulse-dot !h-[6px] !w-[6px]"
                      style={{ background: chart[500], color: chart[500], animationDelay: `${j * 0.3}s` }}
                      aria-hidden
                    />
                    {a}
                  </li>
                ))}
              </ul>
              <p
                className="mt-2 text-readout italic leading-snug text-ink-700 lg:mt-0"
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
          <span className="stamp text-small text-risk-extreme">{t.stamp}</span>
          <ul className="min-w-0 space-y-1 font-mono text-readout text-ink-800">
            <li>{t.law1}</li>
            <li>{t.law2}</li>
            <li>{t.law3}</li>
          </ul>
          <p className="min-w-0 max-w-[44ch] flex-1 basis-[260px] text-readout italic leading-relaxed text-ink-800">
            <LockGlyph size={12} className="mr-1 inline text-risk-extreme" />
            {t.lawNote}
          </p>
        </div>
      </section>

      {/* ---------------- the live feed ---------------- */}
      <section className="panel rule-double overflow-hidden">
        <div className="hd flex-wrap">
          <h3 className="label flex items-center gap-2.5">
            <span
              className={`pulse-dot ${scanning ? "" : "pulse-dot--still"}`}
              style={{
                background: scanning ? risk.low : risk.extreme,
                color: scanning ? risk.low : risk.extreme,
              }}
              aria-hidden
            />
            {t.reading}
          </h3>
          <span className="font-mono text-label tabular-nums text-ink-500">
            {t.onePort} {POLL_MS / 1000} s · {mode} {t.flipNote}
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
              {latest ? err.offlineBody : t.unreachable}
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
                className="v-enter mt-0.5 font-display text-heading font-bold leading-tight text-ink-900"
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
                <div className="mt-1 font-mono text-subtitle font-bold tabular-nums text-ink-900">{x.v}</div>
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

        {/* the log */}
        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse font-mono text-readout">
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
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={`${r.port}-${r.at}`}
                    className={`border-b last:border-0 ${i === 0 ? "v-row-enter bg-chart-100/40" : ""}`}
                    style={{ borderColor: "var(--rule-faint)" }}
                  >
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
                        className="border px-1.5 py-px text-micro font-bold tracking-[0.08em] text-ink-800"
                        style={{ borderColor: r.mode === "LIVE" ? risk.low : risk.moderate }}
                      >
                        {r.mode}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-ink-700">{r.latency} ms</td>
                    <td className="px-3 py-2 tabular-nums text-ink-700">{r.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p
          className="flex items-start gap-2 border-t px-4 py-2.5 text-readout italic leading-relaxed text-ink-700"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          <FishGlyph size={16} className="swim mt-0.5 shrink-0 text-chart-500" />
          <span className="min-w-0">{t.feedNote}</span>
        </p>
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
                <h4 className="font-display text-subtitle font-bold text-ink-900">{x.h}</h4>
              </div>
              <p className="mt-1.5 text-small leading-relaxed text-ink-700">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
