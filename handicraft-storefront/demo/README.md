# Ananta Crafts — recorded demo

`ananta-crafts-demo.mp4` is a one-take walkthrough of the storefront against
the local Vite dev server. Recorded with cleared `localStorage` so it shows
the **out-of-the-box defaults**.

## What's in it

1. **Home (USD default)** — currency pill in the navbar reads `USD`, hero copy
   advertises *worldwide shipping*, *Card · PayPal · Apple/Google Pay · UPI ·
   COD (IN)*.
2. **Currency switcher** — flip the navbar pill from `USD` → `INR` and watch
   every shop tile re-render in `₹`. Then back to `USD`.
3. **PDP → Cart** — Indigo Ajrakh Mulmul Stole at `$30.11`, add to cart, cart
   summary in USD with `≈ ₹2,624` indicative-FX footnote.
4. **Checkout · global rail** — country pre-selected to *United States · pay
   in USD*; payment options are **Card · PayPal · Apple Pay · Google Pay ·
   Bank transfer (SWIFT/SEPA/ACH)** processed by Stripe / PayPal in
   production.
5. **Checkout · India rail** — flip the country picker to *India · pay in
   INR* and the rail switches to **UPI · Card · Netbanking · COD** with
   GST 5% line and `₹2,624` total, processed by Razorpay in production.
6. **Pay** — fill a US address (San Francisco, CA 94110), click **Pay
   $60.22** → order `AC-2026-######` placed, status `Placed`, paid via Card.
7. **Returns** — *Simulate → Delivered* flips status, reveals the *Start a
   return* card; type a reason → submit → status flips to *Return requested*
   with the pickup + 5–7-day refund copy.
8. **Snap-and-list** — `/sell/new`, drop a photo, the deterministic vision
   stub auto-fills name (*Mud-Resist Block Print Saree*), origin
   (*Bagru, Rajasthan*), price (`₹1,650`), description, story, tags. Click
   **Publish** → the new listing appears as `Live` on the seller shelf
   (`/sell`).

## Re-recording locally

```bash
cd handicraft-storefront
npm install
npm run dev
# in another shell — capture the browser viewport as 1024x768@20fps
ffmpeg -f x11grab -framerate 20 -video_size 1024x768 -i :0.0+0,0 \
  -c:v libx264 -preset veryfast -pix_fmt yuv420p -movflags +faststart \
  demo/ananta-crafts-demo.mp4
```
