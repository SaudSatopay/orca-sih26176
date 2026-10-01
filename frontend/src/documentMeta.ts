import { useEffect } from "react";
import type { Language } from "./types";

/** The title index.html ships with: the landing page keeps it. */
const BASE_TITLE = typeof document === "undefined" ? "ORCA" : document.title;

/** "Today — ORCA"; with no view name, the page's own title. */
export function pageTitle(view: string | null, base: string = BASE_TITLE): string {
  return view ? `${view} — ORCA` : base;
}

/**
 * Keeps the document in step with what is on screen: `<html lang>` follows the
 * chosen language, so a screen reader pronounces Hindi and Marathi as such, and
 * the title names the current view in that language.
 */
export function useDocumentMeta(language: Language, view: string | null): void {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.title = pageTitle(view);
  }, [view]);
}
