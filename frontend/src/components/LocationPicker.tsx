import { useEffect, useId, useRef, useState } from "react";
import type { Language } from "../types";
import { CrosshairGlyph, WarnGlyph } from "./glyphs";
import { ChevronGlyph } from "./viewGlyphs";
import { T } from "../i18n/locationPicker";
import { PORTS } from "../ports";
import { CHOOSE_HARBOUR_EVENT, fill } from "./todayModel";
import "./views.css";

export interface PickedLocation {
  latitude: number;
  longitude: number;
  label: string;
  source: "gps" | "map" | "port" | "default";
}

/** 18.95, 72.75 → "18.950°N, 72.750°E", with the hemisphere worked out. */
function coords(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(3)}°${lat < 0 ? "S" : "N"}, ${Math.abs(lon).toFixed(3)}°${
    lon < 0 ? "W" : "E"
  }`;
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
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Close on a click anywhere else.
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  // The search field takes focus when the list opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Another panel ("no grounds here: choose harbour") can ask for the list.
  useEffect(() => {
    const show = () => {
      setQuery("");
      setActive(0);
      setOpen(true);
      boxRef.current?.scrollIntoView?.({ block: "nearest" });
    };
    window.addEventListener(CHOOSE_HARBOUR_EVENT, show);
    return () => window.removeEventListener(CHOOSE_HARBOUR_EVENT, show);
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

  const q = query.trim().toLowerCase();
  const matches = q
    ? PORTS.filter((p) => p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q))
    : PORTS;
  const activeIdx = Math.min(active, Math.max(0, matches.length - 1));

  const openList = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };
  const closeList = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };
  const pick = (p: (typeof PORTS)[number]) => {
    onPick({ latitude: p.lat, longitude: p.lon, label: p.name, source: "port" });
    setStatus("idle");
    closeList(true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeList(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(matches.length - 1);
    } else if (e.key === "Enter" && matches[activeIdx]) {
      e.preventDefault();
      pick(matches[activeIdx]);
    }
  };

  const failed = status === "denied" || status === "error";

  return (
    <div
      ref={boxRef}
      className="panel relative z-[600] px-4 py-3"
      onBlur={(e) => {
        // Tabbing out of the picker closes the list; it never holds the keyboard.
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
        <div className="min-w-0 flex-1 basis-[200px]">
          <div className="label">{t.yourLocation}</div>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <span className="min-w-0 truncate font-display text-title font-bold leading-tight text-ink-900">
              {current?.label ?? t.locating}
            </span>
            {current?.source === "gps" && (
              <span className="shrink-0 border border-risk-low px-1.5 py-px font-mono text-label font-bold uppercase tracking-[0.1em] text-ink-800">
                {t.gps}
              </span>
            )}
            {current && (
              <span className="shrink-0 font-mono text-label tabular-nums text-ink-500">
                {coords(current.latitude, current.longitude)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={useGps}
            disabled={status === "locating"}
            aria-busy={status === "locating"}
            className="btn-line !py-1.5 disabled:opacity-60"
          >
            <CrosshairGlyph size={13} />
            {status === "locating" ? t.locating : t.useGps}
          </button>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => (open ? closeList(false) : openList())}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="btn-line !py-1.5"
          >
            {t.pickPort}
            <ChevronGlyph className="v-chevron" />
          </button>
        </div>
      </div>

      {failed ? (
        <div
          role="alert"
          className="v-prohibit v-enter mt-2.5 flex-wrap !items-center !border-risk-high/60"
        >
          <WarnGlyph size={15} className="shrink-0 text-risk-high" />
          <p className="min-w-0 flex-1 basis-[180px] text-body font-medium leading-snug text-ink-900">
            {status === "denied" ? t.denied : t.unavailable}
          </p>
          <button type="button" onClick={openList} className="btn-ink shrink-0 !px-3 !py-1.5">
            {t.pickPort}
          </button>
        </div>
      ) : (
        <p className="mt-1.5 text-label italic text-ink-500">{t.tapMap}</p>
      )}

      {open && (
        <div
          className="v-enter absolute left-3 right-3 top-full z-[700] mt-2 overflow-hidden rounded-[3px] border shadow-xl"
          style={{ borderColor: "var(--rule-strong)", background: "var(--paper-bright)" }}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            enterKeyHint="go"
            role="combobox"
            aria-label={t.search}
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={matches.length ? `${listId}-${activeIdx}` : undefined}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
            placeholder={t.search}
            className="w-full border-b bg-transparent px-4 py-3 text-body text-ink-800 placeholder:text-ink-400 focus-visible:outline-offset-[-2px]"
            style={{ borderColor: "var(--rule)" }}
          />
          <ul id={listId} role="listbox" aria-label={t.harbours} className="max-h-64 overflow-y-auto py-1">
            {matches.map((p, i) => (
              <li
                key={p.name}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === activeIdx}
                // mousedown would blur the field and close the list before the click lands
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(p)}
                onMouseMove={() => i !== activeIdx && setActive(i)}
                className={`v-option flex cursor-pointer flex-wrap items-baseline gap-x-2 border-b px-4 py-2.5 last:border-0 ${
                  i === activeIdx ? "bg-chart-100/70" : ""
                }`}
                style={{ borderColor: "var(--rule-faint)" }}
              >
                <span className="text-body font-semibold text-ink-900">{p.name}</span>
                <span className="text-label text-ink-500">{p.state}</span>
                <span className="ml-auto font-mono text-label tabular-nums text-ink-500">
                  {coords(p.lat, p.lon)}
                </span>
              </li>
            ))}
          </ul>
          {!matches.length && (
            <p role="status" className="px-4 pb-3.5 pt-2 text-body leading-relaxed text-ink-700">
              <span className="font-semibold text-ink-900">{fill(t.noMatch, { q: query.trim() })}</span>{" "}
              {t.noMatchHint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
