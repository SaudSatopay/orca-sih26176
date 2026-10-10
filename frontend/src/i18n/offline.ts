import type { GateState, Language } from "../types";

interface OfflineText {
  /** The banner's title when the network is down. */
  title: string;
  /** "This is ORCA's last plan, from {t}, {age} ago." */
  lastPlan: string;
  /** Why the verdict under the banner may read lower than it did. */
  rejudged: string;
  /** No network and nothing saved on this phone. */
  noPlan: string;
  /** An Ask question while offline: ORCA does not guess. */
  askOffline: string;
  /** "ORCA's last plan is from {t}, {age} ago, on {tab}." */
  askLastPlan: string;
  openPlan: string;
  /** Shown only under the `?offline=` demo link. */
  demo: string;
  /**
   * The safety gate's sentences, re-said on the phone when it re-judges a
   * saved plan. Word for word the backend's (services/i18n.py and
   * plain_language.GATE_LINE), so an offline verdict reads like an online one.
   */
  gate: {
    headline: Record<GateState, string>;
    /** The advice's first sentence under CAUTION / INSUFFICIENT_DATA. */
    line: { CAUTION: string; INSUFFICIENT_DATA: string };
    fresh: string;
    stale: string;
    expired: string;
    future: string;
    reasonStale: string;
    reasonBlocking: string;
    allFresh: string;
    block: string;
    cautionAct: string;
    nogoMissing: string;
    nogoStale: string;
  };
}

