"""Language detection and response templates for English / Hindi / Marathi.

Two deliberate rules:
  * numeric values are NEVER localised into other numeral systems — "2.4 m"
    stays "2.4 m" in all three languages so a number can never be misread;
  * detection is script + marker based, so it works with no network and no LLM.
"""
from __future__ import annotations

import re
from datetime import datetime
from typing import Dict, List, Optional

from ..config import SOURCE_LABELS
from ..schemas import Language
from .plain_language import direction_words

DEVANAGARI = re.compile(r"[ऀ-ॿ]")

# Words that separate Marathi from Hindi (both are Devanagari).
MARATHI_MARKERS = ["आहे", "शकतो", "शकते", "मासेमारी", "काय", "नाही", "सुरक्षित का",
                   "समुद्रात", "होडी", "मला", "कुठे", "आज", "उद्या सकाळी", "मार्ग"]
HINDI_MARKERS = ["है", "सकता", "सकती", "मछली", "क्या", "नहीं", "समुद्र में",
                 "नाव", "मुझे", "कहाँ", "कहां", "रास्ता"]


def detect_language(text: str) -> Language:
    if not text or not DEVANAGARI.search(text):
        return "en"
    mr = sum(1 for w in MARATHI_MARKERS if w in text)
    hi = sum(1 for w in HINDI_MARKERS if w in text)
    if mr > hi:
        return "mr"
    if hi > mr:
        return "hi"
    return "mr"  # Devanagari with no decisive marker: default to Marathi (our pilot coast)


