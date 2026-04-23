import { Link } from 'react-router-dom'

export default function Returns() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose prose-stone">
      <h1 className="text-3xl font-semibold text-bark">Returns &amp; refunds</h1>
      <p className="text-bark/80 mt-2">
        Every piece on Ananta Crafts is handmade. Small variations in colour,
        weave, carve or brushstroke are the signature of the hand — not a
        defect. If something is genuinely damaged, wrong or not as described,
        we make it right.
      </p>

      <ol className="mt-6 space-y-4 text-bark/80">
        <li>
          <strong>7-day window.</strong> Start a return from your Order page
          within 7 days of delivery.
        </li>
        <li>
          <strong>We pick up.</strong> Our courier partner collects from your
          address at no extra cost across 20,000+ PIN codes.
        </li>
        <li>
          <strong>Quality check.</strong> Unused, with original tags and
          packaging. Custom-made or personalised pieces are non-returnable
          unless damaged in transit.
        </li>
        <li>
          <strong>Refund in 5–7 business days.</strong> Original payment method
          for UPI / cards / netbanking; Ananta credit for COD orders.
        </li>
      </ol>

      <div className="card p-4 mt-6 bg-parchment/40 border-bark/10 text-sm">
        <strong>Exchanges:</strong> same-size or same-tradition swaps are free.
        Size-up or up-category swaps charge the price difference.
      </div>

      <div className="mt-8 flex gap-3">
        <Link to="/orders" className="btn-primary">
          Start a return
        </Link>
        <Link to="/shop" className="btn-ghost">
          Back to shop
        </Link>
      </div>
    </div>
  )
}
