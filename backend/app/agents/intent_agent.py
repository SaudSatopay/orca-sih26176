"""Intent agent — turns one free-text/voice line into a structured request.

Rule-based on purpose. A hackathon demo cannot depend on an LLM round-trip (or
an API key) to understand "उद्या सकाळी ६ वाजता", and a safety product should not
let a language model decide *what was asked* without a deterministic fallback.
When an LLM is configured it is used only to enrich, never to replace, this.
"""
from __future__ import annotations

import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from ..data.demo_store import now_ist
from ..data.geo import find_port, nearest_port
from ..schemas import Intent, Language, Location
from ..services.i18n import detect_language
from .base import timed
from ..schemas import AgentResult

# Devanagari -> Latin digits
DEV_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")

TIME_WORDS: Dict[str, int] = {
    # English
    "dawn": 5, "sunrise": 6, "early morning": 5, "morning": 6, "forenoon": 10,
    "noon": 12, "midday": 12, "afternoon": 14, "evening": 18, "sunset": 18,
    "night": 21, "midnight": 0,
    # Hindi
    "सुबह": 6, "तड़के": 5, "दोपहर": 12, "शाम": 18, "रात": 21,
    # Marathi
    "सकाळी": 6, "पहाटे": 5, "दुपारी": 12, "संध्याकाळी": 18, "रात्री": 21,
}

INTENT_KEYWORDS: Dict[str, List[str]] = {
    "find_pfz": ["pfz", "fishing zone", "fishing zones", "where are the fish", "where to fish",
                 "catch", "मत्स्य क्षेत्र", "मछली", "मासेमारी क्षेत्र", "मासे कुठे", "जवळचे pfz",
                 "मछली कहाँ", "मासेमारीसाठी जागा"],
    "route": ["route", "way to", "how do i get", "navigate", "रास्ता", "मार्ग", "सुरक्षित मार्ग",
              "कसे जाऊ", "कैसे जाऊं"],
    "alerts": ["cyclone", "storm", "warning", "alert", "tsunami", "चक्रवात", "चक्रीवादळ",
               "तूफान", "वादळ", "चेतावनी", "इशारा", "अलर्ट"],
    "explain": ["why", "explain", "reason", "क्यों", "क्यूँ", "का ", "कारण", "कशामुळे"],
    "restricted": ["restricted", "boundary", "border", "prohibited", "प्रतिबंधित", "सीमा",
                   "बंदी", "निषिद्ध"],
}

ACTIVITY_KEYWORDS = {
    "fishing": ["fish", "fishing", "मासेमारी", "मछली", "मच्छीमारी"],
    "travel": ["travel", "go to", "sail", "प्रवास", "जाना", "जाणे"],
}


def _normalise(text: str) -> str:
    return text.translate(DEV_DIGITS).lower().strip()


def _extract_time(text: str) -> Optional[str]:
    """Return 'HH:MM' if the message pins a time of day."""
    t = _normalise(text)

    # 6 am / 6pm / 06:00 / 12 pm
    m = re.search(r"\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)\b", t)
    if m:
        hour = int(m.group(1)) % 12
        minute = int(m.group(2) or 0)
        if m.group(3).startswith("p"):
            hour += 12
        return f"{hour:02d}:{minute:02d}"

    m = re.search(r"\b(\d{1,2}):(\d{2})\b", t)
    if m:
        return f"{int(m.group(1)):02d}:{int(m.group(2)):02d}"

    # "सकाळी ६ वाजता" / "दुपारी १२" — word sets the part of day, digit the hour
    for word, default_hour in TIME_WORDS.items():
        if word in t:
            m = re.search(rf"{re.escape(word)}\D{{0,12}}(\d{{1,2}})", t)
            if not m:
                m = re.search(rf"(\d{{1,2}})\D{{0,12}}{re.escape(word)}", t)
            if m:
                hour = int(m.group(1))
                if default_hour >= 12 and hour < 12:
                    hour += 12
                if hour <= 23:
                    return f"{hour:02d}:00"
            return f"{default_hour:02d}:00"

    # bare "at 6" / "६ वाजता"
    m = re.search(r"\b(?:at|वाजता|बजे)\s*(\d{1,2})\b|\b(\d{1,2})\s*(?:वाजता|बजे)\b", t)
    if m:
        hour = int(m.group(1) or m.group(2))
        if hour <= 23:
            return f"{hour:02d}:00"
    return None


