# ScentSense AI

> **Never smell wrong again.** AI-powered fragrance recommendations for every moment — occasion, weather, and vibe in, two or three scent picks out.

A production-ready MVP for a fragrance recommendation platform. Premium, minimal UI. LLM-abstracted reasoning layer (OpenAI / Anthropic / mock). Rule-based fragrance pre-filter so the AI only picks from real products. Email capture for waitlist. Vercel-ready.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a custom luxury palette
- **LLM abstraction** (`src/lib/llm.ts`) — OpenAI & Anthropic adapters behind a single `getRecommendations()` entry point, plus a deterministic fallback
- **Rule-based filter** (`src/lib/rules.ts`) that ranks a curated fragrance dataset against the user's context before ever calling the model
- **Lightweight JSON store** for email capture (swap for Postgres before scaling — see `src/lib/storage.ts`)
- Dark mode, localStorage-persisted preferences, share button, affiliate link placeholders, basic analytics hook

---

## Folder structure

```
scentsense-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, theme bootstrap, SEO
│   │   ├── page.tsx                # Landing page
│   │   ├── recommend/page.tsx      # Recommendation flow
│   │   ├── globals.css
│   │   └── api/
│   │       ├── recommend/route.ts  # POST /api/recommend
│   │       └── subscribe/route.ts  # POST /api/subscribe
│   ├── components/                 # Hero, Flow, Results, EmailCapture, ThemeToggle, ...
│   ├── lib/
│   │   ├── llm.ts                  # Provider-agnostic LLM client + fallback
│   │   ├── prompt.ts               # System + user prompt templates
│   │   ├── rules.ts                # Rule-based pre-filter
│   │   ├── storage.ts              # JSON-backed subscriber store
│   │   ├── analytics.ts            # track() hook
│   │   └── types.ts
│   └── data/
│       └── fragrances.json         # Curated dataset of 20 fragrances
├── data/local/                     # Runtime JSON subscribers (gitignored)
├── .env.example
└── package.json
```

---

## Setup

```bash
cd scentsense-ai
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `LLM_PROVIDER` | yes | `openai` \| `anthropic` \| `mock`. Defaults to `mock` for zero-config local dev. |
| `OPENAI_API_KEY` | when provider=openai | OpenAI API key. |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini`. |
| `ANTHROPIC_API_KEY` | when provider=anthropic | Anthropic API key. |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-3-5-sonnet-latest`. |
| `SUBSCRIBERS_FILE` | no | Custom path for the email JSON store. Defaults to `./data/local/subscribers.json`. |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | no | Set to enable analytics beacons (Plausible-style). |

The app works out of the box with `LLM_PROVIDER=mock` — perfect for CI and local design iteration. Swap to `openai` or `anthropic` for real reasoning.

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

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the `scentsense-ai` directory as a new Vercel project — set the **Root Directory** to `scentsense-ai/`.
3. Add the environment variables from `.env.example` under **Project Settings → Environment Variables**.
4. Deploy. Vercel will auto-detect Next.js and the API routes.

> ⚠️ The JSON-backed subscriber store is ephemeral on Vercel's serverless filesystem. Before going live, swap `src/lib/storage.ts` for Postgres / Supabase / Vercel KV (the interface is already isolated to make that a 30-minute change).

---

## Architecture notes

### Why rule-based filter + LLM
Raw LLMs hallucinate fragrance names and notes. Every request first runs through `rankFragrances()` which scores the 20-fragrance dataset against the user's occasion / mood / weather / intensity / gender, and sends the **top 8** to the LLM. The model's only job is to pick 2–3 and explain the emotional fit. This gives us:
- Grounded, real product names
- Explainability — we could log the shortlist for every request
- Cheap fallback — if the LLM fails, `deterministicFallback()` returns the top 3 shortlist entries with templated copy

### LLM abstraction
`getRecommendations()` in `src/lib/llm.ts` is the only function the API route calls. Adding Gemini, Mistral, or a local Ollama is one new function + a branch in `getProvider()`.

### Fallback logic
- Any thrown error from the provider path → caught → deterministic fallback used → `meta.usedFallback = true` surfaced in the UI with a graceful notice
- Invalid / mis-shaped JSON → same fallback path
- Missing API key → same fallback path

---

## Sample prompts

**System prompt** (see `src/lib/prompt.ts`):
> You are ScentSense AI, a world-class fragrance concierge with the sensibility of a luxury perfumer. Your voice is confident, slightly aspirational, human; emotion-driven — you speak to presence, attraction, memory, and mood; never generic, never robotic. Recommend ONLY from the shortlist provided. Explain the **psychological/emotional reason** each pick fits the context. Return strict JSON.

**User prompt example** (abridged):
```
USER CONTEXT
Occasion: date
Weather: cold
Mood / vibe: confident
Intensity preference: strong
Gender preference: any

SHORTLIST (choose 2 or 3 from here, in ranked order of fit):
1. Tom Ford Tobacco Vanille (id: tom-ford-tobacco-vanille)
   Brand: Tom Ford
   Category: oriental-gourmand | Family: oriental, gourmand, spicy
   ...

Return STRICT JSON with this exact shape:
{ "headline": string, "recommendations": [{ "id": string, "whyItWorks": string, "whenToWearIt": string }] }
```

**Example model output** (cold winter date, confident, strong, unisex):
```json
{
  "headline": "For candlelight and a wool collar, wear presence.",
  "recommendations": [
    {
      "id": "tom-ford-tobacco-vanille",
      "whyItWorks": "Warm tobacco and vanilla stay close to skin — close-range magnetism that reads confident without shouting.",
      "whenToWearIt": "Dinner at a candle-lit bar in January."
    },
    {
      "id": "ysl-la-nuit-de-lhomme",
      "whyItWorks": "Cardamom and cedar give a soft-spoken authority that pulls people in instead of announcing itself.",
      "whenToWearIt": "A slow walk home after the second drink."
    }
  ]
}
```

---

## Example test inputs

Try these in the flow to sanity-check the LLM:

| Occasion | Weather | Mood | Intensity | Gender | Expected vibe |
| --- | --- | --- | --- | --- | --- |
| date | cold | confident | strong | any | Tobacco Vanille, La Nuit de L'Homme, Fireplace |
| work | mild | fresh | moderate | masculine | Bleu de Chanel, Terre d'Hermès |
| gym | hot | fresh | light | any | Wood Sage & Sea Salt, Cool Water |
| party | cool | bold | strong | feminine | Mugler Alien, YSL Libre |
| casual | rainy | relaxed | light | unisex | Gypsy Water, Santal 33 |

---

## Roadmap (post-MVP)

- [ ] Swap JSON subscriber store → Postgres / Vercel KV
- [ ] Real affiliate network integration (Amazon Associates / Sephora via Rakuten)
- [ ] User accounts + saved scent wardrobe
- [ ] Upload your current collection → get adjacent picks
- [ ] Evaluate & cache top contexts (e.g. "cold date confident strong") for sub-100ms responses
- [ ] Paid tier: designer-only picks, dupes under $50, full seasonal wardrobe
