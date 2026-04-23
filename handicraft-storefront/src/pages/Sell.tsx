import { Link } from 'react-router-dom'
import { useCatalog } from '../store/CatalogContext'
import { formatINR } from '../lib/currency'

export default function Sell() {
  const { products, updateProduct, deleteProduct } = useCatalog()
  const myProducts = products

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-bark">Your craft shelf</h1>
          <p className="text-sm text-bark/70 mt-1">
            Snap a product photo and we’ll draft the listing for you — name,
            description, craft tradition, origin, price and tags.
          </p>
        </div>
        <Link to="/sell/new" className="btn-primary">
          + List a product
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {myProducts.map((p) => (
          <div key={p.id} className="card p-4 flex gap-4">
            <img
              src={p.imageDataUrl}
              alt={p.name}
              className="h-24 w-24 rounded-lg object-cover border border-bark/10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    p.published
                      ? 'bg-saffron-100 text-saffron-700'
                      : 'bg-bark/10 text-bark/60'
                  }`}
                >
                  {p.published ? 'Live' : 'Draft'}
                </span>
                <span className="chip">
                  {p.tradition.replace(/ \(.+\)/, '')}
                </span>
              </div>
              <div className="font-display text-base font-semibold text-bark mt-1 truncate">
                {p.name}
              </div>
              <div className="text-xs text-bark/60 truncate">
                {p.origin} · {p.stock} in stock
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-semibold text-bark">
                  {formatINR(p.priceMinor)}
                </span>
                <button
                  className="text-xs text-bark/70 hover:text-terracotta-600"
                  onClick={() =>
                    updateProduct(p.id, { published: !p.published })
                  }
                >
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  className="text-xs text-bark/50 hover:text-terracotta-600"
                  onClick={() => {
                    if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
