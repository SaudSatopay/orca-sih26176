import type { ReactNode } from "react";
import { ERRORS } from "../i18n/errors";
import type { Language } from "../types";
import { WarnGlyph } from "./glyphs";
import "./views.css";

/**
 * "ORCA cannot reach the crew." One notice for every working view, in the
 * chart's danger hatching. With a reading still on screen it sits above it
 * and says the reading is the last one; with nothing on screen `body` says
 * what that view is missing instead.
 */
export function OfflineNotice({
  language = "en",
  body,
  onRetry,
  busy = false,
  className = "",
}: {
  language?: Language;
  /** Replaces the standard "the last reading is still shown" line. */
  body?: string;
  onRetry?: () => void;
  /** A retry is in flight. */
  busy?: boolean;
  className?: string;
}) {
  const t = ERRORS[language] ?? ERRORS.en;
  return (
    <div
      role="alert"
      className={`panel-tint hatch-danger v-enter border-risk-extreme/60 px-4 py-3.5 ${className}`}
    >
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2.5">
        <WarnGlyph size={18} className="mt-0.5 shrink-0 text-risk-extreme" />
        <div className="min-w-0 flex-1 basis-[220px]">
          <p className="font-display text-lead font-bold leading-snug text-ink-900">
            {t.offlineTitle}
          </p>
          <p className="mt-1 max-w-[62ch] text-body leading-relaxed text-ink-700">
            {body ?? t.offlineBody}
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={busy}
            aria-busy={busy}
            className="btn-line shrink-0 self-center bg-paper-50 disabled:opacity-60"
          >
            {t.retry}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * A sheet still being drafted. The visible line says what is being read;
 * the construction boxes below it take the shape of what will arrive, so
 * nothing jumps when it does.
 */
export function DraftSheet({
  label,
  status,
  children,
  className = "",
}: {
  /** The sheet's own title, as it will read once drawn. */
  label: string;
  /**
   * What is being read, in words: "Reading the sea around you…". The sheet
   * that carries it is the one announced; a companion sheet without it is
   * drawn but stays silent.
   */
  status?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={status ? "status" : undefined}
      aria-busy={status ? true : undefined}
      aria-hidden={status ? undefined : true}
      className={`panel overflow-hidden ${className}`}
    >
      <div className="hd flex-wrap">
        <span className="label">{label}</span>
        {status && <span className="font-mono text-label text-ink-500">{status}</span>}
      </div>
      <div aria-hidden>{children}</div>
    </div>
  );
}

/** One construction box. Width and height in CSS units (`"62%"`, `14`). */
export function Draft({
  w = "100%",
  h = 12,
  className = "",
}: {
  w?: number | string;
  h?: number | string;
  className?: string;
}) {
  return <span className={`v-draft ${className}`} style={{ width: w, height: h }} />;
}
