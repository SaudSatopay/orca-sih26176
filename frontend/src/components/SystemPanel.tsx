import { Fragment, useEffect, useRef, useState } from "react";
import * as api from "../api";
import type { Language } from "../types";
import { CourseArrow, FishGlyph, LockGlyph, WarnGlyph } from "./glyphs";
import { CREW_TEXT, L10N, PROVIDER_TEXT } from "../i18n/system";
import { PORTS } from "../ports";
import { chart, ink, risk } from "../tokens";

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

export default function SystemPanel({
  mode,
  language = "en",
}: {
  mode: string;
  language?: Language;
}) {
  const t = L10N[language] ?? L10N.en;
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
          source: f.ocean.source === "OPEN_METEO" ? "Open-Meteo" : "Demo store",
          latency: (f.ocean.latency_ms ?? 0) + (f.weather.latency_ms ?? 0),
          wave: fmt(f.ocean.measurements?.wave_height),
          wind: fmt(f.weather.measurements?.wind_speed),
          sst: fmt(f.ocean.measurements?.sst),
          vis: fmt(f.weather.measurements?.visibility),
          at: new Date().toLocaleTimeString("en-IN", { hour12: false }),
        };
        setRows((r) => [row, ...r].slice(0, 6));
        setTick((t) => t + 1);
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

  const pText = PROVIDER_TEXT[language] ?? PROVIDER_TEXT.en;

  const providers = [
    { name: "Open-Meteo Marine", status: "LIVE", color: risk.low, live: true, ...pText[0] },
    { name: "Open-Meteo Forecast", status: "LIVE", color: risk.low, live: true, ...pText[1] },
    { name: "INCOIS · IMD · MOSDAC", status: "INTERFACE READY", color: risk.moderate, live: false, ...pText[2] },
    { name: "OBIS · Map of Life", status: "BUNDLED SNAPSHOT", color: chart[600], live: false, ...pText[3] },
    { name: "Demo store", status: "ALWAYS ON", color: ink[500], live: false, ...pText[4] },
  ];

  const crew = CREW_TEXT[language] ?? CREW_TEXT.en;

  return (
    <div className="space-y-4">
      {/* ---------------- intro ---------------- */}
      <div className="panel rule-double overflow-hidden">
        <div className="hd">
          <span className="label">{t.engineRoom}</span>
          <span className="hidden font-mono text-[10px] text-chart-600 sm:block">
            {t.configNote}
          </span>
        </div>
        <div className="px-5 py-4">
          <h2 className="font-display text-[24px] font-bold leading-snug text-ink-900">
            {t.title}
          </h2>
          <p className="mt-1.5 max-w-[860px] text-[13.5px] leading-relaxed text-ink-500">
            {t.intro}
          </p>
        </div>
      </div>

      {/* ---------------- the data intake ---------------- */}
      <div className="panel overflow-hidden">
        <div className="hd">
          <span className="label">{t.s1}</span>
        </div>
        <div className="grid gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-5">
          {providers.map((p) => (
            <div
              key={p.name}
              className="lift rounded-[2px] border bg-paper-100 px-3.5 py-3"
              style={{ borderColor: "var(--rule)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`pulse-dot ${p.live ? "" : "pulse-dot--still"}`}
                  style={{ background: p.color, color: p.color }}
                />
                <span className="font-display text-[14px] font-bold text-ink-900">{p.name}</span>
              </div>
              <div
                className="mt-1.5 inline-block border px-1.5 py-px font-mono text-[8.5px] font-bold tracking-[0.14em]"
                style={{ color: p.color, borderColor: p.color }}
              >
                {p.status}
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink-700">{p.gives}</p>
              <p className="mt-1 text-[10.5px] italic leading-snug text-ink-400">{p.note}</p>
            </div>
          ))}
        </div>

        {/* the flow into the cache */}
        <div className="grid items-center gap-2 px-4 pb-4 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
          <div className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
            {t.oneFetch}
            <br />
            <span className="text-ink-400">{t.perProvider}</span>
          </div>
          <div className="signal-line hidden w-24 lg:block">
            <i />
            <i />
            <i />
          </div>
          <div
            className="rounded-[2px] border-2 border-chart-600 bg-chart-100/40 px-4 py-3 text-center"
          >
            <div className="font-display text-[15px] font-bold text-ink-900">
              {t.cacheTitle}
            </div>
            <p className="mt-1 text-[11.5px] leading-relaxed text-ink-700">{t.cacheBody}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-chart-700">
              {t.cacheMeta}
            </p>
          </div>
          <div className="signal-line hidden w-24 lg:block">
            <i />
            <i />
            <i />
          </div>
          <div className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
            {t.everyAgent}
            <br />
            <span className="text-ink-400">{t.fromMemory}</span>
          </div>
        </div>

        <p
          className="border-t px-4 py-2.5 text-[11px] italic leading-relaxed text-ink-500"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          {t.degrade}
        </p>
      </div>

      {/* ---------------- the crew ---------------- */}
      <div className="panel overflow-hidden">
        <div className="hd">
          <span className="label">{t.s2}</span>
          <span className="font-mono text-[10px] text-ink-400">{t.s2note}</span>
        </div>
        <div className="grid gap-0 px-4 py-4 lg:grid-cols-[1fr_auto_1.6fr_auto_1.2fr_auto_1fr]">
          {crew.map((c, i) => (
            <Fragment key={c.phase}>
              {i > 0 && (
                <div className="signal-line mx-1 hidden w-14 self-center lg:block">
                  <i />
                  <i />
                  <i />
                </div>
              )}
              <div className="py-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[16px] font-bold text-ink-900">{c.phase}</span>
                  {c.agents.length > 1 && i === 1 && (
                    <span className="font-mono text-[9px] font-bold text-chart-700">
                      ∥ {c.agents.length} CONCURRENT
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.agents.map((a, j) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 rounded-[2px] border bg-paper-100 px-2 py-1 font-mono text-[10px] font-semibold text-ink-800"
                      style={{ borderColor: "var(--rule)" }}
                    >
                      <span
                        className="pulse-dot !h-[6px] !w-[6px]"
                        style={{
                          background: chart[500],
                          color: chart[500],
                          animationDelay: `${j * 0.3}s`,
                        }}
                      />
                      {a}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[11px] italic leading-snug text-ink-500">{c.note}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* ---------------- the safety law ---------------- */}
      <div className="panel hatch-danger overflow-hidden border-risk-extreme/50">
        <div className="hd border-risk-extreme/25">
          <span className="label flex items-center gap-2 !text-risk-extreme">
            <WarnGlyph size={13} /> {t.s3}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
          <span className="stamp text-[12px] text-risk-extreme">{t.stamp}</span>
          <div className="space-y-1 font-mono text-[11px] text-ink-800">
            <div>{t.law1}</div>
            <div>{t.law2}</div>
            <div>{t.law3}</div>
          </div>
          <p className="max-w-[380px] text-[11.5px] italic leading-relaxed text-ink-600">
            <LockGlyph size={12} className="mr-1 inline text-risk-extreme" />
            {t.lawNote}
          </p>
        </div>
      </div>

      {/* ---------------- the live feed ---------------- */}
      <div className="panel rule-double overflow-hidden">
        <div className="hd">
          <span className="label flex items-center gap-2">
            <span
              className={`pulse-dot ${scanning ? "" : "pulse-dot--still"}`}
              style={{ background: scanning ? risk.low : risk.extreme, color: scanning ? risk.low : risk.extreme }}
            />
            {t.reading}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-ink-400">
            {t.onePort} {POLL_MS / 1000} s · {mode} {t.flipNote}
          </span>
        </div>

        {latest ? (
          <div key={tick} className="popin grid grid-cols-2 gap-0 border-b sm:grid-cols-6" style={{ borderColor: "var(--rule-faint)" }}>
            <div className="col-span-2 px-4 py-3">
              <div className="label !text-[9px]">{t.nowReading}</div>
              <div className="font-display text-[19px] font-bold leading-tight text-ink-900">
                {latest.port}
              </div>
              <div className="font-mono text-[10px] text-ink-400">
                {latest.state} · {latest.at} IST
              </div>
            </div>
            {[
              { k: t.wave, v: latest.wave },
              { k: t.wind, v: latest.wind },
              { k: t.sst, v: latest.sst },
              { k: t.vis, v: latest.vis },
            ].map((x) => (
              <div key={x.k} className="border-l px-3 py-3" style={{ borderColor: "var(--rule-faint)" }}>
                <div className="label truncate !text-[9px]">{x.k}</div>
                <div className="mt-1 font-mono text-[16px] font-bold tabular-nums text-ink-900">
                  {x.v}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-b px-4 py-4 text-[13px] italic text-ink-400" style={{ borderColor: "var(--rule-faint)" }}>
            {scanning ? t.hailing : t.unreachable}
          </div>
        )}

        {/* the log */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--rule)" }}>
                {[t.hPort, t.wave, t.wind, "SST", t.vis, t.hSource, t.hMode, t.hLatency, t.hAt].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`py-2 text-[8.5px] font-bold uppercase tracking-[0.14em] text-ink-400 ${
                        i === 0 ? "pl-4 pr-3" : "px-3"
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={`${r.port}-${r.at}`}
                  className={`border-b last:border-0 ${i === 0 ? "popin bg-chart-100/40" : ""}`}
                  style={{ borderColor: "var(--rule-faint)", opacity: 1 - i * 0.1 }}
                >
                  <td className="py-2 pl-4 pr-3 font-sans font-bold text-ink-900">{r.port}</td>
                  <td className="px-3 py-2 tabular-nums text-ink-800">{r.wave}</td>
                  <td className="px-3 py-2 tabular-nums text-ink-800">{r.wind}</td>
                  <td className="px-3 py-2 tabular-nums text-ink-800">{r.sst}</td>
                  <td className="px-3 py-2 tabular-nums text-ink-800">{r.vis}</td>
                  <td className="px-3 py-2 text-ink-500">{r.source}</td>
                  <td className="px-3 py-2">
                    <span
                      className="border px-1.5 py-px text-[8.5px] font-bold tracking-wider"
                      style={{
                        color: r.mode === "LIVE" ? risk.low : risk.moderate,
                        borderColor: r.mode === "LIVE" ? risk.low : risk.moderate,
                      }}
                    >
                      {r.mode}
                    </span>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-ink-500">{r.latency} ms</td>
                  <td className="px-3 py-2 tabular-nums text-ink-400">{r.at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className="flex items-center gap-2 border-t px-4 py-2.5 text-[11px] italic leading-relaxed text-ink-500"
          style={{ borderColor: "var(--rule-faint)" }}
        >
          <FishGlyph size={16} className="swim shrink-0 text-chart-500" />
          {t.feedNote}
        </p>
      </div>

      {/* ---------------- where it goes ---------------- */}
      <div className="panel overflow-hidden">
        <div className="hd">
          <span className="label">{t.s4}</span>
        </div>
        <div className="grid gap-0 sm:grid-cols-3">
          {[
            { h: t.outVerdict, d: t.outVerdictD },
            { h: t.outPlan, d: t.outPlanD },
            { h: t.outLedger, d: t.outLedgerD },
          ].map((x, i) => (
            <div
              key={x.h}
              className={`group px-5 py-4 transition-colors hover:bg-chart-100/40 ${i > 0 ? "sm:border-l" : ""}`}
              style={{ borderColor: "var(--rule-faint)" }}
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-[16px] font-bold text-ink-900">{x.h}</span>
                <CourseArrow
                  size={12}
                  className="text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-chart-600"
                />
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-600">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
