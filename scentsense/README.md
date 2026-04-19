# ScentSense AI

> **Never smell wrong again.** AI-powered fragrance recommendations for every moment — occasion, weather, and vibe in, two or three scent picks out.

A production-ready fragrance recommendation web app. Premium minimal UI, LLM-abstracted reasoning layer (OpenAI / Anthropic / mock), rule-based pre-filter so the model only picks real products, and a multi-retailer buy panel (Amazon + Sephora + decant + FragranceNet) with affiliate-ready link construction. Ships with a waitlist for a future 1:1 concierge consultation service.

Live pilot: deployed via Vercel.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a custom luxury palette
- **LLM abstraction** (`src/lib/llm.ts`) — OpenAI & Anthropic adapters behind a single `getRecommendations()` entry point, plus a deterministic fallback
- **Rule-based filter** (`src/lib/rules.ts`) ranks a curated fragrance dataset against the user's context before the model ever sees it
- **Multi-retailer buy links** (`src/lib/buyLinks.ts`) — Amazon / Sephora / FragranceNet / The Perfumed Court (decants). Niche scents lead with decants, designer scents lead with Amazon
- **Subscriber capture** — JSON file in local dev, in-memory + optional webhook on Vercel
- Dark mode, localStorage-persisted preferences, share button, analytics hook, concierge-pick badges + waitlist tile

---

## Folder structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, theme bootstrap, SEO
│   │   ├── page.tsx                # Landing page
│   │   ├── recommend/page.tsx      # 5-step recommendation flow
│   │   ├── privacy/page.tsx        # Privacy policy (pilot template)
│   │   ├── terms/page.tsx          # Terms of service (pilot template)
│   │   ├── globals.css
│   │   └── api/
│   │       ├── recommend/route.ts  # POST /api/recommend
│   │       └── subscribe/route.ts  # POST /api/subscribe
│   ├── components/                 # Hero, Flow, Results, BuyPanel, ConciergeWaitlist, ...
│   ├── lib/
│   │   ├── llm.ts                  # Provider-agnostic LLM client + fallback
│   │   ├── buyLinks.ts             # Multi-retailer affiliate link builder
│   │   ├── prompt.ts               # System + user prompt templates
│   │   ├── rules.ts                # Rule-based pre-filter
│   │   ├── storage.ts              # JSON-backed subscriber store w/ serverless fallback
│   │   ├── analytics.ts            # track() hook
│   │   └── types.ts
│   └── data/
│       └── fragrances.json         # Curated dataset (concierge_note optional per item)
├── .env.example
└── package.json
```

---

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `LLM_PROVIDER` | yes | `openai` \| `anthropic` \| `mock`. Defaults to `mock` — zero-config pilot. |
| `OPENAI_API_KEY` | when provider=openai | OpenAI API key. |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini`. |
| `ANTHROPIC_API_KEY` | when provider=anthropic | Anthropic API key. |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-3-5-sonnet-latest`. |
| `NEXT_PUBLIC_AMAZON_TAG` | no | Amazon Associates tag appended to Amazon links. Default `scentsense-20`. |
| `NEXT_PUBLIC_SEPHORA_REF` | no | Sephora referrer param. |
| `NEXT_PUBLIC_DECANT_REF` | no | Affiliate/referrer param for FragranceNet and The Perfumed Court. |
| `SUBSCRIBERS_FILE` | no | Custom path for the email JSON store (local dev). |
| `SUBSCRIBE_WEBHOOK_URL` | no | If set, subscribe events POST to this webhook (Zapier / make.com catch-hook / your backend). |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | no | Plausible domain for analytics beacons. |

The app works out of the box with `LLM_PROVIDER=mock` — perfect for the pilot. Swap to `openai` or `anthropic` for real reasoning.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Start the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## Deploy to Vercel (pilot)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → Import `luckyj5/scentsense-ai`.
3. Framework preset: **Next.js** (auto-detected). Root directory: leave default.
4. Add env vars under **Project Settings → Environment Variables**:
   - `LLM_PROVIDER=mock` (keep mock for pilot)
   - (optional) `NEXT_PUBLIC_AMAZON_TAG=your-amazon-tag`
   - (optional) `SUBSCRIBE_WEBHOOK_URL=https://hooks.zapier.com/...`
5. Click **Deploy**. You'll get a URL like `scentsense-ai.vercel.app` in ~90 seconds.

Every future PR auto-generates a preview URL. Every push to `main` auto-deploys production.

### Email capture on Vercel
The JSON store won't persist on Vercel's serverless filesystem, so `storage.ts` automatically switches to in-memory + `console.log` + optional webhook. For the pilot:

- **Easiest**: create a [Zapier Catch Hook](https://zapier.com/app/editor/templates/catch-hook), paste its URL into `SUBSCRIBE_WEBHOOK_URL`, and route to a Google Sheet or Airtable.
- **Cleaner**: wire Vercel KV / Neon Postgres (isolated behind `storage.ts` so it's a ~30-minute swap).

---

## Architecture notes

### Why rule-based filter + LLM
Raw LLMs hallucinate fragrance names and notes. Every request first runs through `rankFragrances()` which scores the curated dataset against the user's occasion / mood / weather / intensity / gender, and sends the **top 8** to the LLM. The model's only job is to pick 2–3 and explain the emotional fit.

### LLM abstraction
`getRecommendations()` in `src/lib/llm.ts` is the only function the API route calls. Adding Gemini, Mistral, or a local Ollama is one new function + a branch in `getProvider()`.

### Fallback logic
- Any thrown error from the provider path → deterministic fallback used → `meta.usedFallback = true` surfaced in the UI with a graceful notice
- Invalid / mis-shaped JSON → same fallback path
- Missing API key → same fallback path

### Concierge picks
Fragrances can carry an optional `concierge_note` + `concierge_by` field. When present, the results card shows a "Concierge pick" badge and a pull-quote from the concierge. This is how our friend's 300-bottle expertise lives inside the AI product without needing live calls.

### Concierge waitlist
Below every results card we show a "Want a human take?" tile that captures email with `source: "concierge-waitlist"`. This gives us demand signal for a phase-2 1:1 call product without building booking infrastructure yet.

---

## Sample test inputs

```bash
curl -sX POST http://localhost:3000/api/recommend \
  -H 'content-type: application/json' \
  -d '{"occasion":"date","weather":"cold","mood":"confident","intensity":"strong","gender":"unisex"}' | jq
```

```bash
curl -sX POST http://localhost:3000/api/subscribe \
  -H 'content-type: application/json' \
  -d '{"email":"pilot@example.com","source":"waitlist"}' | jq
```

---

## Roadmap

- **v1 (pilot, this repo)**: AI recommendations + multi-retailer buy panel + concierge waitlist + mock LLM
- **v2**: Real LLM (OpenAI/Anthropic) behind a feature flag, expanded dataset (~80 fragrances), Plausible analytics
- **v3**: 1:1 concierge call booking (Calendly + Stripe), paid "full fragrance wardrobe" reports
- **v4**: Personalized scent wardrobe (multi-context picks saved per user)

---

## License

MIT. See [LICENSE](./LICENSE).
