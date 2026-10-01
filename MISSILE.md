# Missile log: orca

status: stage=3 iteration=0 verdict=CONTINUE updated=2026-10-01T10:00:00Z
mode: full flight (resumed from recon)
branch: missile/20261001
url: none
max_iterations: 6

## Target

- One-liner: Ten agents read the sea and return one safe, explainable decision for a fisher, in Marathi, Hindi or English.
- Audience: the fisher on a phone; the district authority; the SIH 2026 judge with two minutes and a laptop.
- Signature moment: "The chart answers" on the landing hero. A question is asked, ten agents report in, the course plots itself around the hatched no-go area, the verdict stamps, and the sea under the chart keeps moving. Static poster first; spec in DESIGN.md.
- Direction: see DESIGN.md. The living nautical chart is kept as it is: chart paper, marine ink, Fraunces / Archivo / Spline Sans Mono, hatching, stamps, soundings. Additions only: one token source, a contrast fix at the token, a motion budget.
- Scope: the plan below.
- User's direction (second firing, 1 Oct 2026): "elevate the frontend to the max and make everything beautiful. use your skills to effect". Read as: push first_impression, motion, layout, design_system and ux_completeness hardest; the visual craft of every screen is the priority; use the installed design skills (impeccable, animate, emil-design-eng, frontend-design, web-design-guidelines, mobile-native) inside the stages.
- Protected: the chart-paper visual language and palette; the three typefaces and their roles; the phone app's three-tab, voice-first structure; the five demo scenarios and their numbers; risk weights and safety floors; demo mode working offline; `RUN-ORCA.bat` and the committed `frontend/dist`; trilingual parity; the transform-only entrance rule; the "decision support, not an official advisory" wording; the README's content and honesty sections.
- Out of scope: model changes, real agency feeds, SMS/IVR, a dark theme, any framework or build-tool change, auth, a database.
- Definition of done: every rubric dimension at 9 or above, mean 9.5 or above, live URL, README, tagged release

## Recon

Verdict: **existing, working, undeployed.** A coherent trilingual single-page app with a FastAPI backend and a strong README. No lint, tests, CI, deploy config or OG image.

### Stack
- Frontend (`frontend/`): Vite 5.4, React 18.3, TypeScript 5.5 strict, Tailwind 3.4 (JS config), Leaflet 1.9. Fonts self-hosted via `@fontsource-variable` (Archivo, Fraunces, Noto Serif Devanagari, Spline Sans Mono). No router, state library or UI kit. npm.
- Backend (`backend/`): Python 3.10, FastAPI, uvicorn, pydantic 2, httpx. Optional LLM path reads `ANTHROPIC_API_KEY` from the environment (`backend/app/config.py:45`); demo mode needs no key and no network.
- Size: frontend about 7,800 lines in 31 files; backend about 3,700 lines.

### Commands
| | Command | State |
|---|---|---|
| dev | `npm run dev` in `frontend/` (5173, proxies `/api` to 8000) | works |
| build | `npm run build` in `frontend/` | passes, 484 KB JS (145 KB gzip), 71 KB CSS |
| typecheck | `npx tsc --noEmit -p .` | passes; no npm script |
| lint | none | missing |
| test | none, 0 test files | missing |
| e2e | none | missing |
| backend | `python -m uvicorn app.main:app --port 8000` in `backend/`; also serves `frontend/dist` at `/` | works |
| smoke | `python -X utf8 smoke_test.py` in `backend/` | passes ("ALL DEMO CHECKS PASSED") |

`.claude/launch.json` now starts both servers (`api`, `web`) for the browser sensor.

### Screens
No router; state plus query parameters. Phone versus desktop is chosen once at load (`main.tsx`: `max-width: 640px` or `?m=1`).
- Landing (default desktop view), Today (`?tab=home`, `?at=lat,lon`), Ask (`?tab=ask`, `?demo=safe|danger|cyclone|pfz|route`), Authority (`?tab=authority`), System (`?tab=system`), guided tour (`?tour=1`).
- Phone app: Today, Map, Ask as bottom tabs.

