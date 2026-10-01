import React from "react";
import ReactDOM from "react-dom/client";
// Self-hosted fonts — the demo must not depend on a font CDN being reachable.
// These imports are @font-face rules only (font-display: swap, one face per
// unicode-range): a file is fetched when text on screen needs it, so Noto
// Serif Devanagari (127 KB) stays off the wire until Hindi or Marathi is
// actually shown. index.html preloads the two faces the first paint uses.
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/noto-serif-devanagari";
import "@fontsource-variable/spline-sans-mono";
import { PHONE_QUERY, readBootParams, ROOT_LOADERS, rootKind } from "./boot";
import ErrorBoundary from "./components/ErrorBoundary";
import { ERRORS } from "./i18n/errors";
import "./index.css";

// Phone or console is chosen once, here (see isPhoneLayout for the rules), and
// only the chosen app's chunk is fetched. Until it arrives the static shell in
// index.html stays on screen; React takes over #root on its first render.
const kind = rootKind(window.location.search, () => window.matchMedia(PHONE_QUERY).matches);
const language = readBootParams(window.location.search).lang ?? "en";
const root = document.getElementById("root")!;
document.documentElement.classList.toggle("phone", kind === "phone");

ROOT_LOADERS[kind]()
  .then(({ default: Root }) => {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary language={language} className="m-4">
          <Root />
        </ErrorBoundary>
      </React.StrictMode>,
    );
  })
  .catch((error: unknown) => {
    // The app's chunk did not arrive (the connection dropped mid-load). Say so
    // in the shell that is already on screen and offer the one useful action.
    console.error("ORCA could not load", error);
    const status = root.querySelector<HTMLElement>("[data-shell-status]");
    if (!status) return;
    const t = ERRORS[language];
    const retry = document.createElement("a");
    retry.href = window.location.href;
    retry.textContent = t.retry;
    status.replaceChildren(`${t.offlineTitle}. `, retry);
    status.setAttribute("role", "alert");
  });
