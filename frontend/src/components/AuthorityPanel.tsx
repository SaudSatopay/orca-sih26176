import { useEffect, useState } from "react";
import * as api from "../api";
import type { AuthorityDashboard } from "../types";
import { RISK_COLOR } from "./RiskDial";

/**
 * The district-administration view: every monitored landing centre, ranked by
 * risk. Same engine, same evidence — one screen that shows ORCA scales beyond
 * a single fisher to the people who issue the warnings.
 */
export default function AuthorityPanel() {
  const [data, setData] = useState<AuthorityDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .authority()
        .then((d) => alive && setData(d))
        .catch((e) => alive && setError(String(e)));
    load();
    const timer = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  if (error)
    return <div className="panel p-6 text-sm text-risk-extreme">Failed to load: {error}</div>;
  if (!data) return <div className="panel p-6 text-sm italic text-ink-400">Loading coastline…</div>;

  const tiles = [
    { key: "monitored", label: "Landing centres", color: "#1E5F7A" },
    { key: "extreme", label: "Extreme risk", color: RISK_COLOR.EXTREME },
    { key: "high", label: "High risk", color: RISK_COLOR.HIGH },
    { key: "official_warnings", label: "Official warnings", color: "#A17000" },
  ];

  return (
    <div className="space-y-4">
      <div className="panel grid grid-cols-2 sm:grid-cols-4">
        {tiles.map((t, i) => (
          <div
            key={t.key}
            className={`px-5 py-4 ${i > 0 ? "border-l" : ""}`}
            style={{ borderColor: "var(--rule-faint)" }}
          >
            <div
              className="font-display text-[34px] font-black leading-none tabular-nums"
              style={{ color: t.color }}
            >
              {data.summary[t.key] ?? 0}
            </div>
            <div className="label mt-1.5">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="panel rule-double overflow-hidden">
        <div className="hd">
          <span className="label">Coastal risk board</span>
          <span className="font-mono text-[10px] tabular-nums text-ink-400">
            {data.generated_at.slice(0, 16).replace("T", " ")} IST · refreshes every 30 s
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--rule-strong)" }}>
                {["Landing centre", "State", "Risk", "Wave", "Wind", "Active warning"].map((h, i) => (
                  <th
                    key={h}
                    className={`py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-ink-400 ${
                      i === 0 ? "pl-4 pr-3" : i === 5 ? "px-4" : "px-3"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.locations.map((row) => {
                const color = RISK_COLOR[row.risk_category];
                return (
                  <tr
                    key={row.name}
                    className="border-b transition last:border-0 hover:bg-paper-150"
                    style={{ borderColor: "var(--rule-faint)" }}
                  >
                    <td className="py-2.5 pl-4 pr-3 font-display text-[13.5px] font-bold text-ink-900">
                      {row.name}
                    </td>
                    <td className="px-3 py-2.5 text-ink-500">{row.state}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[13px] font-bold tabular-nums"
                          style={{ color }}
                        >
                          {row.risk_score}
                        </span>
                        <span
                          className="border px-1.5 py-px font-mono text-[8.5px] font-bold tracking-wider"
                          style={{ color, borderColor: color }}
                        >
                          {row.risk_category}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono tabular-nums text-ink-800">
                      {row.wave_height_m ?? "—"} m
                    </td>
                    <td className="px-3 py-2.5 font-mono tabular-nums text-ink-800">
                      {row.wind_speed_kmh ?? "—"} km/h
                    </td>
                    <td className="max-w-[280px] truncate px-4 py-2.5 text-[12px] text-ink-500">
                      {row.headline ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
