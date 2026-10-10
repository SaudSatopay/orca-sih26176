import type { DataDrill, GateConfidence, GateState, HealthStatus, Language } from "../types";

interface GateText {
  /** The strip's eyebrow. */
  title: string;
  /** The gate's state, as the stamp prints it. */
  state: Record<GateState, string>;
  confidence: Record<GateConfidence, string>;
  /** "{n} of {total} critical inputs fresh" */
  freshCount: string;
  /** The verdict's headline when the gate tempers or withholds it. */
  instruction: { CAUTION: string; INSUFFICIENT_DATA: string };
  /** Where the dial's number would be, when ORCA has no score it can stand behind. */
  noScore: string;
  /** After a score built on out-of-date evidence. */
  unconfirmed: string;
  show: string;
  hide: string;
  /** The panel's heading: the brief's "Evidence Confidence" panel. */
  panel: string;
  /** One line under the heading: what the panel is, and what it is not. */
  panelNote: string;
  /** Before a reading's freshness limit: "limit 3 h". */
  limit: string;
  /** The inputs table's columns. */
  cols: string;
  critical: string;
  /** The chart layer ships with the app: no age, no limit. */
  bundled: string;
  status: Record<HealthStatus, string>;
  /** `min1`: the unit after exactly one minute ("1 मिनिट", not "1 मिनिटे"). */
  units: { h: string; min: string; min1: string };
  drillTitle: string;
  drillHint: string;
  drills: Record<DataDrill, string>;
}

/**
 * The safety gate's words: the evidence check on every verdict, the inputs
 * table and the data drill. The reasons themselves come from the backend, in
 * the answer's language.
 */
export const GATE: Record<Language, GateText> = {
  en: {
    title: "Evidence check",
    state: {
      GO: "Evidence fresh",
      CAUTION: "Caution — data stale",
      NO_GO: "No-go — safety rules decide",
      INSUFFICIENT_DATA: "Insufficient data",
    },
    confidence: {
      normal: "normal confidence",
      degraded: "degraded confidence",
      insufficient: "incomplete evidence",
    },
    freshCount: "{n} of {total} critical inputs fresh",
    instruction: {
      CAUTION: "Check the latest bulletin before you go",
      INSUFFICIENT_DATA: "Follow the official advisory",
    },
    noScore: "No score — ORCA will not guess",
    unconfirmed: "unconfirmed",
    show: "Show evidence confidence",
    hide: "Hide evidence confidence",
    panel: "Evidence confidence",
    panelNote: "Where each reading came from, how old it is against its limit, and whether ORCA could use it. Transparency, not precision.",
    limit: "limit",
    cols: "Input|Source|Freshness|Status",
    critical: "critical",
    bundled: "bundled",
    status: { FRESH: "fresh", STALE: "out of date", MISSING: "missing", ERROR: "error" },
    units: { h: "h", min: "min", min1: "min" },
    drillTitle: "Data drill",
    drillHint: "Sets the marine feed's health — the sea itself does not change.",
    drills: {
      healthy: "Healthy",
      stale: "Stale",
      unavailable: "Unavailable",
      recovery: "Recovery",
    },
  },
  hi: {
    title: "प्रमाण जाँच",
    state: {
      GO: "प्रमाण ताज़ा",
      CAUTION: "सावधान — आँकड़े पुराने",
      NO_GO: "न जाएँ — सुरक्षा नियम लागू",
      INSUFFICIENT_DATA: "अपर्याप्त आँकड़े",
    },
    confidence: {
      normal: "सामान्य भरोसा",
      degraded: "घटा हुआ भरोसा",
      insufficient: "अधूरे प्रमाण",
    },
    freshCount: "{total} में से {n} ज़रूरी आँकड़े ताज़ा",
    instruction: {
      CAUTION: "जाने से पहले ताज़ा बुलेटिन देखें",
      INSUFFICIENT_DATA: "आधिकारिक सलाह का पालन करें",
    },
    noScore: "कोई स्कोर नहीं — ORCA अनुमान नहीं लगाएगा",
    unconfirmed: "अपुष्ट",
    show: "प्रमाण पर भरोसा दिखाएँ",
    hide: "प्रमाण पर भरोसा छिपाएँ",
    panel: "प्रमाण पर भरोसा",
    panelNote: "हर आँकड़ा कहाँ से आया, अपनी सीमा के मुकाबले कितना पुराना है, और ORCA उसे इस्तेमाल कर सका या नहीं। पारदर्शिता, सटीकता का दावा नहीं।",
    limit: "सीमा",
    cols: "आँकड़ा|स्रोत|ताज़गी|स्थिति",
    critical: "ज़रूरी",
    bundled: "साथ में",
    status: { FRESH: "ताज़ा", STALE: "पुराना", MISSING: "उपलब्ध नहीं", ERROR: "त्रुटि" },
    units: { h: "घं", min: "मि", min1: "मि" },
    drillTitle: "आँकड़ा अभ्यास",
    drillHint: "समुद्री स्रोत की हालत बदलता है — समुद्र वही रहता है।",
    drills: {
      healthy: "ठीक",
      stale: "पुराना",
      unavailable: "अनुपलब्ध",
      recovery: "बहाल",
    },
  },
  mr: {
    title: "पुरावा तपासणी",
    state: {
      GO: "पुरावा ताजा",
      CAUTION: "सावधान — माहिती जुनी",
      NO_GO: "जाऊ नका — सुरक्षा नियम लागू",
      INSUFFICIENT_DATA: "अपुरी माहिती",
    },
    confidence: {
      normal: "नेहमीचा विश्वास",
      degraded: "कमी झालेला विश्वास",
      insufficient: "अपूर्ण पुरावा",
    },
    freshCount: "{total} पैकी {n} आवश्यक नोंदी ताज्या",
    instruction: {
      CAUTION: "जाण्यापूर्वी ताजे बुलेटिन पाहा",
      INSUFFICIENT_DATA: "अधिकृत सल्ला पाळा",
    },
    noScore: "गुण नाहीत — ORCA अंदाज लावणार नाही",
    unconfirmed: "अपुष्ट",
    show: "पुराव्यावरील विश्वास दाखवा",
    hide: "पुराव्यावरील विश्वास लपवा",
    panel: "पुराव्यावरील विश्वास",
    panelNote: "प्रत्येक नोंद कुठून आली, तिच्या मर्यादेच्या तुलनेत किती जुनी आहे, आणि ORCA ती वापरू शकले का. पारदर्शकता, अचूकतेचा दावा नाही.",
    limit: "मर्यादा",
    cols: "नोंद|स्रोत|ताजेपणा|स्थिती",
    critical: "आवश्यक",
    bundled: "सोबत",
    status: { FRESH: "ताजी", STALE: "जुनी", MISSING: "उपलब्ध नाही", ERROR: "त्रुटी" },
    units: { h: "तास", min: "मिनिटे", min1: "मिनिट" },
    drillTitle: "माहिती सराव",
    drillHint: "सागरी स्रोताची स्थिती बदलते — समुद्र तोच राहतो.",
    drills: {
      healthy: "ठीक",
      stale: "जुनी",
      unavailable: "उपलब्ध नाही",
      recovery: "पूर्ववत",
    },
  },
};
