import type { Language } from "../types";

/** The engine room, in the fisher's three languages. */
export const L10N: Record<Language, Record<string, string>> = {
  en: {
    engineRoom: "The engine room",
    configNote: "GET /api/config exposes every weight and threshold — nothing is hidden",
    title: "What we do with the data",
    intro:
      "One question triggers one sweep of the machine below: live providers are read once per position, remembered as a 72-hour series, reasoned over by ten agents in parallel, floored by deterministic safety rules — and every number that reaches the screen carries its source, timestamp and mode.",
    s1: "01 · Intake — what comes in",
    s2: "02 · Reasoning — who touches it",
    s2note: "ThreadPoolExecutor fan-out · real latencies in the Agent crew panel",
    s3: "03 · The law — floors that only raise",
    s4: "04 · Out — what it becomes",
    oneFetch: "one HTTP fetch",
    perProvider: "per provider · per position",
    cacheTitle: "The series cache",
    cacheBody:
      "One response already holds 72 hours of hourly sea for that spot. We keep it — keyed to the kilometre, for ten minutes — so the 24-hour timeline, the safe-window scan and the authority board all answer from memory instead of hammering the provider.",
    cacheMeta: "failures remembered 60 s · cleared on mode toggle · first read 32 s, from cache 0.02 s",
    everyAgent: "every agent · every hour",
    fromMemory: "answered from memory",
    degrade:
      "If a live provider fails, the agent degrades to the demo store and says so — the answer arrives either way, relabelled, never silently pretending to be live.",
    stamp: "Official severe warning → 92",
    law1: "IMD fishermen warning active → floor 70",
    law2: "wave ≥ 4.0 m → floor 85 · gale wind ≥ 62 km/h → floor 85",
    law3: "inside a restricted zone → floor 60",
    lawNote:
      "Deterministic rules can only raise a score. No model, no language output, no prompt can talk ORCA down from an official warning.",
    reading: "Reading the coast — right now",
    onePort: "one port every",
    flipNote: "edition · flip DATA EDITION in the header and watch the sources change",
    nowReading: "Now reading",
    wave: "Wave",
    wind: "Wind",
    sst: "Sea temp",
    vis: "Visibility",
    hailing: "Hailing the first landing centre…",
    feedRetry: "The feed is not answering. Next try in {n} s.",
    hPort: "Port",
    hSource: "Source",
    hMode: "Mode",
    hLatency: "Latency",
    hAt: "At",
    concurrent: "{n} at once",
    demoStore: "Demo store",
    inUse: "In use",
    standby: "Standby",
    standbyVerified: "Standby · verified",
    hold: "Hold",
    resume: "Resume",
    feedCaption: "The last six readings of the coast, newest first, with the source and mode of each.",
    feedNote:
      "These are the same readings the fishing model and the risk engine consume — wave and wind feed the safety score, SST and chlorophyll feed the chance-of-fish, and the provenance column is what the evidence table shows a fisher.",
    outVerdict: "A verdict",
    outVerdictD:
      "0–100 risk with every point attributed, floored by the safety law, spoken in the fisher's language.",
    outPlan: "A plan",
    outPlanD:
      "Ranked grounds with chance of fish and likely species, the best window, how long to stay, the safest course.",
    outLedger: "A ledger",
    outLedgerD:
      "Every value with source · timestamp · confidence · mode. Simulated data is always labelled. CSV export for the authority.",
  },
  hi: {
    engineRoom: "इंजन रूम",
    configNote: "GET /api/config हर वेट और सीमा दिखाता है — कुछ भी छिपा नहीं",
    title: "डेटा का हम क्या करते हैं",
    intro:
      "एक सवाल नीचे की पूरी मशीन चलाता है: लाइव स्रोत हर स्थान के लिए एक बार पढ़े जाते हैं, 72 घंटे की सीरीज़ के रूप में याद रहते हैं, दस एजेंट एक साथ उन पर तर्क करते हैं, निश्चित सुरक्षा नियम लागू होते हैं — और स्क्रीन तक पहुँचने वाले हर आँकड़े के साथ उसका स्रोत, समय और मोड होता है।",
    s1: "01 · आगम — क्या आता है",
    s2: "02 · तर्क — कौन छूता है",
    s2note: "ThreadPoolExecutor फैन-आउट · असली लेटेंसी एजेंट पैनल में",
    s3: "03 · नियम — जो सिर्फ़ जोखिम बढ़ाते हैं",
    s4: "04 · परिणाम — क्या बनता है",
    oneFetch: "एक HTTP कॉल",
    perProvider: "प्रति स्रोत · प्रति स्थान",
    cacheTitle: "सीरीज़ कैश",
    cacheBody:
      "एक जवाब में उस जगह के 72 घंटे का प्रति-घंटा समुद्र होता है। हम उसे रखते हैं — किलोमीटर पर, दस मिनट के लिए — ताकि 24 घंटे की टाइमलाइन, सुरक्षित-समय की जाँच और प्रशासन बोर्ड सब स्मृति से जवाब दें, स्रोत को बार-बार न पुकारें।",
    cacheMeta: "विफलता 60 सेकंड याद · मोड बदलने पर साफ़ · पहली रीडिंग 32 s, कैश से 0.02 s",
    everyAgent: "हर एजेंट · हर घंटा",
    fromMemory: "स्मृति से जवाब",
    degrade:
      "लाइव स्रोत विफल हो तो एजेंट डेमो डेटा पर उतर आता है और यह बताता भी है — जवाब हर हाल में आता है, सही लेबल के साथ, कभी चुपचाप लाइव होने का दिखावा नहीं।",
    stamp: "आधिकारिक भीषण चेतावनी → 92",
    law1: "IMD मछुआरा चेतावनी सक्रिय → कम-से-कम 70",
    law2: "लहर ≥ 4.0 मी → 85 · आँधी हवा ≥ 62 किमी/घं → 85",
    law3: "प्रतिबंधित क्षेत्र के भीतर → 60",
    lawNote:
      "निश्चित नियम स्कोर सिर्फ़ बढ़ा सकते हैं। कोई मॉडल, कोई भाषा, कोई प्रॉम्प्ट ORCA को आधिकारिक चेतावनी से नीचे नहीं ला सकता।",
    reading: "तट की रीडिंग — अभी",
    onePort: "हर",
    flipNote: "संस्करण · हेडर में DATA EDITION बदलिए और स्रोत बदलते देखिए",
    nowReading: "अभी पढ़ रहे हैं",
    wave: "लहर",
    wind: "हवा",
    sst: "समुद्री तापमान",
    vis: "दृश्यता",
    hailing: "पहले लैंडिंग सेंटर से संपर्क…",
    feedRetry: "फ़ीड जवाब नहीं दे रही। अगली कोशिश {n} सेकंड में।",
    hPort: "बंदरगाह",
    hSource: "स्रोत",
    hMode: "मोड",
    hLatency: "लेटेंसी",
    hAt: "समय",
    concurrent: "{n} एक साथ",
    demoStore: "डेमो स्टोर",
    inUse: "उपयोग में",
    standby: "स्टैंडबाय",
    standbyVerified: "स्टैंडबाय · जाँचा हुआ",
    hold: "रोकें",
    resume: "फिर चालू करें",
    feedCaption: "तट की पिछली छह रीडिंग, सबसे नई पहले, हर एक के स्रोत और मोड के साथ।",
    feedNote:
      "यही रीडिंग मत्स्य मॉडल और रिस्क इंजन खाते हैं — लहर-हवा सुरक्षा स्कोर में, तापमान-क्लोरोफिल मछली की संभावना में, और स्रोत वाला कॉलम वही है जो मछुआरे को प्रमाण तालिका में दिखता है।",
    outVerdict: "फ़ैसला",
    outVerdictD:
      "0–100 जोखिम, हर अंक के हिसाब के साथ, सुरक्षा नियमों से बँधा, मछुआरे की भाषा में बोला हुआ।",
    outPlan: "योजना",
    outPlanD:
      "रैंक की हुई जगहें, मछली की संभावना और संभावित प्रजातियाँ, सबसे अच्छा समय, कितना रुकना, सबसे सुरक्षित मार्ग।",
    outLedger: "बहीखाता",
    outLedgerD:
      "हर मान के साथ स्रोत · समय · भरोसा · मोड। नक़ली डेटा पर हमेशा लेबल। प्रशासन के लिए CSV निर्यात।",
  },
  mr: {
    engineRoom: "इंजिन रूम",
    configNote: "GET /api/config प्रत्येक वेट व मर्यादा दाखवते — काहीही लपवलेले नाही",
    title: "डेटाचे आम्ही काय करतो",
    intro:
      "एक प्रश्न खालची संपूर्ण यंत्रणा चालवतो: लाइव्ह स्रोत प्रत्येक ठिकाणासाठी एकदाच वाचले जातात, ७२ तासांची मालिका म्हणून लक्षात राहतात, दहा एजंट एकाच वेळी त्यावर तर्क करतात, निश्चित सुरक्षा नियम लागू होतात — आणि स्क्रीनवर पोहोचणाऱ्या प्रत्येक आकड्यासोबत त्याचा स्रोत, वेळ आणि मोड असतो.",
    s1: "01 · आवक — काय येते",
    s2: "02 · तर्क — कोण हाताळते",
    s2note: "ThreadPoolExecutor फॅन-आउट · खऱ्या लेटन्सी एजंट पॅनेलमध्ये",
    s3: "03 · नियम — जे फक्त धोका वाढवतात",
    s4: "04 · निकाल — काय बनते",
    oneFetch: "एक HTTP कॉल",
    perProvider: "प्रति स्रोत · प्रति ठिकाण",
    cacheTitle: "मालिका कॅशे",
    cacheBody:
      "एका उत्तरात त्या जागेचा ७२ तासांचा तासागणिक समुद्र असतो. आम्ही तो ठेवतो — किलोमीटरवर, दहा मिनिटांसाठी — म्हणजे २४ तासांची टाइमलाइन, सुरक्षित-वेळ तपासणी आणि प्रशासन फलक सर्व स्मृतीतून उत्तर देतात, स्रोताला पुन्हा पुन्हा हाक मारत नाहीत.",
    cacheMeta: "अपयश ६० सेकंद लक्षात · मोड बदलल्यावर साफ · पहिले वाचन 32 s, कॅशेतून 0.02 s",
    everyAgent: "प्रत्येक एजंट · प्रत्येक तास",
    fromMemory: "स्मृतीतून उत्तर",
    degrade:
      "लाइव्ह स्रोत अयशस्वी झाला तर एजंट डेमो डेटावर उतरतो आणि तसे सांगतोही — उत्तर कोणत्याही परिस्थितीत येते, योग्य लेबलसह, लाइव्ह असल्याचा आव कधीही आणत नाही.",
    stamp: "अधिकृत तीव्र इशारा → 92",
    law1: "IMD मच्छीमार इशारा सक्रिय → किमान 70",
    law2: "लाट ≥ 4.0 मी → 85 · वादळी वारा ≥ 62 किमी/ता → 85",
    law3: "प्रतिबंधित क्षेत्रात → 60",
    lawNote:
      "निश्चित नियम गुण फक्त वाढवू शकतात. कोणताही मॉडेल, कोणतीही भाषा, कोणताही प्रॉम्प्ट ORCA ला अधिकृत इशाऱ्याखाली आणू शकत नाही.",
    reading: "किनाऱ्याचे वाचन — आत्ता",
    onePort: "दर",
    flipNote: "आवृत्ती · हेडरमधील DATA EDITION बदला आणि स्रोत बदलताना पाहा",
    nowReading: "आत्ता वाचत आहोत",
    wave: "लाट",
    wind: "वारा",
    sst: "समुद्र तापमान",
    vis: "दृश्यमानता",
    hailing: "पहिल्या लँडिंग सेंटरशी संपर्क…",
    feedRetry: "फीड उत्तर देत नाही. पुढचा प्रयत्न {n} सेकंदांत.",
    hPort: "बंदर",
    hSource: "स्रोत",
    hMode: "मोड",
    hLatency: "लेटन्सी",
    hAt: "वेळ",
    concurrent: "{n} एकाच वेळी",
    demoStore: "डेमो स्टोअर",
    inUse: "वापरात",
    standby: "स्टँडबाय",
    standbyVerified: "स्टँडबाय · तपासलेले",
    hold: "थांबवा",
    resume: "पुन्हा सुरू करा",
    feedCaption: "किनाऱ्याची शेवटची सहा वाचने, सर्वात नवीन आधी, प्रत्येकाच्या स्रोत आणि मोडसह.",
    feedNote:
      "हेच वाचन मासेमारी मॉडेल आणि रिस्क इंजिन वापरतात — लाट-वारा सुरक्षा गुणांत, तापमान-क्लोरोफिल माशांच्या शक्यतेत, आणि स्रोताचा स्तंभ तोच जो मच्छीमाराला पुरावा तक्त्यात दिसतो.",
    outVerdict: "निर्णय",
    outVerdictD:
      "0–100 धोका, प्रत्येक गुणाच्या हिशेबासह, सुरक्षा नियमांनी बांधलेला, मच्छीमाराच्या भाषेत बोललेला.",
    outPlan: "योजना",
    outPlanD:
      "क्रमवारी लावलेल्या जागा, माशांची शक्यता व संभाव्य प्रजाती, सर्वोत्तम वेळ, किती थांबायचे, सर्वात सुरक्षित मार्ग.",
    outLedger: "नोंदवही",
    outLedgerD:
      "प्रत्येक मूल्यासोबत स्रोत · वेळ · विश्वास · मोड. नमुना डेटावर नेहमी लेबल. प्रशासनासाठी CSV निर्यात.",
  },
};