# --------------------------------------------------------------------------
# Phrase book
# --------------------------------------------------------------------------
T: Dict[str, Dict[Language, str]] = {
    "verdict_low": {
        "en": "Conditions look safe",
        "hi": "स्थिति सुरक्षित लग रही है",
        "mr": "परिस्थिती सुरक्षित दिसते",
    },
    "verdict_moderate": {
        "en": "Go with caution",
        "hi": "सावधानी से जाएँ",
        "mr": "सावधगिरीने जा",
    },
    "verdict_high": {
        "en": "High risk — not recommended",
        "hi": "जोखिम अधिक है — जाने की सलाह नहीं",
        "mr": "धोका जास्त आहे — जाऊ नका",
    },
    "verdict_extreme": {
        "en": "EXTREME RISK — do not go to sea",
        "hi": "अत्यधिक जोखिम — समुद्र में न जाएँ",
        "mr": "अत्यंत धोका — समुद्रात जाऊ नका",
    },
    "based_on": {
        "en": "Based on available data",
        "hi": "उपलब्ध आँकड़ों के आधार पर",
        "mr": "उपलब्ध माहितीच्या आधारे",
    },
    "risk_score": {
        "en": "Risk score",
        "hi": "जोखिम स्कोर",
        "mr": "धोका गुण",
    },
    "why": {
        "en": "Main reasons",
        "hi": "मुख्य कारण",
        "mr": "मुख्य कारणे",
    },
    "official_warning": {
        "en": "An official warning is in force. Please follow IMD / INCOIS and Coast Guard instructions.",
        "hi": "आधिकारिक चेतावनी लागू है। कृपया IMD / INCOIS और तटरक्षक बल के निर्देशों का पालन करें।",
        "mr": "अधिकृत इशारा लागू आहे. कृपया IMD / INCOIS आणि तटरक्षक दलाच्या सूचना पाळा.",
    },
    "improves_at": {
        "en": "Conditions are expected to improve after {hour}:00. Ask me again then.",
        "hi": "{hour}:00 बजे के बाद स्थिति सुधरने की संभावना है। तब दोबारा पूछें।",
        "mr": "{hour}:00 नंतर परिस्थिती सुधारण्याची शक्यता आहे. तेव्हा पुन्हा विचारा.",
    },
    "no_improvement": {
        "en": "Conditions are not expected to improve today.",
        "hi": "आज स्थिति सुधरने की संभावना नहीं है।",
        "mr": "आज परिस्थिती सुधारण्याची शक्यता नाही.",
    },
    "pfz_intro": {
        "en": "Nearest potential fishing zones",
        "hi": "निकटतम संभावित मत्स्य क्षेत्र",
        "mr": "जवळची संभाव्य मासेमारी क्षेत्रे",
    },
    # One ranked ground. Units stay as they are written on every chart
    # (km, °C, mg/m3); the words around them are translated.
    "pfz_line": {
        "en": "#{rank} — {distance} km {direction}, SST {sst} °C, "
              "chlorophyll {chl} mg/m³, chance of fish {chance}%.",
        "hi": "#{rank} — {distance} किमी {direction} की ओर, समुद्र सतह का तापमान {sst} °C, "
              "क्लोरोफिल {chl} mg/m³, मछली मिलने की संभावना {chance}%।",
        "mr": "#{rank} — {distance} किमी {direction} दिशेला, समुद्रपृष्ठाचे तापमान {sst} °C, "
              "क्लोरोफिल {chl} mg/m³, मासे मिळण्याची शक्यता {chance}%.",
    },
    "pfz_note": {
        "en": "A potential fishing zone is a scientifically likely area — it is not a guarantee of fish.",
        "hi": "संभावित मत्स्य क्षेत्र वैज्ञानिक रूप से संभावित क्षेत्र है — मछली की गारंटी नहीं।",
        "mr": "संभाव्य मासेमारी क्षेत्र म्हणजे शास्त्रीयदृष्ट्या शक्यता असलेला भाग — माशांची हमी नाही.",
    },
    "route_intro": {
        "en": "Safest route",
        "hi": "सबसे सुरक्षित रास्ता",
        "mr": "सर्वात सुरक्षित मार्ग",
    },
    "route_detail": {
        "en": "{distance} km, about {eta}, avoiding restricted areas.",
        "hi": "{distance} किमी, लगभग {eta}, प्रतिबंधित क्षेत्रों से बचते हुए।",
        "mr": "{distance} किमी, अंदाजे {eta}, प्रतिबंधित क्षेत्रे टाळून.",
    },
    "geofence_warn": {
        "en": "WARNING: {zone} is {distance} km away.",
        "hi": "चेतावनी: {zone} {distance} किमी दूर है।",
        "mr": "इशारा: {zone} {distance} किमी अंतरावर आहे.",
    },
    "geofence_inside": {
        "en": "ALERT: you are inside {zone}. Leave the area immediately.",
        "hi": "अलर्ट: आप {zone} के भीतर हैं। तुरंत क्षेत्र छोड़ें।",
        "mr": "सतर्कता: तुम्ही {zone} मध्ये आहात. ताबडतोब क्षेत्र सोडा.",
    },
    "sources_line": {
        "en": "Sources: {sources} · Updated {stamp}.",
        "hi": "स्रोत: {sources} · अपडेट {stamp}।",
        "mr": "स्रोत: {sources} · अपडेट {stamp}.",
    },
    "demo_mode": {
        "en": "Demo / simulated data — not a live government feed.",
        "hi": "डेमो / नकली आँकड़े — यह सरकारी लाइव फ़ीड नहीं है।",
        "mr": "डेमो / नमुना माहिती — हा सरकारी थेट स्रोत नाही.",
    },
    "unavailable": {
        "en": "Ocean forecast unavailable for this location.",
        "hi": "इस स्थान के लिए समुद्री पूर्वानुमान उपलब्ध नहीं है।",
        "mr": "या ठिकाणासाठी समुद्री अंदाज उपलब्ध नाही.",
    },
    "hours": {"en": "h", "hi": "घं", "mr": "तास"},
    "minutes": {"en": "min", "hi": "मि", "mr": "मिनिटे"},
    "disclaimer": {
        "en": "ORCA is a decision-support tool. It does not replace official marine "
              "advisories or Coast Guard instructions.",
        "hi": "ORCA एक निर्णय-सहायक उपकरण है। यह आधिकारिक समुद्री सलाह या तटरक्षक "
              "निर्देशों का विकल्प नहीं है।",
        "mr": "ORCA हे निर्णय-सहाय्य साधन आहे. ते अधिकृत सागरी सल्ला किंवा तटरक्षक "
              "दलाच्या सूचनांना पर्याय नाही.",
    },

    # ---- data health: how old, and from whom, each input is -----------------
    "dh_fresh": {"en": "{age} old (limit {limit})",
                 "hi": "{age} पहले मिला (सीमा {limit})",
                 "mr": "{age} पूर्वी मिळाले (मर्यादा {limit})"},
    "dh_stale": {"en": "{age} old — over the {limit} limit",
                 "hi": "{age} पहले मिला — {limit} की सीमा से ज़्यादा",
                 "mr": "{age} पूर्वी मिळाले — {limit} मर्यादेपेक्षा जास्त"},
    "dh_expired": {"en": "{age} old — too old to use (limit {limit})",
                   "hi": "{age} पहले मिला — इस्तेमाल के लिए बहुत पुराना (सीमा {limit})",
                   "mr": "{age} पूर्वी मिळाले — वापरण्यास खूप जुने (मर्यादा {limit})"},
    "dh_missing": {"en": "no reading — the {feed} did not respond",
                   "hi": "कोई रीडिंग नहीं — {feed} ने जवाब नहीं दिया",
                   "mr": "नोंद नाही — {feed} प्रतिसाद देत नाही"},
    "dh_error": {"en": "the {feed} returned an error",
                 "hi": "{feed} से त्रुटि मिली",
                 "mr": "{feed}: त्रुटी आली"},
    "dh_no_time": {"en": "no timestamp, so its age cannot be checked",
                   "hi": "समय दर्ज नहीं, इसलिए यह कितना पुराना है जाँचा नहीं जा सकता",
                   "mr": "वेळ नोंदलेली नाही, त्यामुळे ती किती जुनी आहे ते तपासता येत नाही"},
    "dh_future": {"en": "its time is in the future, so it cannot be trusted",
                  "hi": "इसका समय भविष्य का है, इसलिए इस पर भरोसा नहीं किया जा सकता",
                  "mr": "याची वेळ भविष्यातील आहे, त्यामुळे यावर विश्वास ठेवता येत नाही"},
    "dh_static": {"en": "bundled with the app",
                  "hi": "ऐप के साथ शामिल",
                  "mr": "अॅपसोबत समाविष्ट"},
    "dh_standin": {"en": "live provider unreachable — the simulated stand-in shown is not "
                         "used to clear a trip",
                   "hi": "लाइव स्रोत उपलब्ध नहीं — दिखाया गया नकली मान यात्रा की मंज़ूरी "
                         "के लिए इस्तेमाल नहीं होता",
                   "mr": "थेट स्रोत उपलब्ध नाही — दाखवलेले नमुना मूल्य फेरीच्या परवानगीसाठी "
                         "वापरले जात नाही"},
    "dh_reconnected": {"en": "the {feed} reconnected {age} ago",
                       "hi": "{feed} {age} पहले फिर से जुड़ा",
                       "mr": "{feed} {age} पूर्वी पुन्हा जोडला गेला"},
    "dh_no_reading": {"en": "no reading", "hi": "कोई रीडिंग नहीं", "mr": "नोंद नाही"},
    "dh_bundled": {"en": "bundled bulletin — no live IMD / INCOIS feed, age unknown",
                   "hi": "साथ आया बुलेटिन — IMD / INCOIS का लाइव स्रोत नहीं, उम्र अज्ञात",
                   "mr": "सोबतचे बुलेटिन — IMD / INCOIS चा थेट स्रोत नाही, वय अज्ञात"},
    "minute_one": {"en": "min", "hi": "मि", "mr": "मिनिट"},
    "dhs_FRESH": {"en": "fresh", "hi": "ताज़ा", "mr": "ताजी"},
    "dhs_STALE": {"en": "out of date", "hi": "पुराना", "mr": "जुनी"},
    "dhs_MISSING": {"en": "missing", "hi": "उपलब्ध नहीं", "mr": "उपलब्ध नाही"},
    "dhs_ERROR": {"en": "error", "hi": "त्रुटि", "mr": "त्रुटी"},
    "dhi_wave": {"en": "Wave height", "hi": "लहरों की ऊँचाई", "mr": "लाटांची उंची"},
    "dhi_wind": {"en": "Wind", "hi": "हवा", "mr": "वारा"},
    "dhi_warnings": {"en": "Official warnings", "hi": "आधिकारिक चेतावनियाँ",
                     "mr": "अधिकृत इशारे"},
    "dhi_position": {"en": "Position and restricted zones",
                     "hi": "स्थान और प्रतिबंधित क्षेत्र",
                     "mr": "ठिकाण आणि प्रतिबंधित क्षेत्रे"},
    "dhi_rain": {"en": "Rain and visibility", "hi": "वर्षा और दृश्यता",
                 "mr": "पाऊस आणि दृश्यमानता"},
    "dhi_current": {"en": "Surface current", "hi": "सतही धारा",
                    "mr": "पृष्ठभागावरील प्रवाह"},
    "dhf_marine": {"en": "marine forecast feed", "hi": "समुद्री पूर्वानुमान स्रोत",
                   "mr": "सागरी अंदाज स्रोत"},
    "dhf_weather": {"en": "weather forecast feed", "hi": "मौसम पूर्वानुमान स्रोत",
                    "mr": "हवामान अंदाज स्रोत"},
    "dhf_warnings": {"en": "warnings bulletin feed", "hi": "चेतावनी बुलेटिन स्रोत",
                     "mr": "इशारा बुलेटिन स्रोत"},
    "dhf_chart": {"en": "bundled chart layer", "hi": "साथ आई नक्शा परत",
                  "mr": "सोबतचा नकाशा स्तर"},

    # ---- the safety gate: may ORCA give its normal answer? -------------------
    "gate_headline_GO": {"en": "Evidence check passed — normal confidence.",
                         "hi": "प्रमाण जाँच सफल — सामान्य भरोसा।",
                         "mr": "पुरावा तपासणी यशस्वी — नेहमीचा विश्वास."},
    "gate_headline_CAUTION": {"en": "Caution — some of the data behind this answer is out "
                                    "of date.",
                              "hi": "सावधान — इस उत्तर के पीछे के कुछ आँकड़े पुराने हैं।",
                              "mr": "सावधान — या उत्तरामागील काही माहिती जुनी आहे."},
    "gate_headline_INSUFFICIENT_DATA": {
        "en": "Not enough reliable data to decide — follow the official advisory.",
        "hi": "निर्णय के लिए पर्याप्त भरोसेमंद आँकड़े नहीं — आधिकारिक सलाह का पालन करें।",
        "mr": "निर्णयासाठी पुरेशी विश्वासार्ह माहिती नाही — अधिकृत सल्ला पाळा."},
    "gate_headline_NO_GO": {"en": "Do not go — the existing safety rules decide.",
                            "hi": "न जाएँ — मौजूदा सुरक्षा नियम लागू हैं।",
                            "mr": "जाऊ नका — सध्याचे सुरक्षा नियम लागू आहेत."},
    "gate_all_fresh": {"en": "All {n} critical inputs are fresh.",
                       "hi": "सभी {n} ज़रूरी आँकड़े ताज़ा हैं।",
                       "mr": "सर्व {n} आवश्यक नोंदी ताज्या आहेत."},
    "gate_reason_stale": {"en": "{input} is {age} old — over the {limit} limit.",
                          "hi": "{input}: {age} पुराना आँकड़ा — {limit} की सीमा से ज़्यादा।",
                          "mr": "{input}: {age} जुनी नोंद — {limit} मर्यादेपेक्षा जास्त."},
    "gate_reason_bundled": {"en": "{input}: no live IMD / INCOIS feed is connected — the bundled "
                                  "bulletin cannot say what was issued in the last hour.",
                            "hi": "{input}: IMD / INCOIS का कोई लाइव स्रोत जुड़ा नहीं — साथ आया "
                                  "बुलेटिन पिछले घंटे की चेतावनी नहीं बता सकता।",
                            "mr": "{input}: IMD / INCOIS चा कोणताही थेट स्रोत जोडलेला नाही — सोबतचे "
                                  "बुलेटिन गेल्या तासातील इशारा सांगू शकत नाही."},
    "gate_reason_blocking": {"en": "{input}: {detail}.", "hi": "{input}: {detail}।",
                             "mr": "{input}: {detail}."},
    "gate_block": {"en": "ORCA will not clear a trip on missing or out-of-date evidence.",
                   "hi": "ORCA गायब या पुराने आँकड़ों पर यात्रा की मंज़ूरी नहीं देता।",
                   "mr": "ORCA गहाळ किंवा जुन्या माहितीवर फेरीला परवानगी देत नाही."},
    "gate_caution_act": {"en": "Check the latest IMD / INCOIS bulletin before you go.",
                         "hi": "जाने से पहले IMD / INCOIS का ताज़ा बुलेटिन देखें।",
                         "mr": "जाण्यापूर्वी IMD / INCOIS चे ताजे बुलेटिन पाहा."},
    "gate_advisory": {"en": "Follow the official IMD / INCOIS advisory and Coast Guard "
                            "instructions.",
                      "hi": "IMD / INCOIS की आधिकारिक सलाह और तटरक्षक बल के निर्देशों का "
                            "पालन करें।",
                      "mr": "IMD / INCOIS चा अधिकृत सल्ला आणि तटरक्षक दलाच्या सूचना पाळा."},
    "gate_nogo_missing": {"en": "The safety rules already say do not go. With a reading "
                                "missing, the real risk may be higher than shown.",
                          "hi": "सुरक्षा नियम पहले ही न जाने को कहते हैं। एक रीडिंग गायब होने से "
                                "असली जोखिम दिखाए गए से ज़्यादा हो सकता है।",
                          "mr": "सुरक्षा नियम आधीच जाऊ नका असे सांगतात. एक नोंद गहाळ असल्याने "
                                "खरा धोका दाखवलेल्यापेक्षा जास्त असू शकतो."},
    "gate_nogo_stale": {"en": "The safety rules already say do not go; some of the readings "
                              "behind the score are out of date.",
                        "hi": "सुरक्षा नियम पहले ही न जाने को कहते हैं; स्कोर के पीछे की कुछ "
                              "रीडिंग पुरानी हैं।",
                        "mr": "सुरक्षा नियम आधीच जाऊ नका असे सांगतात; गुणांमागील काही नोंदी "
                              "जुन्या आहेत."},
    "gate_no_risk": {"en": "The risk engine returned no result.",
                     "hi": "जोखिम गणना से कोई परिणाम नहीं मिला।",
                     "mr": "धोका गणनेतून कोणताही निकाल मिळाला नाही."},
    "gate_reconnected": {"en": "The {feed} reconnected {age} ago — readings are fresh again.",
                         "hi": "{feed} {age} पहले फिर से जुड़ा — रीडिंग फिर से ताज़ा हैं।",
                         "mr": "{feed} {age} पूर्वी पुन्हा जोडला गेला — नोंदी पुन्हा ताज्या "
                               "आहेत."},
    "gate_conf_normal": {"en": "normal confidence", "hi": "सामान्य भरोसा",
                         "mr": "नेहमीचा विश्वास"},
    "gate_conf_degraded": {"en": "degraded confidence", "hi": "घटा हुआ भरोसा",
                           "mr": "कमी झालेला विश्वास"},
    "gate_conf_insufficient": {"en": "incomplete evidence", "hi": "अधूरे प्रमाण",
                               "mr": "अपूर्ण पुरावा"},
    "gate_state_GO": {"en": "Go", "hi": "जा सकते हैं", "mr": "जाऊ शकता"},
    "gate_state_CAUTION": {"en": "Caution", "hi": "सावधान", "mr": "सावधान"},
    "gate_state_NO_GO": {"en": "No-go", "hi": "न जाएँ", "mr": "जाऊ नका"},
    "gate_state_INSUFFICIENT_DATA": {"en": "Insufficient data", "hi": "अपर्याप्त आँकड़े",
                                     "mr": "अपुरी माहिती"},
}

