# LuckyPool

An end-to-end website for running **8-ball, 9-ball, and snooker** tournaments — inspired by [digitalpool.com](https://digitalpool.com/). Think "Challonge meets Digital Pool": a platform for players, venues and tournament directors to create brackets, live-score matches, and track stats.

> **Status:** Demo / MVP. The UI is production-grade React + TypeScript + Tailwind, but all data is mocked and persisted in the browser's `localStorage`. No backend is wired up yet. See [Pending / parked](#pending--parked-items) below.

---

## Table of contents

1. [Scope & feature tour](#scope--feature-tour)
2. [Tech stack & why](#tech-stack--why)
3. [Project layout](#project-layout)
4. [Run it locally](#run-it-locally)
5. [How to test / try it out](#how-to-test--try-it-out)
6. [Design decisions & things considered](#design-decisions--things-considered)
7. [Pending / parked items](#pending--parked-items)
8. [Deployment: how & where](#deployment-how--where)
9. [Parked product questions for Shubham](#parked-product-questions-for-shubham)

---

## Scope & feature tour

LuckyPool covers the core loops of a cue-sports tournament platform:

| Route | What it does |
| --- | --- |
| `/` | Marketing home with hero, three-discipline pitch, featured tournaments, live/upcoming matches. |
| `/tournaments` | Browse tournaments with filters (discipline, status, free-text search). |
| `/tournaments/:id` | Tournament detail: banner, metadata, **interactive bracket**, match list, field roster. |
| `/matches` | Global match feed with live / scheduled / completed filter. |
| `/matches/:id` | **Tablet-style live scoring** UI — increment games per player, auto-detects the winner at race-to, reset to replay. |
| `/players` | Searchable player directory with discipline filters and ratings. |
| `/players/:id` | Player profile with bio, rating, win/loss record and match history. |
| `/venues` | Partner venue list with table counts and supported disciplines. |
| `/builder` | **Tournament Builder** — 3-step wizard (setup → format → players) that creates a new tournament and auto-generates a single/double-elim bracket. Persists across refresh. |

All three disciplines have first-class support:

- **8-Ball** — race-to-N game tracking. Rule-preset hooks wired through the UI (BCA / APA / handicap) — implementation parked.
- **9-Ball** — rotation game scoring with `race to` format. Break-and-run detection hooks in place — implementation parked.
- **Snooker** — "best of N frames" format. Break-builder UI (century detection, fouls, free ball) called out on the home page — implementation parked.

The Match Detail page doubles as a **live scoring console** similar to DigitalPool's tablet scoring screen: `+`/`−` controls per player, a progress-to-race bar, auto-winner when a player reaches the race target, and a reset button to replay. State is written to `localStorage` so refreshes preserve scores.

## Tech stack & why

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **React 19 + TypeScript** | Matches the sibling `smus-enablement-demo` so contributors have one mental model. Type-safe mock data + domain types (`Discipline`, `TournamentFormat`, `MatchStatus`, etc.). |
| Build | **Vite 8** | Fast HMR, zero-config, same as sibling project. Produces a static SPA — trivial to deploy. |
| Styling | **Tailwind CSS 3** | Matches the sibling project. Custom palette themed around felt/chalk/cue colors (see `tailwind.config.js`). |
| Routing | **react-router-dom 7** | Only runtime dep added beyond the sibling project; needed for multi-page navigation (tournaments, matches, players, venues, builder). |
| State | **React hooks + `localStorage`** | Deliberate: no backend yet, but we still want the Tournament Builder and Live Scoring to persist across reloads. The `useTournaments` / `useMatches` hooks in `src/data/store.ts` are drop-in replaceable with a TanStack Query / fetch layer once an API exists. |
| Lint | **ESLint flat config + typescript-eslint + react-hooks + react-refresh** | Mirrors sibling project. `npm run lint` must pass CI. |

## Project layout

```
luckypool/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig*.json
├── eslint.config.js
├── public/
│   └── luckypool.svg               # favicon (8-ball logo)
└── src/
    ├── main.tsx                    # React root + BrowserRouter
    ├── App.tsx                     # route table
    ├── index.css                   # Tailwind + component utilities
    ├── types.ts                    # domain types
    ├── data/
    │   ├── mock.ts                 # seed players, venues, tournaments, matches
    │   └── store.ts                # localStorage-backed hooks (useTournaments, useMatches)
    ├── lib/
    │   ├── bracket.ts              # seed ordering + single-elim skeleton generator
    │   └── format.ts               # small string helpers
    ├── components/
    │   ├── Nav.tsx · Footer.tsx
    │   ├── Avatar.tsx              # initials-based avatars (deterministic hue)
    │   ├── DisciplineBadge.tsx
    │   ├── TournamentCard.tsx · StatusChip
    │   ├── MatchCard.tsx · StatusPill
    │   └── Bracket.tsx             # horizontal round-by-round bracket view
    └── pages/
        ├── Home.tsx
        ├── Tournaments.tsx · TournamentDetail.tsx
        ├── Matches.tsx · MatchDetail.tsx
        ├── Players.tsx · PlayerDetail.tsx
        ├── Venues.tsx
        ├── TournamentBuilder.tsx
        └── NotFound.tsx
```

## Run it locally

Requires Node 22+ (already on the Devin image).

```bash
cd luckypool
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run lint       # ESLint flat config
npm run build      # tsc -b && vite build  (outputs dist/)
npm run preview    # serve the production build
```

The repo-level environment config (`.devin.yaml` / Devin org config) has a maintenance block that installs deps for every subproject automatically — `luckypool` is wired into that alongside `smus-enablement-demo` and `scentsense-ai`.

## How to test / try it out

Since there's no backend, the happy-path smoke test is entirely in the browser:

1. **Landing page (`/`)** — verify hero, three discipline cards, featured tournaments, and "Live & upcoming matches" section all render. Featured tournaments sort with live → registering → upcoming → completed.
2. **Tournaments page (`/tournaments`)** — filter by discipline (All / 8-Ball / 9-Ball / Snooker) and status (Live / Registering / Upcoming / Completed). Search for e.g. "Derby" and confirm filtering.
3. **Tournament detail** — open `LuckyPool World 9-Ball Open 2026`. The bracket should render with 4 quarterfinals (one live, one scheduled, two completed), 2 empty semifinals, and a final. Field roster is clickable.
4. **Live scoring** — click into any match (try the live QF: "Shaw vs Strickland"). Use the `+ Add game` / `−` buttons. When one player hits race-to-11, `LIVE` flips to `Final` and the winner's name turns gold. Click **Reset match** to replay. Refresh the page — scores persist via `localStorage`.
5. **Players** — filter by discipline, open a profile (e.g. Ronnie O'Sullivan), verify match history.
6. **Tournament Builder (`/builder`)** — enter a name, pick a discipline (race-to auto-adjusts), pick a format (e.g. Single elimination), select 4 or 8 players, click **Create tournament →**. You should be redirected to a detail page with a generated bracket skeleton.
7. **Reset demo data** — click "Reset demo data" on the Builder page to wipe `localStorage` back to the seed dataset. Useful between demos.

Automated testing is not yet wired up (see [Pending](#pending--parked-items)).

### What can break

- If you see a bracket page with "TBD" in every slot, the tournament is in `registering` status with no matches yet. That's intentional (see `t-derby8`).
- The round-robin tournament (`t-tokyo-9`) has no bracket view — the Bracket component only renders single/double elim. Round-robin standings UI is parked.

## Design decisions & things considered

1. **React 19 + Vite + Tailwind matches the sibling project.** This keeps the repo coherent (same ESLint, same tsconfig shape, same TS strictness flags like `verbatimModuleSyntax`). A fresh contributor can go from `smus-enablement-demo` to `luckypool` without re-learning tooling.
2. **`localStorage` as a temporary persistence layer.** The Tournament Builder isn't useful if the tournament disappears on refresh. Hooks (`useTournaments`, `useMatches`) are intentionally small and stateless — swap the `load`/`save` internals for an HTTP client once an API exists. No Redux / Zustand needed at this size.
3. **Domain types are the source of truth.** `Discipline`, `MatchStatus`, `TournamentFormat`, etc. live in `src/types.ts`. All mock data and components type against those so adding a fourth discipline (e.g. 10-ball, one-pocket) is a single-point change.
4. **Bracket generation is data-driven.** `generateSkeletonMatches` in `src/lib/bracket.ts` produces real `Match` records (Round 1 seeded properly via a power-of-two seed order, then empty rounds up to the final). That means the existing `MatchCard`, `Bracket`, and `MatchDetail` components work for generated tournaments with zero changes.
5. **Felt / chalk / cue color palette.** `tailwind.config.js` extends Tailwind with `felt-*`, `chalk`, `cue`, `rail`, `ink`. The body has a subtle radial-gradient felt vibe; buttons use the cue-tip orange as the primary accent.
6. **No image assets bundled.** All avatars are deterministic initials on a colored disk (see `Avatar.tsx`), and banners use per-tournament hues. This keeps the demo lightweight and license-clean; swap to real photos in production.
7. **Accessibility basics.** Focus rings on inputs/buttons, semantic headings, keyboard-reachable navigation. Not yet audited end-to-end — see Pending.
8. **Tablet-style scoring on the match page.** The Match Detail `+`/`−` controls (plus auto-winner detection) mimic the "Tablet scoring" flow DigitalPool describes in their [quick-start guide](https://docs.digitalpool.com/tournament-builder-quick-start-guide). Good enough to demo; a real implementation needs rack-by-rack break tracking, fouls, and TD approval.

## Pending / parked items

Tracked here so nothing gets lost. Priority is my rough guess — adjust as you see fit.

### P0 — required before "real" launch

- [ ] **Backend + persistence.** Replace `localStorage` with a real API. Minimum models: `User`, `Player`, `Venue`, `Tournament`, `Match`, `MatchEvent`. Options: Supabase (fastest), a small Fastify/Express + Postgres, or Next.js API routes if we migrate.
- [ ] **Auth & roles.** At minimum: Player, Tournament Director, Venue Owner, Admin. Magic-link or OAuth (Google) — no passwords.
- [ ] **Real scoring.** Discipline-specific scoring engines:
  - 8-ball: group assignment (stripes/solids), turn tracking, foul handling, winning ball rules, BCA/APA handicap presets.
  - 9-ball: rotation turn tracking, push-out, 3-foul rule, break-and-run detection, alternate-break vs winner-break.
  - Snooker: frame-by-frame scoring, break builder (reds → colour → reds), fouls, free ball, respot black, best-of-N frames.
- [ ] **Bracket progression logic.** Right now winners don't auto-advance in generated brackets. Need `nextMatchId` / `nextMatchSlot` wiring so marking a match complete populates the next round.
- [ ] **Double-elim and round-robin UIs.** `Bracket.tsx` only renders single-elim as columns. Add loser's bracket visualization and a standings table for round-robin / Swiss.
- [ ] **Testing.** `vitest` + `@testing-library/react` for components and `lib/bracket.ts`, plus a Playwright smoke test for the golden path (create tournament → score a match → see winner).

### P1 — nice-to-have

- [ ] **Real-time live scoring.** WebSockets / SSE so spectators see scores update. A simple pub/sub channel per match-id.
- [ ] **TV display mode.** Full-screen scoreboard URL per match (mentioned on Digital Pool). Easy to add — reuses `MatchDetail` state.
- [ ] **Streaming overlays.** Transparent-background HTML URLs per match suitable for OBS browser sources.
- [ ] **Player self-service.** Profile editing, avatar upload, discipline preferences, head-to-head stats.
- [ ] **Leagues.** Season-long standings, handicap rolling averages, schedule generation. Currently only tournaments are modeled.
- [ ] **Notifications.** Match about to start, your match is on Table N, opponent confirmed, score submitted for approval.
- [ ] **Mobile app / PWA.** Vite plugin + offline tablet scoring for venues with flaky Wi-Fi.
- [ ] **Search & global Cmd-K.** As the dataset grows, a unified search across players / tournaments / venues.
- [ ] **Payments.** Stripe for entry fees + prize disbursement. Probably Stripe Connect so venues own their payouts.

### P2 — polish

- [ ] Dark/light mode toggle (currently dark-only; palette supports it).
- [ ] i18n (at minimum Filipino and European markets — Digital Pool's strongest demographics).
- [ ] Accessibility audit (axe-core run + keyboard nav tests).
- [ ] Replace initials-avatars with real photos & country flags.
- [ ] Animated break/rack visualizations for featured matches.

### Known small bugs / TODOs

- Bracket skeleton generator treats byes as "TBD" slots rather than auto-advancing the seeded player in Round 1.
- Generated double-elim tournaments currently produce only the upper bracket — no loser's-side matches yet.
- `useMatches` / `useTournaments` cross-tab sync works within the same tab (event bus) but does not listen to `storage` events, so two tabs won't stay in sync. One-liner fix, parked.

## Deployment: how & where

LuckyPool is a static Vite SPA — `npm run build` produces a self-contained `dist/` you can host anywhere. Full guide with copy-pasteable configs for **Vercel, Netlify, Cloudflare Pages, GitHub Pages, AWS S3+CloudFront, and Docker/Nginx (any VPS / Fly / Render / Railway / DO App Platform)** is in [`DEPLOY.md`](./DEPLOY.md).

TL;DR — for a personal / small-team production deploy, use **Vercel**:

1. Sign in at [vercel.com](https://vercel.com/), import the repo, accept the auto-detected Vite settings (`npm run build`, output `dist`).
2. Commit a one-line `vercel.json` for SPA routing: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
3. Add your custom domain under Settings → Domains.

**Should LuckyPool live in its own repo?** Yes — see [`DEPLOY.md` §1](./DEPLOY.md#1-should-luckypool-live-in-its-own-repo) for the migration recipe (`git subtree split` preserves history). Subfolder still works if you set the provider's Root Directory to `luckypool`.

### When we add a backend

Recommended: Fly.io or Render for the API (Node/Python/Rust — pick one), managed Postgres (Neon / Supabase), keep the frontend on Vercel. Static frontend → API domain via `VITE_API_URL` env var, which we should introduce as a placeholder (`.env.example`) even before the backend exists.

## Parked product questions for Shubham

Things I made judgement calls on — flag any that are wrong and I'll revise:

1. **Brand & domain.** I used "LuckyPool" as the product name and `luckypool.com` in copy. If you want a different name, it's a single find-and-replace across `index.html`, `Nav.tsx`, `Footer.tsx`, and README.
2. **Scope vs Digital Pool.** I cloned the *structure* (Home / Tournaments / Matches / Players / Venues / Builder) but intentionally *didn't* clone Leagues, Pricing, Events, Live Chat, News Feeds, or Mobile Apps. Those are listed in Pending — tell me which to prioritize next.
3. **Monetization model.** I added "Entry fee" and "Prize pool" fields to tournaments but no payments. Is the plan free-for-players with SaaS fees for Tournament Directors (Digital Pool's model), or per-entry transaction fees, or both?
4. **Rules presets.** I left BCA/APA/WPA rulesets as labels without implementations. Which one should be the default for 8-ball? I assumed BCA.
5. **Ratings system.** Players have a `rating` number but no dynamic update logic. Fargo-style rating (most popular in pool) vs Elo vs something custom?
6. **Target persona first.** Home page currently pitches to both players *and* tournament directors. Usually you want one clear primary persona — which is ours?

---

*Questions, feedback, or "rip this all up and start over"? Message me or open an issue.*