/** What each data provider contributes, in intake order. */
/** Entries without `status` take theirs from the data edition (S1). */
export const PROVIDER_TEXT: Record<Language, { status?: string; gives: string; note: string }[]> = {
  en: [
    { gives: "wave height · wave period · sea-surface temperature · currents", note: "keyless public API — verified working" },
    { gives: "wind · rain probability · visibility · air temperature", note: "keyless public API — verified working" },
    { status: "Interface ready", gives: "PFZ advisories · marine warnings · satellite SST", note: "no open public JSON API — slots in behind the same interface" },
    { status: "Bundled snapshot", gives: "species occurrence records, Indian coastal waters", note: "open biodiversity data, bundled as a dated snapshot — offline-safe" },
    { gives: "rehearsed sea states, keyed by hour of day", note: "every synthetic value is labelled simulated" },
  ],
  hi: [
    { gives: "लहर की ऊँचाई · अवधि · समुद्री सतह तापमान · धाराएँ", note: "बिना कुंजी सार्वजनिक API — जाँचा हुआ" },
    { gives: "हवा · वर्षा संभावना · दृश्यता · तापमान", note: "बिना कुंजी सार्वजनिक API — जाँचा हुआ" },
    { status: "इंटरफ़ेस तैयार", gives: "PFZ सलाह · समुद्री चेतावनियाँ · उपग्रह SST", note: "खुला JSON API नहीं — उसी इंटरफ़ेस के पीछे जुड़ते हैं" },
    { status: "बंडल स्नैपशॉट", gives: "प्रजातियों की उपस्थिति के रिकॉर्ड, भारतीय तटीय जल", note: "खुला जैवविविधता डेटा, दिनांकित स्नैपशॉट — ऑफ़लाइन-सुरक्षित" },
    { gives: "घंटे के हिसाब से तैयार समुद्री स्थितियाँ", note: "हर नक़ली मान पर 'सिम्युलेटेड' लेबल" },
  ],
  mr: [
    { gives: "लाटेची उंची · कालावधी · समुद्र पृष्ठ तापमान · प्रवाह", note: "किल्लीशिवाय सार्वजनिक API — तपासलेले" },
    { gives: "वारा · पावसाची शक्यता · दृश्यमानता · तापमान", note: "किल्लीशिवाय सार्वजनिक API — तपासलेले" },
    { status: "इंटरफेस तयार", gives: "PFZ सल्ले · सागरी इशारे · उपग्रह SST", note: "खुले JSON API नाही — त्याच इंटरफेसमागे जोडले जातात" },
    { status: "बंडल स्नॅपशॉट", gives: "प्रजातींच्या उपस्थितीच्या नोंदी, भारतीय किनारी पाणी", note: "खुला जैवविविधता डेटा, दिनांकित स्नॅपशॉट — ऑफलाइन-सुरक्षित" },
    { gives: "तासागणिक तयार समुद्री स्थिती", note: "प्रत्येक नमुना मूल्यावर 'सिम्युलेटेड' लेबल" },
  ],
};

