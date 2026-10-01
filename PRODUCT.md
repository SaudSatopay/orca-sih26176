# ORCA — product

## One-liner

Ten agents read the sea and return one safe, explainable decision for a fisher, in Marathi, Hindi or English.

## Who it is for

1. **The fisher** on India's coast, on a phone, who may read little. Wants to know: can I go, where are the fish, when do I leave, when must I be back.
2. **The district authority** who needs every landing centre scored by the same evidence the fisher sees.
3. **The judge** (Smart India Hackathon 2026, problem SIH26176, ISRO) with two minutes and a laptop, who needs to see that this is a reasoning system and not a chatbot.

## The three jobs

1. **Answer "can I go fishing?"** with a 0–100 risk verdict where every point is attributed, official warnings override the model, and safety floors can only raise the score.
2. **Plan the trip**: ranked fishing grounds with chance of fish and likely species, best window, time on the ground, return-by time, and the safest course around restricted areas.
3. **Show the working**: the agent trace, the evidence ledger (source, timestamp, confidence, mode), the district board and the engine-room view, with simulated data always labelled.

## The signature moment

A question goes in and the chart answers. On the landing hero, a fisher's question is asked, the ten agents report in, the sea on the chart moves, the course plots itself around the hatched no-go area, and the verdict lands as a rubber stamp. It is the product's whole claim in about four seconds, and it runs on the same chart language the app uses everywhere.

## What ORCA is not

- Not a chatbot. The language model never decides safety.
- Not an official advisory. It is decision support and says so on every screen.
- Not a guarantee of fish. A potential fishing zone is a likelihood.

## Out of scope for this flight

- Changing the risk model, the fishing model, the weights or the safety floors.
- Real INCOIS, IMD or MOSDAC ingestion; SMS or IVR; model training.
- A dark theme (light chart paper is a deliberate choice for projectors).
- Replacing the stack: Vite, React 18, Tailwind 3, Leaflet, FastAPI stay.
- Accounts, auth, a database.

## Must never break

- The five rehearsed scenarios (`/?demo=safe|danger|cyclone|pfz|route`) and their numbers: Goa 9 LOW, Mumbai 06:00 70 HIGH, Paradip 92 EXTREME.
- Demo mode running with no network and no API key.
- `RUN-ORCA.bat` one-click launch from the committed `frontend/dist`.
- Trilingual parity (en, hi, mr) on every string.
- The rule that safety data is never hidden behind an animation that might not run.
- The line "decision support, not an official advisory".
