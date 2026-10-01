import type { Language, RiskCategory } from "../types";

const en = {
  today: "Today",
  map: "Map",
  ask: "Ask",
  language: "Language",
  purpose: "Sea safety for fishers",
  question: "Can I go to sea today?",
  riskOutOf: "Risk {n} out of 100",
  outOf100: "out of 100",
  asOf: "Read at {t}",
  waves: "waves",
  wind: "wind",
  offlineFirst: "Check the connection, then try again. Always follow the official warning.",
  listen: "LISTEN",
  stop: "STOP",
  noVoiceOut: "This phone cannot read aloud",
  speaking: "Reading aloud",
  stopped: "Stopped reading",
  bestTime: "Best time",
  returnBy: "Be back by",
  dayToday: "today",
  dayTonight: "tonight, after midnight",
  dayTomorrow: "tomorrow",
  areas: "Where the fish are",
  tapToHear: "Tap to hear",
  hearArea: "Area {n}: hear it and see it on the map",
  chance: "chance of fish",
  km: "km",
  profit: "Profit est.",
  fuel: "Fuel",
  simulated: "Simulated data, not a live government feed",
  advisory: "Decision support, not an official advisory",
  reading: "Reading the sea…",
  locating: "Finding your position…",
  updating: "Updating…",
  lastReading: "Last reading: {p}, {t}",
  locationOff: "Location is off. Showing {p}.",
  locationFailed: "Your position could not be found. Showing {p}.",
  chooseHarbour: "Choose harbour",
  harbours: "Harbours",
  useMyPosition: "Use my position",
  harbourNow: "Harbour: {p}. Change harbour",
  close: "Close",
  warnSpeak: "Official warning",
  zonesMissing: "The no-go areas could not be drawn on the map.",
  drawingChart: "Drawing the chart…",
  tapMic: "Tap and speak",
  tapMicStop: "Tap to stop",
  micStart: "Ask by voice",
  micStop: "Stop listening",
  listening: "Listening…",
  thinking: "Asking the crew…",
  tryAsking: "Or tap a question",
  youAsked: "You asked",
  why: "Why",
  typeHere: "Type your question",
  send: "Send",
  cannotListen: "This browser cannot listen. Type your question, or tap one below.",
  micBlocked: "The microphone is blocked. Type your question, or tap one below.",
  noSpeech: "Nothing was heard. Tap the microphone and speak again.",
  listenFailed: "Listening stopped early. Tap the microphone, or type your question.",
  bestTimeSay: "Best time to fish is {a} to {b}.",
  returnSayToday: "Be back before {t} today.",
  returnSayTonight: "Be back before {t} tonight. That is after midnight.",
  returnSayTomorrow: "Be back before {t} tomorrow.",
};

export type MobileStrings = Record<keyof typeof en, string>;

