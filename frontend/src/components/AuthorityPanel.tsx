import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import * as api from "../api";
import { useFirstSight } from "../firstSight";
import type { AuthorityDashboard, AuthorityRow, Language, RiskCategory } from "../types";
import { RISK_BANDS, RISK_COLOR, RISK_INK } from "../risk";
import { dec1, int } from "../format";
import { PORTS } from "../ports";
import { BAND, T } from "../i18n/authority";
import { WarnGlyph } from "./glyphs";
import { DownloadGlyph, SortGlyph } from "./viewGlyphs";
import { Draft, DraftSheet, OfflineNotice } from "./SheetStates";
import {
  DEFAULT_SORT,
  ariaSort,
  bandCounts,
  boardChanges,
  coastOrder,
  nextSort,
  sortRows,
  type ScoreChange,
  type Sort,
  type SortKey,
} from "./authorityBoard";
import { fill, panelState } from "./todayModel";
import "./views.css";

const REFRESH_MS = 30_000;
/** Band edges ruled on every meter and on the coast profile. */
const EDGES = RISK_BANDS.slice(0, -1).map((b) => b.max);
const BANDS_WORST_FIRST: RiskCategory[] = ["EXTREME", "HIGH", "MODERATE", "LOW"];

type Strings = Record<string, string>;

