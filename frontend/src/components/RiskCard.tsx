import { useState } from "react";
import type { Evidence, Language, RiskAssessment } from "../types";
import RiskDial, { RISK_COLOR } from "./RiskDial";

const VERDICT: Record<Language, Record<string, string>> = {
  en: {
    LOW: "Conditions look safe",
    MODERATE: "Go with caution",
    HIGH: "High risk — not recommended",
    EXTREME: "EXTREME — do not go to sea",
  },
  hi: {
    LOW: "स्थिति सुरक्षित लग रही है",
    MODERATE: "सावधानी से जाएँ",
    HIGH: "जोखिम अधिक है — जाने की सलाह नहीं",
    EXTREME: "अत्यधिक जोखिम — समुद्र में न जाएँ",
  },
  mr: {
    LOW: "परिस्थिती सुरक्षित दिसते",
    MODERATE: "सावधगिरीने जा",
    HIGH: "धोका जास्त आहे — जाऊ नका",
    EXTREME: "अत्यंत धोका — समुद्रात जाऊ नका",
  },
};

const UI: Record<Language, Record<string, string>> = {
  en: {
    why: "Why — ranked contribution to the score",
    warning: "OFFICIAL WARNING ACTIVE",
    improves: "Conditions expected to improve after",
    askAgain: "— ask again then.",
    overrides: "Safety overrides applied",
    overrideNote:
      "Deterministic rules can only raise a risk score — never lower it. No model or language output can talk ORCA down from an official warning.",
    evidence: "Evidence",
    traced: "traced values",
    show: "show ▼",
    hide: "hide ▲",
    cols: "Value|Reading|Source|Updated",
  },
  hi: {
    why: "क्यों — स्कोर में योगदान",
    warning: "आधिकारिक चेतावनी सक्रिय",
    improves: "स्थिति सुधरने की संभावना",
    askAgain: "बजे के बाद — तब दोबारा पूछें।",
    overrides: "सुरक्षा नियम लागू",
    overrideNote:
      "नियम केवल जोखिम बढ़ा सकते हैं, घटा नहीं। कोई भी मॉडल आधिकारिक चेतावनी को रद्द नहीं कर सकता।",
    evidence: "प्रमाण",
    traced: "स्रोत-सहित मान",
    show: "दिखाएँ ▼",
    hide: "छिपाएँ ▲",
    cols: "मान|रीडिंग|स्रोत|अपडेट",
  },
  mr: {
    why: "का — गुणांमधील योगदान",
    warning: "अधिकृत इशारा सक्रिय",
    improves: "परिस्थिती सुधारण्याची शक्यता",
    askAgain: "नंतर — तेव्हा पुन्हा विचारा.",
    overrides: "सुरक्षा नियम लागू",
    overrideNote:
      "नियम फक्त धोका वाढवू शकतात, कमी करू शकत नाहीत. कोणतेही मॉडेल अधिकृत इशाऱ्याला ओलांडू शकत नाही.",
    evidence: "पुरावा",
    traced: "स्रोतासह मूल्ये",
    show: "दाखवा ▼",
    hide: "लपवा ▲",
    cols: "मूल्य|वाचन|स्रोत|अपडेट",
  },
};

export default function RiskCard({
  risk,
  evidence,
  language = "en",
}: {
  risk: RiskAssessment;
  evidence: Evidence[];
  language?: Language;
}) {
  const ui = UI[language] ?? UI.en;
  const [colValue, colReading, colSource, colUpdated] = ui.cols.split("|");
  const [showEvidence, setShowEvidence] = useState(false);
  const color = RISK_COLOR[risk.category];
  const top = risk.factors.filter((f) => f.contribution > 0).slice(0, 5);
  const max = Math.max(...top.map((f) => f.contribution), 1);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-5 p-5">
        <RiskDial score={risk.score} category={risk.category} />
        <div className="min-w-0">
          <div className="text-xl font-extrabold leading-tight" style={{ color }}>
            {(VERDICT[language] ?? VERDICT.en)[risk.category]}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide"
              style={{ background: `${color}22`, color }}
            >
              {risk.category}
            </span>
            {risk.official_warning && (
              <span className="rounded-full bg-risk-extreme/20 px-2.5 py-0.5 text-[11px] font-bold text-red-200">
                {ui.warning}
              </span>
            )}
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-ocean-300">
              {risk.mode}
            </span>
          </div>
          {risk.window && (
            <div className="mt-2.5 rounded-xl bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
              {ui.improves} <span className="font-bold">{risk.window}</span> {ui.askAgain}
            </div>
          )}
        </div>
      </div>

      {/* why */}
      <div className="border-t border-white/10 px-5 py-4">
        <div className="label mb-2.5">{ui.why}</div>
        <ul className="space-y-2">
          {top.map((f) => (
            <li key={f.key}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-ocean-100">{f.label}</span>
                <span className="shrink-0 font-mono text-xs" style={{ color }}>
                  +{f.contribution.toFixed(1)}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(f.contribution / max) * 100}%`, background: color }}
                />
              </div>
              <div className="mt-1 text-[11px] text-ocean-300/80">{f.detail}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* deterministic overrides — the trust moment */}
      {risk.overrides.length > 0 && (
        <div className="border-t border-white/10 bg-risk-extreme/10 px-5 py-3">
          <div className="label mb-1.5 text-red-200/80">{ui.overrides}</div>
          <ul className="space-y-1">
            {risk.overrides.map((o, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-red-100">
                <span aria-hidden>🔒</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-red-200/70">{ui.overrideNote}</p>
        </div>
      )}

      {/* evidence */}
      <div className="border-t border-white/10 px-5 py-3">
        <button
          onClick={() => setShowEvidence((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="label">
            {ui.evidence} · {evidence.length} {ui.traced}
          </span>
          <span className="text-xs text-ocean-300">{showEvidence ? ui.hide : ui.show}</span>
        </button>

        {showEvidence && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-ocean-300/70">
                <tr>
                  <th className="pb-1.5 pr-3 font-medium">{colValue}</th>
                  <th className="pb-1.5 pr-3 font-medium">{colReading}</th>
                  <th className="pb-1.5 pr-3 font-medium">{colSource}</th>
                  <th className="pb-1.5 font-medium">{colUpdated}</th>
                </tr>
              </thead>
              <tbody className="text-ocean-100">
                {evidence.map((e, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-1.5 pr-3">{e.label}</td>
                    <td className="py-1.5 pr-3 font-mono">{e.value}</td>
                    <td className="py-1.5 pr-3 text-ocean-300">{e.source}</td>
                    <td className="py-1.5 font-mono text-ocean-300">
                      {e.timestamp?.slice(0, 16).replace("T", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