export const T: Record<Language, MobileStrings> = {
  en,
  hi: {
    today: "आज",
    map: "नक्शा",
    ask: "पूछें",
    language: "भाषा",
    purpose: "मछुआरों के लिए समुद्र की सुरक्षा",
    question: "क्या आज समुद्र में जाऊँ?",
    riskOutOf: "जोखिम 100 में से {n}",
    outOf100: "100 में से",
    asOf: "{t} की रीडिंग",
    waves: "लहरें",
    wind: "हवा",
    offlineFirst: "कनेक्शन जाँचें, फिर दोबारा कोशिश करें। आधिकारिक चेतावनी हमेशा मानें।",
    listen: "सुनें",
    stop: "रोकें",
    noVoiceOut: "यह फ़ोन बोलकर नहीं सुना सकता",
    speaking: "बोलकर सुना रहे हैं",
    stopped: "सुनाना रोक दिया",
    bestTime: "सबसे अच्छा समय",
    returnBy: "इससे पहले लौटें",
    dayToday: "आज",
    dayTonight: "आज रात, आधी रात के बाद",
    dayTomorrow: "कल",
    areas: "मछली कहाँ है",
    tapToHear: "दबाकर सुनें",
    hearArea: "क्षेत्र {n}: सुनें और नक्शे पर देखें",
    chance: "मछली मिलने की संभावना",
    km: "किमी",
    profit: "अनुमानित मुनाफ़ा",
    fuel: "ईंधन",
    simulated: "नकली आँकड़े, सरकारी लाइव फ़ीड नहीं",
    advisory: "निर्णय में मदद, आधिकारिक सलाह नहीं",
    reading: "समुद्र पढ़ रहे हैं…",
    locating: "आपकी जगह ढूँढ रहे हैं…",
    updating: "नया कर रहे हैं…",
    lastReading: "पिछली रीडिंग: {p}, {t}",
    locationOff: "लोकेशन बंद है। {p} दिखा रहे हैं।",
    locationFailed: "आपकी जगह नहीं मिल सकी। {p} दिखा रहे हैं।",
    chooseHarbour: "बंदरगाह चुनें",
    harbours: "बंदरगाह",
    useMyPosition: "मेरी जगह इस्तेमाल करें",
    harbourNow: "बंदरगाह: {p}. बंदरगाह बदलें",
    close: "बंद करें",
    warnSpeak: "आधिकारिक चेतावनी",
    zonesMissing: "प्रतिबंधित क्षेत्र नक्शे पर नहीं बन सके।",
    drawingChart: "चार्ट बना रहे हैं…",
    tapMic: "दबाकर बोलिए",
    tapMicStop: "रोकने के लिए दबाएँ",
    micStart: "बोलकर पूछें",
    micStop: "सुनना रोकें",
    listening: "सुन रहे हैं…",
    thinking: "टीम से पूछ रहे हैं…",
    tryAsking: "या कोई सवाल दबाएँ",
    youAsked: "आपने पूछा",
    why: "क्यों",
    typeHere: "अपना सवाल लिखें",
    send: "भेजें",
    cannotListen: "यह ब्राउज़र सुन नहीं सकता। अपना सवाल लिखें, या नीचे कोई सवाल दबाएँ।",
    micBlocked: "माइक्रोफ़ोन बंद है। अपना सवाल लिखें, या नीचे कोई सवाल दबाएँ।",
    noSpeech: "कुछ सुनाई नहीं दिया। माइक दबाकर फिर बोलिए।",
    listenFailed: "सुनना बीच में रुक गया। माइक दबाएँ, या अपना सवाल लिखें।",
    bestTimeSay: "मछली पकड़ने का सबसे अच्छा समय {a} से {b} बजे तक है।",
    returnSayToday: "आज {t} बजे से पहले लौट आएँ।",
    returnSayTonight: "{t} बजे से पहले लौट आएँ। यह आधी रात के बाद है।",
    returnSayTomorrow: "कल {t} बजे से पहले लौट आएँ।",
  },
  mr: {
    today: "आज",
    map: "नकाशा",
    ask: "विचारा",
    language: "भाषा",
    purpose: "मच्छीमारांसाठी समुद्र सुरक्षा",
    question: "आज समुद्रात जाऊ का?",
    riskOutOf: "धोका 100 पैकी {n}",
    outOf100: "100 पैकी",
    asOf: "{t} ची नोंद",
    waves: "लाटा",
    wind: "वारा",
    offlineFirst: "कनेक्शन तपासा, मग पुन्हा प्रयत्न करा. अधिकृत इशारा नेहमी पाळा.",
    listen: "ऐका",
    stop: "थांबवा",
    noVoiceOut: "हा फोन बोलून ऐकवू शकत नाही",
    speaking: "बोलून ऐकवत आहोत",
    stopped: "ऐकवणे थांबवले",
    bestTime: "सर्वोत्तम वेळ",
    returnBy: "याआधी परत या",
    dayToday: "आज",
    dayTonight: "आज रात्री, मध्यरात्रीनंतर",
    dayTomorrow: "उद्या",
    areas: "मासे कुठे आहेत",
    tapToHear: "दाबून ऐका",
    hearArea: "क्षेत्र {n}: ऐका आणि नकाशावर पाहा",
    chance: "मासे मिळण्याची शक्यता",
    km: "किमी",
    profit: "अंदाजे नफा",
    fuel: "इंधन",
    simulated: "नमुना माहिती, सरकारी थेट स्रोत नाही",
    advisory: "निर्णयासाठी मदत, अधिकृत सल्ला नाही",
    reading: "समुद्र वाचत आहोत…",
    locating: "तुमचे ठिकाण शोधत आहोत…",
    updating: "नवीन करत आहोत…",
    lastReading: "मागील नोंद: {p}, {t}",
    locationOff: "लोकेशन बंद आहे. {p} दाखवत आहोत.",
    locationFailed: "तुमचे ठिकाण सापडले नाही. {p} दाखवत आहोत.",
    chooseHarbour: "बंदर निवडा",
    harbours: "बंदरे",
    useMyPosition: "माझे ठिकाण वापरा",
    harbourNow: "बंदर: {p}. बंदर बदला",
    close: "बंद करा",
    warnSpeak: "अधिकृत इशारा",
    zonesMissing: "प्रतिबंधित क्षेत्रे नकाशावर काढता आली नाहीत.",
    drawingChart: "चार्ट काढत आहोत…",
    tapMic: "दाबून बोला",
    tapMicStop: "थांबवण्यासाठी दाबा",
    micStart: "बोलून विचारा",
    micStop: "ऐकणे थांबवा",
    listening: "ऐकत आहोत…",
    thinking: "टीमला विचारत आहोत…",
    tryAsking: "किंवा एखादा प्रश्न दाबा",
    youAsked: "तुम्ही विचारले",
    why: "का",
    typeHere: "तुमचा प्रश्न लिहा",
    send: "पाठवा",
    cannotListen: "हा ब्राउझर ऐकू शकत नाही. तुमचा प्रश्न लिहा, किंवा खालचा एखादा प्रश्न दाबा.",
    micBlocked: "मायक्रोफोन बंद आहे. तुमचा प्रश्न लिहा, किंवा खालचा एखादा प्रश्न दाबा.",
    noSpeech: "काही ऐकू आले नाही. माइक दाबून पुन्हा बोला.",
    listenFailed: "ऐकणे मध्येच थांबले. माइक दाबा, किंवा तुमचा प्रश्न लिहा.",
    bestTimeSay: "मासेमारीसाठी सर्वोत्तम वेळ {a} ते {b}.",
    returnSayToday: "आज {t} च्या आधी परत या.",
    returnSayTonight: "{t} च्या आधी परत या. ही वेळ मध्यरात्रीनंतरची आहे.",
    returnSayTomorrow: "उद्या {t} च्या आधी परत या.",
  },
};

