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

  if (error) return <div className="card p-6 text-sm text-red-200">Failed to load: {error}</div>;
  if (!data) return <div className="card p-6 text-sm text-ocean-300">Loading coastline…</div>;

  const tiles = [
    { key: "monitored", label: "Landing centres", color: "#7FB2E5" },
    { key: "extreme", label: "Extreme risk", color: RISK_COLOR.EXTREME },
    { key: "high", label: "High risk", color: RISK_COLOR.HIGH },
    { key: "official_warnings", label: "Official warnings", color: "#B8860B" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.key} className="card p-4">
            <div className="text-3xl font-extrabold tabular-nums" style={{ color: t.color }}>
              {data.summary[t.key] ?? 0}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-ocean-300">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-baseline justify-between border-b border-white/10 px-4 py-3">
          <span className="label">Coastal risk board</span>
          <span className="font-mono text-[10px] text-ocean-300">
            {data.generated_at.slice(0, 16).replace("T", " ")} IST
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[12px]">
            <thead className="text-ocean-300/70">
              <tr className="border-b border-white/10">
                <th className="px-4 py-2 font-medium">Landing centre</th>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 font-medium">Risk</th>
                <th className="px-3 py-2 font-medium">Wave</th>
                <th className="px-3 py-2 font-medium">Wind</th>
                <th className="px-4 py-2 font-medium">Active warning</th>
              </tr>
            </thead>
            <tbody>
              {data.locations.map((row) => {
                const color = RISK_COLOR[row.risk_category];
                return (
                  <tr key={row.name} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-ocean-100">{row.name}</td>
                    <td className="px-3 py-2.5 text-ocean-300">{row.state}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: color }}
                        />
                        <span className="font-mono font-bold tabular-nums" style={{ color }}>
                          {row.risk_score}
                        </span>
                        <span className="text-[10px] font-semibold" style={{ color }}>
                          {row.risk_category}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-ocean-100">
                      {row.wave_height_m ?? "—"} m
                    </td>
                    <td className="px-3 py-2.5 font-mono text-ocean-100">
                      {row.wind_speed_kmh ?? "—"} km/h
                    </td>
                    <td className="max-w-[280px] truncate px-4 py-2.5 text-ocean-300">
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