/** The phone's words for a plan read without a connection. */
export const OFFLINE: Record<Language, OfflineText> = {
  en: {
    title: "No connection",
    lastPlan: "This is ORCA's last plan, from {t}, {age} ago.",
    rejudged:
      "Checked again on this phone for its age. Old readings can only lower the verdict, never raise it.",
    noPlan:
      "No connection, and this phone has no saved plan from ORCA yet. ORCA will not guess. Follow the official warning.",
    askOffline: "No connection, so ORCA will not guess an answer.",
    askLastPlan: "ORCA's last plan is from {t}, {age} ago, on {tab}.",
    openPlan: "Open the last plan",
    demo: "Demo link: the connection is switched off on purpose.",
    gate: {
      headline: {
        GO: "Evidence check passed — normal confidence.",
        CAUTION: "Caution — some of the data behind this answer is out of date.",
        INSUFFICIENT_DATA: "Not enough reliable data to decide — follow the official advisory.",
        NO_GO: "Do not go — the existing safety rules decide.",
      },
      line: {
        CAUTION: "Be careful: some of today's sea data is old. Check the latest warning before you go.",
        INSUFFICIENT_DATA:
          "ORCA does not have enough reliable sea data to say go today. Follow the official advisory.",
      },
      fresh: "{age} old (limit {limit})",
      stale: "{age} old — over the {limit} limit",
      expired: "{age} old — too old to use (limit {limit})",
      future: "its time is in the future, so it cannot be trusted",
      reasonStale: "{input} is {age} old — over the {limit} limit.",
      reasonBlocking: "{input}: {detail}.",
      allFresh: "All {n} critical inputs are fresh.",
      block: "ORCA will not clear a trip on missing or out-of-date evidence.",
      cautionAct: "Check the latest IMD / INCOIS bulletin before you go.",
      nogoMissing:
        "The safety rules already say do not go. With a reading missing, the real risk may be higher than shown.",
      nogoStale:
        "The safety rules already say do not go; some of the readings behind the score are out of date.",
    },
  },
  hi: {
    title: "कनेक्शन नहीं है",
    lastPlan: "यह ORCA की पिछली योजना है, {t} की, {age} पहले की।",
    rejudged:
      "इसकी उम्र के हिसाब से इस फ़ोन पर फिर से जाँची गई। पुराने आँकड़े फ़ैसले को सिर्फ़ घटा सकते हैं, कभी बढ़ा नहीं सकते।",
    noPlan:
      "कनेक्शन नहीं है, और इस फ़ोन पर ORCA की कोई सहेजी योजना अभी नहीं है। ORCA अंदाज़ा नहीं लगाएगा। आधिकारिक चेतावनी मानें।",
    askOffline: "कनेक्शन नहीं है, इसलिए ORCA उत्तर का अंदाज़ा नहीं लगाएगा।",
    askLastPlan: "ORCA की पिछली योजना {t} की है, {age} पहले की, {tab} में।",
    openPlan: "पिछली योजना खोलें",
    demo: "डेमो लिंक: कनेक्शन जानबूझकर बंद किया गया है।",
    gate: {
      headline: {
        GO: "प्रमाण जाँच सफल — सामान्य भरोसा।",
        CAUTION: "सावधान — इस उत्तर के पीछे के कुछ आँकड़े पुराने हैं।",
        INSUFFICIENT_DATA: "निर्णय के लिए पर्याप्त भरोसेमंद आँकड़े नहीं — आधिकारिक सलाह का पालन करें।",
        NO_GO: "न जाएँ — मौजूदा सुरक्षा नियम लागू हैं।",
      },
      line: {
        CAUTION: "सावधान रहें: आज के समुद्र के कुछ आँकड़े पुराने हैं। जाने से पहले ताज़ा चेतावनी देख लें।",
        INSUFFICIENT_DATA:
          "आज जाने की सलाह देने के लिए ORCA के पास पर्याप्त भरोसेमंद समुद्री आँकड़े नहीं हैं। आधिकारिक सलाह का पालन करें।",
      },
      fresh: "{age} पहले मिला (सीमा {limit})",
      stale: "{age} पहले मिला — {limit} की सीमा से ज़्यादा",
      expired: "{age} पहले मिला — इस्तेमाल के लिए बहुत पुराना (सीमा {limit})",
      future: "इसका समय भविष्य का है, इसलिए इस पर भरोसा नहीं किया जा सकता",
      reasonStale: "{input}: {age} पुराना आँकड़ा — {limit} की सीमा से ज़्यादा।",
      reasonBlocking: "{input}: {detail}।",
      allFresh: "सभी {n} ज़रूरी आँकड़े ताज़ा हैं।",
      block: "ORCA गायब या पुराने आँकड़ों पर यात्रा की मंज़ूरी नहीं देता।",
      cautionAct: "जाने से पहले IMD / INCOIS का ताज़ा बुलेटिन देखें।",
      nogoMissing:
        "सुरक्षा नियम पहले ही न जाने को कहते हैं। एक रीडिंग गायब होने से असली जोखिम दिखाए गए से ज़्यादा हो सकता है।",
      nogoStale: "सुरक्षा नियम पहले ही न जाने को कहते हैं; स्कोर के पीछे की कुछ रीडिंग पुरानी हैं।",
    },
  },
  mr: {
    title: "कनेक्शन नाही",
    lastPlan: "ही ORCA ची शेवटची योजना आहे, {t} ची, {age} पूर्वीची.",
    rejudged:
      "तिच्या वयानुसार या फोनवर पुन्हा तपासली. जुनी माहिती निर्णय फक्त कमी करू शकते, कधीच वाढवू शकत नाही.",
    noPlan:
      "कनेक्शन नाही, आणि या फोनवर ORCA ची कोणतीही जतन केलेली योजना अजून नाही. ORCA अंदाज लावणार नाही. अधिकृत इशारा पाळा.",
    askOffline: "कनेक्शन नाही, म्हणून ORCA उत्तराचा अंदाज लावणार नाही.",
    askLastPlan: "ORCA ची शेवटची योजना {t} ची आहे, {age} पूर्वीची, {tab} मध्ये.",
    openPlan: "शेवटची योजना उघडा",
    demo: "डेमो लिंक: कनेक्शन मुद्दाम बंद केले आहे.",
    gate: {
      headline: {
        GO: "पुरावा तपासणी यशस्वी — नेहमीचा विश्वास.",
        CAUTION: "सावधान — या उत्तरामागील काही माहिती जुनी आहे.",
        INSUFFICIENT_DATA: "निर्णयासाठी पुरेशी विश्वासार्ह माहिती नाही — अधिकृत सल्ला पाळा.",
        NO_GO: "जाऊ नका — सध्याचे सुरक्षा नियम लागू आहेत.",
      },
      line: {
        CAUTION: "काळजी घ्या: आजची काही सागरी माहिती जुनी आहे. जाण्यापूर्वी ताजा इशारा पाहा.",
        INSUFFICIENT_DATA:
          "आज जाण्याचा सल्ला देण्यासाठी ORCA कडे पुरेशी विश्वासार्ह सागरी माहिती नाही. अधिकृत सल्ला पाळा.",
      },
      fresh: "{age} पूर्वी मिळाले (मर्यादा {limit})",
      stale: "{age} पूर्वी मिळाले — {limit} मर्यादेपेक्षा जास्त",
      expired: "{age} पूर्वी मिळाले — वापरण्यास खूप जुने (मर्यादा {limit})",
      future: "याची वेळ भविष्यातील आहे, त्यामुळे यावर विश्वास ठेवता येत नाही",
      reasonStale: "{input}: {age} जुनी नोंद — {limit} मर्यादेपेक्षा जास्त.",
      reasonBlocking: "{input}: {detail}.",
      allFresh: "सर्व {n} आवश्यक नोंदी ताज्या आहेत.",
      block: "ORCA गहाळ किंवा जुन्या माहितीवर फेरीला परवानगी देत नाही.",
      cautionAct: "जाण्यापूर्वी IMD / INCOIS चे ताजे बुलेटिन पाहा.",
      nogoMissing:
        "सुरक्षा नियम आधीच जाऊ नका असे सांगतात. एक नोंद गहाळ असल्याने खरा धोका दाखवलेल्यापेक्षा जास्त असू शकतो.",
      nogoStale: "सुरक्षा नियम आधीच जाऊ नका असे सांगतात; गुणांमागील काही नोंदी जुन्या आहेत.",
    },
  },
};
