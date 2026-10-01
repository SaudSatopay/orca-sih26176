import { useId } from "react";
import type { Language, PFZZone } from "../types";
import { SchoolGlyph } from "./glyphs";
import { L } from "../i18n/pfz";
import { chart, risk, riskInk } from "../tokens";
import "./views.css";

/**
 * Potential fishing zones behind an answer, ranked. Drawn with the same card,
 * buoy and sounding as Today's grounds, so area 1 reads the same everywhere.
 */
export default function PFZList({
  zones,
  language = "en",
}: {
  zones: PFZZone[];
  language?: Language;
}) {
  const titleId = useId();
  if (!zones.length) return null;
  const t = L[language] ?? L.en;

  return (
    <section className="panel overflow-hidden" aria-labelledby={titleId}>
      <div className="hd">
        <h2 id={titleId} className="label flex items-center gap-2">
          {t.title}
          <SchoolGlyph size={26} className="swim text-chart-500" />
        </h2>
      </div>
      <ol className="space-y-2 px-4 py-3.5">
        {zones.map((z) => {
          const best = z.rank === 1;
          const ring = best ? risk.low : chart[500];
          return (
            <li key={z.rank} className="v-card">
              <div className="flex items-center gap-3.5">
                {/* the buoy: same symbology as the chart */}
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[3.5px] bg-paper-50 font-display text-title font-extrabold text-ink-900 shadow-sm"
                  style={{ borderColor: ring }}
                  aria-hidden
                >
                  {z.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="sr-only">{z.rank}. </span>
                    <span className="font-mono text-lead font-bold tabular-nums leading-none text-ink-900">
                      {z.distance_km}
                      <span className="ml-1 text-label">km</span>
                    </span>
                    <span className="font-mono text-label font-semibold text-ink-500">
                      {z.bearing}
                    </span>
                    {best && (
                      <span className="stamp !px-1.5 !py-0.5 !text-label text-risk-low">{t.best}</span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-label leading-snug text-ink-500">
                    <span>
                      {t.sst} {z.sst_c ?? "—"} °C
                    </span>
                    <span>
                      {t.chl} {z.chlorophyll_mg_m3 ?? "—"} mg/m³
                    </span>
                    {z.wave_height_m != null && (
                      <span>
                        {z.wave_height_m} m {t.waves}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div
                    className="sounding text-headline leading-none"
                    style={{ color: best ? riskInk.low : chart[600] }}
                  >
                    {Math.round(z.confidence * 100)}
                    <span className="text-body text-ink-500">%</span>
                  </div>
                  <div className="mt-1 max-w-[92px] text-label leading-tight text-ink-500">{t.conf}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p
        className="border-t px-4 py-2.5 text-label leading-relaxed text-ink-400"
        style={{ borderColor: "var(--rule-faint)" }}
      >
        {t.note}
      </p>
    </section>
  );
}
