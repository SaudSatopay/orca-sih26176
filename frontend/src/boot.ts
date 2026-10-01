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
