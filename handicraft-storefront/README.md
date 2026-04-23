# Ananta Crafts — handicraft storefront (demo)

A snap-and-list handicraft storefront celebrating India's artisan
heritage — block prints, Pattachitra, Madhubani, Dhokra brass, Channapatna
toys, blue pottery, Meenakari.

**Tagline:** *Snap a photo. Launch your craft.*

## What this is

A zero-backend React demo that shows how a modern Indian handicraft site
could work end to end:

- Browse a curated shop filtered by craft tradition, region and price.
- Upload a photo and have the listing (title, story, category, tradition,
  origin, price, tags) auto-drafted for you. Edit and publish.
- Cart, checkout (UPI / Card / Netbanking / COD), order tracking, 7-day
  returns with pickup, and a customer profile with saved addresses.
- All state persists in `localStorage` so the flow feels real without a
  server.

Not production — see [`docs/architecture.md`](docs/architecture.md) for the
path from demo to live.

## Quick start

```bash
cd handicraft-storefront
npm install
npm run dev
```

Opens on [http://localhost:5173](http://localhost:5173).

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the built app |

## Key flows to try

1. **Shop.** `/shop` → filter by category, search "Ajrakh", open a PDP and
   add to cart.
2. **Checkout.** Fill address (pincode must be 6 digits), pick UPI, place
   the order. You’ll land on the order page with a simulated status
   tracker.
3. **Snap-and-list.** `/sell/new` → drag or pick any image. The app drafts
   a listing from the image bytes, you edit anything, hit *Publish*. The
   new product shows up on `/shop` immediately.
4. **Returns.** On a delivered order, start a return with a reason.
5. **Profile.** `/profile` → sign in with name + email, save addresses.

## What the "AI" does in this demo

`src/lib/aiListing.ts` is a deterministic stub: the image bytes are hashed,
and the hash indexes into a curated registry of 16 Indian craft traditions
(Ajrakh, Bandhani, Chikankari, Pattachitra, Pichwai, Warli, Gond, Dhokra,
Channapatna, Blue Pottery, Meenakari, …). Same photo always yields the same
draft.

For production, swap this for a real vision-LLM call (GPT-4o / Gemini /
Claude). The `ListingSuggestion` type is the contract — see
[`docs/architecture.md`](docs/architecture.md).

## How it compares to the incumbents

See [`docs/comparison.md`](docs/comparison.md) for a side-by-side of the
five biggest Indian handicraft sites — Jaypore, iTokri, Okhai, FabIndia and
Amazon Karigar — and where a self-service, image-led listing flow fits.

## File layout

```
handicraft-storefront/
├── docs/
│   ├── comparison.md       # top-5 comparison
│   └── architecture.md     # demo → production path
├── public/favicon.svg
└── src/
    ├── App.tsx             # routes
    ├── main.tsx            # mount + router
    ├── index.css           # Tailwind entry + utilities
    ├── types.ts            # Product / Cart / Order / User
    ├── components/         # Navbar, Footer, ProductCard, ImageUploader
    ├── pages/              # Home, Shop, ProductDetail, Cart, Checkout,
    │                       # Orders, OrderDetail, Sell, SellNew, Profile, Returns
    ├── store/              # Catalog / Cart / Auth / Orders contexts (localStorage-backed)
    └── lib/
        ├── aiListing.ts    # photo → listing suggestion (stubbed)
        ├── seed.ts         # six SVG-seeded demo products
        ├── currency.ts     # INR helpers
        └── storage.ts      # tiny localStorage wrapper
```

## License

Apache-2.0, matching the parent `ai-playground` repo.
