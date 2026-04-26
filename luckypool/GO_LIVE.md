# Going Live — From "I bought a domain" to "It's online"

This guide is the **fast path** from a freshly registered domain to a
working production deploy of LuckyPool. It assumes you've already merged
the code to `main` and `npm run build` passes locally. For deeper
provider-specific config (Netlify, Cloudflare, S3+CloudFront, Docker),
see [`DEPLOY.md`](./DEPLOY.md).

**Recommended host: Vercel.** Free tier, zero config for Vite SPAs,
preview deploys per PR, custom domain + automatic HTTPS. The whole flow
below takes ~10 minutes.

---

## Prerequisites checklist

Before you start:

- [ ] Domain purchased (Namecheap / Cloudflare Registrar / Porkbun / Google Domains).
- [ ] Repo pushed to GitHub (`git push origin main`) and `main` is the latest version you want live.
- [ ] `npm run build` passes locally with no errors.
- [ ] You have admin access to the DNS records for the domain.
- [ ] (Optional) Brand decided. If you're rebranding from LuckyPool, do that **before** going live — see [`CONTRIBUTING.md` § Renaming the brand](./CONTRIBUTING.md#renaming-the-brand-luckypool--something-else).

---

## Step 1 · Add the SPA-routing fallback

LuckyPool uses client-side routing. Direct hits on `/play` or
`/leaderboard` (and refreshes on those URLs) must serve `index.html` or
the host returns 404.

Create `vercel.json` at the repo root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Commit and push:

```bash
git add vercel.json
git commit -m "chore: add SPA-routing fallback for Vercel"
git push
```

> Other hosts have equivalent files (`public/_redirects` for Netlify /
> Cloudflare Pages; `try_files` for Nginx; CloudFront 403/404 → 200 for
> AWS). See [`DEPLOY.md`](./DEPLOY.md).

---

## Step 2 · Connect repo to Vercel

1. Sign in at <https://vercel.com/> with your GitHub account.
2. **Add New → Project** → select the LuckyPool repo → **Import**.
3. Vercel auto-detects:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. (If LuckyPool is still inside `ai-playground` as a subfolder, set
   **Root Directory** = `luckypool` here. If you've moved it to its own
   repo, leave the root as `/`.)
5. **Deploy.**

90 seconds later, Vercel gives you a URL like
`https://luckypool-abc123.vercel.app`. Open it; verify the home page
renders, then navigate to `/play`, `/leaderboard`, refresh once on each.
If a refresh on `/play` returns 404 you've forgotten Step 1.

---

## Step 3 · Add the custom domain

In the Vercel project:

1. **Settings → Domains → Add**.
2. Type `luckypool.com` (or whatever you bought). Click **Add**.
3. Add `www.luckypool.com` too if you want both (Vercel will offer to
   redirect one to the other).
4. Vercel shows you the DNS records you need to set at your registrar.

There are two flavors depending on whether you're pointing the **apex**
(`luckypool.com`) or a **subdomain** (`www.luckypool.com`):

| Record type | Host | Value | TTL |
| --- | --- | --- | --- |
| `A` (apex) | `@` | `76.76.21.21` | 3600 |
| `CNAME` (www) | `www` | `cname.vercel-dns.com.` | 3600 |

(Vercel may show different IPs / hostnames for your specific account —
**always use the values shown in the Vercel UI**.)

If your registrar is **Cloudflare**, set the records to "DNS only"
(grey cloud) — proxying through Cloudflare's orange cloud breaks the
Vercel domain validation flow. After the cert is issued you can flip it
back if you want.

---

## Step 4 · Wait for DNS + cert

Vercel polls DNS automatically. Typical timeline:

| Phase | Typical | Worst case |
| --- | --- | --- |
| DNS propagation | < 5 min | 1 hr (occasionally 24 hr) |
| Let's Encrypt cert issuance | < 60 sec after DNS resolves | 5 min |

You'll see green check marks next to each domain in **Settings → Domains**.
Once green, open `https://luckypool.com` — the cert padlock should be valid
and the site should load.

If you're impatient, `dig luckypool.com +short` from a terminal returns
the resolved IP — when that matches Vercel's value, propagation is done.

---

## Step 5 · Smoke test the live site

Run through this list against the production URL (not the `*.vercel.app`
preview):

