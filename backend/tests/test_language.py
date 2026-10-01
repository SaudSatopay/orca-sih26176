"""Language detection: script plus marker words, no network and no LLM."""
from __future__ import annotations

import pytest

from app.services.i18n import SUGGESTIONS, T, detect_language, t


@pytest.mark.parametrize("text,expected", [
    ("Is it safe to go fishing tomorrow morning near Goa?", "en"),
    ("Give me the safest route to the nearest fishing zone", "en"),
    ("", "en"),
    ("कोच्चि के पास मछली पकड़ने का क्षेत्र कहाँ है?", "hi"),
    ("क्या मैं कल सुबह समुद्र में जा सकता हूँ?", "hi"),
    ("मुझे सबसे सुरक्षित रास्ता बताओ", "hi"),
    ("मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?", "mr"),
    ("दुपारी १२ वाजता काय?", "mr"),
    ("जवळपास चक्रीवादळ आहे का?", "mr"),
])
def test_detect_language(text, expected):
    assert detect_language(text) == expected


def test_devanagari_without_a_decisive_marker_defaults_to_marathi():
    assert detect_language("मुंबई") == "mr"


def test_the_answer_language_follows_the_question(ask):
    assert ask("Is it safe near Goa tomorrow morning?").language == "en"
    assert ask("कोच्चि के पास मछली पकड़ने का क्षेत्र कहाँ है?").language == "hi"
    assert ask("मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?").language == "mr"


def test_an_explicit_language_overrides_detection(ask):
    r = ask("Is it safe near Goa tomorrow morning?", language="mr")
    assert r.language == "mr"
    assert t("verdict_low", "mr") in r.answer


def test_every_phrase_exists_in_all_three_languages():
    for key, entry in T.items():
        assert set(entry) == {"en", "hi", "mr"}, key
        assert all(entry[lang].strip() for lang in entry), key
    assert set(SUGGESTIONS) == {"en", "hi", "mr"}
    assert len({len(v) for v in SUGGESTIONS.values()}) == 1
