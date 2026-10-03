import type { Language } from "../types";

/** The seven sheets the landing shows, captured from the running app. */
export type SheetId = "today" | "ask" | "authority" | "system" | "phoneToday" | "phoneMap" | "phoneAsk";

export interface ShowcaseStrings {
  editions: {
    kicker: string;
    title: string;
    lead: string;
    /** The two buttons; also what each edition is called. */
    console: string;
    phone: string;
    switchLabel: string;
    /** The phone edition picture: the three phone tabs side by side. */
    phoneAlt: string;
    pause: string;
    play: string;
  };
  flow: {
    kicker: string;
    title: string;
    lead: string;
    /** The poster strip, a scrollable region. */
    strip: string;
  };
  ripple: {
    kicker: string;
    title: string;
    caption: string;
  };
  crumple: {
    kicker: string;
    title: string;
    lead: string;
    officers: string;
    fisher: string;
    verdict: string;
    /** ORCA's plain answer. Always DOM text, never part of an image. */
    answer: string;
    footnote: string;
    crumple: string;
    smooth: string;
    hint: string;
    bulletinAlt: string;
  };
  sheets: Record<SheetId, { caption: string; alt: string }>;
}

/** Every word of the four showcase sections, in the reader's three languages. */
export const SHOWCASE: Record<Language, ShowcaseStrings> = {
  en: {
    editions: {
      kicker: "Two editions",
      title: "One ORCA, two editions",
      lead: "The console is for officers and port control: the whole coast, every number with its source. The phone is for the fisher at the jetty: one verdict, one button to hear it. Same crew of agents, same numbers.",
      console: "Console",
      phone: "Phone",
      switchLabel: "Show an edition",
      phoneAlt:
        "ORCA on a phone, three tabs side by side: Today with the risk circle at 29 and one large LISTEN button, the Map with numbered fishing grounds, and Ask with a tap-and-speak button.",
      pause: "Pause",
      play: "Play",
    },
    flow: {
      kicker: "The sheets",
      title: "Every sheet of ORCA, as it runs today",
      lead: "Captured from the running app, not drawn for this page: the console's four sheets and the phone's three tabs. Drag the row, or let it drift.",
      strip: "Screens of ORCA",
    },
    ripple: {
      kicker: "The chart",
      title: "The chart is the sea.",
      caption: "Ask ORCA, a cyclone off Paradip. Move across the sheet and the chart moves like water.",
    },
    crumple: {
      kicker: "Plain words",
      title: "Bulletins are written for officers. ORCA rewrites them for the fisher.",
      lead: "A warning in knots, coded positions and sea states helps nobody on a small boat. ORCA reads it, and says what it means for him today, in his own language.",
      officers: "Written for officers",
      fisher: "ORCA, for the fisher",
      verdict: "Do not go",
      answer: "Do not go out. Stay on land. The sea is too rough — a cyclone warning is in force.",
      footnote: "Same warning, in plain words.",
      crumple: "Crumple the bulletin",
      smooth: "Smooth it out",
      hint: "Or press and hold the bulletin.",
      bulletinAlt:
        "An illustrative marine bulletin in dense upper-case type: storm positions, wind in knots, sea states and coded figures.",
    },
    sheets: {
      today: {
        caption: "Today",
        alt: "The ORCA console, Today sheet: the chart off Mumbai with numbered fishing grounds, a moderate risk of 29 and the plan for the day.",
      },
      ask: {
        caption: "Ask ORCA",
        alt: "The ORCA console, Ask sheet: the cyclone question off Paradip answered with extreme risk, 92 out of 100, the verdict “Do not go to sea” and its reasons.",
      },
      authority: {
        caption: "Authority",
        alt: "The ORCA console, Authority sheet: risk along the whole coast and the board of landing centres, with Paradip extreme and Digha high.",
      },
      system: {
        caption: "System",
        alt: "The ORCA console, System sheet: where the data comes from and how the ten agents reason over it.",
      },
      phoneToday: {
        caption: "Phone · Today",
        alt: "ORCA on a phone, Today: the risk circle at 29, “Go with care”, one large LISTEN button, and no safe time to fish today.",
      },
      phoneMap: {
        caption: "Phone · Map",
        alt: "ORCA on a phone, Map: the chart off Mumbai with numbered fishing grounds and the wind drawn across the sea.",
      },
      phoneAsk: {
        caption: "Phone · Ask",
        alt: "ORCA on a phone, Ask: a large tap-and-speak button and four questions to tap.",
      },
    },
  },
  hi: {
    editions: {
      kicker: "दो संस्करण",
      title: "एक ORCA, दो संस्करण",
      lead: "कंसोल अधिकारियों और बंदरगाह नियंत्रण के लिए है: पूरा तट, हर संख्या अपने स्रोत के साथ। फ़ोन घाट पर खड़े मछुआरे के लिए है: एक फ़ैसला, सुनने के लिए एक बटन। वही एजेंट, वही संख्याएँ।",
      console: "कंसोल",
      phone: "फ़ोन",
      switchLabel: "संस्करण दिखाएँ",
      phoneAlt:
        "फ़ोन पर ORCA, तीन टैब साथ-साथ: आज, 29 पर जोखिम का घेरा और सुनने का एक बड़ा बटन; नक्शा, क्रमांकित मछली क्षेत्रों के साथ; और पूछें, दबाकर बोलने के बटन के साथ।",
      pause: "रोकें",
      play: "चलाएँ",
    },
    flow: {
      kicker: "शीट",
      title: "ORCA की हर शीट, जैसी आज चलती है",
      lead: "चलते हुए ऐप से ली गई, इस पेज के लिए बनाई नहीं गई: कंसोल की चार शीट और फ़ोन के तीन टैब। पंक्ति को खींचें, या बहने दें।",
      strip: "ORCA की स्क्रीन",
    },
    ripple: {
      kicker: "नक्शा",
      title: "नक्शा ही समुद्र है।",
      caption: "ORCA से पूछें, पारादीप के पास चक्रवात। शीट पर चलें और नक्शा पानी की तरह हिलता है।",
    },
    crumple: {
      kicker: "सीधे शब्द",
      title: "बुलेटिन अधिकारियों के लिए लिखे जाते हैं। ORCA उन्हें मछुआरे के लिए दोबारा लिखता है।",
      lead: "नॉट में हवा, कोड में स्थिति और समुद्र की अवस्था वाली चेतावनी छोटी नाव पर किसी काम की नहीं। ORCA उसे पढ़ता है, और बताता है कि आज उसके लिए इसका क्या मतलब है, उसकी अपनी भाषा में।",
      officers: "अधिकारियों के लिए लिखा गया",
      fisher: "ORCA, मछुआरे के लिए",
      verdict: "मत जाइए",
      answer: "समुद्र में मत जाइए। किनारे पर ही रहिए। समुद्र बहुत उफान पर है — चक्रवात की चेतावनी लागू है।",
      footnote: "वही चेतावनी, सीधे शब्दों में।",
      crumple: "बुलेटिन को मरोड़ें",
      smooth: "फिर से सीधा करें",
      hint: "या बुलेटिन को दबाकर रखें।",
      bulletinAlt:
        "एक उदाहरण समुद्री बुलेटिन, घने बड़े अक्षरों में: तूफ़ान की स्थितियाँ, नॉट में हवा, समुद्र की अवस्था और कोड वाले अंक।",
    },
    sheets: {
      today: {
        caption: "आज",
        alt: "ORCA कंसोल, आज की शीट: मुंबई के पास का नक्शा, क्रमांकित मछली क्षेत्र, 29 का मध्यम जोखिम और दिन की योजना।",
      },
      ask: {
        caption: "ORCA से पूछें",
        alt: "ORCA कंसोल, पूछें शीट: पारादीप के पास चक्रवात का सवाल, 100 में 92 का अत्यधिक जोखिम, फ़ैसला “समुद्र में मत जाइए” और उसके कारण।",
      },
      authority: {
        caption: "प्राधिकरण",
        alt: "ORCA कंसोल, प्राधिकरण शीट: पूरे तट का जोखिम और लैंडिंग केंद्रों की सूची, पारादीप अत्यधिक और दीघा उच्च।",
      },
      system: {
        caption: "सिस्टम",
        alt: "ORCA कंसोल, सिस्टम शीट: डेटा कहाँ से आता है और दस एजेंट उस पर कैसे सोचते हैं।",
      },
      phoneToday: {
        caption: "फ़ोन · आज",
        alt: "फ़ोन पर ORCA, आज: 29 पर जोखिम का घेरा, “सावधानी से जाएँ”, सुनने का एक बड़ा बटन, और आज मछली पकड़ने का सुरक्षित समय नहीं।",
      },
      phoneMap: {
        caption: "फ़ोन · नक्शा",
        alt: "फ़ोन पर ORCA, नक्शा: मुंबई के पास का नक्शा, क्रमांकित मछली क्षेत्र और समुद्र पर बहती हवा।",
      },
      phoneAsk: {
        caption: "फ़ोन · पूछें",
        alt: "फ़ोन पर ORCA, पूछें: दबाकर बोलने का बड़ा बटन और दबाने के लिए चार सवाल।",
      },
    },
  },
  mr: {
    editions: {
      kicker: "दोन आवृत्त्या",
      title: "एक ORCA, दोन आवृत्त्या",
      lead: "कन्सोल अधिकारी आणि बंदर नियंत्रणासाठी आहे: संपूर्ण किनारा, प्रत्येक आकडा त्याच्या स्रोतासह. फोन धक्क्यावरच्या मच्छीमारासाठी आहे: एक निर्णय, ऐकण्यासाठी एक बटण. तेच एजंट, तेच आकडे.",
      console: "कन्सोल",
      phone: "फोन",
      switchLabel: "आवृत्ती दाखवा",
      phoneAlt:
        "फोनवर ORCA, तीन टॅब शेजारी शेजारी: आज, 29 वर धोक्याचे वर्तुळ आणि ऐकण्याचे एक मोठे बटण; नकाशा, क्रमांक दिलेल्या मासेमारी क्षेत्रांसह; आणि विचारा, दाबून बोलण्याच्या बटणासह.",
      pause: "थांबवा",
      play: "चालू करा",
    },
    flow: {
      kicker: "पत्रके",
      title: "ORCA चे प्रत्येक पत्रक, आज जसे चालते तसे",
      lead: "चालू ॲपमधून घेतलेली, या पानासाठी काढलेली नाहीत: कन्सोलची चार पत्रके आणि फोनचे तीन टॅब. ओळ ओढा, किंवा वाहू द्या.",
      strip: "ORCA च्या स्क्रीन",
    },
    ripple: {
      kicker: "नकाशा",
      title: "नकाशा हाच समुद्र आहे.",
      caption: "ORCA ला विचारा, पारादीपजवळ चक्रीवादळ. पत्रकावरून फिरा आणि नकाशा पाण्यासारखा हलतो.",
    },
    crumple: {
      kicker: "साधे शब्द",
      title: "बुलेटिन अधिकाऱ्यांसाठी लिहिले जातात. ORCA ते मच्छीमारासाठी पुन्हा लिहितो.",
      lead: "नॉटमधला वारा, सांकेतिक स्थाने आणि समुद्राच्या अवस्था असलेला इशारा लहान होडीवर कुणाच्याच कामाचा नाही. ORCA तो वाचतो, आणि आज त्याच्यासाठी त्याचा काय अर्थ आहे ते त्याच्याच भाषेत सांगतो.",
      officers: "अधिकाऱ्यांसाठी लिहिलेले",
      fisher: "ORCA, मच्छीमारासाठी",
      verdict: "जाऊ नका",
      answer: "समुद्रात जाऊ नका. किनाऱ्यावरच राहा. समुद्र खूप खवळलेला आहे — चक्रीवादळाचा इशारा लागू आहे.",
      footnote: "तोच इशारा, साध्या शब्दांत.",
      crumple: "बुलेटिन चुरगळा",
      smooth: "पुन्हा सरळ करा",
      hint: "किंवा बुलेटिन दाबून धरा.",
      bulletinAlt:
        "एक उदाहरणादाखल सागरी बुलेटिन, दाट मोठ्या अक्षरांत: वादळाची स्थाने, नॉटमधला वारा, समुद्राच्या अवस्था आणि सांकेतिक आकडे.",
    },
    sheets: {
      today: {
        caption: "आज",
        alt: "ORCA कन्सोल, आजचे पत्रक: मुंबईजवळचा नकाशा, क्रमांक दिलेली मासेमारी क्षेत्रे, 29 चा मध्यम धोका आणि दिवसाची योजना.",
      },
      ask: {
        caption: "ORCA ला विचारा",
        alt: "ORCA कन्सोल, विचारा पत्रक: पारादीपजवळच्या चक्रीवादळाचा प्रश्न, 100 पैकी 92 चा अतिधोका, निर्णय “समुद्रात जाऊ नका” आणि त्याची कारणे.",
      },
      authority: {
        caption: "प्राधिकरण",
        alt: "ORCA कन्सोल, प्राधिकरण पत्रक: संपूर्ण किनाऱ्यावरचा धोका आणि लँडिंग केंद्रांचा फलक, पारादीप अतिधोका आणि दिघा उच्च.",
      },
      system: {
        caption: "प्रणाली",
        alt: "ORCA कन्सोल, प्रणाली पत्रक: डेटा कुठून येतो आणि दहा एजंट त्यावर कसा विचार करतात.",
      },
      phoneToday: {
        caption: "फोन · आज",
        alt: "फोनवर ORCA, आज: 29 वर धोक्याचे वर्तुळ, “सावधगिरीने जा”, ऐकण्याचे एक मोठे बटण, आणि आज मासेमारीसाठी सुरक्षित वेळ नाही.",
      },
      phoneMap: {
        caption: "फोन · नकाशा",
        alt: "फोनवर ORCA, नकाशा: मुंबईजवळचा नकाशा, क्रमांक दिलेली मासेमारी क्षेत्रे आणि समुद्रावर वाहणारा वारा.",
      },
      phoneAsk: {
        caption: "फोन · विचारा",
        alt: "फोनवर ORCA, विचारा: दाबून बोलण्याचे मोठे बटण आणि दाबण्यासाठी चार प्रश्न.",
      },
    },
  },
};