SUGGESTIONS: Dict[Language, List[str]] = {
    "en": ["What about 12 PM?", "Show nearby fishing zones", "Give me the safest route",
           "Is there a cyclone nearby?"],
    "hi": ["दोपहर 12 बजे कैसा रहेगा?", "पास के मत्स्य क्षेत्र दिखाओ", "सबसे सुरक्षित रास्ता बताओ",
           "क्या आसपास कोई चक्रवात है?"],
    "mr": ["दुपारी १२ वाजता काय?", "जवळचे PFZ दाखवा", "सुरक्षित मार्ग दाखवा",
           "जवळपास चक्रीवादळ आहे का?"],
}


# --------------------------------------------------------------------------
# Provenance, places and dates
# --------------------------------------------------------------------------
# English labels live in config.SOURCE_LABELS (also served by /api/config).
# Organisation names are proper nouns and stay in Latin script; everything
# around them is translated. The simulated-data label must stay blunt in
# every language: it is the line that stops a demo value being read as an
# official one.
SOURCE_LABELS_L10N: Dict[str, Dict[Language, str]] = {
    "INCOIS": {"hi": "INCOIS", "mr": "INCOIS"},
    "IMD": {"hi": "IMD", "mr": "IMD"},
    "MOSDAC": {"hi": "ISRO MOSDAC", "mr": "ISRO MOSDAC"},
    "OPEN_METEO": {"hi": "Open-Meteo Marine (खुला वैकल्पिक स्रोत)",
                   "mr": "Open-Meteo Marine (खुला पर्यायी स्रोत)"},
    "DEMO": {"hi": "ORCA डेमो डेटासेट — नकली आँकड़े, असली या आधिकारिक नहीं",
             "mr": "ORCA डेमो माहितीसंच — नमुना माहिती, खरी किंवा अधिकृत नाही"},
    "ORCA_GIS": {"hi": "ORCA भू-स्थानिक परत (OpenStreetMap से तैयार)",
                 "mr": "ORCA भू-स्थानिक स्तर (OpenStreetMap वरून तयार)"},
}


