import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatINR } from '../lib/currency'

export default function ProductCard({ product }: { product: Product }) {
  const discount =
    product.mrpMinor && product.mrpMinor > product.priceMinor
      ? Math.round(
          ((product.mrpMinor - product.priceMinor) / product.mrpMinor) * 100,
        )
      : 0

  return (
    <Link
      to={`/product/${product.id}`}
      className="group card overflow-hidden block hover:-translate-y-0.5 transition"
    >
      <div className="aspect-square bg-parchment overflow-hidden">
        <img
          src={product.imageDataUrl}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="chip">{product.tradition.replace(/ \(.+\)/, '')}</span>
          {discount > 0 && (
            <span className="chip bg-terracotta-50 text-terracotta-600">
              {discount}% off
            </span>
          )}
        </div>
        <div className="font-display text-base font-semibold text-bark leading-tight">
          {product.name}
        </div>
        <div className="text-xs text-bark/60 mt-0.5">{product.origin}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-bark">
            {formatINR(product.priceMinor)}
          </span>
          {product.mrpMinor && product.mrpMinor > product.priceMinor && (
            <span className="text-xs text-bark/50 line-through">
              {formatINR(product.mrpMinor)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
