import type { Language } from "../types";

export const VERDICT: Record<Language, Record<string, string>> = {
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

export const UI: Record<Language, Record<string, string>> = {
  en: {
    why: "Why — ranked contribution to the score",
    warning: "Official warning",
    improves: "Conditions expected to improve after",
    askAgain: "— ask again then.",
    overrides: "Safety overrides applied",
    overrideNote:
      "Deterministic rules can only raise a risk score — never lower it. No model or language output can talk ORCA down from an official warning.",
    evidence: "Evidence",
    traced: "traced values",
    show: "show ▾",
    hide: "hide ▴",
    cols: "Value|Reading|Source|Updated",
  },
  hi: {
    why: "क्यों — स्कोर में योगदान",
    warning: "आधिकारिक चेतावनी",
    improves: "स्थिति सुधरने की संभावना",
    askAgain: "बजे के बाद — तब दोबारा पूछें।",
    overrides: "सुरक्षा नियम लागू",
    overrideNote:
      "नियम केवल जोखिम बढ़ा सकते हैं, घटा नहीं। कोई भी मॉडल आधिकारिक चेतावनी को रद्द नहीं कर सकता।",
    evidence: "प्रमाण",
    traced: "स्रोत-सहित मान",
    show: "दिखाएँ ▾",
    hide: "छिपाएँ ▴",
    cols: "मान|रीडिंग|स्रोत|अपडेट",
  },
  mr: {
    why: "का — गुणांमधील योगदान",
    warning: "अधिकृत इशारा",
    improves: "परिस्थिती सुधारण्याची शक्यता",
    askAgain: "नंतर — तेव्हा पुन्हा विचारा.",
    overrides: "सुरक्षा नियम लागू",
    overrideNote:
      "नियम फक्त धोका वाढवू शकतात, कमी करू शकत नाहीत. कोणतेही मॉडेल अधिकृत इशाऱ्याला ओलांडू शकत नाही.",
    evidence: "पुरावा",
    traced: "स्रोतासह मूल्ये",
    show: "दाखवा ▾",
    hide: "लपवा ▴",
    cols: "मूल्य|वाचन|स्रोत|अपडेट",
  },
};
