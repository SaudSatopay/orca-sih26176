import type { ChatResponse, Language } from "../types";

const L: Record<Language, Record<string, string>> = {
  en: { wave: "Wave", wind: "Wind", sea: "Sea state", vis: "Visibility", sst: "Sea temp", rain: "Rain" },
  hi: { wave: "लहरें", wind: "हवा", sea: "समुद्र", vis: "दृश्यता", sst: "तापमान", rain: "वर्षा" },
  mr: { wave: "लाटा", wind: "वारा", sea: "समुद्र", vis: "दृश्यमानता", sst: "तापमान", rain: "पाऊस" },
};

/** Reads the traced evidence rows rather than duplicating any parsing. */
function findEvidence(res: ChatResponse, label: string): string | null {
  const row = res.evidence.find((e) => e.label.toLowerCase() === label.toLowerCase());
  return row ? row.value : null;
}

function Tile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | null;
  accent?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border px-3 py-2.5 ${
        accent ? "border-ocean-500/40 bg-ocean-500/10" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="label truncate">{label}</div>
      <div className="mt-0.5 truncate font-mono text-[15px] font-bold tabular-nums text-ocean-100">
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function ConditionsStrip({
  res,
  language = "en",
}: {
  res: ChatResponse;
  language?: Language;
}) {
  const t = L[language] ?? L.en;
  const tiles = [
    { label: t.wave, value: findEvidence(res, "Wave height"), accent: true },
    { label: t.wind, value: findEvidence(res, "Wind"), accent: true },
    { label: t.sea, value: findEvidence(res, "Sea state") },
    { label: t.rain, value: findEvidence(res, "Rain probability") },
    { label: t.vis, value: findEvidence(res, "Visibility") },
    { label: t.sst, value: findEvidence(res, "Sea surface temperature") },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {tiles.map((tile) => (
        <Tile key={tile.label} {...tile} />
      ))}
    </div>
  );
}
