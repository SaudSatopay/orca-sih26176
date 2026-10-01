import React from "react";
import ReactDOM from "react-dom/client";
// Self-hosted fonts — the demo must not depend on a font CDN being reachable.
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/noto-serif-devanagari";
import "@fontsource-variable/spline-sans-mono";
import App from "./App";
import { isPhoneLayout, PHONE_QUERY } from "./boot";
import MobileApp from "./components/MobileApp";
import "./index.css";

// Phone or console is chosen once, here (see isPhoneLayout for the rules).
const isPhone = isPhoneLayout(
  window.location.search,
  () => window.matchMedia(PHONE_QUERY).matches,
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isPhone ? <MobileApp /> : <App />}</React.StrictMode>,
);
