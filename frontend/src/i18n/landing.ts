import type { Language } from "../types";

/** Every word on the front door, in the fisher's three languages. */
export const L10N: Record<
  Language,
  {
    tag1: string;
    tag2a: string;
    tag2b: string;
    tag2c: string;
    sub: string;
    ctaTour: string;
    ctaOpen: string;
    ctaPhone: string;
    ctaTry: string;
    openOrca: string;
    openWord: string;
    watchLive: string;
    pipelineTitle: string;
    stats: string[];
    cards: { kicker: string; title: string; lines: string[] }[];
    phases: { t: string; n: string }[];
    footer: string;
  }
> = {
  en: {
    tag1: "Ten agents read the sea.",
    tag2a: "One safe, ",
    tag2b: "explainable",
    tag2c: " decision.",
    sub: "Marine EcOsystem Reasoning with Collaborative Agents — India's marine data turned into plain words a fisher can act on, in his own language, with every number carrying its source.",
    ctaTour: "Watch the guided tour",
    ctaOpen: "Open the app",
    ctaPhone: "Phone version",
    ctaTry: "Try: cyclone near Paradip →",
    openOrca: "Open ORCA",
    openWord: "Open",
    watchLive: "watch it run live →",
    pipelineTitle: "How ORCA decides",
    stats: ["Agents in the crew", "Landing centres", "Official warnings", "Languages", "Data edition"],
    cards: [
      {
        kicker: "Today's plan",
        title: "Where the fish are",
        lines: [
          "Opens knowing where you are — reads 100 km of sea unprompted",
          "Every ground scored for chance of fish, with the why behind it",
          "Trip plan: when to go, how long to stay, what it should earn",
        ],
      },
      {
        kicker: "Ask ORCA",
        title: "Your language, spoken or typed",
        lines: [
          "English · हिंदी · मराठी — detected, never configured",
          "A 0–100 risk verdict where every point is attributed",
          "Official warnings override the model. Always.",
        ],
      },
      {
        kicker: "Authority",
        title: "The district view",
        lines: [
          "Every landing centre on the coast, scored by the same engine",
          "The administration sees the same evidence the fisher sees",
          "One-click CSV export for the day's advisory board",
        ],
      },
    ],
    phases: [
      { t: "Understand", n: "parse the question, any language" },
      { t: "Gather", n: "five specialists fan out concurrently" },
      { t: "Decide", n: "weighted model + safety floors that only raise" },
      { t: "Explain", n: "plain words, with sources, spoken back" },
    ],
    footer:
      "Demo / simulated data is always labelled · ORCA is decision support — never a replacement for an official advisory",
  },
  hi: {
    tag1: "दस एजेंट समुद्र पढ़ते हैं।",
    tag2a: "एक सुरक्षित, ",
    tag2b: "समझाने योग्य",
    tag2c: " फ़ैसला।",
    sub: "भारत का समुद्री डेटा, मछुआरे की अपनी भाषा में, सीधे काम आने वाले शब्दों में — और हर आँकड़े के साथ उसका स्रोत।",
    ctaTour: "गाइडेड टूर देखें",
    ctaOpen: "ऐप खोलें",
    ctaPhone: "फ़ोन संस्करण",
    ctaTry: "देखें: पारादीप के पास चक्रवात →",
    openOrca: "ORCA खोलें",
    openWord: "खोलें",
    watchLive: "इसे चलते हुए देखें →",
    pipelineTitle: "ORCA फ़ैसला कैसे करता है",
    stats: ["टीम के एजेंट", "लैंडिंग सेंटर", "आधिकारिक चेतावनियाँ", "भाषाएँ", "डेटा संस्करण"],
    cards: [
      {
        kicker: "आज की योजना",
        title: "मछली कहाँ है",
        lines: [
          "खुलते ही आपकी जगह जानता है — 100 किमी समुद्र ख़ुद पढ़ता है",
          "हर इलाक़े को मछली की संभावना पर अंक, कारण के साथ",
          "यात्रा योजना: कब जाएँ, कितना रुकें, कितना मिलेगा",
        ],
      },
      {
        kicker: "ORCA से पूछें",
        title: "आपकी भाषा, बोलकर या लिखकर",
        lines: [
          "English · हिंदी · मराठी — ख़ुद पहचानता है, कोई सेटिंग नहीं",
          "0–100 का जोखिम, हर अंक के हिसाब के साथ",
          "आधिकारिक चेतावनी मॉडल से हमेशा ऊपर।",
        ],
      },
      {
        kicker: "प्रशासन",
        title: "ज़िले का नज़ारा",
        lines: [
          "तट का हर लैंडिंग सेंटर, उसी इंजन से आँका हुआ",
          "प्रशासन वही प्रमाण देखता है जो मछुआरा देखता है",
          "दिन के बोर्ड का एक-क्लिक CSV निर्यात",
        ],
      },
    ],
    phases: [
      { t: "समझो", n: "सवाल परखो, किसी भी भाषा में" },
      { t: "जुटाओ", n: "पाँच विशेषज्ञ एक साथ निकलते हैं" },
      { t: "तय करो", n: "भारित मॉडल + नियम जो सिर्फ़ जोखिम बढ़ाते हैं" },
      { t: "समझाओ", n: "सीधी भाषा, स्रोतों के साथ, बोलकर भी" },
    ],
    footer:
      "नक़ली/डेमो डेटा पर हमेशा लेबल · ORCA निर्णय-सहायक है — आधिकारिक सलाह का विकल्प कभी नहीं",
  },
  mr: {
    tag1: "दहा एजंट समुद्र वाचतात.",
    tag2a: "एक सुरक्षित, ",
    tag2b: "स्पष्टीकरणासह",
    tag2c: " निर्णय.",
    sub: "भारताचा सागरी डेटा, मच्छीमाराच्या स्वतःच्या भाषेत, थेट कामी येणाऱ्या शब्दांत — आणि प्रत्येक आकड्यासोबत त्याचा स्रोत.",
    ctaTour: "गाइडेड टूर पाहा",
    ctaOpen: "अ‍ॅप उघडा",
    ctaPhone: "फोन आवृत्ती",
    ctaTry: "पाहा: पारादीपजवळ चक्रीवादळ →",
    openOrca: "ORCA उघडा",
    openWord: "उघडा",
    watchLive: "हे चालताना पाहा →",
    pipelineTitle: "ORCA निर्णय कसा घेते",
    stats: ["टीममधील एजंट", "लँडिंग सेंटर", "अधिकृत इशारे", "भाषा", "डेटा आवृत्ती"],
    cards: [
      {
        kicker: "आजची योजना",
        title: "मासे कुठे आहेत",
        lines: [
          "उघडताच तुमचे ठिकाण ओळखते — १०० किमी समुद्र स्वतः वाचते",
          "प्रत्येक जागेला माशांच्या शक्यतेवर गुण, कारणासह",
          "फेरीची योजना: कधी जायचे, किती थांबायचे, किती मिळेल",
        ],
      },
      {
        kicker: "ORCA ला विचारा",
        title: "तुमची भाषा, बोलून किंवा लिहून",
        lines: [
          "English · हिंदी · मराठी — स्वतः ओळखते, सेटिंग नाही",
          "0–100 धोका, प्रत्येक गुणाच्या हिशेबासह",
          "अधिकृत इशारा मॉडेलच्या नेहमी वर.",
        ],
      },
      {
        kicker: "प्रशासन",
        title: "जिल्ह्याचे दृश्य",
        lines: [
          "किनाऱ्यावरील प्रत्येक लँडिंग सेंटर, त्याच इंजिनने तपासलेले",
          "प्रशासनाला तेच पुरावे दिसतात जे मच्छीमाराला दिसतात",
          "दिवसाच्या बोर्डाचे एक-क्लिक CSV निर्यात",
        ],
      },
    ],
    phases: [
      { t: "समजून घ्या", n: "प्रश्न पारखा, कोणत्याही भाषेत" },
      { t: "गोळा करा", n: "पाच तज्ज्ञ एकाच वेळी निघतात" },
      { t: "ठरवा", n: "भारित मॉडेल + फक्त धोका वाढवणारे नियम" },
      { t: "समजावा", n: "सोपी भाषा, स्रोतांसह, बोलूनही" },
    ],
    footer:
      "नमुना/डेमो डेटावर नेहमी लेबल · ORCA निर्णय-सहाय्यक आहे — अधिकृत सल्ल्याचा पर्याय कधीही नाही",
  },
};