def source_label(code: str, lang: Language) -> str:
    """Human name of a data source, in the reader's language."""
    english = SOURCE_LABELS.get(code, code)
    if lang == "en":
        return english
    return SOURCE_LABELS_L10N.get(code, {}).get(lang, english)


# Species as a fisher names them, keyed by the canonical entries in
# services/fishing.py. English keeps the local-name-plus-gloss form; Hindi and
# Marathi print the local name in the reader's own script, with no English
# gloss — the gloss exists for readers who do not know the local name, and in
# hi/mr the local name IS the reader's word.
SPECIES_L10N: Dict[str, Dict[Language, str]] = {
    "Bangda (Indian mackerel)": {"hi": "बांगड़ा", "mr": "बांगडा"},
    "Tarli (oil sardine)": {"hi": "तारली", "mr": "तारली"},
    "Paplet (silver pomfret)": {"hi": "पापलेट", "mr": "पापलेट"},
    "Surmai (seer fish)": {"hi": "सुरमई", "mr": "सुरमई"},
    "Bombil (Bombay duck)": {"hi": "बोंबिल", "mr": "बोंबील"},
    "Hilsa (ilish)": {"hi": "हिल्सा", "mr": "हिलसा"},
}


def species_name(name: str, lang: Language) -> str:
    return SPECIES_L10N.get(name, {}).get(lang, name)


