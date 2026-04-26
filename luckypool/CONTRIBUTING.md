# Contributing to LuckyPool

Welcome — this is a Vite + React + TypeScript + Tailwind SPA for running
8-ball, 9-ball, and snooker tournaments. The whole front-end is a single
package; there is no backend yet (state lives in `localStorage`).

The TL;DR for any change:

```bash
npm install
npm run dev      # http://localhost:5173 — hot reload
npm run lint
npm run build    # tsc -b && vite build (must pass before PR)
```

If lint and build both pass, your PR is ready to open.

---

## Table of contents

1. [Dev environment](#dev-environment)
2. [Project layout](#project-layout)
3. [Running locally](#running-locally)
4. [Coding standards](#coding-standards)
5. [Commit message convention](#commit-message-convention)
6. [Branching & PR process](#branching--pr-process)
7. [Testing checklist](#testing-checklist)
8. [Renaming the brand (LuckyPool → something else)](#renaming-the-brand-luckypool--something-else)
9. [Adding a new page / feature](#adding-a-new-page--feature)
10. [Working with `localStorage` state](#working-with-localstorage-state)

---

## Dev environment

| Tool | Version |
| --- | --- |
| Node | ≥ 20.10 (LTS) |
| npm | ≥ 10 |
| Git | ≥ 2.40 |

Pinning Node 20+ keeps Vite 8 happy. `nvm install 20 && nvm use 20` is the
fastest path. Anything ≥ 18 will work in a pinch but isn't tested.

## Project layout

```
luckypool/
├── index.html                  # <title>, meta tags, font preload
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig*.json
├── eslint.config.js
├── public/
│   └── luckypool.svg           # favicon — also referenced from index.html
├── demo/
│   └── luckypool-demo.mp4      # walkthrough video committed for sharing
└── src/
    ├── main.tsx                # React root + BrowserRouter
    ├── App.tsx                 # route table
    ├── index.css               # Tailwind layers + tokens
    ├── types.ts                # domain types (Discipline, Tournament, …)
    ├── data/
    │   ├── mock.ts             # seed players, venues, tournaments, matches
    │   ├── store.ts            # localStorage-backed useTournaments / useMatches
    │   ├── quickfire.ts        # localStorage-backed Quickfire best-time store
    │   ├── stats.ts            # deterministic seeded global stats / leaderboard
    │   └── realRankings.ts     # real-world snapshot data (WPA / Snooker / BCA)
    ├── lib/
    │   ├── bracket.ts          # seed ordering + skeleton bracket generator
    │   └── format.ts           # tiny string helpers
    ├── components/             # Nav, Footer, Bracket, Rack, Ball, Avatar, …
    └── pages/                  # Home, Tournaments, Matches, Players, Venues,
                                #   TournamentBuilder, Leaderboard, Quickfire
```

## Running locally

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>. HMR is enabled — saves reflect immediately.

To preview the production bundle:

```bash
npm run build
npm run preview     # serves dist/ on http://localhost:4173
```

## Coding standards

- **TypeScript strict.** No `any`, no `as unknown as X`, no `getattr/setattr`-style escapes. If types feel ambiguous, model the data better.
- **Tailwind classes** for styling. If you find yourself repeating long class lists, lift a small utility into `src/index.css` under `@layer components` (see existing `.btn-primary`, `.chip`, `.card`, `.section-title`).
- **One component per file** for non-trivial components. Tiny presentational helpers can live next to their parent.
- **No new runtime deps without a reason.** The current runtime tree is `react`, `react-dom`, `react-router-dom`. Each new dep adds bundle weight and supply-chain risk — justify it in the PR.
- **Imports at the top of files.** No nested imports inside functions.
- **Comments are rare.** Prefer good names + small functions over comments. When you do comment, document the *why* and steady-state intent — never describe the diff.

`npm run lint` will catch most of the above. CI does not exist yet, but please run it before opening a PR.

## Commit message convention

We use [Conventional Commits](https://www.conventionalcommits.org/), one
line for the subject, optional body for context. Examples in this repo:

```
feat(luckypool): add real-world rankings tab to /leaderboard
fix(luckypool): clamp Race to input to [1,99] integers
docs(luckypool): add full deployment guide (DEPLOY.md)
chore(luckypool): bump tailwind to 3.4
```

Scope is `luckypool` while we live as a subfolder of `ai-playground`. Drop
the scope once we move to our own repo.

## Branching & PR process

- Default branch is `main`.
- Feature branches: `<author>/<short-slug>` or `devin/<timestamp>-<slug>`.
- Open a PR against `main` — every PR must:
  1. Pass `npm run lint`
  2. Pass `npm run build`
  3. Have a description that explains *what* changed and *why*
  4. Include screenshots / video for any visual change
- Direct pushes to `main` are blocked. Use a PR.
- Squash-merge by default. The PR title becomes the commit subject.

## Testing checklist

There's no automated test runner yet. For every PR, manually verify:

- [ ] **Home (`/`)** renders without console errors, all three discipline cards show their rack SVG, hero CTAs work.
- [ ] **`/tournaments`** filters (discipline + status + search) work; clicking a card navigates to detail.
- [ ] **`/matches/:id`** live scoring: `+A` to raceTo flips `LIVE → Final`, winner name turns gold, score caps don't go past raceTo, `−A` from the cap flips back to LIVE.
- [ ] **`/builder`** creates a real tournament with a bracket. **Reset demo data** wipes tournaments + matches + Quickfire all together.
- [ ] **`/play`** Quickfire: timer doesn't advance before first correct click; wrong click adds 500 ms penalty; completion overlay fires; `localStorage.luckypool.quickfire.v1` survives reload.
- [ ] **`/leaderboard`** all six tabs load (Overall / 8-Ball / 9-Ball / Snooker / **World** with sub-tabs / Quickfire); World source/asOf strip is visible.
- [ ] **Hard reload** on every page: state and route both survive.
- [ ] **Mobile breakpoints** (≤ 640 px): nav collapses, cards stack, no horizontal scroll.

Once we have a backend, this becomes Playwright + Vitest. Tracked in the
[Pending / parked items](./README.md#pending--parked-items).

---

## Renaming the brand (LuckyPool → something else)

The brand string `LuckyPool` (display) and `luckypool` (kebab-case slug)
appear in a small number of well-defined places. To rebrand to e.g.
**AngelBilliards** (display) / **angelbilliards** (slug), follow this
checklist in order:

### 1. Files where the brand string appears

```
package.json                          // "name" field — use the slug
index.html                            // <title>, meta description, og:title
public/luckypool.svg                  // favicon — rename file + update reference in index.html
src/components/Nav.tsx                // top-left brand wordmark
src/components/Footer.tsx             // © line
src/pages/Home.tsx                    // hero headline + sub-copy (2 lines)
src/pages/Venues.tsx                  // partner copy
src/pages/Players.tsx                 // search placeholder / empty state
src/data/mock.ts                      // sample tournament names that mention the brand
README.md, DEPLOY.md, GO_LIVE.md      // docs (this file too)
demo/README.md                        // demo notes
```

To preview every match before changing anything:

```bash
git grep -n -E 'LuckyPool|luckypool'
```

### 2. One-shot rename recipe

> ⚠️ Run from the repo root, on a clean working tree. Review the diff
> before committing.

```bash
# Display name (LuckyPool → AngelBilliards)
git ls-files -z '*.tsx' '*.ts' '*.html' '*.md' '*.json' \
  | xargs -0 sed -i 's/LuckyPool/AngelBilliards/g'

# Slug (luckypool → angelbilliards) — but DO NOT rewrite localStorage keys yet
# (see step 4). Restrict to safe files:
git ls-files -z '*.tsx' '*.ts' '*.html' '*.md' '*.json' \
  | xargs -0 sed -i '/luckypool\.\(tournaments\|matches\|quickfire\)\.v1/!s/luckypool/angelbilliards/g'

# Rename the favicon file + update the <link rel="icon"> reference
git mv public/luckypool.svg public/angelbilliards.svg
sed -i 's|/luckypool\.svg|/angelbilliards.svg|g' index.html

# Optional: rename the demo file
git mv demo/luckypool-demo.mp4 demo/angelbilliards-demo.mp4
sed -i 's|luckypool-demo\.mp4|angelbilliards-demo.mp4|g' demo/README.md README.md
```

### 3. Verify

```bash
git grep -n -E 'LuckyPool|luckypool' \
  | grep -v 'luckypool\.\(tournaments\|matches\|quickfire\)\.v1'
```

This should print **nothing**. If anything shows up that isn't a
localStorage key, fix it manually.

### 4. localStorage keys — handle separately

The keys in `src/data/store.ts` and `src/data/quickfire.ts`
(`luckypool.tournaments.v1`, `luckypool.matches.v1`, `luckypool.quickfire.v1`)
are intentionally left out of the rename above because **changing them
wipes existing user data** (every browser still references the old key).

Two options:

- **Migration shim** (preferred for a live site with users):
  ```ts
  // In store.ts, before first read:
  function migrate(oldKey: string, newKey: string) {
    const v = localStorage.getItem(oldKey);
    if (v && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, v);
      localStorage.removeItem(oldKey);
    }
  }
  migrate('luckypool.tournaments.v1', 'angelbilliards.tournaments.v1');
  ```

- **Just rename and accept the loss** (fine for pre-launch demos with no
  real users yet — the demo data simply re-seeds itself).

### 5. External rename steps (outside the repo)

- **GitHub repo:** Rename via Settings → Repository name. Old URL keeps
  redirecting; existing clones still pull/push correctly.
- **Vercel / Netlify / Cloudflare project:** Rename in dashboard. The
  default `*.vercel.app` URL changes; custom domain unaffected.
- **Custom domain:** Update DNS records to point at the new project
  endpoint if the CNAME target changed (usually it doesn't on Vercel).
- **Social handles, analytics property:** Update separately.

### 6. Commit

```bash
git checkout -b rename/angelbilliards
git add -A
git commit -m "chore: rename LuckyPool → AngelBilliards (display + slug)"
git push -u origin rename/angelbilliards
```

Open a PR with screenshots showing the new brand renders correctly on
Home, Nav, Footer, and the favicon.

---

## Adding a new page / feature

1. Add the route in `src/App.tsx`.
2. Add the page component in `src/pages/<PageName>.tsx`.
3. If the page reads/writes domain state, lift the data into
   `src/data/store.ts` (or a new sibling) so it stays decoupled from the
   UI.
4. Match the existing visual vocabulary — `card`, `chip`, `section-title`,
   `section-eyebrow`, `btn-primary`, `btn-ghost`, the noir/gold palette
   tokens (`ink`, `chalk`, `cue-accent`).
5. Update the navigation in `src/components/Nav.tsx` if the page should
   be discoverable.

## Working with `localStorage` state

Three keys today, all versioned with `.v1`:

| Key | Owner | Shape |
| --- | --- | --- |
| `luckypool.tournaments.v1` | `useTournaments` in `src/data/store.ts` | `Tournament[]` |
| `luckypool.matches.v1` | `useMatches` in `src/data/store.ts` | `Match[]` |
| `luckypool.quickfire.v1` | `useQuickfire` in `src/data/quickfire.ts` | `QuickfireRecord` |

Rules of engagement:

- **Always bump the version** (`.v1` → `.v2`) when changing the shape in a
  way that can't be parsed by old code. Provide a migration shim that
  reads `.v1`, transforms it, writes `.v2`, deletes `.v1`.
- **Never read directly via `window.localStorage` in components.** Use
  the `useTournaments` / `useMatches` / `useQuickfire` hooks so
  `useSyncExternalStore` notifies all subscribers on changes.
- **`resetAll()` in `src/data/store.ts`** must wipe *every* LuckyPool key
  back to seed when the global "Reset demo data" button is clicked.
  Adding a new key? Wire its reset path into `resetAll()`.