/** The crew, phase by phase, as the pipeline executes. */
export const CREW_TEXT: Record<Language, { phase: string; agents: string[]; note: string }[]> = {
  en: [
    { phase: "Understand", agents: ["Intent"], note: "rule-based parsing — language, place, time. No LLM." },
    { phase: "Gather", agents: ["Weather", "Ocean", "PFZ", "Alerts", "GIS"], note: "independent specialists fan out concurrently" },
    { phase: "Decide", agents: ["Risk engine", "Route (A*)"], note: "weighted model, then floors; safest ≠ shortest" },
    { phase: "Explain", agents: ["Explanation"], note: "plain words in EN / HI / MR, spoken back" },
  ],
  hi: [
    { phase: "समझो", agents: ["आशय"], note: "नियम-आधारित — भाषा, जगह, समय। कोई LLM नहीं।" },
    { phase: "जुटाओ", agents: ["मौसम", "समुद्र", "PFZ", "चेतावनियाँ", "GIS"], note: "स्वतंत्र विशेषज्ञ एक साथ निकलते हैं" },
    { phase: "तय करो", agents: ["रिस्क इंजन", "मार्ग (A*)"], note: "भारित मॉडल, फिर नियम; सुरक्षित ≠ छोटा" },
    { phase: "समझाओ", agents: ["व्याख्या"], note: "EN / HI / MR में सीधी भाषा, बोलकर भी" },
  ],
  mr: [
    { phase: "समजून घ्या", agents: ["हेतू"], note: "नियम-आधारित — भाषा, ठिकाण, वेळ. LLM नाही." },
    { phase: "गोळा करा", agents: ["हवामान", "समुद्र", "PFZ", "इशारे", "GIS"], note: "स्वतंत्र तज्ज्ञ एकाच वेळी निघतात" },
    { phase: "ठरवा", agents: ["रिस्क इंजिन", "मार्ग (A*)"], note: "भारित मॉडेल, मग नियम; सुरक्षित ≠ छोटा" },
    { phase: "समजावा", agents: ["स्पष्टीकरण"], note: "EN / HI / MR मध्ये सोपी भाषा, बोलूनही" },
  ],
};
