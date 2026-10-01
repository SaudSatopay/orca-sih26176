import type { ChatResponse, Language } from "../types";
import { L } from "../i18n/conditions";

/** Reads the traced evidence rows rather than duplicating any parsing. */
function findEvidence(res: ChatResponse, label: string): string | null {
  const row = res.evidence.find((e) => e.label.toLowerCase() === label.toLowerCase());
  return row ? row.value : null;
}

/** One instrument bank: six readings behind hairline dividers, like a bridge console. */
export default function ConditionsStrip({
  res,
  language = "en",
  answerLang,
}: {
  res: ChatResponse;
  /** The reader's language: the instrument labels print in it. */
  language?: Language;
  /** The language the answer's own readings were written in. */
  answerLang?: Language;
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
    <dl className="conditions panel overflow-hidden">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="min-w-0 px-3 py-2.5"
          data-accent={tile.accent ? "" : undefined}
        >
          <dt className="label truncate !text-label">{tile.label}</dt>
          <dd
            lang={tile.value ? answerLang : undefined}
            className="mt-1 truncate font-mono text-body font-bold tabular-nums leading-none text-ink-900"
            title={tile.value ?? undefined}
          >
            {tile.value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
