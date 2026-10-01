/** Entry for /studio/dividers.html. Dev only; see DividerSpecimen.tsx. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DividerSpecimen from "./DividerSpecimen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DividerSpecimen />
  </StrictMode>,
);
