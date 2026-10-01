/** Entry for /studio/ink.html. Dev only; see InkStudio.tsx. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import InkStudio from "./InkStudio";

createRoot(document.getElementById("studio")!).render(
  <StrictMode>
    <InkStudio />
  </StrictMode>,
);
