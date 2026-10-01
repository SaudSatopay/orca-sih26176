import type { Language } from "../types";

export type AppTab = "home" | "ask" | "authority" | "system";

export const SCENARIOS: {
  id: string;
  n: string;
  label: Record<Language, string>;
  ask: string;
  /** The language the rehearsed question itself is written in. */
  askLang: Language;
  /** One grammar for every hint: PLACE · expected band. */
  hint: string;
  /** For Devanagari questions: what the question says, in each reader language. */
  gloss?: Record<Language, string>;
}[] = [
  { id: "safe", n: "1", label: { en: "Safe", hi: "सुरक्षित", mr: "सुरक्षित" }, ask: "Is it safe to go fishing tomorrow morning near Goa?", askLang: "en", hint: "Goa · LOW" },
  {
    id: "danger", n: "2", label: { en: "Rough", hi: "ख़राब मौसम", mr: "खराब हवामान" },
    ask: "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?", askLang: "mr", hint: "Mumbai · HIGH",
    gloss: {
      en: "In Marathi: can I go fishing near Mumbai at 6 tomorrow morning?",
      hi: "मराठी में: क्या मैं कल सुबह 6 बजे मुंबई के पास मछली पकड़ने जा सकता हूँ?",
      mr: "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?",
    },
  },
  { id: "cyclone", n: "3", label: { en: "Cyclone", hi: "चक्रवात", mr: "चक्रीवादळ" }, ask: "Is there a cyclone near Paradip? Can I go fishing?", askLang: "en", hint: "Paradip · EXTREME" },
  {
    id: "pfz", n: "4", label: { en: "Fishing zones", hi: "मत्स्य क्षेत्र", mr: "मासेमारी क्षेत्रे" },
    ask: "कोच्चि के पास मछली पकड़ने का क्षेत्र कहाँ है?", askLang: "hi", hint: "Kochi · MODERATE",
    gloss: {
      en: "In Hindi: where is the fishing zone near Kochi?",
      hi: "कोच्चि के पास मछली पकड़ने का क्षेत्र कहाँ है?",
      mr: "हिंदीत: कोचीजवळ मासेमारीचे क्षेत्र कुठे आहे?",
    },
  },
  { id: "route", n: "5", label: { en: "Safe route", hi: "सुरक्षित मार्ग", mr: "सुरक्षित मार्ग" }, ask: "Give me the safest route to the nearest fishing zone near Mumbai", askLang: "en", hint: "Mumbai · MODERATE" },
];

export const TAB_LABEL: Record<Language, Record<AppTab, string>> = {
  en: { home: "Today", ask: "Ask ORCA", authority: "Authority", system: "System" },
  hi: { home: "आज", ask: "ORCA से पूछें", authority: "प्रशासन", system: "प्रणाली" },
  mr: { home: "आज", ask: "ORCA ला विचारा", authority: "प्रशासन", system: "प्रणाली" },
};

/** What the browser tab calls each view: "Today — ORCA". */
export const VIEW_TITLE: Record<Language, Record<AppTab, string>> = {
  en: { home: "Today", ask: "Ask", authority: "Authority", system: "System" },
  hi: { home: "आज", ask: "पूछें", authority: "प्रशासन", system: "प्रणाली" },
  mr: { home: "आज", ask: "विचारा", authority: "प्रशासन", system: "प्रणाली" },
};

/** Each language under its own name, and as the switch prints it. */
export const LANG_NAME: Record<Language, string> = { en: "English", hi: "हिन्दी", mr: "मराठी" };
export const LANG_SHORT: Record<Language, string> = { en: "EN", hi: "हिं", mr: "मरा" };