# The fishing model's footnote, shown under the factor meters.
METHOD_L10N: Dict[Language, str] = {
    "en": ("Likelihood from chlorophyll, sea-surface temperature, thermal front "
           "strength, sea state and time of day. Species mix weighted by regional "
           "occurrence records (OBIS / Map of Life snapshot). "
           "A likelihood, never a guarantee."),
    "hi": ("संभावना क्लोरोफ़िल, समुद्र-सतह के तापमान, तापीय मोर्चे की ताक़त, समुद्र की "
           "हालत और दिन के समय से निकाली गई है। मछलियों का मिश्रण क्षेत्रीय "
           "उपस्थिति रिकॉर्ड (OBIS / Map of Life स्नैपशॉट) से तौला गया है। "
           "यह एक संभावना है, कोई वादा नहीं।"),
    "mr": ("शक्यता क्लोरोफिल, समुद्र-पृष्ठ तापमान, तापीय आघाडीची तीव्रता, समुद्राची "
           "स्थिती आणि दिवसाच्या वेळेवरून काढली आहे. माशांचे मिश्रण प्रादेशिक "
           "नोंदींनुसार (OBIS / Map of Life स्नॅपशॉट) तोलले आहे. "
           "ही एक शक्यता आहे, हमी नाही."),
}


def method_line(lang: Language) -> str:
    return METHOD_L10N.get(lang, METHOD_L10N["en"])


# The trip-economics assumptions, with the numbers handed in so this table can
# never drift from the model's constants (services/fishing.py).
ASSUMPTIONS_L10N: Dict[Language, str] = {
    "en": "Typical motorised FRP boat · {l_per_km} L/km · ₹{price}/L · mixed catch ₹{mixed}/kg",
    "hi": "आम मोटर वाली FRP नाव · {l_per_km} ली/किमी · ₹{price}/ली · मिली-जुली पकड़ ₹{mixed}/किलो",
    "mr": "नेहमीची मोटर असलेली FRP होडी · {l_per_km} ली/किमी · ₹{price}/ली · मिश्र मासळी ₹{mixed}/किलो",
}


def assumptions_line(lang: Language, *, l_per_km: float, price: float, mixed: float) -> str:
    return ASSUMPTIONS_L10N.get(lang, ASSUMPTIONS_L10N["en"]).format(
        l_per_km=l_per_km, price=f"{price:.0f}", mixed=f"{mixed:.0f}")


# A ground's one-line rationale: the same figures in every language.
RATIONALE_L10N: Dict[Language, str] = {
    "en": "Chlorophyll {chl} mg/m³ at {sst} °C, {km} km {dir}.",
    "hi": "क्लोरोफ़िल {chl} mg/m³, {sst} °C पर · {km} किमी {dir}।",
    "mr": "क्लोरोफिल {chl} mg/m³, {sst} °C ला · {km} किमी {dir}.",
}


def ground_rationale(lang: Language, *, chl, sst, km: int, bearing: Optional[str]) -> str:
    return RATIONALE_L10N.get(lang, RATIONALE_L10N["en"]).format(
        chl=chl, sst=sst, km=km, dir=direction(bearing, lang))


# The demo geofences (data/geo.py RESTRICTED_ZONES), by their English name.
ZONE_NAMES: Dict[str, Dict[Language, str]] = {
    "Mumbai Port approach channel": {
        "hi": "मुंबई बंदरगाह का प्रवेश मार्ग", "mr": "मुंबई बंदराचा प्रवेश मार्ग"},
    "Naval exercise area (notified)": {
        "hi": "नौसेना अभ्यास क्षेत्र (अधिसूचित)", "mr": "नौदल सराव क्षेत्र (अधिसूचित)"},
    "Malvan Marine Sanctuary": {
        "hi": "मालवण समुद्री अभयारण्य", "mr": "मालवण सागरी अभयारण्य"},
    "International Maritime Boundary (Palk Bay approach)": {
        "hi": "अंतरराष्ट्रीय समुद्री सीमा (पाक खाड़ी के पास)",
        "mr": "आंतरराष्ट्रीय सागरी सीमा (पाकच्या उपसागराजवळ)"},
    "Kochi Port navigation channel": {
        "hi": "कोच्चि बंदरगाह का नौवहन मार्ग", "mr": "कोची बंदराचा जलवाहतूक मार्ग"},
}


def zone_name(name: str, lang: Language) -> str:
    return ZONE_NAMES.get(name, {}).get(lang, name)


def direction(bearing: Optional[str], lang: Language) -> str:
    """Compass label for the answer text: "WSW" in English, a plain direction
    word ("नैऋत्य", "दक्षिण-पश्चिम") in Marathi and Hindi."""
    if not bearing:
        return ""
    if lang == "en":
        return bearing
    return direction_words(bearing, lang) or bearing


MONTHS: Dict[Language, List[str]] = {
    "hi": ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त",
           "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    "mr": ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट",
           "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
}


def format_stamp(when: datetime, lang: Language) -> str:
    """"02 Oct 2026, 06:00 IST" / "2 ऑक्टोबर 2026, 06:00 IST". Digits are never
    localised (module rule); only the month name is."""
    if lang in MONTHS:
        return f"{when.day} {MONTHS[lang][when.month - 1]} {when.year}, {when:%H:%M} IST"
    return when.strftime("%d %b %Y, %H:%M IST")


def t(key: str, lang: Language, **kwargs) -> str:
    template = T.get(key, {}).get(lang) or T.get(key, {}).get("en", key)
    return template.format(**kwargs) if kwargs else template


def verdict_key(category: str) -> str:
    return {"LOW": "verdict_low", "MODERATE": "verdict_moderate",
            "HIGH": "verdict_high", "EXTREME": "verdict_extreme"}[category]


def humanise_duration(minutes: int, lang: Language) -> str:
    h, m = divmod(int(minutes), 60)
    if h and m:
        return f"{h} {t('hours', lang)} {m} {t('minutes', lang)}"
    if h:
        return f"{h} {t('hours', lang)}"
    return f"{m} {t('minutes', lang)}"


