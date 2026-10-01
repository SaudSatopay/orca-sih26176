import { useId, useRef, useState } from "react";
import type { Evidence, Language } from "../types";
import { UI } from "../i18n/riskCard";

/**
 * Every reading behind the verdict, with its source and timestamp. Closed by
 * default so the verdict leads; one press (or Enter) opens it, Escape closes
 * it and hands focus back to the switch.
 */
export default function EvidenceLedger({
  evidence,
  language = "en",
}: {
  evidence: Evidence[];
  language?: Language;
}) {
  const ui = UI[language] ?? UI.en;
  const [colValue, colReading, colSource, colUpdated] = ui.cols.split("|");
  const [open, setOpen] = useState(false);
  const tableId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  if (!evidence.length) return null;

  return (
    <section
      className="panel overflow-hidden"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <h2>
        <button
          ref={toggleRef}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={tableId}
          className="hd cell-press w-full !items-center text-left"
        >
          <span className="label">
            {ui.ledger} · {evidence.length} {ui.traced}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-label font-bold text-chart-700">
            {open ? ui.hide : ui.show}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden
              className="transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : undefined }}
            >
              <path
                d="M1.5 3.5 L5 7 L8.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </h2>

      <div id={tableId} hidden={!open} className="overflow-x-auto px-4 pb-3 pt-1">
        <table className="w-full min-w-[520px] text-left font-mono text-label">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--rule)" }}>
              {[colValue, colReading, colSource, colUpdated].map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="py-2 pr-3 text-label font-bold uppercase tracking-[0.12em] text-ink-400 last:pr-0"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-ink-800">
            {evidence.map((e, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "var(--rule-faint)" }}>
                <th scope="row" className="py-1.5 pr-3 font-sans font-normal">
                  {e.label}
                </th>
                <td className="py-1.5 pr-3 font-bold tabular-nums">{e.value}</td>
                <td className="py-1.5 pr-3 text-ink-500">{e.source}</td>
                <td className="whitespace-nowrap py-1.5 tabular-nums text-ink-500">
                  {e.timestamp?.slice(0, 16).replace("T", " ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
