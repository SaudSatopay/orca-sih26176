import type { Language } from "../types";

export const L: Record<Language, Record<string, string>> = {
  en: {
    title: "Potential fishing zones",
    note: "Derived from sea-surface-temperature fronts and chlorophyll — a likely area, never a guarantee of fish.",
    conf: "confidence",
    away: "away",
  },
  hi: {
    title: "संभावित मत्स्य क्षेत्र",
    note: "समुद्री सतह तापमान और क्लोरोफिल से अनुमानित — संभावित क्षेत्र, मछली की गारंटी नहीं।",
    conf: "भरोसा",
    away: "दूर",
  },
  mr: {
    title: "संभाव्य मासेमारी क्षेत्रे",
    note: "समुद्र पृष्ठभाग तापमान व क्लोरोफिलवरून काढलेले — शक्यता असलेला भाग, माशांची हमी नाही.",
    conf: "भरवसा",
    away: "अंतरावर",
  },
};
