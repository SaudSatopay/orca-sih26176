# ORCA — Marine EcOsystem Reasoning with Collaborative Agents

**Smart India Hackathon 2026 · Problem Statement SIH26176 · Team Random (U3M71E5U)**

A crew of cooperating AI agents that turns India's marine data into **one safe,
explainable decision** for a fisher — in English, Hindi or Marathi, by text or voice.

> ORCA is decision support. It does not replace official IMD / INCOIS advisories
> or Coast Guard instructions.

---

## Run it

```powershell
.\start-orca.ps1
```

Then open <http://127.0.0.1:8000>. That's the whole demo — one process, one port,
no database, no API key, no internet required.

| Command | What it does |
|---|---|
| `.\start-orca.ps1` | Demo mode (cached data). **Use this on stage.** |
| `.\start-orca.ps1 -Live` | Live public providers, auto-falls back to cache |
| `.\dev.ps1` | Hot-reload backend + Vite HMR frontend |
| `cd backend; python smoke_test.py` | Runs all five demo scenarios headless |

### What's in the app

**Fisher view**
- Ask in English / Hindi / Marathi, by **typing or speaking** (Web Speech API — no key)
- Spoken answers back in the same language, toggleable
- **Live conditions strip** — wave, wind, sea state, rain, visibility, sea temperature
- **Dark marine map** with restricted zones, ranked fishing zones and both route options
- **Draggable vessel** — drag the boat anywhere and ORCA geofences that position live
- **Risk card** — animated score, ranked factor contributions, safety overrides, evidence table
- **"When is it safe to go?"** — 24-hour risk curve with the best departure window highlighted
- **Fishing-zone list** — ranked, with SST, chlorophyll and confidence
- **Agent crew panel** — grouped by execution phase, showing the parallel fan-out and real latencies
- **LIVE ⇄ DEMO toggle** — flip the data mode mid-demo without a restart

**Authority view** — every monitored landing centre ranked by risk, auto-refreshing.

### One-click demo links

| Link | Scenario |
|---|---|
| `/?demo=safe` | Goa — calm seas, **LOW** |
| `/?demo=danger` | Mumbai — Marathi, **HIGH**, IMD warning, clears after 11:00 |
| `/?demo=cyclone` | Paradip — **EXTREME**, official warning overrides the model |
| `/?demo=pfz` | Kochi — Hindi, ranked fishing zones |
| `/?demo=route` | Mumbai — safest route + geofence alert |

---

## Architecture

```
                     ┌──────────────┐
   user (text/voice) │ Intent agent │  language · place · time · activity
        │            └──────┬───────┘
        ▼                   ▼
   ┌─────────────────────────────────────┐
   │  Planner / Orchestrator             │  decides who runs, runs them in parallel
   └──┬────────┬────────┬────────┬───────┘
      ▼        ▼        ▼        ▼        ▼
   Weather   Ocean    PFZ     Alerts    GIS          ← run concurrently
      │        │        │        │        │
      └────────┴────────┴────────┴────────┘
                        ▼
                  ┌───────────┐
                  │Risk engine│  rules + weighted model + deterministic overrides
                  └─────┬─────┘
                        ▼
                  Route optimiser (A*)
                        ▼
                 Explanation agent  → answer + evidence, in the user's language
```

Ten agents: `intent · planner · weather · ocean · pfz · cyclone · gis · risk ·
route · explanation`.

### Why this is not a chatbot

1. **The LLM never decides safety.** Intent parsing is deterministic and
   rule-based; the risk score comes from a documented weighted model; and
   **deterministic safety floors can only raise a score, never lower it**. An
   active IMD severe warning forces EXTREME regardless of what any model says.
2. **Every number is traceable.** Each value carries `source · timestamp ·
   confidence · mode`, surfaced in the UI's evidence table.
3. **Synthetic data is always labelled.** Demo values are stamped
   *"Demo / simulated data — not a live government feed"*. Nothing synthetic is
   ever presented as an official feed.
4. **It refuses to send you somewhere illegal.** Candidate fishing zones that
   fall inside a marine protected area, defence zone or port limit are filtered
   out before ranking.

---

## The risk engine

```
score = 100 × Σ weightᵢ × factorᵢ        then deterministic floors are applied
```

| Factor | Weight | Rationale |
|---|---|---|
| Wave height | 25% | dominant capsize driver for small craft |
| Official warnings | 25% | an advisory is evidence, not noise |
| Wind | 20% | |
| Rain / visibility | 10% | |
| Sea state & current | 10% | |
| Position & zones | 10% | distance offshore, restricted-zone proximity |