/** Each language under its own name, in its own script — never translated. */
export const LANGUAGE_NAME: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};

/** The short mark for the language switch in the tab bar. */
export const LANGUAGE_MARK: Record<Language, string> = {
  en: "EN",
  hi: "हिं",
  mr: "मरा",
};

/** The risk band as one stamped word. */
export const CATEGORY: Record<Language, Record<RiskCategory, string>> = {
  en: { LOW: "Low", MODERATE: "Moderate", HIGH: "High", EXTREME: "Extreme" },
  hi: { LOW: "कम", MODERATE: "मध्यम", HIGH: "अधिक", EXTREME: "अत्यधिक" },
  mr: { LOW: "कमी", MODERATE: "मध्यम", HIGH: "जास्त", EXTREME: "अत्यंत" },
};

/**
 * The rehearsed questions, as a fisher would say them. The first three are
 * answered for the phone's own position; the last names its place.
 */
export const ASK_EXAMPLES: Record<Language, string[]> = {
  en: [
    "Can I go fishing tomorrow at 6 AM?",
    "Where are the fish today?",
    "Give me the safest route",
    "Is there a cyclone near Paradip?",
  ],
  hi: [
    "क्या मैं कल सुबह 6 बजे मछली पकड़ने जा सकता हूँ?",
    "आज मछली कहाँ मिलेगी?",
    "सबसे सुरक्षित रास्ता बताओ",
    "क्या पारादीप के पास चक्रवात है?",
  ],
  mr: [
    "मी उद्या सकाळी ६ वाजता मासेमारीला जाऊ शकतो का?",
    "आज मासे कुठे मिळतील?",
    "सुरक्षित मार्ग दाखवा",
    "पारादीपजवळ चक्रीवादळ आहे का?",
  ],
};

