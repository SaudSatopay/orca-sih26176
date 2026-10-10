"""Typed contracts shared by every ORCA agent.

Rule: agents never return prose. They return these structures, each carrying
provenance (value + unit + source + timestamp + confidence). The Explanation
agent is the only component allowed to turn them into sentences.
"""
from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

Language = Literal["en", "hi", "mr"]
DataMode = Literal["LIVE", "DEMO", "CACHE"]
RiskCategory = Literal["LOW", "MODERATE", "HIGH", "EXTREME"]
HealthStatus = Literal["FRESH", "STALE", "MISSING", "ERROR"]
GateState = Literal["GO", "CAUTION", "NO_GO", "INSUFFICIENT_DATA"]
Confidence = Literal["normal", "degraded", "insufficient"]


class Provenance(BaseModel):
    """Attached to every factual number ORCA shows a user."""

    source: str
    timestamp: str
    mode: DataMode = "DEMO"
    confidence: Optional[float] = None
    note: Optional[str] = None


class Measurement(BaseModel):
    """A single traceable value."""

    value: Optional[float] = None
    unit: str = ""
    label: str = ""
    provenance: Provenance

    @property
    def known(self) -> bool:
        return self.value is not None


class Location(BaseModel):
    name: str = ""
    latitude: float
    longitude: float
    state: Optional[str] = None


class Intent(BaseModel):
    intent: str = "fishing_safety"
    activity: str = "fishing"
    location: Optional[Location] = None
    location_text: str = ""
    date: Optional[str] = None
    time: Optional[str] = None
    language: Language = "en"
    raw_query: str = ""
    needs: List[str] = Field(default_factory=list)
    missing: List[str] = Field(default_factory=list)


class DataHealth(BaseModel):
    """Is one input of the safety decision fit to decide on? (data sufficiency)

    One record per input (wave, wind, warnings, position, rain, current), made
    where the agent reads its provider: who delivered it, when, how old it is
    against its configured limits, and whether a decision may rest on it.
    """

    input: str                                     # stable key, e.g. "wave"
    label: str                                     # in the reader's language
    source: str                                    # provider, in the reader's language
    feed: str                                      # marine | weather | warnings | chart
    available: bool
    observed_at: Optional[str] = None              # when the provider delivered it
    age_seconds: Optional[int] = None
    freshness_limit_seconds: Optional[int] = None  # None: static, bundled layer
    max_age_seconds: Optional[int] = None
    status: HealthStatus
    critical: bool
    usable: bool                                   # may a decision rest on it?
    detail: str = ""                               # why, in the reader's language
    note: Optional[str] = None                     # "reconnected" | "standin"
    mode: DataMode = "DEMO"


class SafetyDecision(BaseModel):
    """The safety gate's verdict on the evidence, made before the final answer.

    GO: every critical input is fresh, and the existing verdict stands at normal
    confidence. CAUTION: a critical input is stale but usable (degraded
    confidence). INSUFFICIENT_DATA: a critical input is missing or too old, so
    ORCA will not clear a trip (follow the official advisory). NO_GO: the
    existing safety logic already says do not go, whatever the data health.
    """

    state: GateState
    confidence: Confidence
    headline: str
    reasons: List[str] = Field(default_factory=list)
    blocking_inputs: List[str] = Field(default_factory=list)
    stale_inputs: List[str] = Field(default_factory=list)
    risk_go: Optional[bool] = None                 # what the risk engine said
    drill: str = "healthy"                         # the active data drill
    timestamp: str = ""


class AgentResult(BaseModel):
    """Uniform envelope returned by every specialist agent."""

    agent: str
    ok: bool = True
    location: Optional[Location] = None
    data: Dict[str, Any] = Field(default_factory=dict)
    measurements: Dict[str, Measurement] = Field(default_factory=dict)
    risk: Optional[float] = None          # 0..1 sub-risk for the risk engine
    unavailable: List[str] = Field(default_factory=list)
    source: str = "DEMO"
    timestamp: str = ""
    confidence: Optional[float] = None
    mode: DataMode = "DEMO"
    latency_ms: Optional[int] = None
    error: Optional[str] = None
    # The health of every input this agent delivered (data sufficiency).
    health: List[DataHealth] = Field(default_factory=list)


class RiskFactor(BaseModel):
    key: str
    label: str
    factor: float          # 0..1 normalised severity
    weight: float          # configured weight
    contribution: float    # points added to the 0-100 score
    detail: str = ""


class RiskAssessment(BaseModel):
    score: int
    category: RiskCategory
    factors: List[RiskFactor]
    overrides: List[str] = Field(default_factory=list)
    official_warning: bool = False
    go: bool = False
    headline: str = ""
    advice: str = ""
    window: Optional[str] = None          # e.g. "conditions improve after 11:00"
    sources: List[str] = Field(default_factory=list)
    generated_at: str = ""
    mode: DataMode = "DEMO"


class PFZZone(BaseModel):
    rank: int
    latitude: float
    longitude: float
    distance_km: float
    bearing: str = ""
    sst_c: Optional[float] = None
    chlorophyll_mg_m3: Optional[float] = None
    wave_height_m: Optional[float] = None
    confidence: float = 0.0
    rationale: str = ""
    source: str = "DEMO"
    timestamp: str = ""


class RouteLeg(BaseModel):
    latitude: float
    longitude: float


class RouteOption(BaseModel):
    name: str
    kind: Literal["safest", "shortest", "alternate"]
    legs: List[RouteLeg]
    distance_km: float
    eta_minutes: int
    risk_score: int
    risk_category: RiskCategory
    penalties: Dict[str, float] = Field(default_factory=dict)
    recommended: bool = False
    notes: str = ""


class GeofenceAlert(BaseModel):
    zone_name: str
    zone_type: str
    distance_km: float
    inside: bool
    severity: Literal["info", "warning", "critical"]
    message: str


class Evidence(BaseModel):
    """One row of the 'why did you say that' table."""

    label: str
    value: str
    source: str
    timestamp: str
    confidence: Optional[float] = None
    mode: DataMode = "DEMO"


class ChatRequest(BaseModel):
    message: str
    language: Optional[Language] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    session_id: str = "default"
    # Answer this one question under a data drill, leaving the server's alone.
    drill: Optional[Literal["healthy", "stale", "unavailable", "recovery"]] = None


class AgentTrace(BaseModel):
    """What ran, in what order, how long it took — drives the demo animation."""

    agent: str
    status: Literal["ok", "skipped", "failed", "degraded"]
    latency_ms: int
    summary: str = ""
    source: str = ""
    mode: DataMode = "DEMO"


class ChatResponse(BaseModel):
    session_id: str
    language: Language
    answer: str
    intent: Intent
    risk: Optional[RiskAssessment] = None
    pfz: List[PFZZone] = Field(default_factory=list)
    routes: List[RouteOption] = Field(default_factory=list)
    geofence: List[GeofenceAlert] = Field(default_factory=list)
    alerts: List[Dict[str, Any]] = Field(default_factory=list)
    evidence: List[Evidence] = Field(default_factory=list)
    trace: List[AgentTrace] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    mode: DataMode = "DEMO"
    disclaimer: str = ""
    elapsed_ms: int = 0
    # The safety gate: may ORCA give its normal-confidence answer, and why.
    decision: Optional[SafetyDecision] = None
    data_health: List[DataHealth] = Field(default_factory=list)