# The forecast ORCA reads covers today and the next two days.
HORIZON_DAYS = 3

_NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7,
    "eight": 8, "nine": 9, "ten": 10,
    "दो": 2, "तीन": 3, "चार": 4, "पाँच": 5, "पांच": 5, "छह": 6, "सात": 7, "आठ": 8, "दस": 10,
    "दोन": 2, "पाच": 5, "सहा": 6,
}
_WEEKDAYS = {
    "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3, "friday": 4,
    "saturday": 5, "sunday": 6,
    "सोमवार": 0, "मंगलवार": 1, "मंगळवार": 1, "बुधवार": 2, "गुरुवार": 3, "शुक्रवार": 4,
    "शनिवार": 5, "रविवार": 6,
}
_NEXT_WEEK = ["next week", "अगले हफ्ते", "अगले हफ़्ते", "अगले सप्ताह", "पुढच्या आठवड्यात",
              "पुढील आठवड्यात"]


def _as_number(token: str) -> Optional[int]:
    if token.isdigit():
        return int(token)
    return _NUMBER_WORDS.get(token)


def days_ahead(text: str, base: datetime) -> Optional[int]:
    """How far ahead a question asks, when it says so beyond today/tomorrow.

    "in 5 days", "5 दिन बाद", "५ दिवसांनी", "next week", "on Friday". None
    when the question names no such day (today, tomorrow and the day after
    are handled by _extract_date).
    """
    t = _normalise(text)
    for pattern in (r"\bin\s+(\w+)\s+days?\b", r"(\S+)\s+दिन\s+(?:बाद|में)",
                    r"(\S+)\s+दिवसांनी", r"(\S+)\s+दिवसांत"):
        m = re.search(pattern, t)
        if m and _as_number(m.group(1)) is not None:
            return _as_number(m.group(1))
    if any(w in t for w in _NEXT_WEEK):
        return 7
    for name, wd in _WEEKDAYS.items():
        if re.search(r"(?<![\w\u0900-\u097F])" + name, t):
            ahead = (wd - base.weekday()) % 7
            return ahead or 7
    return None


# Words that follow "near" or "from" without naming a place.
_NOT_PLACES = {
    "the", "a", "an", "my", "our", "your", "me", "us", "here", "there", "home", "shore",
    "coast", "harbour", "harbor", "port", "sea", "land", "beach", "now", "today", "tomorrow",
    "morning", "evening", "night", "noon", "am", "pm", "ist", "orca", "it", "this", "that",
    "english", "hindi", "marathi", "gujarati", "konkani", "tamil", "telugu", "kannada",
    "malayalam", "bengali", "odia", "monday", "tuesday", "wednesday", "thursday", "friday",
    "saturday", "sunday", "days", "day", "week", "next",
    "किनाऱ्या", "किनाऱ्याच्या", "किनारे", "किनारा", "समुद्रा", "समुद्र", "बंदरा", "घरा", "घर",
    "बंदरगाह", "माझ्या", "मेरे", "हमारे",
}


def unknown_place(text: str) -> Optional[str]:
    """A place the question names that matches none of ORCA's landing centres.

    English: the word after near / from / off / around / outside (any case),
    or a Capitalised word after at / in. Marathi: the word before जवळ;
    Hindi: the word before के पास. Ordinary words ("near the coast", "at 6 AM",
    "in Marathi") are never taken for places.
    """
    candidates = []
    candidates += re.findall(r"\b(?:near|from|off|around|outside)\s+([A-Za-z][A-Za-z\-]{2,})", text)
    candidates += re.findall(r"\b(?:at|in)\s+([A-Z][A-Za-z\-]{2,})", text)
    candidates += re.findall(r"(?:^|\s)([\u0900-\u097F]+?)\s?जवळ", text)
    candidates += re.findall(r"(?:^|\s)([\u0900-\u097F]+)\s+के\s+पास", text)
    for word in candidates:
        if word.lower() in _NOT_PLACES or find_port(word):
            continue
        return word
    return None