/** The data edition, as the title block prints it. */
export const MODE_LABEL: Record<Language, Record<string, string>> = {
  en: { LIVE: "LIVE", DEMO: "DEMO", CACHE: "CACHE" },
  hi: { LIVE: "लाइव", DEMO: "डेमो", CACHE: "कैश" },
  mr: { LIVE: "लाइव्ह", DEMO: "डेमो", CACHE: "कॅशे" },
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
    safety: "Risk",
    waves: "Waves",
    wind: "Wind",
    areas: "Areas",
    inRadius: "in {km} km",
    skip: "Skip to the sheet",
    frontPage: "ORCA — back to the front page",
    tagline: "Marine EcOsystem Reasoning · Collaborative Agents",
    views: "Sheets",
    modeHint: "Switch between rehearsed demo data and live public feeds",
    modeSwitching: "Switching…",
    voiceHint: "Read each answer aloud",
    voiceOn: "On",
    voiceOff: "Off",
    selectedPoint: "Selected point",
    yourLocation: "Your location",
    deckLead: "Start with a rehearsed question",
    deckSub: "Five questions with known answers. Pick one, or ask your own below.",
    pendingTitle: "The verdict is stamped here",
    pendingBody:
      "Ask, and this sheet fills in: a 0–100 risk score, the reasons ranked by weight, the course on the chart and every reading with its source.",
    crossesOne: "Crosses 1 restricted area",
    crossesMany: "Crosses {n} restricted areas",
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
    safety: "जोखिम",
    waves: "लहरें",
    wind: "हवा",
    areas: "जगहें",
    inRadius: "{km} किमी में",
    skip: "सीधे शीट पर जाएँ",
    frontPage: "ORCA — मुखपृष्ठ पर लौटें",
    tagline: "समुद्री तंत्र की समझ · मिलकर काम करते एजेंट",
    views: "शीटें",
    modeHint: "तैयार डेमो डेटा और लाइव सार्वजनिक फ़ीड के बीच बदलें",
    modeSwitching: "बदल रहे हैं…",
    voiceHint: "हर जवाब बोलकर सुनाएँ",
    voiceOn: "चालू",
    voiceOff: "बंद",
    selectedPoint: "चुना हुआ स्थान",
    yourLocation: "आपका स्थान",
    deckLead: "तैयार सवाल से शुरू करें",
    deckSub: "पाँच सवाल, जिनके जवाब जाँचे हुए हैं। एक चुनें, या नीचे अपना सवाल पूछें।",
    pendingTitle: "फ़ैसले की मुहर यहाँ लगेगी",
    pendingBody:
      "पूछिए, और यह शीट भर जाएगी: 0–100 जोखिम स्कोर, वज़न के क्रम में कारण, चार्ट पर मार्ग और हर रीडिंग उसके स्रोत के साथ।",
    crossesOne: "1 प्रतिबंधित क्षेत्र से होकर गुज़रता है",
    crossesMany: "{n} प्रतिबंधित क्षेत्रों से होकर गुज़रता है",
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
    safety: "धोका",
    waves: "लाटा",
    wind: "वारा",
    areas: "जागा",
    inRadius: "{km} किमीमध्ये",
    skip: "थेट शीटवर जा",
    frontPage: "ORCA — मुखपृष्ठावर परत जा",
    tagline: "सागरी परिसंस्थेची समज · एकत्र काम करणारे एजंट",
    views: "शीट",
    modeHint: "तयार डेमो डेटा आणि लाइव्ह सार्वजनिक फीड यांमध्ये बदला",
    modeSwitching: "बदलत आहे…",
    voiceHint: "प्रत्येक उत्तर मोठ्याने वाचा",
    voiceOn: "चालू",
    voiceOff: "बंद",
    selectedPoint: "निवडलेले ठिकाण",
    yourLocation: "तुमचे ठिकाण",
    deckLead: "तयार प्रश्नाने सुरुवात करा",
    deckSub: "पाच प्रश्न, ज्यांची उत्तरे तपासलेली आहेत. एक निवडा, किंवा खाली स्वतःचा प्रश्न विचारा.",
    pendingTitle: "निर्णयाचा शिक्का इथे उमटेल",
    pendingBody:
      "विचारा, आणि ही शीट भरेल: 0–100 धोका गुण, वजनानुसार कारणे, चार्टवरील मार्ग आणि प्रत्येक नोंद तिच्या स्रोतासह.",
    crossesOne: "1 प्रतिबंधित क्षेत्रातून जातो",
    crossesMany: "{n} प्रतिबंधित क्षेत्रांतून जातो",
  },
};
