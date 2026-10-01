import type { Language } from "../types";

export const PLACEHOLDER: Record<Language, string> = {
  en: "Ask ORCA — can I go fishing tomorrow at 6 AM?",
  hi: "ORCA से पूछें — क्या मैं कल सुबह 6 बजे जा सकता हूँ?",
  mr: "ORCA ला विचारा — मी उद्या सकाळी ६ वाजता जाऊ शकतो का?",
};

export const T: Record<Language, Record<string, string>> = {
  en: {
    title: "Ask ORCA",
    sub: "Type or speak — English · हिंदी · मराठी",
    you: "You",
    emptyMain: "Ask about safety, fishing zones, routes or warnings.",
    emptySub: "ORCA keeps context — follow-ups like “what about 12 PM?” work.",
    busy: "agents working…",
  },
  hi: {
    title: "ORCA से पूछें",
    sub: "लिखें या बोलें — English · हिंदी · मराठी",
    you: "आप",
    emptyMain: "सुरक्षा, मत्स्य क्षेत्र, मार्ग या चेतावनियों के बारे में पूछिए।",
    emptySub: "ORCA संदर्भ याद रखता है — “दोपहर 12 बजे क्या?” जैसे सवाल चलते हैं।",
    busy: "एजेंट काम कर रहे हैं…",
  },
  mr: {
    title: "ORCA ला विचारा",
    sub: "लिहा किंवा बोला — English · हिंदी · मराठी",
    you: "तुम्ही",
    emptyMain: "सुरक्षा, मासेमारी क्षेत्रे, मार्ग किंवा इशाऱ्यांबद्दल विचारा.",
    emptySub: "ORCA संदर्भ लक्षात ठेवते — “दुपारी १२ वाजता काय?” असे प्रश्न चालतात.",
    busy: "एजंट काम करत आहेत…",
  },
};
