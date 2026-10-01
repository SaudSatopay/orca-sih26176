import { useEffect, useRef, useState } from "react";
import type { Language } from "../types";
import { CrosshairGlyph } from "./glyphs";
import { T } from "../i18n/locationPicker";
import { PORTS } from "../ports";

export interface PickedLocation {
  latitude: number;
  longitude: number;
  label: string;
  source: "gps" | "map" | "port" | "default";
}

export default function LocationPicker({
  current,
  language = "en",
  onPick,
}: {
  current: PickedLocation | null;
  language?: Language;
  onPick: (loc: PickedLocation) => void;
}) {
  const t = T[language] ?? T.en;
  const [status, setStatus] = useState<"idle" | "locating" | "denied" | "error">("idle");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const useGps = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("idle");
        onPick({
          latitude: +pos.coords.latitude.toFixed(4),
          longitude: +pos.coords.longitude.toFixed(4),
          label: t.yourLocation,
          source: "gps",
        });
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  };

  const matches = query
    ? PORTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.state.toLowerCase().includes(query.toLowerCase()),
      )
    : PORTS;

  return (
    <div ref={boxRef} className="panel relative z-[600] px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <div className="label">{t.yourLocation}</div>
          <div className="mt-0.5 flex items-baseline gap-2.5">
            <span className="truncate font-display text-[18px] font-bold leading-tight text-ink-900">
              {current?.label ?? "—"}
            </span>
            {current?.source === "gps" && (
              <span className="shrink-0 border border-risk-low/70 px-1.5 py-px font-mono text-[8.5px] font-bold uppercase tracking-wider text-risk-low">
                {t.gps}
              </span>
            )}
            {current && (
              <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-ink-400">
                {current.latitude.toFixed(3)}°N, {current.longitude.toFixed(3)}°E
              </span>
            )}
          </div>
        </div>

        <button onClick={useGps} disabled={status === "locating"} className="btn-line !py-1.5 disabled:opacity-55">
          <CrosshairGlyph size={13} />
          {status === "locating" ? t.locating : t.useGps}
        </button>

        <button onClick={() => setOpen((v) => !v)} className="btn-line !py-1.5">
          {t.pickPort} ▾
        </button>
      </div>

      {(status === "denied" || status === "error") && (
        <p className="mt-2 text-[11.5px] font-medium text-risk-high">
          {status === "denied" ? t.denied : t.unavailable}
        </p>
      )}
      <p className="mt-1.5 text-[10.5px] italic text-ink-400">{t.tapMap}</p>

      {open && (
        <div
          className="absolute left-3 right-3 top-full z-[700] mt-2 overflow-hidden rounded-[3px] border shadow-xl"
          style={{ borderColor: "var(--rule-strong)", background: "var(--paper-bright)" }}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full border-b bg-transparent px-4 py-3 text-[13px] text-ink-800 outline-none placeholder:text-ink-400"
            style={{ borderColor: "var(--rule)" }}
          />
          <div className="max-h-64 overflow-y-auto py-1">
            {matches.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  onPick({
                    latitude: p.lat,
                    longitude: p.lon,
                    label: p.name,
                    source: "port",
                  });
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-baseline gap-2 border-b px-4 py-2.5 text-left transition last:border-0 hover:bg-paper-150"
                style={{ borderColor: "var(--rule-faint)" }}
              >
                <span className="text-[13px] font-semibold text-ink-900">{p.name}</span>
                <span className="text-[11px] text-ink-400">{p.state}</span>
                <span className="ml-auto font-mono text-[9.5px] tabular-nums text-ink-400">
                  {p.lat.toFixed(2)}°N {p.lon.toFixed(2)}°E
                </span>
              </button>
            ))}
            {!matches.length && <div className="px-4 py-3 text-[12px] text-ink-400">—</div>}
          </div>
        </div>
      )}
    </div>
  );
}
