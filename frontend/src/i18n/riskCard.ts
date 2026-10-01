import type { Language } from "../types";

/**
 * The one verdict vocabulary: the stamp prints these four phrases on every
 * verdict surface — the same words the landing hero stamps.
 */
export const VERDICT: Record<Language, Record<string, string>> = {
  en: {
    LOW: "Safe to go",
    MODERATE: "Go with care",
    HIGH: "Do not go",
    EXTREME: "Do not launch",
  },
  hi: {
    LOW: "जाना सुरक्षित",
    MODERATE: "सावधानी से जाएँ",
    HIGH: "न जाएँ",
    EXTREME: "नाव न उतारें",
  },
  mr: {
    LOW: "जाणे सुरक्षित",
    MODERATE: "सावधगिरीने जा",
    HIGH: "जाऊ नका",
    EXTREME: "होडी उतरवू नका",
  },
};

/** The headline under the eyebrow: the plain instruction as a sentence. */
export const INSTRUCTION: Record<Language, Record<string, string>> = {
  en: {
    LOW: "Conditions look safe",
    MODERATE: "Go, but with caution",
    HIGH: "Going is not recommended",
    EXTREME: "Do not go to sea",
  },
  hi: {
    LOW: "स्थिति सुरक्षित लग रही है",
    MODERATE: "जाएँ, पर सावधानी से",
    HIGH: "जाने की सलाह नहीं",
    EXTREME: "समुद्र में न जाएँ",
  },
  mr: {
    LOW: "परिस्थिती सुरक्षित दिसते",
    MODERATE: "जा, पण सावधगिरीने",
    HIGH: "जाण्याचा सल्ला नाही",
    EXTREME: "समुद्रात जाऊ नका",
  },
};

/** The band, as the stamp prints it. */
export const CATEGORY: Record<Language, Record<string, string>> = {
  en: { LOW: "LOW", MODERATE: "MODERATE", HIGH: "HIGH", EXTREME: "EXTREME" },
  hi: { LOW: "कम", MODERATE: "मध्यम", HIGH: "अधिक", EXTREME: "अत्यधिक" },
  mr: { LOW: "कमी", MODERATE: "मध्यम", HIGH: "जास्त", EXTREME: "अत्यंत" },
};

/** The six readings the risk engine weighs, by the key the backend gives them. */
export const FACTOR: Record<Language, Record<string, string>> = {
  en: {
    wave: "Wave height",
    cyclone: "Official warnings",
    wind: "Wind",
    weather: "Rain and visibility",
    ocean: "Sea state and current",
    gis: "Position and zones",
  },
  hi: {
    wave: "लहरों की ऊँचाई",
    cyclone: "आधिकारिक चेतावनियाँ",
    wind: "हवा",
    weather: "वर्षा और दृश्यता",
    ocean: "समुद्र की स्थिति और धारा",
    gis: "स्थान और प्रतिबंधित क्षेत्र",
  },
  mr: {
    wave: "लाटांची उंची",
    cyclone: "अधिकृत इशारे",
    wind: "वारा",
    weather: "पाऊस आणि दृश्यमानता",
    ocean: "समुद्राची स्थिती आणि प्रवाह",
    gis: "ठिकाण आणि प्रतिबंधित क्षेत्रे",
  },
};

export const UI: Record<Language, Record<string, string>> = {
  en: {
    why: "Why: points each reading adds",
    verdict: "Verdict",
    outOf: "{n} out of 100",
    answeredIn: "Answered in {lang}",
    data: "LIVE:live data|DEMO:simulated data|CACHE:cached data",
    moreReasons: "Also counted",
    ledger: "Evidence ledger",
    warning: "Official warning",
    improves: "Expected to clear after",
    askAgain: "— ask again then.",
    overrides: "Safety overrides applied",
    overrideNote:
      "Deterministic rules can only raise a risk score — never lower it. No model or language output can talk ORCA down from an official warning.",
    evidence: "Evidence",
    traced: "traced values",
    show: "Show",
    hide: "Hide",
    cols: "Value|Reading|Source|Updated",
  },
  hi: {
    why: "क्यों: हर रीडिंग कितने अंक जोड़ती है",
    verdict: "फ़ैसला",
    outOf: "100 में से {n}",
    answeredIn: "{lang} में उत्तर दिया गया",
    data: "LIVE:लाइव डेटा|DEMO:नकली आँकड़े|CACHE:कैश डेटा",
    moreReasons: "ये भी गिने गए",
    ledger: "प्रमाण बही",
    warning: "आधिकारिक चेतावनी",
    improves: "स्थिति सुधरने की संभावना",
    askAgain: "बजे के बाद — तब दोबारा पूछें।",
    overrides: "सुरक्षा नियम लागू",
    overrideNote:
      "नियम केवल जोखिम बढ़ा सकते हैं, घटा नहीं। कोई भी मॉडल आधिकारिक चेतावनी को रद्द नहीं कर सकता।",
    evidence: "प्रमाण",
    traced: "स्रोत-सहित मान",
    show: "दिखाएँ",
    hide: "छिपाएँ",
    cols: "मान|रीडिंग|स्रोत|अपडेट",
  },
  mr: {
    why: "का: प्रत्येक नोंद किती गुण वाढवते",
    verdict: "निर्णय",
    outOf: "100 पैकी {n}",
    answeredIn: "{lang} मध्ये उत्तर दिले",
    data: "LIVE:लाइव्ह डेटा|DEMO:नमुना माहिती|CACHE:कॅशे डेटा",
    moreReasons: "हेही मोजले",
    ledger: "पुरावा वही",
    warning: "अधिकृत इशारा",
    improves: "परिस्थिती सुधारण्याची शक्यता",
    askAgain: "नंतर — तेव्हा पुन्हा विचारा.",
    overrides: "सुरक्षा नियम लागू",
    overrideNote:
      "नियम फक्त धोका वाढवू शकतात, कमी करू शकत नाहीत. कोणतेही मॉडेल अधिकृत इशाऱ्याला ओलांडू शकत नाही.",
    evidence: "पुरावा",
    traced: "स्रोतासह मूल्ये",
    show: "दाखवा",
    hide: "लपवा",
    cols: "मूल्य|वाचन|स्रोत|अपडेट",
  },
};
