import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCatalog } from '../store/CatalogContext'
import { useCart } from '../store/CartContext'
import { formatINR } from '../lib/currency'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { getById, products } = useCatalog()
  const { add } = useCart()
  const navigate = useNavigate()
  const product = id ? getById(id) : undefined

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-bark">Product not found</h1>
        <Link to="/shop" className="btn-secondary mt-4 inline-flex">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = products
    .filter(
      (p) =>
        p.published && p.id !== product.id && p.category === product.category,
    )
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="card overflow-hidden">
          <img
            src={product.imageDataUrl}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="chip">{product.tradition.replace(/ \(.+\)/, '')}</span>
            <span className="chip bg-terracotta-50 text-terracotta-600">
              {product.category}
            </span>
            <span className="chip bg-indigo-ink/10 text-indigo-ink">
              {product.origin}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-bark">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-bark">
              {formatINR(product.priceMinor)}
            </span>
            {product.mrpMinor && product.mrpMinor > product.priceMinor && (
              <>
                <span className="text-sm text-bark/50 line-through">
                  {formatINR(product.mrpMinor)}
                </span>
                <span className="text-sm font-medium text-terracotta-600">
                  Save{' '}
                  {formatINR(product.mrpMinor - product.priceMinor)}
                </span>
              </>
            )}
          </div>
          <div className="mt-1 text-xs text-bark/60">
            Inclusive of all taxes · {product.stock} in stock
          </div>

          <p className="mt-5 text-bark/80 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-4 card p-4 bg-parchment/40 border-bark/10">
            <div className="label">The story</div>
            <p className="text-sm text-bark/80 leading-relaxed">{product.story}</p>
            <div className="mt-2 text-xs text-bark/60">
              Crafted by <span className="font-medium">{product.artisan}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="btn-primary"
              onClick={() => {
                add(product.id, 1)
                navigate('/cart')
              }}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sold out' : 'Add to cart'}
            </button>
            <Link to="/shop" className="btn-ghost">
              Keep browsing
            </Link>
          </div>

          <ul className="mt-6 text-sm text-bark/70 space-y-1">
            <li>✓ Free shipping over ₹1,500 · 3–7 business days</li>
            <li>✓ 7-day easy returns (pickup included)</li>
            <li>✓ Pay via UPI, cards, netbanking or Cash on Delivery</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-bark">
            You may also like
          </h2>
          <div className="mt-4 grid gap-4 grid-cols-2 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
