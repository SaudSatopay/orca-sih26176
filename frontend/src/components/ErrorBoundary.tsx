import { Component, type ErrorInfo, type ReactNode } from "react";
import { ERRORS } from "../i18n/errors";
import type { Language } from "../types";
import { WarnGlyph } from "./glyphs";

/**
 * One broken sheet must never take the chart table with it — least of all the
 * verdict. Wrap each view, and the map on its own, so a render error is
 * contained to a panel that says what happened and offers to draw it again.
 */
export default class ErrorBoundary extends Component<
  { language?: Language; children: ReactNode; className?: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ORCA sheet failed to draw", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const t = ERRORS[this.props.language ?? "en"] ?? ERRORS.en;
    return (
      <div role="alert" className={`panel-tint hatch-danger p-5 ${this.props.className ?? ""}`}>
        <div className="flex items-start gap-3">
          <WarnGlyph size={18} className="mt-0.5 shrink-0 text-risk-extreme" />
          <div>
            <h2 className="font-display text-lead font-bold text-ink-900">{t.brokenTitle}</h2>
            <p className="mt-1 max-w-[52ch] text-body leading-relaxed text-ink-700">{t.brokenBody}</p>
            <button className="btn-line mt-3" onClick={() => this.setState({ failed: false })}>
              {t.reload}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