# --------------------------------------------------------------------------
# The verdict's working, in the reader's language
# --------------------------------------------------------------------------
# Everything the risk card, the map and the authority board print next to a
# number: the factor names, the reason under each, the safety floors, official
# warnings, geofence messages and courses. English is the engine's original
# wording, character for character; Hindi and Marathi say the same thing.
# Units that are written on every chart (m, km/h, m/s, %) are never translated.
FACTOR_LABELS: Dict[str, Dict[Language, str]] = {
    "wave":    {"en": "Wave height",         "hi": "लहरों की ऊँचाई",        "mr": "लाटांची उंची"},
    "cyclone": {"en": "Official warnings",   "hi": "आधिकारिक चेतावनी",     "mr": "अधिकृत इशारा"},
    "wind":    {"en": "Wind",                "hi": "हवा",                  "mr": "वारा"},
    "weather": {"en": "Rain / visibility",   "hi": "बारिश / दृश्यता",       "mr": "पाऊस / दृश्यमानता"},
    "ocean":   {"en": "Sea state & current", "hi": "समुद्र की स्थिति व धारा", "mr": "समुद्राची स्थिती व प्रवाह"},
    "gis":     {"en": "Position & zones",    "hi": "स्थिति व क्षेत्र",        "mr": "स्थान व क्षेत्रे"},
}


def factor_label(key: str, lang: Language) -> str:
    row = FACTOR_LABELS.get(key, {})
    return row.get(lang) or row.get("en", key)


SEA_STATE_L10N: Dict[str, Dict[Language, str]] = {
    "calm":       {"en": "calm", "hi": "शांत", "mr": "शांत"},
    "slight":     {"en": "slight", "hi": "हल्का", "mr": "किंचित"},
    "moderate":   {"en": "moderate", "hi": "मध्यम", "mr": "मध्यम"},
    "rough":      {"en": "rough", "hi": "उग्र", "mr": "खवळलेला"},
    "very rough": {"en": "very rough", "hi": "अति उग्र", "mr": "अतिशय खवळलेला"},
    "phenomenal": {"en": "phenomenal", "hi": "अत्यंत भीषण", "mr": "अत्यंत धोकादायक"},
    "unknown":    {"en": "unknown", "hi": "अज्ञात", "mr": "अज्ञात"},
}


def sea_state(label: Optional[str], lang: Language) -> str:
    """"moderate" / "मध्यम". An unrecognised label is passed through unchanged."""
    key = str(label or "unknown")
    return SEA_STATE_L10N.get(key.lower(), {}).get(lang, key)


RISK_BAND: Dict[str, Dict[Language, str]] = {
    "LOW":      {"en": "LOW", "hi": "कम", "mr": "कमी"},
    "MODERATE": {"en": "MODERATE", "hi": "मध्यम", "mr": "मध्यम"},
    "HIGH":     {"en": "HIGH", "hi": "अधिक", "mr": "जास्त"},
    "EXTREME":  {"en": "EXTREME", "hi": "अत्यधिक", "mr": "अत्यंत"},
}

