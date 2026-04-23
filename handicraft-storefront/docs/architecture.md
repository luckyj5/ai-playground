# Kalakar Bazaar — architecture &amp; production path

This demo is a single-page React app with everything stored in `localStorage`
so it runs in the browser with zero backend. This doc sketches what to swap
in when moving from demo to production.

## Demo build (what’s shipped here)

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React 19)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │ Catalog  │  │   Cart   │  │  Orders  │  │
│  │  Context │  │ Context  │  │ Context  │  │ Context  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       └─────────────┴───── localStorage ────────┘        │
│                                                          │
│  Pages: Home · Shop · PDP · Cart · Checkout · Orders    │
│         Sell · SellNew (photo→listing) · Profile · etc. │
└─────────────────────────────────────────────────────────┘
```

- Stateless deploy — any static host (Netlify / Vercel / S3+CloudFront).
- `src/lib/aiListing.ts` is a deterministic stub that mimics vision-LLM
  output. Swap it for a real call (see below) without touching UI code.
- `src/lib/seed.ts` supplies six inline SVG "photos" so the demo is
  self-contained — no image CDN needed.

## Recommended production stack

| Concern | Demo | Production |
|---|---|---|
| Frontend | Vite + React 19 + Tailwind | Same, or Next.js for SEO on PDPs + marketing pages |
| Hosting | Static S3/Netlify | Vercel / AWS Amplify / CloudFront |
| Backend API | none (browser) | Node/Fastify or Python/FastAPI on Fly.io / Render / ECS |
| Database | localStorage | Postgres (Supabase / Neon / RDS) |
| Auth | local session | Auth.js (email OTP, Google, Apple) or WhatsApp OTP via MSG91 |
| Image storage | data URLs | S3 / Cloudflare R2 + image resize via Cloudflare Images or Imgix |
| Vision listing | deterministic stub | OpenAI `gpt-4o` or Google `gemini-2.0-flash` with the photo + a JSON schema |
| Payments | simulated | **Razorpay** primary, Stripe fallback for cross-border |
| Shipping | flat ₹99 free>₹1500 | Shiprocket / Delhivery API for live rates + AWB |
| Tax | flat 5% GST | Compute per-SKU HSN from Clear / IndiaGST |
| Returns | status machine | Pickup via Shiprocket Reverse, refund via Razorpay Refunds API |
| Transactional messaging | — | MSG91 (WhatsApp + SMS) + Resend (email) |
| Analytics | — | PostHog (product) + GA4 (marketing) |
| Error / perf | — | Sentry + Vercel Speed Insights |

## Vision-LLM listing integration

Swap `suggestListing(imageDataUrl)` in `src/lib/aiListing.ts` with a real call:

```ts
// server-side route, e.g. POST /api/listing-from-image
export async function POST(req: Request) {
  const { imageUrl } = await req.json()

  const body = {
    model: 'gpt-4o',
    response_format: { type: 'json_schema', json_schema: listingSchema },
    messages: [
      {
        role: 'system',
        content:
          'You are a product cataloguer for an Indian handicraft storefront. ' +
          'Given one photo, identify the craft tradition, suggest a title, ' +
          'description, origin cluster, a fair price band in INR, and 5 SEO tags.',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Draft a listing for this product.' },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  })
  return Response.json(await res.json())
}
```

The client only needs to change the call site — the `ListingSuggestion` type
is the contract.

## Payments — Razorpay integration outline

1. Create a Razorpay account, get `key_id` / `key_secret`, enable UPI, cards
   and netbanking.
2. Server: expose `POST /api/payments/create-order` — call
   `razorpay.orders.create({ amount, currency: 'INR' })` and return the
   order ID.
3. Client: open Razorpay Checkout with that order ID; on success, call
   `POST /api/payments/verify` which verifies the HMAC signature server-side
   and flips the order status from `pending_payment` to `placed`.
4. Webhook: subscribe to `payment.captured` and `payment.failed` for
   reconciliation.
5. Refunds: `POST /api/payments/refund` calls `razorpay.payments.refund()`;
   plug into the return-completed event.

## Shipping &amp; returns — Shiprocket outline

- On `placed → packed`, call Shiprocket `orders/create` to generate an AWB.
- Webhook `shipment/awb-generated` updates tracking on the order page.
- On `return_requested`, call `orders/create-reverse` for pickup.
- On pickup-delivered + QC pass, trigger Razorpay refund.

## Data model (Postgres)

```
users (id, email, phone, name, is_seller, created_at)
addresses (id, user_id, name, phone, line1, line2, city, state, pincode)
products (
  id, seller_id, name, description, story,
  category, tradition, origin, artisan,
  price_minor, mrp_minor, stock, is_published,
  created_at, updated_at
)
product_images (id, product_id, url, is_primary, sort)
orders (
  id, buyer_id, status, subtotal_minor, shipping_minor, tax_minor, total_minor,
  shipping_address_id, payment_method, razorpay_order_id, created_at
)
order_lines (id, order_id, product_id, qty, unit_price_minor, line_total_minor)
order_status_events (id, order_id, status, note, at)
returns (id, order_id, reason, state, refund_amount_minor, created_at)
```

## Rollout plan

1. **Week 1–2.** Stand up backend + Postgres; migrate contexts to API calls
   behind the same hook names (zero UI churn).
2. **Week 2–3.** Wire Razorpay + Shiprocket + MSG91.
3. **Week 3–4.** Ship real vision-LLM drafting; add moderation queue for
   new listings (human-in-the-loop for first 30 days).
4. **Week 4–6.** SEO overhaul — migrate to Next.js, add per-tradition
   landing pages, structured data for product schema.
5. **Week 6+.** Loyalty / gift cards / wedding concierge.
