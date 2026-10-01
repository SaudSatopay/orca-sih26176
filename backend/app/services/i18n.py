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