/** The board as a CSV file — the format an administration actually circulates. */
function exportCsv(data: AuthorityDashboard) {
  const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["Landing centre", "State", "Risk score", "Category", "Official warning",
     "Wave (m)", "Wind (km/h)", "Active warning"].join(","),
    ...data.locations.map((r) =>
      [q(r.name), q(r.state), r.risk_score, r.risk_category,
       r.official_warning ? "YES" : "", r.wave_height_m ?? "",
       r.wind_speed_kmh ?? "", q(r.headline)].join(","),
    ),
    "",
    q(`Generated ${data.generated_at} IST by ORCA (SIH26176). Demo / simulated data is labelled — this sheet is decision support, not an official advisory.`),
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([rows], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `orca-coastal-risk-board-${data.generated_at.slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface Board {
  data: AuthorityDashboard | null;
  /** Score moves against the reading before this one; null on the first. */
  changes: ScoreChange[] | null;
  error: boolean;
}

/**
 * The district-administration view: every monitored landing centre, scored by
 * the same engine and the same evidence the fisher sees. Summary first, then
 * the coast as a profile, then the table an officer can order and export.
 */
export default function AuthorityPanel({ language = "en" }: { language?: Language }) {
  const t = T[language] ?? T.en;
  const [board, setBoard] = useState<Board>({ data: null, changes: null, error: false });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);
  const alive = useRef(true);

  const read = useCallback(
    () =>
      api
        .authority(language)
        .then((d) => {
          if (!alive.current) return;
          setBoard((prev) => ({
            data: d,
            changes: prev.data ? boardChanges(prev.data.locations, d.locations) : null,
            error: false,
          }));
        })
        .catch(() => {
          // Keep the last reading on screen; only the notice changes.
          if (alive.current) setBoard((prev) => ({ ...prev, error: true }));
        })
        .finally(() => {
          if (alive.current) setLoading(false);
        }),
    // A new language re-reads the board: its warning headlines are translated.
    [language],
  );
  /** A reading asked for by the clock or by the officer: mark it in flight. */
  const load = useCallback(() => {
    setLoading(true);
    return read();
  }, [read]);

  useEffect(() => {
    alive.current = true;
    read(); // the first reading; `loading` starts true
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      alive.current = false;
      window.clearInterval(timer);
    };
  }, [read, load]);

  const { data, changes, error } = board;
  const state = panelState({ hasData: data != null, loading, error });

  if (!data) {
    if (state === "error")
      // A failed first reading keeps the board's frame: the officer still sees
      // which centres are watched, with em-dash readings (AU3).
      return (
        <div className="flex min-w-0 flex-col gap-4">
          <OfflineNotice language={language} body={t.noReading} onRetry={load} busy={loading} />
          <EmptyBoard t={t} />
        </div>
      );
    return <BoardDraft t={t} />;
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {state === "stale" && <OfflineNotice language={language} onRetry={load} busy={loading} />}
      <Summary data={data} language={language} t={t} />
      {data.locations.length > 0 && <CoastProfile rows={data.locations} language={language} t={t} />}
      <BoardTable
        data={data}
        changes={changes}
        stale={state === "stale"}
        sort={sort}
        onSort={(key) => setSort((s) => nextSort(s, key))}
        language={language}
        t={t}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- summary */

function Summary({ data, language, t }: { data: AuthorityDashboard; language: Language; t: Strings }) {
  const band = BAND[language] ?? BAND.en;
  const counts = bandCounts(data.locations);
  const total = data.locations.length;
  const warnings = data.summary.official_warnings ?? data.locations.filter((r) => r.official_warning).length;

  // The risk tiles name their centres instead of repeating the legend's
  // counts: "Paradip · 92" says where the trouble is (AU1).
  const named = (c: RiskCategory) => data.locations.filter((r) => r.risk_category === c);
  const tiles = [
    { key: "extreme", label: t.extreme, c: "EXTREME" as RiskCategory, rows: named("EXTREME"), hatch: true },
    { key: "high", label: t.high, c: "HIGH" as RiskCategory, rows: named("HIGH"), hatch: false },
  ];

  return (
    <div className="panel v-cells grid-cols-2 md:grid-cols-[1.7fr_1fr_1fr_1fr]">
      <div className="col-span-2 px-5 py-4 md:col-span-1">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <div>
            <div className="lining font-display text-display font-black leading-none text-ink-900">
              {data.summary.monitored ?? total}
            </div>
            <div className="label mt-1.5">{t.centres}</div>
          </div>
          {total > 0 && (
            <div className="min-w-0 flex-1 basis-[190px] pb-0.5">
              {/* how the coast divides across the four bands */}
              <div className="flex h-2 gap-0.5" aria-hidden>
                {BANDS_WORST_FIRST.filter((c) => counts[c] > 0).map((c) => (
                  <span key={c} style={{ flexGrow: counts[c], flexBasis: 0, background: RISK_COLOR[c] }} />
                ))}
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1">
                {BANDS_WORST_FIRST.map((c) => (
                  <li key={c} className="flex items-center gap-1.5 font-mono text-label text-ink-700">
                    <span
                      className="h-2 w-2 shrink-0"
                      style={{ background: counts[c] > 0 ? RISK_COLOR[c] : "var(--rule)" }}
                      aria-hidden
                    />
                    <span className="font-bold tabular-nums text-ink-900">{counts[c]}</span> {band[c]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {tiles.map((x) => (
        <div key={x.key} className={`px-5 py-4 ${x.rows.length > 0 && x.hatch ? "hatch-danger" : ""}`}>
          {x.rows.length > 0 ? (
            <ul className="space-y-1">
              {x.rows.map((r) => (
                <li key={r.name} className="font-display text-title font-bold leading-tight text-ink-900">
                  {r.name}{" "}
                  <span className="lining whitespace-nowrap" style={{ color: RISK_INK[x.c] }}>
                    · {r.risk_score}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="font-mono text-body text-ink-400">{t.none}</div>
          )}
          <div className="label mt-1.5">{x.label}</div>
        </div>
      ))}

      {/* official warnings keep their count and mark */}
      <div className="px-5 py-4">
        <div
          className={`lining flex items-center gap-2 font-display text-display font-black leading-none ${
            warnings > 0 ? "text-risk-extreme" : "text-ink-400"
          }`}
        >
          {warnings}
          {warnings > 0 && <WarnGlyph size={20} className="shrink-0" />}
        </div>
        <div className="label mt-1.5">{t.warnings}</div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- coast profile */

/**
 * The same ten scores as the table, placed in coastal order and plotted
 * upward on the table's 0–100 scale. A storm reads as a run of tall marks on
 * one stretch of coast, which a ranked table cannot show.
 */
function CoastProfile({ rows, language, t }: { rows: AuthorityRow[]; language: Language; t: Strings }) {
  const titleId = useId();
  const band = BAND[language] ?? BAND.en;
  const groups = useMemo(() => coastOrder(rows), [rows]);
  const stations = groups.flatMap((g) => g.rows);
  const stretchName: Record<string, string> = { west: t.west, east: t.east, islands: t.islands };
  const offset = groups.map((_, i) => groups.slice(0, i).reduce((n, g) => n + g.rows.length, 0));
  // Constant key on purpose: the board refetches every 30 s, and a refreshed
  // profile is not the news — the stems rise once per page load.
  const fresh = useFirstSight("authority:coast");

  return (
    <section className="panel overflow-hidden" aria-labelledby={titleId} data-fresh={fresh ? "" : undefined}>
      <div className="hd flex-wrap">
        <h2 id={titleId} className="label">
          {t.coast}
        </h2>
        <span className="font-mono text-label text-ink-500">{t.coastNote}</span>
      </div>

      {/* the figure, for eyes */}
      <div className="overflow-x-auto px-4 pb-3 pt-2" aria-hidden>
        <div
          className="grid min-w-[640px]"
          style={{ gridTemplateColumns: `repeat(${stations.length}, minmax(0, 1fr))` }}
        >
          <div
            className="relative row-start-1 mt-8 h-[124px] border-b"
            style={{ gridColumn: "1 / -1", borderColor: "var(--rule-strong)" }}
          >
            {[...EDGES, 100].map((v) => (
              <span key={v} className="v-coast-grid" style={{ bottom: `${v}%` }} />
            ))}
            {/* the scale names the bands, not their bare edges (AU4) */}
            {RISK_BANDS.map((b) => (
              <span
                key={b.category}
                className="absolute right-1 z-[1] font-mono text-label uppercase tracking-[0.12em] text-ink-400"
                style={{ bottom: `${(b.from + b.max) / 2}%`, transform: "translateY(50%)" }}
              >
                {band[b.category]}
              </span>
            ))}
          </div>

          {stations.map((r, i) => (
            <div
              key={r.name}
              className="v-coast-station row-start-1 mt-8 h-[124px]"
              style={{ gridColumn: i + 1 }}
              title={`${r.name}: ${fill(t.of100, { score: r.risk_score, band: band[r.risk_category] })}`}
            >
              <span className="v-coast-stem" style={{ height: `${r.risk_score}%` }} />
              <span
                className="v-coast-dot"
                style={{ bottom: `${r.risk_score}%`, background: RISK_COLOR[r.risk_category] }}
              />
              <span className="v-coast-score" style={{ bottom: `${r.risk_score}%` }}>
                {r.official_warning && (
                  <WarnGlyph size={11} className="mr-1 inline -translate-y-px text-risk-extreme" />
                )}
                {r.risk_score}
              </span>
            </div>
          ))}

          {stations.map((r, i) => (
            <div
              key={r.name}
              className="row-start-2 px-1 pt-2 text-center text-label font-semibold leading-tight text-ink-800"
              style={{ gridColumn: i + 1 }}
            >
              {r.name}
            </div>
          ))}

          {groups.map((g, i) => (
            <div
              key={g.stretch}
              className="row-start-3 mx-1.5 mt-2 truncate border-t pt-1.5 text-center font-mono text-label uppercase tracking-[0.12em] text-ink-500"
              style={{
                gridColumn: `${offset[i] + 1} / span ${g.rows.length}`,
                borderColor: "var(--rule-strong)",
              }}
            >
              {stretchName[g.stretch]}
            </div>
          ))}
        </div>
      </div>

      {/* the same figure, in words */}
      <div className="sr-only">
        {groups.map((g) => (
          <div key={g.stretch}>
            <h3>{stretchName[g.stretch]}</h3>
            <ol>
              {g.rows.map((r) => (
                <li key={r.name}>
                  {r.name}: {fill(t.of100, { score: r.risk_score, band: band[r.risk_category] })}
                  {r.official_warning ? `, ${t.warned}` : ""}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- table */

const HEAD = "py-2.5 font-mono text-label font-bold uppercase tracking-[0.14em] text-ink-500";

/** A column head that orders the board: a real button inside a real `<th>`. */
function SortHead({
  k,
  sort,
  onSort,
  sortBy,
  children,
  align = "left",
  className = "",
}: {
  k: SortKey;
  sort: Sort;
  onSort: (key: SortKey) => void;
  /** "Sort by {col}" */
  sortBy: string;
  children: string;
  align?: "left" | "right";
  className?: string;
}) {
  const active = sort.key === k;
  return (
    <th
      scope="col"
      aria-sort={ariaSort(sort, k)}
      className={`${HEAD} ${align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className="v-sort"
        data-active={active}
        data-dir={active ? sort.dir : undefined}
        title={fill(sortBy, { col: children })}
      >
        {children}
        <SortGlyph className="v-sort-mark" />
      </button>
    </th>
  );
}

function BoardTable({
  data,
  changes,
  stale,
  sort,
  onSort,
  language,
  t,
}: {
  data: AuthorityDashboard;
  changes: ScoreChange[] | null;
  /** The newest refresh failed: this is the last reading, not a live one. */
  stale: boolean;
  sort: Sort;
  onSort: (key: SortKey) => void;
  language: Language;
  t: Strings;
}) {
  const titleId = useId();
  const band = BAND[language] ?? BAND.en;
  const rows = useMemo(() => sortRows(data.locations, sort), [data.locations, sort]);
  const time = data.generated_at.slice(11, 19);

  const head = { sort, onSort, sortBy: t.sortBy };
  const plainHead = `${HEAD} text-left`;
  // Constant key on purpose: a sort or a 30 s refresh must not redraw the
  // meters on the rows React moves — the officer asked for an order, not a show.
  const fresh = useFirstSight("authority:board");

  return (
    <section className="panel rule-double overflow-hidden" aria-labelledby={titleId} data-fresh={fresh ? "" : undefined}>
      <div className="hd flex-wrap">
        <h2 id={titleId} className="label">
          {t.board}
        </h2>
        <span className="flex items-center gap-2 font-mono text-label tabular-nums text-ink-500">
          <span
            className={`pulse-dot ${stale ? "pulse-dot--still text-risk-extreme" : "text-risk-low"}`}
            style={{ background: "currentColor" }}
            aria-hidden
          />
          <span className="ml-1">
            {fill(t.updated, { time })} · {t.refresh}
          </span>
        </span>
      </div>
      {/* the 30 seconds running out; restarts with each reading */}
      <div className="h-[2px] bg-chart-100" aria-hidden>
        <span
          key={data.generated_at}
          className="v-countdown"
          style={{ animationDuration: `${REFRESH_MS}ms` }}
        />
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-6">
          <p className="font-display text-lead font-bold leading-snug text-ink-900">{t.emptyTitle}</p>
          <p className="mt-1 max-w-[56ch] text-body leading-relaxed text-ink-700">{t.emptyBody}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Below lg the warning column folds into the centre cell, so the
              column an officer needs is never cut by the panel edge (AU2). */}
          <table className="w-full min-w-[640px] border-collapse text-body lg:min-w-[900px]">
            <caption className="sr-only">{t.caption}</caption>
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--rule-strong)" }}>
                <SortHead k="name" {...head} className="pl-4 pr-3">
                  {t.hCentre}
                </SortHead>
                <th scope="col" className={`${plainHead} px-3`}>
                  {t.hState}
                </th>
                <SortHead k="risk" {...head} className="px-3">
                  {t.hRisk}
                </SortHead>
                <SortHead k="wave" {...head} align="right" className="px-3">
                  {t.hWave}
                </SortHead>
                <SortHead k="wind" {...head} align="right" className="px-3">
                  {t.hWind}
                </SortHead>
                <th scope="col" className={`${plainHead} hidden pl-5 pr-4 lg:table-cell`}>
                  {t.hWarning}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const color = RISK_COLOR[row.risk_category];
                return (
                  <tr
                    key={row.name}
                    className={`v-row border-b last:border-0 ${row.official_warning ? "v-row-warned" : ""}`}
                    style={{ borderColor: "var(--rule-faint)" }}
                  >
                    <th scope="row" className="py-2.5 pl-4 pr-3 text-left font-normal">
                      <span className="flex items-center gap-2">
                        {/* the signal mark at the row's edge: a warning is in force */}
                        <span className="grid w-[15px] shrink-0 place-items-center">
                          {row.official_warning && <WarnGlyph size={15} className="text-risk-extreme" />}
                        </span>
                        <span className="font-display text-body font-bold text-ink-900">{row.name}</span>
                      </span>
                      {/* below lg the active warning rides the centre cell (AU2) */}
                      {row.official_warning && row.headline && (
                        <span className="mt-1 block max-w-[32ch] pl-6 text-label font-medium leading-snug text-ink-800 lg:hidden">
                          {row.headline}
                        </span>
                      )}
                    </th>
                    <td className="px-3 py-2.5 text-ink-700">{row.state}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-[2ch] shrink-0 text-right font-mono text-body font-bold tabular-nums text-ink-900">
                          {row.risk_score}
                        </span>
                        <span className="v-meter w-[104px] shrink-0" aria-hidden>
                          <span
                            className="v-meter-fill"
                            style={{ width: `${Math.max(0, Math.min(100, row.risk_score))}%`, background: color }}
                          />
                          {EDGES.map((v) => (
                            <span key={v} className="v-meter-tick" style={{ left: `${v}%` }} />
                          ))}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-label font-bold uppercase tracking-[0.06em] text-ink-800">
                          <span className="h-2 w-2 shrink-0" style={{ background: color }} aria-hidden />
                          {band[row.risk_category]}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono tabular-nums text-ink-900">
                      {row.wave_height_m != null ? dec1(row.wave_height_m) : "—"}
                      <span className="ml-1 text-ink-500">m</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono tabular-nums text-ink-900">
                      {row.wind_speed_kmh != null ? int(row.wind_speed_kmh) : "—"}
                      <span className="ml-1 text-ink-500">km/h</span>
                    </td>
                    <td className="hidden min-w-[260px] py-2.5 pl-5 pr-4 lg:table-cell">
                      {row.headline ? (
                        <span className="flex items-start gap-2">
                          {row.official_warning && (
                            <span className="mt-px shrink-0 border border-risk-extreme bg-paper-50 px-1.5 py-px font-mono text-label font-bold uppercase tracking-[0.1em] text-risk-extreme">
                              {t.official}
                            </span>
                          )}
                          <span className="min-w-0 font-medium leading-snug text-ink-900">{row.headline}</span>
                        </span>
                      ) : (
                        <span className="text-ink-500" role="img" aria-label={t.noWarning}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* what moved since the last reading, and the sheet to circulate */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-4 py-2.5"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        <p role="status" className="min-w-0 flex-1 basis-[260px] text-label leading-relaxed text-ink-700">
          {rows.length === 0 ? null : changes == null ? (
            t.changesFirst
          ) : changes.length === 0 ? (
            t.changesNone
          ) : (
            <>
              <span className="font-semibold text-ink-900">{t.changes}</span>{" "}
              {changes.map((c, i) => (
                <span key={c.name} className="whitespace-nowrap">
                  {i > 0 && ", "}
                  {c.name}{" "}
                  <span className="font-mono tabular-nums">
                    {c.from} → {c.to}
                  </span>
                </span>
              ))}
            </>
          )}
        </p>
        {rows.length > 0 && (
          <button
            type="button"
            onClick={() => exportCsv(data)}
            className="btn-line shrink-0 !px-2.5 !py-1.5 !text-label"
            title={t.exportTitle}
          >
            <DownloadGlyph />
            {t.export}
          </button>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- draft */

/**
 * The board's frame when the first reading failed: column heads and the ten
 * centres ORCA watches, with em-dash readings, under the error notice (AU3).
 */
function EmptyBoard({ t }: { t: Strings }) {
  const heads = [t.hCentre, t.hState, t.hRisk, t.hWave, t.hWind, t.hWarning];
  return (
    <section className="panel rule-double overflow-hidden">
      <div className="hd">
        <span className="label">{t.board}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-body">
          <caption className="sr-only">{t.caption}</caption>
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--rule-strong)" }}>
              {heads.map((h, i) => (
                <th key={h} scope="col" className={`${HEAD} text-left ${i === 0 ? "pl-4 pr-3" : "px-3"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PORTS.map((p) => (
              <tr key={p.name} className="border-b last:border-0" style={{ borderColor: "var(--rule-faint)" }}>
                <th scope="row" className="py-2.5 pl-4 pr-3 text-left font-display text-body font-bold text-ink-900">
                  {p.name}
                </th>
                <td className="px-3 py-2.5 text-ink-700">{p.state}</td>
                {[0, 1, 2, 3].map((i) => (
                  <td key={i} className="px-3 py-2.5 font-mono text-ink-500">
                    —
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BoardDraft({ t }: { t: Strings }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <DraftSheet label={t.board} status={t.loading} className="rule-double">
        <div className="grid grid-cols-2 gap-3 px-4 py-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Draft key={i} h={56} />
          ))}
        </div>
        <div className="space-y-2.5 px-4 pb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Draft w="18%" h={13} />
              <Draft w="12%" h={13} />
              <Draft w="22%" h={13} />
              <Draft w="8%" h={13} />
              <Draft w="8%" h={13} />
              <Draft w="24%" h={13} className="ml-auto" />
            </div>
          ))}
        </div>
      </DraftSheet>
    </div>
  );
}
