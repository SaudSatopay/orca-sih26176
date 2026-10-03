import type { Language } from "../types";

/**
 * The night bands and the halftone sea on the landing
 * (components/landing/NightBands.tsx), in the fisher's three languages.
 * The verdict word is the product's own (riskCard.ts VERDICT.HIGH) and the
 * agent names are the crew's (agentTrace.ts LABEL); the two call-to-action
 * labels are the landing's (landing.ts L10N).
 */
export const BANDS: Record<
  Language,
  {
    watch: { kicker: string; title: string; body: string };
    halftone: { kicker: string; title: string; body: string; sources: string[] };
    warning: { kicker: string; title: string; body: string; rule: string; authorities: string };
    threads: { kicker: string; title: string; body: string; decision: string };
    call: { kicker: string; title: string };
  }
> = {
  en: {
    watch: {
      kicker: "Night watch · 04:30",
      title: "Before dawn, the crew has already read the sea.",
      body: "While the boats are still being readied, ten agents have read the wind, the swell, the warnings and the fishing grounds. The answer is waiting in your language before you reach the jetty.",
    },
    halftone: {
      kicker: "Provenance",
      title: "Every number carries its source.",
      body: "Wind and warnings from IMD, swell and sea temperature from INCOIS, fishing zones from the PFZ advisory. Each figure on the chart says where it came from and how old it is, so you can check it before you trust it.",
      sources: ["IMD", "INCOIS", "PFZ advisory"],
    },
    warning: {
      kicker: "The one rule above the model",
      title: "Official warnings override everything.",
      body: "When IMD or INCOIS issues a warning for your stretch of coast, ORCA's verdict is do not go, whatever the model scores and however good the fishing looks. The model can make the advice more careful, never less.",
      rule: "Official warning in force",
      authorities: "IMD · INCOIS",
    },
    threads: {
      kicker: "The crew",
      title: "Ten agents. One thread.",
      body: "Each specialist reads its own part of the sea. The risk engine waits for all ten, then ties their readings into one decision you can question line by line.",
      decision: "One decision",
    },
    call: {
      kicker: "Before you cast off",
      title: "Read today's sea.",
    },
  },
  hi: {
    watch: {
      kicker: "रात की निगरानी · 04:30",
      title: "भोर से पहले ही दल समुद्र पढ़ चुका है।",
      body: "जब नावें अभी तैयार हो रही होती हैं, दस एजेंट हवा, लहरें, चेतावनियाँ और मछली के क्षेत्र पढ़ चुके होते हैं। जेटी तक पहुँचने से पहले जवाब आपकी भाषा में तैयार रहता है।",
    },
    halftone: {
      kicker: "स्रोत",
      title: "हर संख्या अपना स्रोत साथ रखती है।",
      body: "हवा और चेतावनियाँ IMD से, लहरें और समुद्र का तापमान INCOIS से, मछली के क्षेत्र PFZ सलाह से। नक्शे का हर आँकड़ा बताता है कि वह कहाँ से आया और कितना पुराना है, ताकि भरोसा करने से पहले आप उसे जाँच सकें।",
      sources: ["IMD", "INCOIS", "PFZ सलाह"],
    },
    warning: {
      kicker: "मॉडल से ऊपर का एक नियम",
      title: "आधिकारिक चेतावनी हर बात से ऊपर है।",
      body: "जब IMD या INCOIS आपके तट के लिए चेतावनी जारी करता है, ORCA का फ़ैसला होता है: न जाएँ, चाहे मॉडल का स्कोर कुछ भी हो और मछली कितनी भी अच्छी दिखे। मॉडल सलाह को और सावधान बना सकता है, कभी ढीला नहीं।",
      rule: "आधिकारिक चेतावनी लागू",
      authorities: "IMD · INCOIS",
    },
    threads: {
      kicker: "दल",
      title: "दस एजेंट। एक धागा।",
      body: "हर विशेषज्ञ समुद्र का अपना हिस्सा पढ़ता है। रिस्क इंजन दसों का इंतज़ार करता है, फिर उनकी रीडिंग को एक फ़ैसले में बाँधता है, जिस पर आप हर पंक्ति में सवाल कर सकते हैं।",
      decision: "एक फ़ैसला",
    },
    call: {
      kicker: "किनारा छोड़ने से पहले",
      title: "आज का समुद्र पढ़िए।",
    },
  },
  mr: {
    watch: {
      kicker: "रात्रीचा पहारा · 04:30",
      title: "पहाट होण्याआधीच चमूने समुद्र वाचलेला असतो.",
      body: "बोटी तयार होत असतानाच दहा एजंटांनी वारा, लाटा, इशारे आणि मासेमारीची क्षेत्रे वाचलेली असतात. धक्क्यावर पोहोचण्याआधीच उत्तर तुमच्या भाषेत तयार असते.",
    },
    halftone: {
      kicker: "स्रोत",
      title: "प्रत्येक आकडा आपला स्रोत सोबत घेऊन येतो.",
      body: "वारा आणि इशारे IMD कडून, लाटा आणि समुद्राचे तापमान INCOIS कडून, मासेमारी क्षेत्रे PFZ सल्ल्यातून. नकाशावरील प्रत्येक आकडा तो कुठून आला आणि किती जुना आहे हे सांगतो, म्हणजे विश्वास ठेवण्याआधी तुम्ही तो तपासू शकता.",
      sources: ["IMD", "INCOIS", "PFZ सल्ला"],
    },
    warning: {
      kicker: "मॉडेलच्या वरचा एकमेव नियम",
      title: "अधिकृत इशारा सर्वांच्या वर.",
      body: "IMD किंवा INCOIS तुमच्या किनाऱ्यासाठी इशारा देतात तेव्हा ORCA चा निर्णय असतो: जाऊ नका, मॉडेलचा गुण काहीही असो आणि मासे कितीही चांगले दिसोत. मॉडेल सल्ला अधिक सावध करू शकते, कधीही सैल नाही.",
      rule: "अधिकृत इशारा लागू",
      authorities: "IMD · INCOIS",
    },
    threads: {
      kicker: "चमू",
      title: "दहा एजंट. एक धागा.",
      body: "प्रत्येक तज्ज्ञ समुद्राचा आपला भाग वाचतो. रिस्क इंजिन दहाही जणांची वाट पाहते, मग त्यांचे वाचन एका निर्णयात गुंफते, ज्यावर तुम्ही ओळीओळीने प्रश्न विचारू शकता.",
      decision: "एक निर्णय",
    },
    call: {
      kicker: "किनारा सोडण्याआधी",
      title: "आजचा समुद्र वाचा.",
    },
  },
};
