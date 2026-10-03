import { createContext } from "react";
import type { SheetId } from "../../i18n/showcase";
import type { Language } from "../../types";

/**
 * ORCA's own sheets, captured from the running app (console at 1440 x 900,
 * phone at 390 x 844) and saved as WebP in `public/sheets/`. They are served
 * from this origin and loaded only when their section is near the viewport.
 */
export interface Sheet {
  id: SheetId;
  src: string;
  width: number;
  height: number;
  edition: "console" | "phone";
}

export const SHEETS: readonly Sheet[] = [
  { id: "today", src: "/sheets/console-today.webp", width: 1280, height: 800, edition: "console" },
  { id: "ask", src: "/sheets/console-ask.webp", width: 1280, height: 800, edition: "console" },
  { id: "authority", src: "/sheets/console-authority.webp", width: 1280, height: 800, edition: "console" },
  { id: "system", src: "/sheets/console-system.webp", width: 1280, height: 800, edition: "console" },
  { id: "phoneToday", src: "/sheets/phone-today.webp", width: 360, height: 780, edition: "phone" },
  { id: "phoneMap", src: "/sheets/phone-map.webp", width: 360, height: 780, edition: "phone" },
  { id: "phoneAsk", src: "/sheets/phone-ask.webp", width: 360, height: 780, edition: "phone" },
];

export const sheet = (id: SheetId): Sheet => SHEETS.find((s) => s.id === id)!;

/** The phone edition as one sheet: the three phone captures laid side by side on paper. */
export const PHONE_EDITION = { src: "/sheets/phone-edition.webp", width: 1280, height: 800 } as const;

/** An illustrative bulletin, drawn for ORCA: generic, no agency, no letterhead. */
export const BULLETIN = { src: "/sheets/bulletin.webp", width: 720, height: 900 } as const;

/**
 * What the showcase's effects need from the page around them. An effect only
 * receives `EffectProps` from its slot, so the reader's language and the
 * crumple toggle (a real button outside the canvas) reach it through here.
 */
export interface ShowcaseState {
  language: Language;
  crumpled: boolean;
  setCrumpled: (next: boolean) => void;
}

export const ShowcaseContext = createContext<ShowcaseState>({
  language: "en",
  crumpled: false,
  setCrumpled: () => {},
});