T.update({
    # ---- the reason printed under each risk factor -----------------------
    "rf_wave": {"en": "Wave height {v} m", "hi": "लहरों की ऊँचाई {v} m", "mr": "लाटांची उंची {v} m"},
    "rf_wave_na": {"en": "Wave height unavailable", "hi": "लहरों की ऊँचाई उपलब्ध नहीं",
                   "mr": "लाटांची उंची उपलब्ध नाही"},
    "rf_no_warning": {"en": "No active marine warning", "hi": "कोई सक्रिय समुद्री चेतावनी नहीं",
                      "mr": "कोणताही सक्रिय सागरी इशारा नाही"},
    "rf_wind": {"en": "Wind {v} km/h", "hi": "हवा {v} km/h", "mr": "वारा {v} km/h"},
    "rf_wind_na": {"en": "Wind unavailable", "hi": "हवा की जानकारी उपलब्ध नहीं",
                   "mr": "वाऱ्याची माहिती उपलब्ध नाही"},
    "rf_rain": {"en": "Rain probability {v}%", "hi": "बारिश की संभावना {v}%",
                "mr": "पावसाची शक्यता {v}%"},
    "rf_lightning": {"en": ", lightning likely", "hi": ", बिजली गिरने की संभावना",
                     "mr": ", विजा पडण्याची शक्यता"},
    "rf_visibility": {"en": ", visibility {v} km", "hi": ", दृश्यता {v} किमी",
                      "mr": ", दृश्यमानता {v} किमी"},
    "rf_weather_na": {"en": "Weather detail unavailable", "hi": "मौसम का ब्योरा उपलब्ध नहीं",
                      "mr": "हवामानाचा तपशील उपलब्ध नाही"},
    "rf_sea_state": {"en": "Sea state {v}", "hi": "समुद्र की स्थिति {v}",
                     "mr": "समुद्राची स्थिती {v}"},
    "rf_current": {"en": ", current {v} m/s", "hi": ", धारा {v} m/s", "mr": ", प्रवाह {v} m/s"},
    "rf_inside_zone": {"en": "Inside a restricted zone", "hi": "प्रतिबंधित क्षेत्र के भीतर",
                       "mr": "प्रतिबंधित क्षेत्राच्या आत"},
    "rf_offshore": {"en": "{v} km offshore", "hi": "तट से {v} किमी दूर",
                    "mr": "किनाऱ्यापासून {v} किमी दूर"},
    "rf_position_na": {"en": "Position unavailable", "hi": "स्थिति उपलब्ध नहीं",
                       "mr": "स्थान उपलब्ध नाही"},
    "rf_zone_near": {"en": ", restricted zone {v} km away",
                     "hi": ", प्रतिबंधित क्षेत्र {v} किमी दूर",
                     "mr": ", प्रतिबंधित क्षेत्र {v} किमी अंतरावर"},
    # ---- the safety floors (risk_engine layer 3) -------------------------
    "floor_severe": {
        "en": "Official severe warning in force ({source}) — overrides model output",
        "hi": "आधिकारिक गंभीर चेतावनी लागू ({source}) — मॉडल के नतीजे से ऊपर",
        "mr": "अधिकृत गंभीर इशारा लागू ({source}) — मॉडेलच्या निकालापेक्षा वरचढ",
    },
    "floor_fishermen": {
        "en": "{source} fishermen warning active — advisory overrides model output",
        "hi": "{source} की मछुआरा चेतावनी सक्रिय — सलाह मॉडल के नतीजे से ऊपर",
        "mr": "{source} चा मच्छीमार इशारा सक्रिय — सूचना मॉडेलच्या निकालापेक्षा वरचढ",
    },
    "floor_wave": {
        "en": "Wave height {v} m exceeds the {limit} m small-craft danger threshold",
        "hi": "लहरों की ऊँचाई {v} m, छोटी नावों की {limit} m की ख़तरे की सीमा से ऊपर",
        "mr": "लाटांची उंची {v} m, लहान होड्यांच्या {limit} m धोका-मर्यादेपेक्षा जास्त",
    },
    "floor_wind": {
        "en": "Wind {v} km/h at or above gale force",
        "hi": "हवा {v} km/h, आँधी के स्तर पर या उससे ऊपर",
        "mr": "वारा {v} km/h, वादळी वाऱ्याच्या पातळीवर किंवा त्याहून जास्त",
    },
    "floor_zone": {
        "en": "Position falls inside a restricted maritime zone",
        "hi": "स्थिति प्रतिबंधित समुद्री क्षेत्र के भीतर है",
        "mr": "स्थान प्रतिबंधित सागरी क्षेत्राच्या आत आहे",
    },
    # ---- geofence messages (GIS agent) -----------------------------------
    "gf_msg_inside": {
        "en": "You are inside {zone}. Leave the area immediately.",
        "hi": "आप {zone} के भीतर हैं। तुरंत क्षेत्र छोड़ें।",
        "mr": "तुम्ही {zone} मध्ये आहात. ताबडतोब क्षेत्र सोडा.",
    },
    "gf_msg_close": {
        "en": "{zone} is only {distance} km away.",
        "hi": "{zone} केवल {distance} किमी दूर है।",
        "mr": "{zone} फक्त {distance} किमी अंतरावर आहे.",
    },
    "gf_msg_approach": {
        "en": "Approaching {zone} — {distance} km away.",
        "hi": "{zone} के पास पहुँच रहे हैं — {distance} किमी दूर।",
        "mr": "{zone} जवळ येत आहात — {distance} किमी अंतरावर.",
    },
    # ---- the draggable boat's position check -----------------------------
    "pos_on_land": {
        "en": "That position is on land — drop the boat on the water",
        "hi": "यह जगह ज़मीन पर है — नाव को पानी पर रखें",
        "mr": "ही जागा जमिनीवर आहे — होडी पाण्यावर ठेवा",
    },
    "pos_inside": {"en": "Inside {zone}", "hi": "{zone} के भीतर", "mr": "{zone} च्या आत"},
    "pos_close": {"en": "{zone} is {distance} km away", "hi": "{zone} {distance} किमी दूर है",
                  "mr": "{zone} {distance} किमी अंतरावर आहे"},
    "pos_approach": {"en": "Approaching {zone}", "hi": "{zone} के पास पहुँच रहे हैं",
                     "mr": "{zone} जवळ येत आहात"},
    "pos_clear": {"en": "No restricted area nearby", "hi": "पास में कोई प्रतिबंधित क्षेत्र नहीं",
                  "mr": "जवळ कोणतेही प्रतिबंधित क्षेत्र नाही"},
    # ---- courses (route optimiser) ---------------------------------------
    "route_name_safest": {"en": "Safest route", "hi": "सबसे सुरक्षित रास्ता",
                          "mr": "सर्वात सुरक्षित मार्ग"},
    "route_name_direct": {"en": "Direct route", "hi": "सीधा रास्ता", "mr": "थेट मार्ग"},
    "route_note_clear": {"en": "Avoids all restricted areas.",
                         "hi": "सभी प्रतिबंधित क्षेत्रों से बचता है।",
                         "mr": "सर्व प्रतिबंधित क्षेत्रे टाळतो."},
    "route_note_close": {
        "en": "Best available track — some restricted areas remain close.",
        "hi": "उपलब्ध सबसे अच्छा रास्ता — कुछ प्रतिबंधित क्षेत्र पास ही रहते हैं।",
        "mr": "उपलब्ध सर्वोत्तम मार्ग — काही प्रतिबंधित क्षेत्रे जवळच राहतात.",
    },
    "route_note_through": {
        "en": "Shortest track, but it passes through: {zones}",
        "hi": "सबसे छोटा रास्ता, पर यह इन क्षेत्रों से गुज़रता है: {zones}",
        "mr": "सर्वात जवळचा मार्ग, पण तो या क्षेत्रांमधून जातो: {zones}",
    },
    "route_note_direct_clear": {
        "en": "Shortest track, no restricted areas on the way.",
        "hi": "सबसे छोटा रास्ता, बीच में कोई प्रतिबंधित क्षेत्र नहीं।",
        "mr": "सर्वात जवळचा मार्ग, वाटेत कोणतेही प्रतिबंधित क्षेत्र नाही.",
    },
    # ---- one line per agent in the crew trace ----------------------------
    "trace_weather": {"en": "wind {wind} km/h, rain {rain}%", "hi": "हवा {wind} km/h, बारिश {rain}%",
                      "mr": "वारा {wind} km/h, पाऊस {rain}%"},
    "trace_ocean": {"en": "wave {wave} m, {state}", "hi": "लहर {wave} m, {state}",
                    "mr": "लाट {wave} m, {state}"},
    "trace_risk_withheld": {"en": "score withheld — evidence incomplete",
                            "hi": "स्कोर रोका गया — प्रमाण अधूरे",
                            "mr": "गुण रोखले — पुरावा अपूर्ण"},
    "trace_ocean_none": {"en": "no wave reading — marine feed silent",
                         "hi": "लहर की रीडिंग नहीं — समुद्री स्रोत चुप",
                         "mr": "लाटेची नोंद नाही — सागरी स्रोत बंद"},
    "trace_weather_none": {"en": "no wind reading — weather feed silent",
                           "hi": "हवा की रीडिंग नहीं — मौसम स्रोत चुप",
                           "mr": "वाऱ्याची नोंद नाही — हवामान स्रोत बंद"},
    "trace_pfz": {"en": "{n} zones ranked", "hi": "{n} क्षेत्र क्रम से लगाए",
                  "mr": "{n} क्षेत्रे क्रमवार लावली"},
    "trace_no_warning": {"en": "no active warning", "hi": "कोई सक्रिय चेतावनी नहीं",
                         "mr": "सक्रिय इशारा नाही"},
    "trace_gis": {"en": "{km} km offshore, {n} zones nearby", "hi": "तट से {km} किमी, पास में {n} क्षेत्र",
                  "mr": "किनाऱ्यापासून {km} किमी, जवळ {n} क्षेत्रे"},
    "trace_route": {"en": "{km} km recommended", "hi": "{km} किमी का रास्ता सुझाया",
                    "mr": "{km} किमी मार्ग सुचवला"},
    "trace_no_route": {"en": "no route", "hi": "कोई रास्ता नहीं", "mr": "मार्ग नाही"},
    "trace_explanation": {"en": "answer composed", "hi": "उत्तर तैयार", "mr": "उत्तर तयार"},
})

