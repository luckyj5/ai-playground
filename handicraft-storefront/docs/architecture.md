# Ananta Crafts — architecture &amp; production path

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
| Payments | simulated | **Dual rail**: Razorpay (India — UPI/Card/Netbanking/COD) + **Stripe** & **PayPal** (global — Card/Apple Pay/Google Pay/PayPal/SEPA/ACH) |
| Shipping | flat ₹99 free>₹1500 (IN) · ₹2,499 free>₹10,000 (intl) | Shiprocket / Delhivery for India · DHL Express / FedEx International for global · EasyPost or Shippo for unified API |
| Tax | India: 5% GST · Intl: collected on delivery | India: HSN-driven GST via Clear/IndiaGST · Intl: TaxJar / Avalara for VAT/GST destination calc; DDP for high-value via DHL Paperless Trade |
| FX & currency | indicative INR→foreign rates | Stripe FX (lock at PaymentIntent) or Wise Platform; show local currency on PDP via geo-IP |
| Returns | status machine | India: Shiprocket Reverse pickup + Razorpay refund · Intl: store credit by default; physical return via DHL Reverse for high-value; Stripe / PayPal refund |
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

## Payments — dual-rail (India + global)

The checkout picks a payment processor based on the buyer's country (see
`src/lib/regions.ts` — `regionFor(countryCode)`):

```
         country == 'IN'                   country != 'IN'
              │                                  │
         ┌────┴────┐                         ┌────┴─────┐
         │ Razorpay│                         │ Stripe / │
         │  rail   │                         │ PayPal   │
         └───┬────┘                         └────┬────┘
             │                                   │
  UPI · Card · Netbanking · COD          Card · Apple Pay · Google Pay
                                          PayPal · Bank transfer
                                          (SEPA / ACH / SWIFT)
```

### India rail — Razorpay

1. Get `key_id` / `key_secret`, enable UPI, cards, netbanking, COD.
2. Server: `POST /api/payments/in/create-order` →
   `razorpay.orders.create({ amount, currency: 'INR' })`.
3. Client: open Razorpay Checkout; on success call
   `POST /api/payments/in/verify` which HMAC-verifies the signature server-side.
4. Subscribe to `payment.captured` / `payment.failed` webhooks for reconciliation.
5. Refunds: `razorpay.payments.refund()` on return-completed.

### Global rail — Stripe (default) + PayPal

1. Stripe: get `STRIPE_SECRET_KEY`, enable Cards + Apple Pay + Google Pay
   + Klarna + SEPA + ACH in the dashboard.
2. Server: `POST /api/payments/intl/create-payment-intent` calls
   `stripe.paymentIntents.create({ amount, currency, automatic_payment_methods: { enabled: true } })`
   where `amount` is FX-converted from INR using `stripe.exchangeRates` and
   locked for the next 10 minutes. Return `client_secret`.
3. Client: render Stripe Elements / Payment Element; `stripe.confirmPayment`
   handles 3-D Secure / Apple Pay / Google Pay automatically.
4. PayPal: parallel "PayPal" button via PayPal JS SDK; server creates the
   PayPal order with `purchase_units[0].amount = { currency_code, value }`.
5. Webhooks: `payment_intent.succeeded` / `payment_intent.payment_failed`
   from Stripe; `CHECKOUT.ORDER.APPROVED` from PayPal.
6. Refunds: `stripe.refunds.create()` or `paypal.payments.refund()`.
7. Cross-border compliance: enable Stripe Tax for VAT/GST collection (EU,
   UK, AU, CA), DDP via DHL Paperless Trade for items > $200, store the
   commercial invoice with the order.

### Currency & FX

- Canonical price is INR minor units in the DB.
- On checkout the server creates a `PaymentIntent` (or PayPal order) in the
  buyer's local currency at the locked FX rate, and stores both:
  `paid_currency`, `paid_amount_minor`, `fx_rate`, `inr_amount_minor`.
- Refunds reverse in the same `paid_currency`.
- The `currency` field on `Order` in this demo is the placeholder for
  `paid_currency`.

## Shipping &amp; returns

### India
- On `placed → packed`, call Shiprocket `orders/create` to generate an AWB.
- Webhook `shipment/awb-generated` updates tracking on the order page.
- On `return_requested`, call `orders/create-reverse` for pickup.
- On pickup-delivered + QC pass, trigger Razorpay refund.

### Global
- DHL Express MyDHL API or FedEx Web Services for AWB generation +
  customs paperwork. EasyPost / Shippo offer a unified abstraction if
  you want to pick rates across DHL/FedEx/UPS at runtime.
- HS codes: pre-tag every product with an HS code (handicrafts often map
  to chapter 57–71; e.g. textile stoles → 6214). Stripe Tax / Avalara can
  compute destination tax from HS + ship-to country.
- DDU vs DDP: by default duties are collected by the carrier on delivery
  (DDU). For high-value or US-bound orders consider DDP via DHL
  Paperless Trade so duties are pre-paid at checkout.
- Returns from outside India are rare and expensive — default policy is
  store credit; only physical pickup if item value > $250.

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
2. **Week 2–3.** Wire Razorpay + Shiprocket + MSG91 for India.
2a. **Week 2–4 (parallel).** Wire Stripe (Cards + Apple Pay + Google Pay)
    + PayPal + DHL Express for international; turn on Stripe Tax for VAT/GST.
3. **Week 3–4.** Ship real vision-LLM drafting; add moderation queue for
   new listings (human-in-the-loop for first 30 days).
4. **Week 4–6.** SEO overhaul — migrate to Next.js, add per-tradition
   landing pages, structured data for product schema.
5. **Week 6+.** Loyalty / gift cards / wedding concierge.