### Design system
Real, coherent and distinctive; extracted into DESIGN.md. Debts: tokens split across `tailwind.config.js`, 8 custom properties in `index.css`, and about 110 literal hex values in components (9 of them off-palette); no type scale; `ink-300` text at about 2.9:1 on paper; many always-on ambient loops and a fixed full-screen grain layer; `<html lang>` fixed at `en`.

### Measured at baseline (1 Oct 2026)
- Lighthouse, production bundle on :8000:

| View | Perf | A11y | Best practices | SEO | LCP |
|---|---|---|---|---|---|
| Phone app, mobile emulation | 68 | 100 | 96 | 91 | 5.3 s |
| Landing, desktop | 98 | 87 | 96 | 91 | 1.0 s |
| Today, desktop | 96 | 95 | 100 | 92 | 1.4 s |
| Ask (`?demo=danger`), desktop | 95 | 90 | 77 | 92 | 1.5 s |

- The mobile 5 s paint is transfer size: the backend serves the 484 KB bundle uncompressed (no `Content-Encoding`), and Lighthouse reports 281 KB of unused JavaScript on the phone route because the desktop console, landing and Leaflet ship in one chunk.
- Accessibility findings: 17 low-contrast elements on Ask, 1 on the landing; one unnamed button on Today and Ask; no `main` landmark; one heading-order skip.
- Overflow: none at 1440 or in the phone app at 390. The desktop console forced to 390 (`?m=0`) overflows (423 and 459 px wide); a real phone never gets that layout.
- Console: 0 errors, 0 warnings.
- Keyboard: all 13 landing controls reachable in order with a visible dashed focus ring. The in-app flow has not been walked yet.
- Seen in screenshots: on `?demo=danger`, `cyclone` and `route` the conversation shows the ORCA answer twice in the dev build. On the production bundle (:8000) the answer appears once, so this is an effect that is not safe under React StrictMode's double run; it still needs fixing. In Ask at 1440 by 900 the risk dial and verdict are cut at the fold. The answer text says "confidence 0%" for a ground the chart rates at 77%. The Marathi answer carries untranslated English ("ORCA demo dataset — SIMULATED, not official data"). On the phone, "BE BACK BY 00:07" reads as an error next to a 2 PM–7 PM window, and the Today card list runs under the fixed tab bar.
- Baseline critic verdict: CONTINUE, mean 5.8, lowest performance 4 and shipped 4. Full scorecard in `.missile/scorecards/it0.json`. This is a repair-then-elevate flight, not an elevation flight (mean under 7); the design language is protected anyway because `design_system` scored 7 and the user's README names it as deliberate.
- Sensor gaps the critic named for the next pass: screenshots between 641 and 1439 px, a motion recording or throttled trace, loading and error states, an in-app keyboard walk, a cold run of the guided tour and the LISTEN button.

### Story and deploy
- README is 24 KB and strong: banner, pitch, screenshots, quickstart, deep links, architecture diagram, honest limits.
- `index.html` has title, description, theme-colour, manifest and SVG icon. No `og:` or `twitter:` tags, no OG image, no apple-touch icon. The manifest exists but there is no service worker.
- No hosting config of any kind. Vercel CLI is logged in; no project linked. Remote: github.com/SaudSatopay/orca-sih26176 (public).

### Risks
- `frontend/dist` is committed; every source change needs a rebuild in the same commit or the one-click launcher serves stale code.
- No ErrorBoundary; `MobileApp.tsx:185` and `:214` swallow API errors silently; a leftover width probe at `MobileApp.tsx:159-170`.
- The chat keeps per-session context in process memory, which matters for a serverless deploy.
- The map's OpenStreetMap tiles are the one network dependency in demo mode.

## Scoreboard

<!-- scoreboard:start -->
| dimension | baseline | target |
|---|---|---|
| first_impression | 7 | 9+ |
| design_system | 7 | 9+ |
| layout | 6 | 9+ |
| motion | 6 | 9+ |
| ux_completeness | 6 | 9+ |
| accessibility | 6 | 9+ |
| performance | 4 | 9+ |
| code_health | 5 | 9+ |
| story | 7 | 9+ |
| shipped | 4 | 9+ |
| **mean** | 5.8 | 9.5+ |
<!-- scoreboard:end -->

