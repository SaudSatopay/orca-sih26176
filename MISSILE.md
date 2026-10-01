# Missile log: orca

status: stage=4 iteration=0 verdict=CONTINUE updated=2026-10-01T11:30:00Z
mode: full flight, second stage (`/missile go`, 1 Oct 2026)
branch: missile/20261001
url: https://orca-psi-one.vercel.app
max_iterations: 6

## Target

- One-liner: Ten agents read the sea and return one safe, explainable decision for a fisher, in Marathi, Hindi or English.
- Audience: the fisher on a phone; the district authority; the SIH 2026 judge with two minutes and a laptop.
- Signature moment: "The chart answers" on the landing hero. A question is asked, ten agents report in, the course plots itself around the hatched no-go area, the verdict stamps, and the sea under the chart keeps moving. Static poster first; spec in DESIGN.md.
- Direction: see DESIGN.md. The living nautical chart is kept as it is: chart paper, marine ink, Fraunces / Archivo / Spline Sans Mono, hatching, stamps, soundings. Additions only: one token source, a contrast fix at the token, a motion budget.
- Scope: the plan below.
- User's direction (second firing, 1 Oct 2026): "elevate the frontend to the max and make everything beautiful. use your skills to effect". Read as: push first_impression, motion, layout, design_system and ux_completeness hardest; the visual craft of every screen is the priority; use the installed design skills (impeccable, animate, emil-design-eng, frontend-design, web-design-guidelines, mobile-native) inside the stages.
- User's direction (third firing, `/missile go`, 1 Oct 2026, "second-stage revamp"): take the frontend from good to exceptional. Reconcile first and measure (iteration 1) before changing anything. Finish the open plan, code-splitting first. Then an effects stage, one lazy module per effect, poster first: (1) ShaderGradient waterPlane as the sea behind the landing hero on desktop, (2) one React Three Fiber 8 + drei 9 paper-relief bathymetry sheet below the hero, (3) liquid-glass-js as a chart loupe on the hero's question tabs and primary action, (4) Paper Shaders LiquidMetal / liquid-logo wet ink on the wordmark for the PWA splash and the social image, (5) Spline only if its MCP is connected, (6) Haikei waves and contours for dividers and the social image. Design tools as passes inside stages: Taste Skill audits, Impeccable (critique, layout, typeset, polish, harden, onboard, adapt, optimize, delight; overdrive on the hero only), Emil Kowalski's four animation skills and mobile-native, the Vercel guidelines and React best practices, Hallmark's gates before every critic pass, Watermelon / 21st.dev / shadcn searched before hand-building, the getdesign.md gallery against DESIGN.md, Figma (whoami, then at most two calls), Playwright CLI for every screenshot, Chrome DevTools MCP for a 4x-throttled trace of each effect. Every tool gets a fair trial; a tool that fails the critic, the budget or the chart doctrine is removed with the reason under Decisions. Then the loop to IMPACT (cap six), then README, tag `v0.2.0-missile` and a handover with a tool ledger. Previews only; the production alias is left alone.
- Rules for the effects (user's, binding): the phone app gets none of the WebGL effects and its bundle does not grow; everything works in demo mode with no network (no CDN assets, no remote scene files, no environment maps); safety data never waits on an animation; reduced motion and reduced transparency get the poster; at most three live WebGL contexts on the landing and none on the phone; landing Lighthouse stays at 90 or above on mobile and 95 on desktop.
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
- [x] F1. Add `typecheck`, `lint`, `test` scripts to `frontend/package.json`; ESLint flat config with the TypeScript and React hooks rules. Test: `npm run typecheck && npm run lint` exit 0. Effort S. Files: `frontend/package.json`, `frontend/eslint.config.js`. Done in a0bf59c.
- [x] F2. Vitest with three tests on the demo path: phone/desktop selection, the risk dial band for 9 / 70 / 92, and language switching keeping all three dictionaries in step (a key-parity test over every string table). Test: `npm test` passes. Effort M. Files: `frontend/src/**/*.test.ts(x)`, `frontend/vite.config.ts`. Done in 771a5d0.
- [x] F3. Turn `backend/smoke_test.py` assertions into pytest cases for the five scenarios and the safety floors (floors only raise; severe warning forces 92). Test: `python -m pytest backend` passes. Effort M. Files: `backend/tests/`. Done in 7af37e4.
- [x] F4. ErrorBoundary around the map and each view; replace the silent `.catch(() => {})` calls with a visible, trilingual "could not reach ORCA, showing the last reading" state; remove the width probe. Test: with the backend stopped, every view shows the message and no console error. Effort M. Files: `App.tsx`, `MobileApp.tsx`, new `ErrorBoundary.tsx`. Done in 031e324, dc87863, 90856cd.
- [x] F5. `.env.example` documenting `ORCA_DATA_MODE` and `ANTHROPIC_API_KEY`; GitHub Actions workflow running the four commands and pytest. Test: workflow file lints; commands pass locally. Effort S. Done in c0a7473.

### Ship early (shipped, performance)
- [x] S1. Gzip on the backend (`GZipMiddleware`) and long-lived cache headers on hashed assets. Test: `curl -H "Accept-Encoding: gzip"` shows `content-encoding: gzip`; mobile Lighthouse FCP under 2.5 s. Effort S. Files: `backend/app/main.py`. Done in f7567c9.
- [x] S2. Split the bundle: lazy-load the desktop console, the landing and Leaflet separately from the phone app. Test: phone route ships under 120 KB gzip of JavaScript; mobile Lighthouse performance 90 or above. Effort M. Files: `main.tsx`, `App.tsx`, `vite.config.ts`. Done in ac295f3.
- [x] S3. Vercel preview: static `frontend/dist` plus the FastAPI app as a Python function under `/api`, demo mode. Test: the preview URL opens in a private window on a phone and at 1440, and all five `?demo=` links return their rehearsed numbers. Effort M. Files: `vercel.json`, `api/index.py`, `requirements.txt`. Done in 8858a42 (deployed; see Decisions).

### Design system (design_system, accessibility)
- [x] D1. One token source: custom properties in `index.css`, read by `tailwind.config.js`, exported to canvas and Leaflet code through `tokens.ts`. Sweep the literal hex values in components onto tokens; name the off-palette ones. Test: a grep for `#[0-9a-f]{6}` in `frontend/src/components` returns only `tokens.ts`; screenshots unchanged. Effort M. Done in 61f3c2b.
- [x] D2. Contrast at the token: text uses of `ink-300` move to `ink-400` or darker. Test: Lighthouse reports zero contrast failures on landing, Today and Ask. Effort S. Done in 8385891.
- [x] D3. A named type scale replacing literal pixel sizes. Test: no `text-[` arbitrary sizes left in components. Effort M. Done in 9222530.

### Accessibility
- [x] A1. `main`, `nav` and `header` landmarks; heading order; a name on every icon button; `<html lang>` follows the chosen language. Test: Lighthouse accessibility 95 or above on all four views; `document.documentElement.lang` is `mr` after switching. Effort S. Done in dc87863, 2f49ed2.
- [x] A2. A text equivalent for the chart: a visually hidden, ordered list of grounds, restricted areas and the course, kept in step with the map. Test: screen-reader tree for Today names every buoy. Effort M. Done in dd3642a.
- [ ] A3. (console and phone walked by their builders, `.missile/checks/keyboard-c1.txt` and `keyboard-d.txt`; the landing hero's tabs and a full cold walk are owed in iteration 1) Keyboard walk of the full flow on desktop and phone (ask a question, open a ground, switch tab, close the tour with Escape), fixing whatever traps or hides focus. Test: the walk is written to `.missile/checks/keyboard-it<N>.txt` with no dead ends. Effort M.

### Signature moment (first_impression, motion)
- [x] M1. "The chart answers" on the landing hero, per the spec in DESIGN.md: static poster first, then the one-time sequence, then the lazy particle sea. Test: the first viewport at 1440 and at 390 shows the question, the plotted course and the stamped verdict with JavaScript disabled; with it enabled the sequence finishes in under 2.5 s and landing Lighthouse performance stays at 95 or above. Effort L. Files: `Landing.tsx`, new `HeroChart.tsx`, `FlowLayer.ts` (reuse only). Done in 4d7366a.
- [x] M2. A phone front door: the phone app's first paint gets the verdict circle's entrance and a one-line statement of what ORCA is, since phone visitors never see the landing. Test: a stranger shown `phone-today-390.png` can say what the product does. Effort S. Done in 90856cd.
- [x] M3. Motion budget: ambient loops pause off-screen and on hidden tabs; the grain layer drops on small screens if it costs frames. Test: a 4x CPU-throttled trace of Today shows no long frames from CSS animation. Effort S. Done in dc87863 (ambient.ts).

### States and copy (ux_completeness, layout)
- [x] U1. Enumerate loading, empty, error and denied-location states for Today, Ask, Authority, System and the three phone tabs; design the missing ones in the chart language. Test: a screenshot of each state exists in `.missile/shots/`. Effort M. Done in dc87863, f88f585, dac17c4, 90856cd.
- [x] U2. Make the scenario effect in Ask idempotent so the answer renders once under StrictMode; pad the phone list so the last card clears the tab bar. Test: `?demo=danger` on the dev server shows the question, then one answer; the last phone card clears the tab bar. Effort S. Done in 8f153e7, 90856cd.
- [x] U4. Answer text agrees with the chart: the fishing-zone "confidence" in the explanation uses the same chance-of-fish number the buoy shows (presentation only, no model change); the source and simulated-data lines are translated in Hindi and Marathi; the phone's return time is labelled with its day ("back by 12:07 AM tomorrow"). Test: `?demo=pfz` answer and chart show the same percentage; `?demo=danger` in Marathi has no English sentence outside proper nouns; smoke test still passes. Effort M. Files: `backend/app/agents/explanation_agent.py`, `backend/app/services/i18n.py`, `MobileApp.tsx`. Done in f17fdd5, 6b8329d, 90856cd.
- [x] U5. Ask at 1440 by 900 shows the verdict and dial above the fold; Today's right column ends on a whole card. Test: viewport screenshots at 1440 by 900 and 1280 by 720 show the stamped verdict without scrolling. Effort M. Files: `App.tsx`, `ChatPanel.tsx`, `RiskCard.tsx`. Done in dc87863.
- [x] U3. The desktop console between 641 and 1024 px (tablet, split-screen laptops). Test: no horizontal overflow at 768. Effort M. Done in dc87863, 2f49ed2.

### Story
- [x] T1. OG image (1200 by 630) drawn from the tokens, `og:` and `twitter:` tags, apple-touch icon, per-view `document.title`. Test: the preview URL pasted into a chat shows the card. Effort S. Done in 6986d7f, 813eeb2, dc87863.
- [ ] T2. README: add the live URL at the top and a fresh-clone run verified on a clean checkout. Keep everything else. Test: clone into a temp folder, follow the steps, app opens. Effort S.

### Stage two: reconcile (1 Oct 2026)
- [x] R1. Read MISSILE.md, PRODUCT.md, DESIGN.md, CLAUDE.md and HANDOFF.md (the working copy and the stashed rewrite). Protected and "Must never break" stand.
- [x] R2. Merge the finished, green builder branches. Merged: `missile/b-backend`, `missile/b-frontend-foundations`, `missile/c1-console-ask`, `missile/c2-views`, `missile/d-phone`. Nothing is left unmerged; nothing was deleted (see Decisions for the two empty branches).
- [ ] R3. Iteration 1: full sensor pass, Hallmark gates, critic. The revamp starts from this score, not from 5.8.

### Stage two: the open plan
- [ ] O1. Hero follows the motion doctrine to the letter: no opacity under a fill-mode. The sequence becomes state plus transitions with a frame-and-timeout fail-safe, as `Reveal` does. Test: with animations disabled in DevTools the hero is complete; the sequence still reads question, crew, course, stamp. Effort M. Files: `HeroChart.tsx`, `hero.css`.
- [ ] O2. `/?debug=1` on the phone lists over-wide elements again (HANDOFF section 2 documents it; it was removed as dead code in F1). Test: `/?m=1&debug=1` shows the probe; the phone bundle grows by less than 1 KB. Effort S.
- [ ] O3. Leftovers the builders handed over: the chart's init timer is cleared on unmount; the boat marker has a name; buoy and map control targets reach 44 px on the phone; `og.png` is referenced and present. Test: Lighthouse accessibility 100 on Today and Ask; no console error under StrictMode. Effort S.
- [ ] O4. Whatever iteration 1 names in accessibility, states, layout and motion budget.
- [ ] T2. README: the live URL at the top and a fresh-clone run verified on a clean checkout; screenshots in `docs/` regenerated. Effort S.

### Stage two: effects (one lazy module each, poster first, a fair trial, kept only if it earns its place)
- [ ] E0. Scaffold: `frontend/src/effects/` with one slot component (poster first, mounts after first paint, desktop and fine pointer only, off under reduced motion or reduced transparency, error boundary back to the poster), a `?fx=` switch for trials, and a counter that proves the WebGL context cap. Dependencies pinned after checking Context7: React 18 stays. Test: with `?fx=none` the landing is byte-for-byte the poster; the phone chunk list is unchanged.
- [ ] E1. ShaderGradient waterPlane sea behind the hero (desktop), `lightType="3d"`, `pixelDensity` 1, `lazyLoad`, `animate="off"` under reduced motion; the CSS swell is the poster.
- [ ] E2. R3F 8 + drei 9 paper-relief bathymetry off Mumbai with ink contours and the plotted course, below the hero; orthographic, flat-shaded, no environment map, `frameloop="demand"`, an SVG poster; labelled illustrative.
- [ ] E3. liquid-glass-js loupe on the hero's question tabs and the primary action only; vendored as one module; CSS blur fallback; real button semantics; never over a canvas.
- [ ] E4. LiquidMetal wet ink on the ORCA wordmark, rendered to still images for the PWA splash and the social image (the phone runs no WebGL); static under reduced motion.
- [ ] E5. Spline numbered buoy, only if its MCP server is connected.
- [ ] E6. Haikei layered waves and contours in the chart palette for section dividers and the social image; hand-written equivalents if the export cannot be automated.
- [ ] E7. Per effect: Lighthouse before and after, a 4x-throttled trace, the context count, the reduced-motion and offline paths; keep or remove, with the reason under Decisions.

### Stage two: design-tool passes (inside stages, never an interview)
- [ ] P1. Taste Skill: `redesign-existing-projects` audit on every screen; `design-taste-frontend` pre-flight.
- [ ] P2. Impeccable: critique, layout, typeset, polish, harden, onboard, adapt (641 to 1024 px), optimize, delight; overdrive on the hero only.
- [ ] P3. Emil Kowalski: find-animation-opportunities, animate, review-animations, improve-animations; mobile-native on the phone app.
- [ ] P4. Vercel: web-design-guidelines audit; react-best-practices on the code split. Hallmark gates before every critic pass.
- [ ] P5. Watermelon, 21st.dev and shadcn searched for the Authority table, the engine-room pipeline and the phone tab bar; anything borrowed restyled to the tokens and Tailwind 3.
- [ ] P6. getdesign.md gallery: DESIGN.md compared with two strong brand files; only missing sections added.
- [ ] P7. Figma: whoami, then at most two calls for the finished landing and phone Today.
- [ ] P8. Chrome DevTools MCP: a 4x-throttled trace of each effect.

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

- `go` was passed on the third firing (`/missile go`, the second-stage brief): no Target-lock confirmation was asked for stage two.
- Deploys from here on are previews only. The production alias https://orca-psi-one.vercel.app is left exactly as the first deploy put it; nothing in this flight runs `vercel --prod`. Preview URLs sit behind Vercel's login, so the public alias keeps showing the first build until the user decides otherwise.
- Reconcile, 1 Oct 2026: five builder branches merged (see R2). Two branches exist that this flight did not create and that carry no commits beyond the recon commit 4f9ae32: `missile/backend-hardening` and `missile/ci-lint-tests`, each with a locked worktree under `.claude/worktrees/`. They are left alone: nothing to merge, nothing deleted. The seven `worktree-agent-*` branches are the harness's own bookkeeping at `abc0d20`.
- The stashed HANDOFF.md rewrite was read for the reconcile (`git show stash@{0}:HANDOFF.md`); it is still in the stash and was not applied.
- HANDOFF's motion doctrine says "never animate opacity with fill-mode: both". The landing hero built in this flight does that on its crew ticks, buoys, stamp and reasons. It carries a rehearsed scenario, not the reader's own safety data, but the rule is written without that exception, so the hero is being rebuilt on state plus transitions (plan O1).
- `/?debug=1` (the phone layout probe) is documented in HANDOFF section 2. It was removed in F1 on the recon report's reading of it as leftover debug code. It is being restored (plan O2).
- The phone's language switch moved from the header into a fourth, narrow cell of the tab bar (builder's call, to keep it within thumb reach). The three destinations, Today, Map and Ask, are unchanged, but the bar has four cells. For the user to confirm or reverse.
- The console's tagline under the wordmark ("Marine EcOsystem Reasoning · Collaborative Agents") is translated in Hindi and Marathi, which loses the acronym there. English keeps it.
- Spline: no Spline MCP server is connected in this session (tool search for it returned nothing), so effect 5 is recorded as not used. The numbered buoy stays the SVG it is.
- Screenshots in this flight are taken with `playwright-cli` at an emulated viewport, with `innerWidth` read back after every resize (HANDOFF's first headless trap: a clamped window that crops the PNG). Motion is captured in real time, never under a virtual-time budget (the second trap: frozen transitions), and anything the in-app Browser pane shows is treated as a hidden tab.

- Deploy, 1 Oct 2026: `vercel deploy --yes` (no `--prod`) created the Vercel project `orca`. Because it was the project's first deployment, Vercel assigned it to the production alias https://orca-psi-one.vercel.app on its own. That was not intended: the plan said preview only. Nothing existed there before, so nothing was replaced. Later deploys from this branch are previews; the production alias only moves again if the user asks for `--prod`. To take it down: `vercel remove orca`.
- Vercel runs the API on Python 3.12 (3.10 is not offered); local and CI run 3.10. `/api/health` and `/api/scenarios` answer on the deployment.

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
