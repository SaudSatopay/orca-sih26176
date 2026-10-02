import { useEffect, useState } from "react";
import { overWide } from "./overWide";

/**
 * `/?debug=1` on the phone: an on-screen layout probe listing the over-wide
 * elements, so a headless screenshot carries its own diagnosis. It is a
 * separate chunk that only this query ever fetches.
 */
export default function LayoutProbe() {
  const [report, setReport] = useState("");
  useEffect(() => {
    const read = () => {
      const vw = document.documentElement.clientWidth;
      const rows = overWide(document, vw);
      setReport(
        `vw=${vw} sw=${document.documentElement.scrollWidth}\n${rows.join("\n") || "no wide elements"}`,
      );
    };
    // After the first reading has had time to lay out, and again on resize.
    const id = window.setTimeout(read, 3500);
    window.addEventListener("resize", read);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", read);
    };
  }, []);
  if (!report) return null;
  return (
    <pre
      data-layout-probe
      className="fixed inset-x-2 bottom-24 z-[3000] max-h-[40vh] overflow-auto whitespace-pre-wrap rounded-[2px] border border-ink-900 bg-paper-50 p-2 font-mono text-label leading-snug text-ink-900"
    >
      {report}
    </pre>
  );
}
