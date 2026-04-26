# LuckyPool — Deployment Guide

LuckyPool is a 100% static **Vite + React SPA**. `npm run build` produces a
self-contained `dist/` folder (HTML, JS, CSS, SVG). There is no backend
today — all state lives in the browser's `localStorage` — so deploying is
just "host these files behind HTTPS with one rewrite rule for client-side
routing".

This guide covers:

1. [Should LuckyPool live in its own repo?](#1-should-luckypool-live-in-its-own-repo)
2. [Build basics & the SPA-routing fallback](#2-build-basics--the-spa-routing-fallback)
3. [Vercel — recommended, zero-config](#3-vercel--recommended-zero-config)
4. [Netlify](#4-netlify)
5. [Cloudflare Pages](#5-cloudflare-pages)
6. [GitHub Pages](#6-github-pages)
7. [AWS S3 + CloudFront](#7-aws-s3--cloudfront)
8. [Docker + Nginx (any VPS, Fly, Render, Railway, DigitalOcean App Platform…)](#8-docker--nginx-any-vps-fly-render-railway-do-app-platform)
9. [Custom domain & HTTPS](#9-custom-domain--https)
10. [Production hardening checklist](#10-production-hardening-checklist)
11. [Backend readiness — what to plan for next](#11-backend-readiness--what-to-plan-for-next)
12. [Renaming the brand before deploy](#12-renaming-the-brand-before-deploy)

> **See also:** [`GO_LIVE.md`](./GO_LIVE.md) is the focused 10-minute walkthrough from "I just bought a domain" to a live HTTPS site on Vercel. [`CONTRIBUTING.md`](./CONTRIBUTING.md) has the full dev workflow + rebrand recipe.

---

## 1. Should LuckyPool live in its own repo?

**Recommendation: yes, move it to its own repo (`luckyj5/luckypool`).**

| Concern | Subfolder of `ai-playground` | Own repo |
| --- | --- | --- |
| Vercel / Netlify / Cloudflare "Connect repo" flow | Works, but you must set **Root Directory** = `luckypool` and override the build command | Zero-config, one click |
| Preview deploy per PR | Triggers on every PR in the parent repo (noisy) | Triggers only on LuckyPool PRs |
| CI scope | Has to be scoped manually with path filters | Naturally scoped |
| Public URL / discoverability | `github.com/luckyj5/ai-playground/tree/main/luckypool` | `github.com/luckyj5/luckypool` |
| Issue tracker / releases | Mixed with other projects | Project-specific |

If you keep it as a subfolder, every section below still works — you just
have to set the deploy provider's "Root Directory" / "Base Directory" to
`luckypool`. All the config snippets below assume the repo root **is** the
LuckyPool app; if it's a subfolder, prefix the paths accordingly.

### How to migrate to its own repo (preserves history)

After PR #4 is merged to `main`, on a fresh clone of `ai-playground`:

```bash
# 1. Extract just the luckypool subtree onto a new branch
git checkout main
git pull
git subtree split --prefix=luckypool -b luckypool-only

# 2. Create the new empty repo on GitHub
#    (or use the GitHub UI: New repo → name "luckypool" → empty, no readme)
gh repo create luckyj5/luckypool --public --description "Cue-sports tournament platform — 8-ball, 9-ball, snooker"

# 3. Push the extracted branch as the new main
git push https://github.com/luckyj5/luckypool.git luckypool-only:main

# 4. (Optional) clone the new repo and verify
git clone https://github.com/luckyj5/luckypool.git
cd luckypool && npm install && npm run dev
```

That's it — full history of every commit that touched `luckypool/` is
preserved. The original `ai-playground/luckypool/` subfolder can stay (as
a snapshot) or be deleted in a follow-up PR.

If you prefer a cleaner, smaller history use [`git filter-repo`](https://github.com/newren/git-filter-repo)
instead of `subtree split` — both work, `filter-repo` is faster on large repos.

---

## 2. Build basics & the SPA-routing fallback

### Build

```bash
npm install     # Node 20.x LTS recommended (anything ≥ 18 works)
npm run build   # → dist/
npm run preview # serves dist/ locally on http://localhost:4173 to sanity-check
```

`dist/` is fully self-contained — you can `scp` it to any static host.

### The one critical rewrite rule

LuckyPool uses `react-router-dom`, so URLs like `/play` and `/leaderboard`
exist on the client only. When a user opens `https://luckypool.com/play`
directly (or hits refresh on it), the server must serve `index.html` with
HTTP 200 (not 404), and the client router takes over.

**Every section below shows the provider's specific config for this.** If
you skip it, deep links and refreshes will return 404.

### Recommended environment / Node version

```
node ≥ 20.10
npm ≥ 10
```

Pin this in CI / deploy provider settings to avoid build drift.

---

## 3. Vercel — recommended, zero-config

Best path for a personal / small-team static SPA. Free tier is generous,
preview deploys per PR are first-class, custom domains + HTTPS are
included.

### One-time setup

1. Create a free account at [vercel.com](https://vercel.com/) and link your
   GitHub.
2. Click **Add New → Project**, pick the LuckyPool repo, click **Deploy**.
3. Vercel auto-detects Vite. It will use:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

If LuckyPool stayed as a subfolder of `ai-playground`, set
**Root Directory** = `luckypool` in the project settings.

### Add SPA fallback

Create `vercel.json` at the LuckyPool repo root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Commit, push — Vercel rebuilds automatically. Done.

### After deploy

- Production URL: `https://<project>.vercel.app`
- Every PR gets a unique preview URL (you'll see it in PR comments).
- Add a custom domain under **Settings → Domains** — Vercel auto-provisions
  the cert (Let's Encrypt).

---

## 4. Netlify

Equivalent to Vercel in capability and simplicity.

### One-time setup

1. Sign up at [netlify.com](https://netlify.com/), connect GitHub.
2. **Add new site → Import existing project → GitHub → LuckyPool**.
3. Build settings (Netlify auto-detects most of this):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (leave empty if own repo, or `luckypool` if subfolder)

### Add SPA fallback

Create `public/_redirects` (note: under `public/`, **not** `dist/` — Vite
copies `public/*` into `dist/` at build time):

```
/*    /index.html   200
```

Commit. Netlify rebuilds and serves it.

### Or use `netlify.toml` (alternative, more explicit)

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 5. Cloudflare Pages

Cloudflare's edge network is fast and the free tier is generous (unlimited
bandwidth, unlimited requests). Best for global low-latency.

### One-time setup

1. Sign in to [Cloudflare Dashboard → Workers & Pages → Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages).
2. **Create a project → Connect to Git → LuckyPool**.
3. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (or `luckypool` if subfolder)
   - **Environment variables:** `NODE_VERSION = 20`

### Add SPA fallback

Same `public/_redirects` file as Netlify works:

```
/*  /index.html  200
```

---

## 6. GitHub Pages

Free, no account beyond GitHub, but slightly fiddlier because:

- GH Pages serves the site at `https://<user>.github.io/<repo>/` (a
  subpath, not the domain root). Vite needs to know this so asset URLs
  resolve correctly.
- GH Pages doesn't natively support SPA fallback — you have to ship a
  custom `404.html` that re-runs the router.

### Configure Vite base path

If you're at `luckyj5.github.io/luckypool`, edit `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/luckypool/',
});
```

For a custom domain (e.g. `luckypool.com`), keep `base: '/'`.

### Add a deploy workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: SPA fallback (copy index.html → 404.html)
        run: cp dist/index.html dist/404.html
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

The `cp dist/index.html dist/404.html` step is the SPA-fallback hack: GH
Pages serves `404.html` for any unknown path, and since it's actually
`index.html`, the React Router boots and renders the correct route.

Then in repo **Settings → Pages**, set **Source** = "GitHub Actions".

---

## 7. AWS S3 + CloudFront

Production-grade if you already live in AWS or want full control.

### Architecture

- **S3 bucket** holds `dist/`.
- **CloudFront distribution** sits in front for HTTPS + global edge cache.
- **Route 53** (optional) for DNS.
- **ACM certificate** in `us-east-1` for HTTPS on a custom domain.

### Step 1 — create the bucket

```bash
aws s3 mb s3://luckypool-prod --region us-east-1
aws s3api put-public-access-block \
  --bucket luckypool-prod \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

(For maximum security, use **Origin Access Control** instead of making
the bucket public — see the AWS docs. Public + CloudFront is simpler to
explain and is fine for a static site.)

### Step 2 — upload the build

```bash
npm run build
aws s3 sync dist/ s3://luckypool-prod/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"
aws s3 cp dist/index.html s3://luckypool-prod/index.html \
  --cache-control "public, max-age=0, must-revalidate"
```

The split caching is important: hashed JS/CSS bundles are immutable so
cache them forever; `index.html` references the latest bundles, so never
cache it.

### Step 3 — enable static website hosting on the bucket

```bash
aws s3 website s3://luckypool-prod/ \
  --index-document index.html \
  --error-document index.html
```

The `--error-document index.html` is the **SPA fallback for S3**: any 404
returns `index.html` so the router can take over.

### Step 4 — bucket policy for public read

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadForGetBucketObjects",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::luckypool-prod/*"
  }]
}
```

Save as `bucket-policy.json` and apply:

```bash
aws s3api put-bucket-policy --bucket luckypool-prod --policy file://bucket-policy.json
```

### Step 5 — CloudFront in front

Create a distribution pointing to the S3 **website endpoint** (not the
REST endpoint), e.g. `luckypool-prod.s3-website-us-east-1.amazonaws.com`.

Critical settings:

- **Default root object:** `index.html`
- **Custom error responses:**
  - 403 → `/index.html` with HTTP 200
  - 404 → `/index.html` with HTTP 200
- **Viewer protocol policy:** Redirect HTTP → HTTPS
- **Compress objects automatically:** Yes
- **Alternate domain (CNAME):** your custom domain (e.g. `luckypool.com`)
- **Custom SSL certificate:** ACM cert (must be issued in `us-east-1`)

### Step 6 — invalidate cache after every deploy

```bash
aws cloudfront create-invalidation \
  --distribution-id E1234567ABCDEF \
  --paths "/index.html"
```

### Wrap it in CI

Add as a GitHub Action triggered on push to `main`. See
`.github/workflows/deploy-aws.yml` example in the AWS docs. Use OIDC for
keyless auth, or store `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` as
encrypted GitHub secrets.

---

## 8. Docker + Nginx (any VPS, Fly, Render, Railway, DO App Platform…)

Use this when:

- You need to ship the same artifact to multiple environments.
- Your hosting is a generic VPS (Hetzner, Linode, EC2, DigitalOcean
  Droplet) where you `docker run` things.
- You want to deploy to platforms like **Fly.io**, **Render**,
  **Railway**, **DigitalOcean App Platform**, **Google Cloud Run**, or
  **AWS App Runner** which all accept a Dockerfile.

### `Dockerfile` (multi-stage, ~25 MB final image)

Save at the LuckyPool repo root:

```dockerfile
# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `nginx.conf` (the SPA fallback for Nginx)

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Long-cache hashed assets
  location ~* \.(js|css|svg|png|jpg|jpeg|webp|ico|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
  }

  # SPA fallback — any unknown path → index.html
  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache, must-revalidate";
  }

  # Gzip
  gzip on;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1024;
}
```

### Build & run locally

```bash
docker build -t luckypool .
docker run --rm -p 8080:80 luckypool
# open http://localhost:8080
```

### Deploy to Fly.io

```bash
fly launch --no-deploy --name luckypool
# Edit fly.toml: set internal_port = 80, force_https = true
fly deploy
```

### Deploy to a generic VPS

```bash
# On the VPS:
docker run -d --name luckypool --restart=unless-stopped -p 80:80 \
  ghcr.io/luckyj5/luckypool:latest

# Or behind Caddy / Traefik for automatic HTTPS:
caddy reverse-proxy --from luckypool.com --to localhost:80
```

### Deploy to DigitalOcean App Platform / Render / Railway

Each of these accepts a Git repo with a Dockerfile and handles building +
deploying + HTTPS. Point them at LuckyPool's repo and they'll find the
`Dockerfile` automatically.

---

## 9. Custom domain & HTTPS

Whichever provider you pick, the flow is essentially:

1. Buy a domain (Namecheap, Cloudflare Registrar, Google Domains, Porkbun).
2. In the provider dashboard, add the domain.
3. Add the DNS records the provider gives you (usually a `CNAME` for the
   subdomain or `A`/`AAAA` for the apex).
4. Wait for DNS propagation (usually < 5 min, can take up to 1h).
5. The provider auto-issues a Let's Encrypt cert.

For AWS, you use **Route 53** + **ACM** (cert must be in `us-east-1`).
For Docker/VPS, use **Caddy** (one-line automatic HTTPS) or **Traefik**.

---

## 10. Production hardening checklist

Before pointing a real domain at this:

- [ ] **Build size sanity:** `dist/` should be < 500 kB gzipped (current
      build is ~94 kB JS gzipped — comfortably small).
- [ ] **Lighthouse:** Run `npx lighthouse https://<your-url> --view`. Aim
      for ≥ 90 on Performance, Accessibility, Best Practices, SEO.
- [ ] **HTTPS-only:** Force HTTP → HTTPS redirect.
- [ ] **HSTS header:** `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- [ ] **CSP header:** A starter CSP for a static SPA:
      `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';`
- [ ] **404 page:** The app's `NotFound` route already covers in-app 404s;
      the SPA fallback ensures direct URL hits also reach it.
- [ ] **Analytics:** Add Plausible / Fathom / GA4 if you want traffic
      data. (Plausible respects DNT and is GDPR-friendly out of the box.)
- [ ] **Error monitoring:** Sentry has a generous free tier; one `init()`
      call in `src/main.tsx`.
- [ ] **CI:** `npm run lint && npm run build` on every PR. Block merge on
      failure.

---

## 11. Backend readiness — what to plan for next

LuckyPool's UI is production-ready, but everything except the static
assets lives in `localStorage` today. When you're ready to put real users
on it:

1. **Auth** — Auth0, Clerk, Supabase Auth, or "magic link" via Resend.
2. **Persistence** — Postgres (Neon, Supabase, RDS) for users,
   tournaments, matches, scores. The current `useTournaments` /
   `useMatches` hooks are deliberately structured as a thin storage
   shim — swap `localStorage` for `fetch('/api/tournaments')` and the
   UI doesn't change.
3. **Real-time live scoring** — Supabase Realtime or a tiny WebSocket
   server (Cloudflare Durable Objects work well for one room per match).
4. **API hosting** — if you go full-stack, the simplest path is a
   single deploy to Vercel/Netlify with serverless API routes, or split
   the front-end (any of the static hosts above) from a Fastify/Hono API
   on Fly/Railway.
5. **Payments / entry fees** — Stripe Checkout. Park until you have your
   first event customer.

When that day comes, none of the deploy targets above need to change —
you just add `VITE_API_URL` as an environment variable and update the
hosts to allow the API origin in the CSP.

---

## 12. Renaming the brand before deploy

If you bought a domain for a different name (`angelbilliards.com` etc.),
rebrand the codebase **before** pointing the domain at the deploy.
Otherwise the site will say `LuckyPool` while sitting at the new URL.

The brand string `LuckyPool` (display) and `luckypool` (slug) live in
~12 files: `package.json`, `index.html`, the favicon, a handful of
components (`Nav`, `Footer`, `Home`, `Venues`, `Players`), some seed
data, and the docs themselves.

The full recipe (one-shot `sed`, verification grep, localStorage migration
notes) is in
[`CONTRIBUTING.md` § Renaming the brand](./CONTRIBUTING.md#renaming-the-brand-luckypool--something-else).
The 60-second version is also inlined into
[`GO_LIVE.md` § Step 7](./GO_LIVE.md#step-7--going-live-with-a-new-brand).

**Critical caveat:** the `localStorage` keys (`luckypool.tournaments.v1`,
`luckypool.matches.v1`, `luckypool.quickfire.v1`) are deliberately *not*
renamed by the recipe. Renaming them wipes any data already stored in
real users' browsers. If your site has live users, ship a one-shot
migration shim that copies old → new and deletes old. If you're still
pre-launch with no real users, just rename them and let the seed data
re-hydrate.
