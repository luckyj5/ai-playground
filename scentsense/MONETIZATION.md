# Monetization & Business Plan — ScentSense

> Reference doc. Not user-facing. Covers how the product makes money, what
> to build when, the unit economics at different scales, and the moat vs
> ChatGPT / Google.

---

## TL;DR

- Pilot phase (now): **affiliate revenue only**. Zero new product work.
- 1k–10k users: layer in a **weekly newsletter** with affiliate links + a **paid AI report** ($19 one-off).
- 10k+ users: validate **concierge consultation calls** ($49–99) and a **decant subscription box** ($25/mo).
- Total infra cost stays under ~$25/mo until ~10k MAU. **The infra is not the bottleneck — distribution and rec quality are.**

---

## Revenue streams (ranked by build effort)

### 1. Affiliate links (live today, $0 work)

Already wired in `src/lib/buyLinks.ts`. Per-retailer affiliate IDs via env vars:

- `NEXT_PUBLIC_AMAZON_TAG` → Amazon Associates (~4–8% of sale)
- `NEXT_PUBLIC_SEPHORA_REF` → Sephora via Rakuten (~4–6%)
- `NEXT_PUBLIC_DECANT_REF` → The Perfumed Court / FragranceNet (10–20%; decant sites tend to be most generous)

Niche/luxury picks lead with **decants** as the primary CTA (people don't blind-buy a $300 Baccarat Rouge — they buy a 5ml decant first, then graduate to the bottle weeks later if they like it). Designer picks lead with **Amazon** (lowest friction, fastest delivery).

**Rough conversion math (back-of-napkin, validated against affiliate-marketing community averages for fragrance):**

| Stage | Conversion | 100 visitors → |
|---|---|---|
| Visit → start flow | 30–50% | 30–50 |
| Start → finish flow | 60–80% | 18–40 |
| Finish → click any Buy CTA | 20–40% | 4–16 |
| Click → actually purchase | 2–5% | 0.1–0.8 |

**At 100 visitors, expect $5–40 in affiliate revenue.** This scales linearly. 1,000 visitors ≈ $50–400. 10,000 visitors ≈ $500–4,000.

The lever that matters most is **rec quality** (do people actually want to buy what we suggest?), not traffic. Better recs lift the click→buy step by 2–3x.

### 2. Email newsletter ("Scent of the Week")

Build once you have 500+ waitlist signups. Free / cheap email tools:

- **Loops.so** — free up to 1,000 contacts; built for product email
- **Beehiiv** — free up to 2,500 contacts; built for newsletters
- **Resend audiences** — pure dev tool; need to build the editor yourself

Format: 1 email/week, 1 themed scent (e.g. "Fall Date Night Picks"), 3 fragrances + buy links. Each email has 3–5 affiliate links.

**Expected revenue:** a 1k-list newsletter with a 30% open rate and 2% buy-conversion on opens earns ~$50–150/week. Most reliable revenue per user once the list exists.

### 3. Premium AI report ($19 one-time)

"Your Fragrance Personality" — a paid, generated PDF deep-dive. Inputs go beyond the 5-step pilot flow (style preferences, lifestyle, Q&A). Output: 12-page PDF with personality archetype + 10 picks across budgets + signature scent recommendation.

Unlock with **Stripe Checkout**. Generate the PDF on-the-fly with Puppeteer or react-pdf.

**Build time:** ~3 days. Defer until you have a steady stream of finished-flow users (signal = high finish rate on the free 5-step flow).

### 4. Concierge consultation ($49–99 per call)

The waitlist tile on the results page is already capturing demand. Once it has 50+ submissions, validate by emailing those people and offering a paid 30-min Zoom + a written follow-up PDF.

Productize your friend's expertise. He picks 5–8 fragrances tailored to the user's life + sends a written rationale. The user can then click through affiliate links to decant the picks (double dip on revenue).

**Pricing tiers to A/B test:** $49 / $79 / $99. Likely sweet spot is $49 for a single 30-min session, $99 for a 60-min "season pass" (consultation + follow-ups for 30 days).

**Build time:** Calendly + Stripe = a weekend.

### 5. Decant subscription box ($25/mo)

Phase 3, only if everything above is working.

Three 5ml decants/month, matched to the user's profile (built up over their interactions). Highest LTV per customer (~$300/year) but real ops: inventory, shipping, regulatory (alcohol shipping has weird state-by-state rules in the US).

**Don't build until you have 100+ paying concierge customers** — that's the audience that's already shown willingness to pay for fragrance curation.

---

## Unit economics

### Cost projection at different scales

| Scale | Vercel | LLM (real, OpenAI) | PostHog | Storage | **Total/mo** |
|---|---|---|---|---|---|
| 0–1k MAU (pilot) | $0 (Hobby) | $0 (mock) | $0 | $0 (Sheets) | **$0** |
| 1k–10k MAU | $20 (Pro)* | $5–25 | $0 | $0 | **~$25–45** |
| 10k–50k MAU | $20–40 | $50–250 | $0 | $0–25 | **~$70–315** |
| 100k+ MAU | $50–150 | $300–1,200 | $20–80 | $25 | **~$400–1,450** |

\* **Vercel Hobby tier is non-commercial use only.** Once affiliate revenue is being earned, you must move to Pro at $20/mo.

### Revenue projections (gut-feel pilot math)

| Scale | Affiliate (low) | Affiliate (high) | Newsletter | Concierge (10% conv.) | **Total revenue (mid)/mo** |
|---|---|---|---|---|---|
| 1k MAU | $50 | $400 | $0 (no list) | $0 | **~$200** |
| 10k MAU | $500 | $4,000 | $200–500 (1k list) | $250 (5 calls × $49) | **~$2,500** |
| 100k MAU | $5,000 | $40,000 | $2,000–5,000 (10k list) | $5,000 (50 calls × $99) | **~$25,000** |

So: **the cost line stays well under 5% of revenue** at every scale. Infra is a rounding error vs. the work of getting users + improving rec quality.

### When to upgrade Vercel

Move to **Pro ($20/mo)** as soon as:
- Any affiliate dollar shows up (ToS requirement — Hobby is non-commercial), OR
- You hit 80% of any Hobby limit (typically bandwidth on a viral day)

Move to **Enterprise** (call sales) only at 1M+ MAU. Most realistic path is to never need it — at that scale you'd self-host the LLM-heavy paths on a $40/mo VPS to cut cost.

---

## Recommendation logic (the "how it works")

ScentSense doesn't trust the LLM blindly. Two-stage pipeline:

### Stage 1: Rule-based pre-filter (`src/lib/rules.ts`)

Scores every fragrance in the curated dataset against the user's context:

- `+3` if fragrance's `occasions` array includes the user's occasion
- `+3` if `moods` includes the user's mood
- `+2` if `weather` includes the user's weather
- `+2` for exact intensity match, `+1` for adjacent (light↔moderate, moderate↔strong)
- `+2` for exact gender match, `+1` for unisex fallback, `–2` for clear mismatch
- `–1` penalty for hot weather + heavy intensity, or cold weather + light intensity

Top 8 by score advance to Stage 2.

### Stage 2: LLM picks 2–3 from the shortlist (`src/lib/llm.ts`)

The LLM (OpenAI / Anthropic / mock) sees only those 8 fragrances + the user's context. It cannot invent fragrances — it can only reorder + write rationales. Fallback: if the LLM call fails, return the rule-scorer's top 3 with a deterministic templated rationale. The user never sees an error.

### Why curated, not "live"

The dataset has **20 fragrances today** (designer + niche + concierge picks). It will grow to 60–100 over the next few weeks. Why not 50,000 (the full universe)?

1. **No hallucinations.** Every output is a real product.
2. **Working buy links.** Every entry has a verified affiliate URL on Amazon, Sephora, and decant sites.
3. **Quality control.** Every entry is checked for accurate notes, longevity, sillage, and price tier — the data the rec engine reasons over.
4. **Editorial voice.** The dataset can carry concierge notes, "best for date night" tags, etc. — content layers a live API can't provide.

This is the same play Wirecutter, The Strategist, and Sephora Editor's Picks make. Curated > comprehensive when the goal is purchase intent.

---

## Moat vs. ChatGPT / Google

The honest answer: **ChatGPT can match ScentSense's recommendations if you prompt it well.** Most users won't.

|  | ChatGPT / Claude | Google search | ScentSense |
|---|---|---|---|
| Will it invent fake fragrances? | Sometimes | No (just bad results) | Never |
| Time to a confident pick | 30s of prompt-craft | 5+ tabs of reading | 5 taps, ~10s |
| Mobile UX | Chat box | Dense SERP | Native |
| Buy buttons | None | Maybe a card | One-click to 4 retailers |
| Decant suggestion (try before $300) | Won't think to | Won't | Default for niche picks |
| Curated by a human expert | No | No (random Reddit) | Yes (concierge picks) |
| Repeat visits / habit | Low | Low | Higher (waitlist, newsletter) |

The defensible moat is **not pure intelligence** — LLMs commoditize that. The moat is:

1. **Brand + repeat usage.** "I always check ScentSense before buying a perfume." Habit, not search.
2. **Email list / newsletter.** Owned audience, not platform-dependent.
3. **Physical product.** A decant subscription is not duplicable by an LLM.
4. **Concierge layer.** Human curation as paid premium.

ChatGPT is the long-term threat. The defense is to layer on what an LLM can't do: physical goods, owned audience, expert relationships.

---

## What I'd build next, in order

1. **Wire analytics** (PostHog free tier) so we can measure the conversion funnel above with real numbers, not gut feel.
2. **Wire waitlist DB** (Google Sheet via Apps Script) so signups are durable.
3. **Apply for Amazon Associates + Sephora/Rakuten** affiliate programs. Replace the placeholder env vars with real IDs.
4. **Expand the dataset to ~60 fragrances.** Half-day. Keeps niche + decant-friendly bias.
5. **Launch to 50–100 friends.** Watch the funnel.
6. **First newsletter.** Once 100+ signups, send a weekly themed pick.
7. **Premium AI report ($19).** Build once finish-rate on the free flow proves intent.
8. **Concierge calls.** Email the waitlist signups, offer a $49 session.
9. **Decant subscription.** Only after concierge proves willingness to pay for curation.

Don't skip ahead. Each step de-risks the next.
