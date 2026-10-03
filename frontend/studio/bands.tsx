/** Entry for /studio/bands.html. Dev only; see bands.view.tsx. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/noto-serif-devanagari";
import "@fontsource-variable/spline-sans-mono";
import "../src/index.css";
import type { Language } from "../src/types";
import { countContexts } from "../src/effects/ledger";
import BandsStudio from "./bands.view";

// With ?fxdebug=1 the page counts the WebGL contexts it opens (as the landing does).
countContexts();

const query = new URLSearchParams(location.search);
const asked = query.get("lang");
const lang: Language = asked === "hi" || asked === "mr" ? asked : "en";
document.documentElement.lang = lang;
document.documentElement.dataset.surface = "landing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BandsStudio lang={lang} />
  </StrictMode>,
);