Bands: **LOW** ≤25 · **MODERATE** ≤50 · **HIGH** ≤79 · **EXTREME** 80+.
EXTREME is reserved for life-threatening conditions or an active severe warning,
so "EXTREME" always means *do not launch, no judgement call*.

Deterministic floors (can only raise the score):

| Trigger | Floor |
|---|---|
| Official **severe** warning (cyclone/tsunami) | 92 |
| IMD fishermen warning active | 70 |
| Wave ≥ 4.0 m | 85 |
| Wind ≥ 62 km/h (gale) | 85 |
| Position inside a restricted zone | 60 |

All of it is live at `GET /api/config` — we show that endpoint to judges rather
than claiming the weights are science.

---

## Data

| Source | Use | Status |
|---|---|---|
| Open-Meteo Marine | wave height/period, SST | **verified live**, keyless |
| Open-Meteo Forecast | wind, rain probability, visibility | **verified live**, keyless |
| INCOIS | PFZ advisories, ocean state forecast | no open public JSON API — provider interface ready |
| IMD | marine warnings, cyclone bulletins | no open public JSON API — provider interface ready |
| ISRO MOSDAC | satellite SST / ocean colour | registration-gated |
| OpenStreetMap | coastline, harbours | used for the geospatial layer |

**Honest position:** INCOIS/IMD/MOSDAC publish through portals and bulletins, not
a documented open API a student team can key into. ORCA is built behind a
provider interface — Open-Meteo is the live provider today; the agencies slot in
via a data-sharing arrangement or bulletin parser without touching agent code.
We never label Open-Meteo output as INCOIS or IMD data.

The demo geofence polygons are **illustrative**, not official maritime boundaries.

---

## API

| Endpoint | Purpose |
|---|---|
| `POST /api/chat` | the full agent pipeline for one question |
| `GET /api/forecast?lat&lon&when` | raw weather + ocean |
| `GET /api/risk?lat&lon&when` | risk assessment with inputs |
| `GET /api/risk/timeline?lat&lon&hours` | hour-by-hour risk curve |
| `GET /api/position?lat&lon` | fast geofence check (drives the draggable boat) |
| `POST /api/config/mode` | switch LIVE ⇄ DEMO at runtime |
| `GET /api/map/zones` \| `/pfz` \| `/ports` | GeoJSON layers |
| `GET /api/alerts?lat&lon` | marine + geofence alerts |
| `POST /api/routes` | safest vs direct route |
| `GET /api/authority/dashboard` | coastal risk board |
| `GET /api/config` | weights, thresholds, overrides |
| `GET /api/scenarios` | the five rehearsed demos |

Interactive docs: <http://127.0.0.1:8000/docs>

---

## Stack

**Backend** Python 3.10 · FastAPI · pydantic v2 · httpx — four dependencies, so
it installs in seconds on any laptop. Geometry (haversine, ray-casting
point-in-polygon, A*) is pure Python: no shapely/GEOS install to fail on stage.
PostGIS and XGBoost are the documented production path, not demo requirements.

**Frontend** React 18 · TypeScript · Tailwind · Leaflet · Vite. Voice in/out uses
the browser's own Web Speech API — no key, no server round-trip.

```
orca/
├─ backend/app/
│  ├─ agents/       intent, planner, weather, ocean, pfz, cyclone, gis,
│  │                risk, route, explanation
│  ├─ services/     risk_engine, route_optimizer, i18n
│  ├─ data/         geo (pure-python GIS), demo_store, live_client
│  ├─ api/          chat, forecast, map, alerts, routes
│  └─ config.py     weights, thresholds, overrides, data mode
└─ frontend/src/
   ├─ components/   ChatPanel, MarineMap, RiskCard, RiskDial,
   │                AgentTrace, AuthorityPanel
   └─ App.tsx
```

---

## Known limits (we say these out loud)

- Risk weights are an engineering baseline, not a certified maritime standard.
- PFZ logic reproduces the *reasoning* of INCOIS advisories; it is not the
  official advisory, and a potential zone is never a guarantee of fish.
- Demo geofences are illustrative polygons.
- Live mode currently uses open providers; agency feeds need a data-sharing
  arrangement.
- The ML layer is a documented weighted model. XGBoost training on historical
  incident data is the next step, not a claim we make today.
