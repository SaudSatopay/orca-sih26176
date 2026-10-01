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
              "chlorophyll {chl} mg/m3, chance of fish {chance}%.",
        "hi": "#{rank} — {distance} किमी {direction} की ओर, समुद्र सतह का तापमान {sst} °C, "
              "क्लोरोफिल {chl} mg/m3, मछली मिलने की संभावना {chance}%।",
        "mr": "#{rank} — {distance} किमी {direction} दिशेला, समुद्रपृष्ठाचे तापमान {sst} °C, "
              "क्लोरोफिल {chl} mg/m3, मासे मिळण्याची शक्यता {chance}%.",
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
