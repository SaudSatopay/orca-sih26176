import type { Language } from "../types";

export const L: Record<Language, Record<string, string>> = {
  en: {
    title: "Potential fishing zones",
    note: "Derived from sea-surface-temperature fronts and chlorophyll — a likely area, never a guarantee of fish.",
    conf: "chance of fish",
    away: "away",
    best: "Best chance",
    sst: "Sea temp",
    chl: "Chlorophyll",
    waves: "waves",
  },
  hi: {
    title: "संभावित मत्स्य क्षेत्र",
    note: "समुद्री सतह तापमान और क्लोरोफिल से अनुमानित — संभावित क्षेत्र, मछली की गारंटी नहीं।",
    conf: "मछली की उम्मीद",
    away: "दूर",
    best: "सबसे अच्छी उम्मीद",
    sst: "समुद्री तापमान",
    chl: "क्लोरोफिल",
    waves: "लहरें",
  },
  mr: {
    title: "संभाव्य मासेमारी क्षेत्रे",
    note: "समुद्र पृष्ठभाग तापमान व क्लोरोफिलवरून काढलेले — शक्यता असलेला भाग, माशांची हमी नाही.",
    conf: "मासे मिळण्याची शक्यता",
    away: "अंतरावर",
    best: "सर्वोत्तम शक्यता",
    sst: "समुद्र तापमान",
    chl: "क्लोरोफिल",
    waves: "लाटा",
  },
};