## Plan

Order: foundations, then ship a preview early, then tokens and accessibility, then the signature moment, then states and story. Every item ends with the four commands green, the smoke test passing, `frontend/dist` rebuilt, and a commit.

### Foundations (code_health)
- [ ] F1. Add `typecheck`, `lint`, `test` scripts to `frontend/package.json`; ESLint flat config with the TypeScript and React hooks rules. Test: `npm run typecheck && npm run lint` exit 0. Effort S. Files: `frontend/package.json`, `frontend/eslint.config.js`.
- [ ] F2. Vitest with three tests on the demo path: phone/desktop selection, the risk dial band for 9 / 70 / 92, and language switching keeping all three dictionaries in step (a key-parity test over every string table). Test: `npm test` passes. Effort M. Files: `frontend/src/**/*.test.ts(x)`, `frontend/vite.config.ts`.
- [ ] F3. Turn `backend/smoke_test.py` assertions into pytest cases for the five scenarios and the safety floors (floors only raise; severe warning forces 92). Test: `python -m pytest backend` passes. Effort M. Files: `backend/tests/`.
- [ ] F4. ErrorBoundary around the map and each view; replace the silent `.catch(() => {})` calls with a visible, trilingual "could not reach ORCA, showing the last reading" state; remove the width probe. Test: with the backend stopped, every view shows the message and no console error. Effort M. Files: `App.tsx`, `MobileApp.tsx`, new `ErrorBoundary.tsx`.
- [ ] F5. `.env.example` documenting `ORCA_DATA_MODE` and `ANTHROPIC_API_KEY`; GitHub Actions workflow running the four commands and pytest. Test: workflow file lints; commands pass locally. Effort S.

### Ship early (shipped, performance)
- [ ] S1. Gzip on the backend (`GZipMiddleware`) and long-lived cache headers on hashed assets. Test: `curl -H "Accept-Encoding: gzip"` shows `content-encoding: gzip`; mobile Lighthouse FCP under 2.5 s. Effort S. Files: `backend/app/main.py`.
- [ ] S2. Split the bundle: lazy-load the desktop console, the landing and Leaflet separately from the phone app. Test: phone route ships under 120 KB gzip of JavaScript; mobile Lighthouse performance 90 or above. Effort M. Files: `main.tsx`, `App.tsx`, `vite.config.ts`.
- [ ] S3. Vercel preview: static `frontend/dist` plus the FastAPI app as a Python function under `/api`, demo mode. Test: the preview URL opens in a private window on a phone and at 1440, and all five `?demo=` links return their rehearsed numbers. Effort M. Files: `vercel.json`, `api/index.py`, `requirements.txt`.

### Design system (design_system, accessibility)
- [ ] D1. One token source: custom properties in `index.css`, read by `tailwind.config.js`, exported to canvas and Leaflet code through `tokens.ts`. Sweep the literal hex values in components onto tokens; name the off-palette ones. Test: a grep for `#[0-9a-f]{6}` in `frontend/src/components` returns only `tokens.ts`; screenshots unchanged. Effort M.
- [ ] D2. Contrast at the token: text uses of `ink-300` move to `ink-400` or darker. Test: Lighthouse reports zero contrast failures on landing, Today and Ask. Effort S.
- [ ] D3. A named type scale replacing literal pixel sizes. Test: no `text-[` arbitrary sizes left in components. Effort M.

### Accessibility
- [ ] A1. `main`, `nav` and `header` landmarks; heading order; a name on every icon button; `<html lang>` follows the chosen language. Test: Lighthouse accessibility 95 or above on all four views; `document.documentElement.lang` is `mr` after switching. Effort S.
- [ ] A2. A text equivalent for the chart: a visually hidden, ordered list of grounds, restricted areas and the course, kept in step with the map. Test: screen-reader tree for Today names every buoy. Effort M.
- [ ] A3. Keyboard walk of the full flow on desktop and phone (ask a question, open a ground, switch tab, close the tour with Escape), fixing whatever traps or hides focus. Test: the walk is written to `.missile/checks/keyboard-it<N>.txt` with no dead ends. Effort M.

