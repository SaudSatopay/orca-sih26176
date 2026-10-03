/**
 * Entry for /studio/showcase.html. DEV ONLY.
 *
 *   cd frontend && npx vite --port 5182
 *   http://localhost:5182/studio/showcase.html?fx=sheets,ripple,crumple&fxdebug=1
 *
 * Renders EditionsSwap, SheetsFlow, ChartRipple and BulletinCrumple in order
 * on the landing's ground, with the same type, tokens and effect gate as the
 * app. `?lang=hi|mr` for the other languages; `?fx=none` for the posters.
 * `window.__orcaFx` (with `fxdebug`) counts the WebGL contexts opened.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/noto-serif-devanagari";
import "@fontsource-variable/spline-sans-mono";
import "../src/index.css";
import { countContexts } from "../src/effects/ledger";
import { readBootParams } from "../src/boot";
import {
  BulletinCrumple,
  ChartRipple,
  EditionsSwap,
  SheetsFlow,
} from "../src/components/landing/SheetsShowcase";

countContexts();
const language = readBootParams(location.search).lang ?? "en";
document.documentElement.lang = language;
document.documentElement.setAttribute("data-surface", "landing");

createRoot(document.getElementById("studio")!).render(
  <StrictMode>
    <main className="mx-auto flex min-h-full max-w-[1240px] flex-col px-5 py-5">
      <div className="sheet-ground" aria-hidden />
      <EditionsSwap language={language} />
      <SheetsFlow language={language} />
      <ChartRipple language={language} />
      <BulletinCrumple language={language} />
    </main>
  </StrictMode>,
);
