"""The safety gate: may ORCA give its normal-confidence answer?

It sits after the risk engine and its floors and before the explanation, so
nothing reaches the fisher without passing it:

    providers -> data health -> agents -> risk engine + floors -> SAFETY GATE -> answer

Five rules, in this order (the order is the safety argument):

    no risk result                          -> INSUFFICIENT_DATA
    the existing logic says do not go       -> NO_GO              (never weakened)
    a critical input missing or too old     -> INSUFFICIENT_DATA  (follow the official advisory)
    a critical input stale but still usable -> CAUTION            (degraded confidence)
    otherwise                               -> GO                 (normal confidence)

The gate reads the risk assessment and never writes to it: the score, the band
and every floor stay exactly as the risk engine left them. Missing or old data
can therefore only move the answer toward caution, never toward "go".
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Sequence

from ..config import DATA_HEALTH
from ..schemas import DataHealth, Evidence, Language, RiskAssessment, SafetyDecision
from . import i18n
from .data_health import age_text


def decide(risk: Optional[RiskAssessment], health: Sequence[DataHealth], now: datetime, *,
           lang: Language = "en", drill: str = "healthy") -> SafetyDecision:
    """The gate's verdict on the evidence behind `risk`."""
    say = lambda key, **kw: i18n.t(key, lang, **kw)  # noqa: E731
    by_input = {h.input: h for h in health}
    critical = [by_input[k] for k in DATA_HEALTH.critical_inputs() if k in by_input]

    # Every critical input the config names must be accounted for: an input
    # nobody reported is missing, never assumed fine.
    blocking = [k for k in DATA_HEALTH.critical_inputs()
                if k not in by_input or not by_input[k].usable]
    stale = [h.input for h in critical if h.usable and h.status == "STALE"]

    if risk is None:
        state = "INSUFFICIENT_DATA"
    elif not risk.go:
        state = "NO_GO"
    elif blocking:
        state = "INSUFFICIENT_DATA"
    elif stale:
        state = "CAUTION"
    else:
        state = "GO"
    confidence = ("insufficient" if blocking or state == "INSUFFICIENT_DATA"
                  else "degraded" if stale else "normal")

    reasons: List[str] = []
    if risk is None:
        reasons.append(say("gate_no_risk"))
    for key in blocking:
        h = by_input.get(key)
        reasons.append(say("gate_reason_blocking",
                           input=h.label if h else say(f"dhi_{key}"),
                           detail=h.detail if h else say("dh_no_reading")))
    for key in stale:
        h = by_input[key]
        reasons.append(say("gate_reason_stale", input=h.label,
                           age=age_text(h.age_seconds or 0, lang),
                           limit=age_text(h.freshness_limit_seconds or 0, lang)))
    reconnected = []
    for h in health:
        if h.note == "reconnected" and h.usable and h.feed not in reconnected:
            reconnected.append(h.feed)
            reasons.append(say("gate_reconnected", feed=say(f"dhf_{h.feed}"),
                               age=age_text(h.age_seconds or 0, lang)))
    if not blocking and not stale and risk is not None:
        reasons.append(say("gate_all_fresh", n=len(critical)))
    if state == "NO_GO" and blocking:
        reasons.append(say("gate_nogo_missing"))
    elif state == "NO_GO" and stale:
        reasons.append(say("gate_nogo_stale"))
    elif state == "INSUFFICIENT_DATA" and blocking:
        reasons.append(say("gate_block"))
    elif state == "CAUTION":
        reasons.append(say("gate_caution_act"))

    return SafetyDecision(
        state=state,  # type: ignore[arg-type]
        confidence=confidence,  # type: ignore[arg-type]
        headline=say(f"gate_headline_{state}"),
        reasons=reasons,
        blocking_inputs=blocking,
        stale_inputs=stale,
        risk_go=None if risk is None else risk.go,
        drill=drill,
        timestamp=now.isoformat(timespec="seconds"),
    )


def evidence_rows(decision: SafetyDecision, health: Sequence[DataHealth],
                  lang: Language = "en", mode: str = "DEMO") -> List[Evidence]:
    """The gate in the evidence ledger: its verdict, then each critical input's age.

    Labels are stable English keys (as every ledger row is); values speak the
    reader's language.
    """
    say = lambda key, **kw: i18n.t(key, lang, **kw)  # noqa: E731
    rows = [Evidence(label="Safety gate",
                     value=f"{say('gate_state_' + decision.state)} · "
                           f"{say('gate_conf_' + decision.confidence)}",
                     source="ORCA", timestamp=decision.timestamp,
                     mode=mode if mode in ("LIVE", "DEMO", "CACHE") else "DEMO")]  # type: ignore[arg-type]
    for h in health:
        if not h.critical:
            continue
        rows.append(Evidence(label=f"Freshness · {DATA_HEALTH.inputs[h.input].label}",
                             value=f"{say('dhs_' + h.status)} · {h.detail}",
                             source=h.source, timestamp=h.observed_at or "", mode=h.mode))
    return rows