### Signature moment (first_impression, motion)
- [ ] M1. "The chart answers" on the landing hero, per the spec in DESIGN.md: static poster first, then the one-time sequence, then the lazy particle sea. Test: the first viewport at 1440 and at 390 shows the question, the plotted course and the stamped verdict with JavaScript disabled; with it enabled the sequence finishes in under 2.5 s and landing Lighthouse performance stays at 95 or above. Effort L. Files: `Landing.tsx`, new `HeroChart.tsx`, `FlowLayer.ts` (reuse only).
- [ ] M2. A phone front door: the phone app's first paint gets the verdict circle's entrance and a one-line statement of what ORCA is, since phone visitors never see the landing. Test: a stranger shown `phone-today-390.png` can say what the product does. Effort S.
- [ ] M3. Motion budget: ambient loops pause off-screen and on hidden tabs; the grain layer drops on small screens if it costs frames. Test: a 4x CPU-throttled trace of Today shows no long frames from CSS animation. Effort S.

### States and copy (ux_completeness, layout)
- [ ] U1. Enumerate loading, empty, error and denied-location states for Today, Ask, Authority, System and the three phone tabs; design the missing ones in the chart language. Test: a screenshot of each state exists in `.missile/shots/`. Effort M.
- [ ] U2. Make the scenario effect in Ask idempotent so the answer renders once under StrictMode; pad the phone list so the last card clears the tab bar. Test: `?demo=danger` on the dev server shows the question, then one answer; the last phone card clears the tab bar. Effort S.
- [ ] U4. Answer text agrees with the chart: the fishing-zone "confidence" in the explanation uses the same chance-of-fish number the buoy shows (presentation only, no model change); the source and simulated-data lines are translated in Hindi and Marathi; the phone's return time is labelled with its day ("back by 12:07 AM tomorrow"). Test: `?demo=pfz` answer and chart show the same percentage; `?demo=danger` in Marathi has no English sentence outside proper nouns; smoke test still passes. Effort M. Files: `backend/app/agents/explanation_agent.py`, `backend/app/services/i18n.py`, `MobileApp.tsx`.
- [ ] U5. Ask at 1440 by 900 shows the verdict and dial above the fold; Today's right column ends on a whole card. Test: viewport screenshots at 1440 by 900 and 1280 by 720 show the stamped verdict without scrolling. Effort M. Files: `App.tsx`, `ChatPanel.tsx`, `RiskCard.tsx`.
- [ ] U3. The desktop console between 641 and 1024 px (tablet, split-screen laptops). Test: no horizontal overflow at 768. Effort M.

### Story
- [ ] T1. OG image (1200 by 630) drawn from the tokens, `og:` and `twitter:` tags, apple-touch icon, per-view `document.title`. Test: the preview URL pasted into a chat shows the card. Effort S.
- [ ] T2. README: add the live URL at the top and a fresh-clone run verified on a clean checkout. Keep everything else. Test: clone into a temp folder, follow the steps, app opens. Effort S.

### Loop and ship
- [ ] Guidance loop to IMPACT (cap 6 iterations)
- [ ] Final preview, tag `v0.2.0-missile`, handover

## Iteration log

