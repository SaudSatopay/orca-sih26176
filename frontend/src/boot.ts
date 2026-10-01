import type { ComponentType } from "react";
import type { AppTab } from "./i18n/app";
import type { Language } from "./types";

/** The width at and below which the fisher's phone app renders. */
export const PHONE_QUERY = "(max-width: 640px)";

/**
 * Phone-sized screens get the fisher's own app — voice-first, symbol-first,
 * three destinations. `?m=1` forces it (testing, the PWA start_url), `?m=0`
 * forces the full console even on a small window. Decided once, at load.
 */
export function isPhoneLayout(search: string, matchesPhoneWidth: () => boolean): boolean {
  const m = new URLSearchParams(search).get("m");
  if (m === "1") return true;
  if (m === "0") return false;
  return matchesPhoneWidth();
}

/** Which of the two apps this visit gets. */
export type RootKind = "phone" | "console";

export function rootKind(search: string, matchesPhoneWidth: () => boolean): RootKind {
  return isPhoneLayout(search, matchesPhoneWidth) ? "phone" : "console";
}

/**
 * Each app is its own chunk, fetched only when it is the one chosen: a phone
 * never downloads the console, the landing or the tour, and the console never
 * downloads the phone app. `index.html` starts the matching download early
 * with the same rule (see `bootPreload` in vite.config.ts).
 */
export const ROOT_LOADERS: Record<RootKind, () => Promise<{ default: ComponentType }>> = {
  phone: () => import("./components/MobileApp"),
  console: () => import("./App"),
};

export interface BootParams {
  /** `?tab=` — a view to open instead of the landing page. */
  tab: AppTab | null;
  /** `?at=lat,lon` — pins the starting position; wins over geolocation. */
  at: { latitude: number; longitude: number } | null;
  /** `?lang=` — an explicit language choice. */
  lang: Language | null;
  /** `?demo=` — a rehearsed scenario, by id or number. */
  demo: string | null;
  /** `?tour=1` — start the guided tour. */
  tour: boolean;
}

/** Everything a deep link can ask for, parsed from `location.search`. */
export function readBootParams(search: string): BootParams {
  const params = new URLSearchParams(search);
  const at = (params.get("at") ?? "").split(",").map(Number);
  const tab = params.get("tab");
  const lang = params.get("lang");
  return {
    tab: tab === "home" || tab === "ask" || tab === "authority" || tab === "system" ? tab : null,
    at:
      at.length === 2 && at.every(Number.isFinite) ? { latitude: at[0], longitude: at[1] } : null,
    lang: lang === "en" || lang === "hi" || lang === "mr" ? lang : null,
    demo: params.get("demo"),
    tour: params.get("tour") === "1",
  };
}

/**
 * The language the phone app opens in: `?lang=` wins, then the first of the
 * phone's own languages that ORCA speaks, then English.
 */
export function initialLanguage(search: string, preferred: readonly string[] = []): Language {
  const explicit = readBootParams(search).lang;
  if (explicit) return explicit;
  for (const tag of preferred) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "hi" || base === "mr" || base === "en") return base;
  }
  return "en";
}
