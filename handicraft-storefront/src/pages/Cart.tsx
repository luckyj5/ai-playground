import { Link } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import { useCatalog } from '../store/CatalogContext'
import { formatINR } from '../lib/currency'
import { formatMoney } from '../lib/regions'
import { usePrefs } from '../store/PrefsContext'

export default function Cart() {
  const { lines, setQty, remove, subtotalMinor, shippingMinor, taxMinor, totalMinor } =
    useCart()
  const { getById } = useCatalog()
  const { currency } = usePrefs()
  const fmt = (m: number) => formatMoney(m, currency)

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-bark">Your cart is empty</h1>
        <p className="mt-2 text-bark/70">
          Start with a block print or a Dhokra horse — we promise nothing here
          comes off an assembly line.
        </p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Shop crafts
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-[1fr,360px] gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-bark">Your cart</h1>
        <div className="mt-6 space-y-3">
          {lines.map((line) => {
            const p = getById(line.productId)
            if (!p) return null
            return (
              <div key={line.productId} className="card p-4 flex gap-4">
                <img
                  src={p.imageDataUrl}
                  alt={p.name}
                  className="h-20 w-20 rounded-lg object-cover border border-bark/10"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${p.id}`}
                    className="font-display text-base font-semibold text-bark hover:underline"
                  >
                    {p.name}
                  </Link>
                  <div className="text-xs text-bark/60">
                    {p.tradition.replace(/ \(.+\)/, '')} · {p.origin}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-bark/15 overflow-hidden text-sm">
                      <button
                        className="px-3 py-1 hover:bg-bark/5"
                        onClick={() => setQty(p.id, line.qty - 1)}
                      >
                        −
                      </button>
                      <span className="px-3 min-w-8 text-center">{line.qty}</span>
                      <button
                        className="px-3 py-1 hover:bg-bark/5"
                        onClick={() => setQty(p.id, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-xs text-bark/60 hover:text-terracotta-600"
                      onClick={() => remove(p.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-bark">
                    {fmt(p.priceMinor * line.qty)}
                  </div>
                  <div className="text-xs text-bark/50">
                    {fmt(p.priceMinor)} each
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <aside className="card p-5 h-fit sticky top-20">
        <h2 className="font-display text-lg font-semibold text-bark">Summary</h2>
        <div className="mt-3 space-y-2 text-sm">
          <Row label="Subtotal" value={fmt(subtotalMinor)} />
          <Row
            label={
              shippingMinor === 0 ? 'Estimated shipping (free)' : 'Estimated shipping'
            }
            value={shippingMinor === 0 ? '—' : fmt(shippingMinor)}
          />
          <Row
            label={currency === 'INR' ? 'Estimated GST (5%)' : 'Est. duties & taxes'}
            value={
              currency === 'INR'
                ? fmt(taxMinor)
                : taxMinor === 0
                  ? 'On delivery'
                  : fmt(taxMinor)
            }
          />
          <div className="border-t border-bark/10 pt-2 mt-2 flex justify-between font-semibold text-bark">
            <span>Estimated total</span>
            <span>{fmt(totalMinor)}</span>
          </div>
          {currency !== 'INR' && (
            <div className="text-[11px] text-bark/50">
              ≈ {formatINR(totalMinor)} · final FX locked at checkout
            </div>
          )}
          <p className="text-[11px] text-bark/50 pt-2">
            Final shipping &amp; taxes are computed at checkout based on your
            ship-to country. Switch currency from the header at any time.
          </p>
        </div>
        <Link to="/checkout" className="btn-primary w-full mt-5">
          Checkout
        </Link>
        <Link to="/shop" className="btn-ghost w-full mt-2">
          Continue shopping
        </Link>
      </aside>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-bark/80">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
