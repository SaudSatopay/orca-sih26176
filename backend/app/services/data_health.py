"""Data health + freshness check: is each input fit to decide on?

Sits between the providers and the agents' outputs. For every input of the
go/no-go decision it records who delivered it, when, how old it is against the
limits in `config.DATA_HEALTH`, and whether a decision may rest on it:

    provider did not answer            -> MISSING  (ERROR if it returned an error)
    static bundled layer               -> FRESH
    no timestamp                       -> STALE, unusable (its age cannot be shown)
    timestamp > 10 min in the future   -> ERROR    (a reading from the future is a fault)
    age <= freshness limit             -> FRESH
    age <= maximum age                 -> STALE, still usable (with caution)
    older than that                    -> STALE, unusable (too old: counts as missing)
    LIVE reading replaced by demo data -> MISSING  (a stand-in never clears a trip)

The check never alters a reading. It only says how far it may be trusted;
`safety_gate.decide()` turns that into the decision state.
"""
from __future__ import annotations

from datetime import datetime
from typing import Iterable, List, Optional

from ..config import DATA_HEALTH, InputPolicy
from ..data.feeds import FeedStatus
from ..schemas import DataHealth, Language
from . import i18n

# How far in the future a timestamp may sit before it is a fault, not clock skew.
FUTURE_SKEW_S = 600


def age_text(seconds: int, lang: Language) -> str:
    """'4 h 10 min' / '4 घं 10 मि' / '4 तास 10 मिनिटे' — the digits never change."""
    minutes = int(seconds) // 60
    if minutes == 1:
        return f"1 {i18n.t('minute_one', lang)}"  # Marathi says "1 मिनिट", not "1 मिनिटे"
    return i18n.humanise_duration(minutes, lang)


def _feed_name(feed: str, lang: Language) -> str:
    return i18n.t(f"dhf_{feed}", lang)


def check(input_key: str, feed: FeedStatus, now: datetime, *, lang: Language = "en",
          mode: str = "DEMO", policy: Optional[InputPolicy] = None) -> DataHealth:
    """The health of one input, as delivered by `feed`, judged at `now`."""
    policy = policy or DATA_HEALTH.inputs[input_key]
    limit = policy.fresh_s
    max_age = policy.max_age_s
    base = dict(input=input_key, label=i18n.t(f"dhi_{input_key}", lang),
                source=i18n.source_label(feed.source, lang), feed=policy.feed,
                freshness_limit_seconds=limit, max_age_seconds=max_age,
                critical=policy.critical, note=feed.note,
                mode="LIVE" if mode == "LIVE" and feed.source == "OPEN_METEO" else "DEMO")

    def record(status: str, usable: bool, detail: str, *, available: bool = True,
               age: Optional[int] = None) -> DataHealth:
        observed = feed.observed_at.isoformat(timespec="seconds") if (
            available and feed.observed_at) else None
        return DataHealth(**base, available=available, observed_at=observed,
                          age_seconds=age, status=status, usable=usable,  # type: ignore[arg-type]
                          detail=detail)

    if not feed.available:
        if feed.error == "not_connected":
            return record("MISSING", False, i18n.t("dh_not_connected", lang), available=False)
        if feed.error == "provider_error":
            return record("ERROR", False, i18n.t("dh_error", lang, feed=_feed_name(policy.feed, lang)),
                          available=False)
        return record("MISSING", False,
                      i18n.t("dh_missing", lang, feed=_feed_name(policy.feed, lang)),
                      available=False)

    if feed.note == "standin":
        return record("MISSING", False, i18n.t("dh_standin", lang), available=False)


    if limit is None:
        return record("FRESH", True, i18n.t("dh_static", lang))

    if feed.observed_at is None:
        return record("STALE", False, i18n.t("dh_no_time", lang))

    age = int((now - feed.observed_at).total_seconds())
    if age < -FUTURE_SKEW_S:
        return record("ERROR", False, i18n.t("dh_future", lang), age=age)
    age = max(0, age)
    words = dict(age=age_text(age, lang), limit=age_text(limit, lang))
    if age <= limit:
        detail = i18n.t("dh_fresh", lang, **words)
        if feed.note == "reconnected":
            detail = f"{detail} · " + i18n.t("dh_reconnected", lang,
                                              feed=_feed_name(policy.feed, lang),
                                              age=age_text(age, lang))
        return record("FRESH", True, detail, age=age)
    if max_age is None or age <= max_age:
        return record("STALE", True, i18n.t("dh_stale", lang, **words), age=age)
    return record("STALE", False,
                  i18n.t("dh_expired", lang, age=age_text(age, lang), limit=age_text(max_age, lang)),
                  age=age)


def missing(input_key: str, *, lang: Language = "en") -> DataHealth:
    """An input nobody reported (its agent failed or never ran): no reading."""
    policy = DATA_HEALTH.inputs[input_key]
    return DataHealth(input=input_key, label=i18n.t(f"dhi_{input_key}", lang),
                      source="—", feed=policy.feed, available=False,
                      freshness_limit_seconds=policy.fresh_s,
                      max_age_seconds=policy.max_age_s, status="MISSING",
                      critical=policy.critical, usable=False,
                      detail=i18n.t("dh_no_reading", lang))


def complete(health: Iterable[DataHealth], *, lang: Language = "en") -> List[DataHealth]:
    """One record per configured input, in config order; the absent ones are MISSING.

    An input with no record is never assumed healthy: an agent that crashed
    reported nothing, and nothing is not the same as fine.
    """
    by_input = {}
    for h in health:
        by_input.setdefault(h.input, h)
    return [by_input.get(key) or missing(key, lang=lang) for key in DATA_HEALTH.inputs]
