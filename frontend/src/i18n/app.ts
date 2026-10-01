import type { Language } from "../types";

export type AppTab = "home" | "ask" | "authority" | "system";

export const SCENARIOS: {
  id: string;
  n: string;
  label: Record<Language, string>;
  ask: string;
  hint: string;
}[] = [
  { id: "safe", n: "1", label: { en: "Safe", hi: "सुरक्षित", mr: "सुरक्षित" }, ask: "Is it safe to go fishing tomorrow morning near Goa?", hint: "Goa · LOW" },
  { id: "danger", n: "2", label: { en: "Rough", hi: "ख़राब मौसम", mr: "खराब हवामान" }, ask: "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?", hint: "Mumbai · मराठी" },
  { id: "cyclone", n: "3", label: { en: "Cyclone", hi: "चक्रवात", mr: "चक्रीवादळ" }, ask: "Is there a cyclone near Paradip? Can I go fishing?", hint: "Paradip · EXTREME" },
  { id: "pfz", n: "4", label: { en: "Fishing zones", hi: "मत्स्य क्षेत्र", mr: "मासेमारी क्षेत्रे" }, ask: "कोच्चि के पास मछली पकड़ने का क्षेत्र कहाँ है?", hint: "Kochi · हिंदी" },
  { id: "route", n: "5", label: { en: "Safe route", hi: "सुरक्षित मार्ग", mr: "सुरक्षित मार्ग" }, ask: "Give me the safest route to the nearest fishing zone near Mumbai", hint: "Mumbai · geofence" },
];

export const TAB_LABEL: Record<Language, Record<AppTab, string>> = {
  en: { home: "Today", ask: "Ask ORCA", authority: "Authority", system: "System" },
  hi: { home: "आज", ask: "ORCA से पूछें", authority: "प्रशासन", system: "प्रणाली" },
  mr: { home: "आज", ask: "ORCA ला विचारा", authority: "प्रशासन", system: "प्रणाली" },
};

/** The app chrome, in the fisher's language. */
export const UI: Record<Language, Record<string, string>> = {
  en: {
    chartNo: "Chart №",
    dataEdition: "Data edition",
    voice: "Voice",
    lang: "Language",
    tour: "Guided tour",
    stopTour: "Stop tour",
    marginalia: "Soundings in metres · WGS 84",
    scenarios: "Rehearsed scenarios",
    courses: "Plotted courses",
    recommended: "Recommended",
    warnings: "Official marine warnings",
    validTill: "valid till",
    safety: "Safety",
    waves: "Waves",
    wind: "Wind",
    areas: "Areas",
    inRadius: "in {km} km",
    readingSea: "Reading the sea at your location…",
  },
  hi: {
    chartNo: "चार्ट क्र.",
    dataEdition: "डेटा संस्करण",
    voice: "आवाज़",
    lang: "भाषा",
    tour: "गाइडेड टूर",
    stopTour: "टूर रोकें",
    marginalia: "गहराई मीटर में · WGS 84",
    scenarios: "तैयार परिदृश्य",
    courses: "आँके गए मार्ग",
    recommended: "सुझाया गया",
    warnings: "आधिकारिक समुद्री चेतावनियाँ",
    validTill: "मान्य",
    safety: "सुरक्षा",
    waves: "लहरें",
    wind: "हवा",
    areas: "जगहें",
    inRadius: "{km} किमी में",
    readingSea: "आपके स्थान की जानकारी ले रहे हैं…",
  },
  mr: {
    chartNo: "तक्ता क्र.",
    dataEdition: "डेटा आवृत्ती",
    voice: "आवाज",
    lang: "भाषा",
    tour: "गाइडेड टूर",
    stopTour: "टूर थांबवा",
    marginalia: "खोली मीटरमध्ये · WGS 84",
    scenarios: "तयार परिस्थिती",
    courses: "आखलेले मार्ग",
    recommended: "सुचवलेला",
    warnings: "अधिकृत सागरी इशारे",
    validTill: "पर्यंत",
    safety: "सुरक्षा",
    waves: "लाटा",
    wind: "वारा",
    areas: "जागा",
    inRadius: "{km} किमीमध्ये",
    readingSea: "तुमच्या ठिकाणाची माहिती घेत आहे…",
  },
};