<!-- iterations:start -->
### Iteration 0 · 2026-10-01T08:43:01.221Z
- mean 5.8, min 4, verdict **CONTINUE**
- url: http://localhost:8000
- screens: /, /?tab=home, /?demo=danger, /?demo=cyclone, /?demo=route, /?tab=authority, /?tab=system, phone app Today/Map/Ask
- next fixes:
  - [S] ux_completeness: Make each demo scenario produce exactly one answer bubble (idempotent trigger under StrictMode) and correct the 'confidence 0%' figure in the composed answer so it matches the 77% shown on the map (frontend/src/components/ChatPanel.tsx, frontend/src/App.tsx, backend/app)
  - [S] accessibility: Add a <main> landmark, fix heading order, name the unnamed icon button, and darken ink-300/ink-400 label text in the token layer until Lighthouse shows zero contrast failures on / and /?demo=danger (frontend/src/App.tsx, frontend/src/components/Landing.tsx, frontend/tailwind.config.js, frontend/src/index.css)
  - [M] performance: Code-split: React.lazy for MobileApp vs App in main.tsx, lazy MarineMap/Landing/SystemPanel/GuidedTour, latin-only font subsets with Devanagari loaded on language switch, static shell in index.html; target Lighthouse mobile 90 and LCP under 2.5 s (now 68 and 5.3 s) (frontend/src/main.tsx, frontend/src/App.tsx, frontend/index.html, frontend/src/index.css)
  - [M] layout: Bring the risk dial and verdict fully above the fold in the Ask view at 1440x900, stop the Today right column slicing cards at the fold, and add min-width: 0 plus wrapping so the desktop layout has no horizontal overflow at 390, 768 and 1024 (frontend/src/App.tsx, frontend/src/components/LocationPicker.tsx, frontend/src/components/RiskCard.tsx, frontend/src/components/MobileApp.tsx)
  - [M] shipped: Add a single-port Dockerfile (FastAPI serving the built frontend), deploy to a public host, put the URL in the README and tag v0.1.0 (Dockerfile, README.md, backend/app)
  - [M] code_health: Add typecheck, lint and test scripts with ESLint and three Vitest tests on the demo path, an ErrorBoundary around the map and chat, and a .env.example (frontend/package.json, frontend/eslint.config.js, frontend/src/App.tsx, .env.example)
  - [M] first_impression: Replace the small landing vignette with the real Today map and verdict at hero scale, cut the hero to one primary and one secondary button, and relabel the phone 'BE BACK BY 00:07' so it cannot read as a clock error (frontend/src/components/Landing.tsx, frontend/src/components/MobileApp.tsx)

<!-- iterations:end -->

## Decisions

- Gate: the user was shown the target and asked go, adjust or stop, and answered by firing the missile again with a direction. Taken as go with an adjustment (frontend beauty first). No second confirmation was asked.
- Hosting: proceeding with the recommended Vercel preview (static frontend plus the FastAPI app as a Python function). Preview only, never production. The in-memory chat session caveat stands and is tested on the preview.
- The typecheck hook was offered once and not taken up; not added.
- Builders run in git worktrees and do not rebuild `frontend/dist`; the main session rebuilds it once per merge so the committed bundle never conflicts.

- Mode is `recon`: stages 0 and 1 only. No product source file was changed. Files added on the branch: MISSILE.md, PRODUCT.md, DESIGN.md, CLAUDE.md, `.claude/launch.json`; `.gitignore` gained `.missile/` and `.playwright-cli/`.
- The working tree had an uncommitted rewrite of HANDOFF.md. On the user's choice it was stashed (`git stash list`: "pre-missile: HANDOFF.md rewrite (1 Oct 2026)"). Restore it with `git stash pop` on whichever branch should carry it.
- Commits carry no `Co-Authored-By` or AI attribution line (user's choice, matching the rule in the stashed HANDOFF.md).
- The existing design system is kept. No replacement direction is proposed; DESIGN.md records it as shipped and lists additions.
- Screenshot sensor: `npx playwright screenshot` had no Chromium, so `playwright-cli` was used for files and the Browser pane for the dev servers. Nothing was installed.
- The baseline build was written to `.missile/dist-it0` so the committed `frontend/dist` stayed untouched; it is byte-identical in size to the committed bundle, so `dist` is current with `src`.
- For the user to decide before a full flight: hosting for the Python backend. Recommended: Vercel preview with the FastAPI app as a Python function (plan item S3). The alternative is a long-running host such as Render behind a Vercel rewrite, which keeps the in-memory chat session intact.
- For the user to decide: adding the typecheck hook from the missile's `settings.hook.json` to `.claude/settings.local.json` (not added).

## Remaining gaps

(filled at Impact, or on stall)
