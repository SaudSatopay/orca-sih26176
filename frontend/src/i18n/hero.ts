import type { Language, RiskCategory } from "../types";

/** The landing hero ("the chart answers"), in the fisher's three languages. */
export type SceneId = "route" | "danger" | "cyclone";
export type FactorKey = "wave" | "cyclone" | "wind" | "weather" | "ocean" | "gis";

export const HERO: Record<
  Language,
  {
    sheet: string;
    /** The three rehearsed questions, as this reader would ask them. */
    ask: Record<SceneId, string>;
    /** The language each question is asked in. */
    askLang: Record<SceneId, Language>;
    planner: string;
    asks: string;
    crew: string;
    crewRan: (n: number) => string;
    idle: string;
    verdict: Record<RiskCategory, string>;
    band: Record<RiskCategory, string>;
    why: string;
    factor: Record<FactorKey, string>;
    floor: string;
    clears: string;
    safest: string;
    direct: string;
    tabs: Record<SceneId, string>;
    tabsLabel: string;
    askReal: string;
    naval: string;
    channel: string;
    imd: string;
    until: string;
    storm: string;
    track: string;
    live: string;
    rehearsed: string;
  }
> = {
  en: {
    sheet: "One question, start to finish",
    ask: {
      route: "Give me the safest route to the nearest fishing zone",
      // English readers see the product's signature case as it happens: asked in Marathi.
      danger: "मी उद्या सकाळी ६ वाजता मासेमारीला जाऊ शकतो का?",
      cyclone: "Is there a cyclone near Paradip?",
    },
    askLang: { route: "en", danger: "mr", cyclone: "en" },
    planner: "Planner",
    asks: "A fisher asks",
    crew: "The crew reports",
    crewRan: (n) => `${n} of 10 needed`,
    idle: "not needed for this question",
    verdict: { LOW: "Safe to go", MODERATE: "Go with care", HIGH: "Do not go", EXTREME: "Do not launch" },
    band: { LOW: "Low", MODERATE: "Moderate", HIGH: "High", EXTREME: "Extreme" },
    why: "Why — every point attributed",
    factor: {
      wave: "Wave height",
      cyclone: "Official warning",
      wind: "Wind",
      weather: "Rain and visibility",
      ocean: "Sea state",
      gis: "Position and zones",
    },
    floor: "Official warning in force — the score cannot go lower",
    clears: "Expected to clear after",
    safest: "Safest course",
    direct: "direct track",
    tabs: { route: "Safest course", danger: "Storm warning", cyclone: "Cyclone" },
    tabsLabel: "Rehearsed questions",
    askReal: "Ask this in the app",
    naval: "Naval exercise area",
    channel: "Port channel",
    imd: "IMD fishermen warning",
    until: "until",
    storm: "Severe cyclonic storm",
    track: "forecast track",
    live: "answered just now · simulated data",
    rehearsed: "rehearsed scenario · simulated data",
  },
  hi: {
    sheet: "एक सवाल, शुरू से आख़िर तक",
    ask: {
      route: "नज़दीकी मछली क्षेत्र तक सबसे सुरक्षित रास्ता बताओ",
      danger: "क्या मैं कल सुबह 6 बजे समुद्र में जा सकता हूँ?",
      cyclone: "क्या पारादीप के पास चक्रवात है?",
    },
    askLang: { route: "hi", danger: "hi", cyclone: "hi" },
    planner: "योजनाकार",
    asks: "मछुआरा पूछता है",
    crew: "टीम की रिपोर्ट",
    crewRan: (n) => `10 में से ${n} की ज़रूरत`,
    idle: "इस सवाल के लिए ज़रूरी नहीं",
    verdict: { LOW: "जाना सुरक्षित", MODERATE: "सावधानी से जाएँ", HIGH: "न जाएँ", EXTREME: "नाव न उतारें" },
    band: { LOW: "कम", MODERATE: "मध्यम", HIGH: "अधिक", EXTREME: "अत्यधिक" },
    why: "क्यों — हर अंक का हिसाब",
    factor: {
      wave: "लहर की ऊँचाई",
      cyclone: "आधिकारिक चेतावनी",
      wind: "हवा",
      weather: "बारिश और दृश्यता",
      ocean: "समुद्र की दशा",
      gis: "स्थिति और क्षेत्र",
    },
    floor: "आधिकारिक चेतावनी लागू — स्कोर इससे कम नहीं हो सकता",
    clears: "सुधरने की उम्मीद",
    safest: "सबसे सुरक्षित मार्ग",
    direct: "सीधा रास्ता",
    tabs: { route: "सुरक्षित मार्ग", danger: "तूफ़ान की चेतावनी", cyclone: "चक्रवात" },
    tabsLabel: "तैयार सवाल",
    askReal: "यही ऐप में पूछें",
    naval: "नौसेना अभ्यास क्षेत्र",
    channel: "बंदरगाह चैनल",
    imd: "IMD मछुआरा चेतावनी",
    until: "तक",
    storm: "गंभीर चक्रवाती तूफ़ान",
    track: "अनुमानित मार्ग",
    live: "अभी जवाब मिला · नक़ली डेटा",
    rehearsed: "तैयार परिदृश्य · नक़ली डेटा",
  },
  mr: {
    sheet: "एक प्रश्न, सुरुवातीपासून शेवटपर्यंत",
    ask: {
      route: "जवळच्या मासेमारी क्षेत्रापर्यंत सर्वात सुरक्षित मार्ग दाखवा",
      danger: "मी उद्या सकाळी ६ वाजता मासेमारीला जाऊ शकतो का?",
      cyclone: "पारादीपजवळ चक्रीवादळ आहे का?",
    },
    askLang: { route: "mr", danger: "mr", cyclone: "mr" },
    planner: "नियोजक",
    asks: "मच्छीमार विचारतो",
    crew: "टीमचा अहवाल",
    crewRan: (n) => `10 पैकी ${n} लागले`,
    idle: "या प्रश्नासाठी गरज नाही",
    verdict: { LOW: "जाणे सुरक्षित", MODERATE: "सावधगिरीने जा", HIGH: "जाऊ नका", EXTREME: "होडी उतरवू नका" },
    band: { LOW: "कमी", MODERATE: "मध्यम", HIGH: "जास्त", EXTREME: "अत्यंत" },
    why: "का — प्रत्येक गुणाचा हिशेब",
    factor: {
      wave: "लाटांची उंची",
      cyclone: "अधिकृत इशारा",
      wind: "वारा",
      weather: "पाऊस आणि दृश्यमानता",
      ocean: "समुद्राची स्थिती",
      gis: "स्थान आणि क्षेत्रे",
    },
    floor: "अधिकृत इशारा लागू — गुण यापेक्षा कमी होऊ शकत नाहीत",
    clears: "सुधारण्याची शक्यता",
    safest: "सर्वात सुरक्षित मार्ग",
    direct: "थेट मार्ग",
    tabs: { route: "सुरक्षित मार्ग", danger: "वादळाचा इशारा", cyclone: "चक्रीवादळ" },
    tabsLabel: "तयार प्रश्न",
    askReal: "हेच अ‍ॅपमध्ये विचारा",
    naval: "नौदल सराव क्षेत्र",
    channel: "बंदर मार्ग",
    imd: "IMD मच्छीमार इशारा",
    until: "पर्यंत",
    storm: "तीव्र चक्रीवादळ",
    track: "अंदाजित मार्ग",
    live: "आत्ताच उत्तर मिळाले · नमुना डेटा",
    rehearsed: "तयार परिस्थिती · नमुना डेटा",
  },
};