/** The part of the day, said before the hour, as people say the time aloud. */
const DAY_PART: Record<Exclude<Language, "en">, (hour: number) => string> = {
  hi: (h) => (h < 4 || h >= 20 ? "रात" : h < 12 ? "सुबह" : h < 16 ? "दोपहर" : "शाम"),
  mr: (h) =>
    h < 4 || h >= 20
      ? "रात्री"
      : h < 6
        ? "पहाटे"
        : h < 12
          ? "सकाळी"
          : h < 16
            ? "दुपारी"
            : "संध्याकाळी",
};

/**
 * A clock time on the 12-hour clock: "2 PM", "12:07 AM"; in Hindi and Marathi
 * the part of the day replaces AM and PM ("रात 12:07", "दुपारी 2").
 */
export function clockLabel(language: Language, hour: number, minute = 0): string {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  const digits = `${h % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""}`;
  if (language === "en") return `${digits} ${h < 12 ? "AM" : "PM"}`;
  return `${DAY_PART[language](h)} ${digits}`;
}

/** "HH:MM" (or the time inside an ISO timestamp) as hour and minute. */
export function parseClock(text: string | null | undefined): { hour: number; minute: number } | null {
  const m = /(?:^|T)(\d{1,2}):(\d{2})/.exec(text ?? "");
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  return hour < 24 && minute < 60 ? { hour, minute } : null;
}

export type ReturnDay = "today" | "tonight" | "tomorrow";

/**
 * Which day a return-by clock time falls on. The backend sends the end of the
 * safe window as a bare "HH:MM" less than a day after the reading, so a time
 * that is not later than the reading's own clock time is past midnight: in the
 * small hours that is still "tonight" to a fisher, later it is "tomorrow".
 */
export function returnDay(returnBy: string, readAt: string): ReturnDay | null {
  const back = parseClock(returnBy);
  const read = parseClock(readAt);
  if (!back || !read) return null;
  const sameDay = back.hour * 60 + back.minute > read.hour * 60 + read.minute;
  if (sameDay) return "today";
  return back.hour < 5 ? "tonight" : "tomorrow";
}

/**
 * The return-by cell and its spoken line: the time in the same 12-hour style
 * as the best-time cell, and the day it belongs to, so "00:07" never reads as
 * a time that has already passed.
 */
export function returnLabel(
  language: Language,
  returnBy: string,
  readAt: string,
): { time: string; day: string; say: string } | null {
  const back = parseClock(returnBy);
  if (!back) return null;
  const t = T[language];
  const time = clockLabel(language, back.hour, back.minute);
  const day = returnDay(returnBy, readAt) ?? "today";
  const [dayText, say] =
    day === "tonight"
      ? [t.dayTonight, t.returnSayTonight]
      : day === "tomorrow"
        ? [t.dayTomorrow, t.returnSayTomorrow]
        : [t.dayToday, t.returnSayToday];
  return { time, day: dayText, say: say.replace("{t}", time) };
}

/** Sentences of an answer; a full stop inside a number ("1.9 m") does not end one. */
export function sentences(text: string): string[] {
  const out: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const end = i === text.length - 1;
    if (".।!?".includes(text[i]) && (end || /\s/.test(text[i + 1]))) {
      out.push(text.slice(start, i + 1).trim());
      start = i + 1;
    }
  }
  const rest = text.slice(start).trim();
  if (rest) out.push(rest);
  return out.filter(Boolean);
}

/**
 * The crew's answer as the phone shows it: the verdict sentence, and the
 * reasons the answer itself lists ("Main reasons: a; b; c."), which arrive in
 * the answer's language. `reasons` is empty when the answer lists none.
 */
export function readAnswer(answer: string): { headline: string; reasons: string[] } {
  const all = sentences(answer);
  const strip = (s: string) => s.replace(/[.।]+$/, "").trim();
  const listed = all.find((s) => s.includes(";") && s.includes(":"));
  return {
    headline: strip(all[0] ?? answer),
    reasons: listed
      ? strip(listed.slice(listed.indexOf(":") + 1))
          .split(";")
          .map((r) => r.trim())
          .filter(Boolean)
      : [],
  };
}