def _extract_date(text: str, base: datetime) -> str:
    t = _normalise(text)
    if any(w in t for w in ["day after tomorrow", "परवा", "परसों"]):
        return (base + timedelta(days=2)).date().isoformat()
    if any(w in t for w in ["tomorrow", "उद्या", "कल"]):
        return (base + timedelta(days=1)).date().isoformat()
    if any(w in t for w in ["today", "आज", "अभी", "आत्ता"]):
        return base.date().isoformat()
    return base.date().isoformat()


# Most specific question wins: "safest route to the fishing zone" is a ROUTE
# question even though it also mentions fishing zones.
INTENT_PRIORITY = ["route", "find_pfz", "restricted", "alerts", "explain"]


def _classify(text: str) -> str:
    t = _normalise(text)
    for intent in INTENT_PRIORITY:
        if any(w in t for w in INTENT_KEYWORDS[intent]):
            return intent
    return "fishing_safety"


def _activity(text: str) -> str:
    t = _normalise(text)
    for activity, words in ACTIVITY_KEYWORDS.items():
        if any(w in t for w in words):
            return activity
    return "fishing"


# Every question gets the full safety core — a user who asks "is there a cyclone"
# still deserves a go/no-go verdict. Intent only adds the optional specialists.
SAFETY_CORE = ["weather", "ocean", "cyclone", "gis", "risk"]
EXTRA_BY_INTENT = {
    "fishing_safety": [],
    "find_pfz":       ["pfz"],
    "route":          ["pfz", "route"],
    "alerts":         [],
    "restricted":     [],
    "explain":        [],
}


def needs_for(intent_type: str) -> List[str]:
    return SAFETY_CORE + EXTRA_BY_INTENT.get(intent_type, [])


@timed
def run(message: str, *, language: Optional[Language] = None,
        latitude: Optional[float] = None, longitude: Optional[float] = None,
        location_name: Optional[str] = None,
        previous: Optional[Intent] = None) -> AgentResult:
    """Extract language, intent, place and time; inherit context on follow-ups."""
    now = now_ist()
    lang: Language = language or detect_language(message)
    intent_type = _classify(message)
    activity = _activity(message)

    # --- location ---------------------------------------------------------
    location: Optional[Location] = None
    port = find_port(message) or (find_port(location_name) if location_name else None)
    if latitude is not None and longitude is not None:
        near = nearest_port(latitude, longitude)
        location = Location(name=location_name or near["name"], latitude=latitude,
                            longitude=longitude, state=near["state"])
    elif port:
        location = Location(name=port["name"], latitude=port["lat"],
                            longitude=port["lon"], state=port["state"])
    elif previous and previous.location:
        location = previous.location            # follow-up inherits the place

    # --- time -------------------------------------------------------------
    time_str = _extract_time(message)
    date_str = _extract_date(message, now)
    if time_str is None and previous and previous.time and not _mentions_new_day(message):
        time_str = previous.time
        date_str = previous.date or date_str

    missing: List[str] = []
    if location is None:
        missing.append("location")
    # Know when not to decide: a named place ORCA has no harbour for, or a
    # day beyond the forecast it reads, is recorded, never quietly replaced.
    place_unknown = unknown_place(message) if location is None else None
    ahead = days_ahead(message, now)

    intent = Intent(
        intent=intent_type,
        activity=activity,
        location=location,
        location_text=(location.name if location else ""),
        date=date_str,
        time=time_str or f"{now.hour:02d}:00",
        language=lang,
        raw_query=message,
        needs=needs_for(intent_type),
        missing=missing,
        place_unknown=place_unknown,
        days_ahead=ahead,
    )

    return AgentResult(
        agent="intent",
        ok=True,
        location=location,
        data=intent.model_dump(),
        source="ORCA",
        timestamp=now.isoformat(timespec="seconds"),
        confidence=0.9 if location else 0.6,
        mode="DEMO",
    )


def _mentions_new_day(text: str) -> bool:
    t = _normalise(text)
    return any(w in t for w in ["tomorrow", "today", "उद्या", "आज", "कल", "परवा", "परसों"])
