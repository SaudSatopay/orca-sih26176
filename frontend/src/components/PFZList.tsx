import type { Language, PFZZone } from "../types";

const L: Record<Language, Record<string, string>> = {
  en: {
    title: "Potential fishing zones",
    note: "Derived from sea-surface-temperature fronts and chlorophyll — a likely area, never a guarantee of fish.",
    conf: "confidence",
    away: "away",
  },
  hi: {
    title: "संभावित मत्स्य क्षेत्र",
    note: "समुद्री सतह तापमान और क्लोरोफिल से अनुमानित — संभावित क्षेत्र, मछली की गारंटी नहीं।",
    conf: "भरोसा",
    away: "दूर",
  },
  mr: {
    title: "संभाव्य मासेमारी क्षेत्रे",
    note: "समुद्र पृष्ठभाग तापमान व क्लोरोफिलवरून काढलेले — शक्यता असलेला भाग, माशांची हमी नाही.",
    conf: "भरवसा",
    away: "अंतरावर",
  },
};

export default function PFZList({
  zones,
  language = "en",
}: {
  zones: PFZZone[];
  language?: Language;
}) {
  if (!zones.length) return null;
  const t = L[language] ?? L.en;

  return (
    <div className="card p-4">
      <div className="label mb-2.5">{t.title}</div>
      <div className="space-y-2">
        {zones.map((z) => {
          const best = z.rank === 1;
          return (
            <div
              key={z.rank}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                best
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-extrabold text-white ${
                  best ? "bg-risk-low" : "bg-ocean-500"
                }`}
              >
                {z.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[13px] font-bold tabular-nums text-ocean-100">
                    {z.distance_km} km
                  </span>
                  <span className="text-[11px] text-ocean-300">{z.bearing}</span>
                </div>
                <div className="mt-0.5 truncate font-mono text-[10.5px] text-ocean-300/85">
                  SST {z.sst_c ?? "—"}°C · Chl {z.chlorophyll_mg_m3 ?? "—"} mg/m³
                  {z.wave_height_m != null ? ` · ${z.wave_height_m} m` : ""}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div
                  className={`font-mono text-[13px] font-bold tabular-nums ${
                    best ? "text-emerald-300" : "text-ocean-300"
                  }`}
                >
                  {Math.round(z.confidence * 100)}%
                </div>
                <div className="text-[9.5px] text-ocean-300/70">{t.conf}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2.5 text-[10.5px] leading-relaxed text-ocean-300/65">{t.note}</p>
    </div>
  );
}
