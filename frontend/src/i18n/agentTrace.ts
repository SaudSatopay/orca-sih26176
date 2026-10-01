import type { Language } from "../types";

export const LABEL: Record<Language, Record<string, string>> = {
  en: {
    intent: "Intent", weather: "Weather", ocean: "Ocean", pfz: "Fishing zones",
    cyclone: "Alerts", gis: "GIS", risk: "Risk engine", route: "Route",
    explanation: "Explanation",
  },
  hi: {
    intent: "आशय", weather: "मौसम", ocean: "समुद्र", pfz: "मत्स्य क्षेत्र",
    cyclone: "चेतावनियाँ", gis: "GIS", risk: "रिस्क इंजन", route: "मार्ग",
    explanation: "व्याख्या",
  },
  mr: {
    intent: "हेतू", weather: "हवामान", ocean: "समुद्र", pfz: "मासेमारी क्षेत्रे",
    cyclone: "इशारे", gis: "GIS", risk: "रिस्क इंजिन", route: "मार्ग",
    explanation: "स्पष्टीकरण",
  },
};

export const T: Record<Language, Record<string, string>> = {
  en: {
    crew: "Agent crew",
    agents: "agents",
    total: "ms total",
    concurrent: "CONCURRENT",
    understand: "Understand", understandN: "parse the question",
    gather: "Gather", gatherN: "specialists run in parallel",
    decide: "Decide", decideN: "fuse evidence, plan",
    explain: "Explain", explainN: "answer in the user's language",
    note: "The planner decides which specialists a question needs and runs the independent ones concurrently. The risk engine waits for all of them — no agent's opinion can skip it.",
  },
  hi: {
    crew: "एजेंट टीम",
    agents: "एजेंट",
    total: "ms कुल",
    concurrent: "एक साथ",
    understand: "समझो", understandN: "सवाल परखो",
    gather: "जुटाओ", gatherN: "विशेषज्ञ एक साथ चलते हैं",
    decide: "तय करो", decideN: "प्रमाण जोड़ो, योजना बनाओ",
    explain: "समझाओ", explainN: "उपयोगकर्ता की भाषा में जवाब",
    note: "प्लानर तय करता है कि किस सवाल के लिए कौन से विशेषज्ञ चाहिए और स्वतंत्र एजेंटों को एक साथ चलाता है। रिस्क इंजन सबका इंतज़ार करता है — कोई भी एजेंट इसे लाँघ नहीं सकता।",
  },
  mr: {
    crew: "एजंट टीम",
    agents: "एजंट",
    total: "ms एकूण",
    concurrent: "एकाच वेळी",
    understand: "समजून घ्या", understandN: "प्रश्न पारखा",
    gather: "गोळा करा", gatherN: "तज्ज्ञ एकाच वेळी चालतात",
    decide: "ठरवा", decideN: "पुरावे जोडा, योजना करा",
    explain: "समजावा", explainN: "वापरकर्त्याच्या भाषेत उत्तर",
    note: "प्लॅनर ठरवतो की प्रश्नाला कोणते तज्ज्ञ हवेत आणि स्वतंत्र एजंटांना एकाच वेळी चालवतो. रिस्क इंजिन सर्वांची वाट पाहते — कोणताही एजंट ते टाळू शकत नाही.",
  },
};