- [ ] **Home (`/`)** loads, hero renders, three discipline cards visible with rack SVGs, no console errors.
- [ ] **Refresh on `/play`** — Quickfire game loads (does not 404).
- [ ] **Refresh on `/leaderboard`** — Leaderboard loads with all six tabs (Overall / 8-Ball / 9-Ball / Snooker / **World** with sub-tabs / Quickfire).
- [ ] **`/tournaments`** filters work.
- [ ] **`/matches/:id`** live scoring works end-to-end (score doesn't go past raceTo, LIVE → Final flips at raceTo, gold winner styling).
- [ ] **`/builder`** creates a tournament and renders a bracket.
- [ ] **HTTPS padlock** is valid; clicking it shows a Let's Encrypt cert.
- [ ] **`http://luckypool.com`** redirects to `https://`.
- [ ] **Mobile** (Chrome DevTools → iPhone 14 Pro): no horizontal scroll, nav collapses, cards stack.
- [ ] **Lighthouse** (DevTools → Lighthouse → Performance + Best Practices + Accessibility + SEO) score ≥ 90 on all four. Bundle is ~94 kB gzipped JS so this should pass comfortably.

---

## Step 6 · Post-launch

Things to add once the site is live but before you start sharing the URL widely:

### Analytics (pick one)

- **Plausible** — privacy-friendly, GDPR by default, $9/mo. One `<script>` tag.
- **Fathom** — similar trade-offs.
- **Vercel Analytics** — free for hobby projects, native to your host.
- **GA4** — free, but heavier and ad-tracked.

Add the script in `index.html` `<head>`. Skip GA4 unless you specifically need its event funnel features.

### Error monitoring

```bash
npm install --save @sentry/react
```

In `src/main.tsx`:

```ts
import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

Add `VITE_SENTRY_DSN` as an environment variable in **Vercel → Settings →
Environment Variables**, scoped to **Production** only. Sentry's free
tier (5k events/mo) is fine for a launch.

### Security headers

In `vercel.json`, add:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';"
        }
      ]
    }
  ]
}
```

If you add Sentry / Plausible later, extend `script-src` and
`connect-src` to allow their domains.

### Status page (optional)

For a demo-tier site, skip it. Once you have paying tournament directors,
add a free-tier UptimeRobot or Better Stack monitor pinging
`https://luckypool.com` every 5 minutes.

### CI on `main`

Add `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

Block PR merging on this check via repo **Settings → Branches → Branch protection rule**.

---

## Step 7 · Going live with a *new* brand

If you registered a domain for a different name (e.g. `angelbilliards.com`)
but the codebase still says `LuckyPool`, **rebrand first, deploy second**.
Otherwise the site will say `LuckyPool` while sitting at `angelbilliards.com`,
which confuses every visitor.

Full rebrand recipe lives in
[`CONTRIBUTING.md` § Renaming the brand](./CONTRIBUTING.md#renaming-the-brand-luckypool--something-else).

The 60-second version:

```bash
git checkout -b rename/angelbilliards
# Display name
git ls-files -z '*.tsx' '*.ts' '*.html' '*.md' '*.json' \
  | xargs -0 sed -i 's/LuckyPool/AngelBilliards/g'
# Slug (skipping localStorage keys)
git ls-files -z '*.tsx' '*.ts' '*.html' '*.md' '*.json' \
  | xargs -0 sed -i '/luckypool\.\(tournaments\|matches\|quickfire\)\.v1/!s/luckypool/angelbilliards/g'
# Verify
git grep -nE 'LuckyPool|luckypool' \
  | grep -v 'luckypool\.\(tournaments\|matches\|quickfire\)\.v1'
# Should print nothing.
git add -A && git commit -m "chore: rename LuckyPool → AngelBilliards"
git push -u origin rename/angelbilliards
```

Merge that PR before pointing the domain.

---

## Step 8 · Day-2 operations

Once live, the loop is:

1. Open a feature branch, push commits, open PR.
2. Vercel posts a unique preview URL per PR — share it for review.
3. Reviewer pokes the preview, leaves comments, you push fixes.
4. Merge to `main`. Vercel auto-redeploys production within ~90 seconds.
5. Smoke-test the production URL (the same checklist from Step 5 — at
   minimum, deep-link to `/play` and refresh once).

If a deploy ever breaks production:

- **Vercel → Deployments → previous successful deploy → ⋯ → Promote to Production**. One click, ~5 second rollback.
- Then open a fix PR for the regression.

That's it — you're live.

---

## Cost expectations

For a static SPA with personal-scale traffic (< 100k req/mo, < 100 GB bandwidth/mo):

| Item | Cost |
| --- | --- |
| Domain | $10–15 / year |
| Vercel Hobby (production + previews) | **$0** |
| Vercel Pro (if you need analytics, longer build times, team) | $20 / month |
| Sentry free tier | **$0** |
| Plausible | $9 / month (skip if Vercel Analytics is enough) |
| **Total** | $0–30/month + $12/year |

Once you outgrow Vercel free (≥ 100k req/day, or you need server-side
rendering / cron jobs), the natural progression is **Vercel Pro** or move
the API tier to Fly.io / Render and keep the static front-end on
Cloudflare Pages (which has no bandwidth limit).