# Official-style warnings in the demo store (data/demo_store.py), by their
# English wording. A real IMD / INCOIS bulletin arrives in English and Hindi;
# an unrecognised text is shown exactly as the agency wrote it.
ALERT_TEXT: Dict[str, Dict[Language, str]] = {
    "Fishermen advised not to venture into the sea": {
        "hi": "मछुआरों को समुद्र में न जाने की सलाह",
        "mr": "मच्छीमारांनी समुद्रात जाऊ नये असा सल्ला"},
    "Squally weather with wind speed reaching 35-45 kmph very likely over the north "
    "Maharashtra coast.": {
        "hi": "उत्तर महाराष्ट्र तट पर 35-45 kmph की हवा के साथ तूफ़ानी मौसम की प्रबल संभावना।",
        "mr": "उत्तर महाराष्ट्र किनाऱ्यावर ताशी 35-45 किमी वेगाच्या वाऱ्यासह वादळी हवामानाची दाट शक्यता."},
    "Severe Cyclonic Storm — Orange message for north Odisha coast": {
        "hi": "गंभीर चक्रवाती तूफ़ान — उत्तर ओडिशा तट के लिए ऑरेंज संदेश",
        "mr": "तीव्र चक्रीवादळ — उत्तर ओडिशा किनाऱ्यासाठी ऑरेंज संदेश"},
    "Sea condition phenomenal. Fishermen are advised NOT to venture into the sea and to "
    "return to coast immediately.": {
        "hi": "समुद्र की स्थिति अत्यंत भीषण। मछुआरों को समुद्र में न जाने और तुरंत तट पर लौटने की सलाह दी जाती है।",
        "mr": "समुद्राची स्थिती अत्यंत धोकादायक. मच्छीमारांनी समुद्रात जाऊ नये आणि ताबडतोब किनाऱ्यावर परतावे."},
    "High Wave Alert — wave height 4.5-6.0 m": {
        "hi": "ऊँची लहरों की चेतावनी — लहरों की ऊँचाई 4.5-6.0 m",
        "mr": "उंच लाटांचा इशारा — लाटांची उंची 4.5-6.0 m"},
    "INCOIS high wave alert in force along the Odisha coast.": {
        "hi": "ओडिशा तट पर INCOIS की ऊँची लहरों की चेतावनी लागू।",
        "mr": "ओडिशा किनाऱ्यावर INCOIS चा उंच लाटांचा इशारा लागू."},
    "Fishermen warning — squally weather over the north Bay of Bengal": {
        "hi": "मछुआरा चेतावनी — उत्तरी बंगाल की खाड़ी में तूफ़ानी मौसम",
        "mr": "मच्छीमार इशारा — उत्तर बंगालच्या उपसागरात वादळी हवामान"},
    "Wind speed reaching 45-55 kmph. Fishermen advised not to venture out.": {
        "hi": "हवा की गति 45-55 kmph तक। मछुआरों को समुद्र में न जाने की सलाह।",
        "mr": "वाऱ्याचा वेग ताशी 45-55 किमी पर्यंत. मच्छीमारांनी समुद्रात जाऊ नये."},
}


def alert_text(text: Optional[str], lang: Language) -> Optional[str]:
    if not text or lang == "en":
        return text
    return ALERT_TEXT.get(text, {}).get(lang, text)


def localise_alert(alert: Dict, lang: Language) -> Dict:
    """A copy of one marine alert with its prose in the reader's language.

    Only the words change. `type`, `severity`, `official` and the storm
    geometry — everything the risk engine and the chart read — are untouched.
    """
    if lang == "en":
        return alert
    out = dict(alert)
    out["headline"] = alert_text(alert.get("headline"), lang)
    out["detail"] = alert_text(alert.get("detail"), lang)
    if alert.get("disclaimer"):
        out["disclaimer"] = t("demo_mode", lang)
    return out


def coerce_language(value: Optional[str]) -> Language:
    """Query-string language -> a supported one (anything else reads as English)."""
    return value if value in ("en", "hi", "mr") else "en"  # type: ignore[return-value]
