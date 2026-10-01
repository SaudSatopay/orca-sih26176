# ORCA

Multi-agent marine decision support for SIH26176. FastAPI backend in `backend/`, Vite + React + TypeScript + Tailwind frontend in `frontend/`. See README.md for the product and HANDOFF.md for history and machine notes.

## Missile

This project is under the missile's guidance loop. MISSILE.md holds the target, the plan and the scoreboard; DESIGN.md is the single source of truth for every visual decision; PRODUCT.md says what the product is and what must never break.

- Stack: Vite 5, React 18, TypeScript 5 (strict), Tailwind 3, Leaflet; Python 3.10, FastAPI, pydantic 2, httpx. Package manager is npm, run from `frontend/`.
- Commands today: `npm run dev` (5173, proxies `/api` to 8000), `npm run build`, `npx tsc --noEmit -p .` for typecheck; `python -m uvicorn app.main:app --port 8000` and `python -X utf8 smoke_test.py` from `backend/`. Lint and test scripts do not exist yet; add missing scripts to `frontend/package.json` rather than running one-offs.
- `frontend/dist` is committed on purpose so `RUN-ORCA.bat` works without npm. Any change to `frontend/src` needs `npm run build` and the rebuilt `dist` in the same commit.
- Design: tokens only, no literal colours in components. Fraunces for display, Archivo for body, Spline Sans Mono for readouts. One signature moment, protected in every iteration. Entrances never start from opacity 0 on safety data.
- Every user-facing string exists in English, Hindi and Marathi.
- Definition of done for any change: typecheck, lint, test and build green; backend smoke test passes; screenshot verified at 390 and 1440; no console errors; committed with a descriptive message on the missile branch.
- Commits are authored by Saud Satopay only. Do not add a `Co-Authored-By` trailer or any AI attribution line.
- Never: rewrite git history, push to shared branches, migrate the framework, delete directories, or touch the risk weights, safety floors or secrets without tests and a note under Decisions in MISSILE.md.
