import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalog } from '../store/CatalogContext'
import ProductCard from '../components/ProductCard'
import { CATEGORY_OPTIONS } from '../lib/aiListing'

export default function Shop() {
  const { products } = useCatalog()
  const [params, setParams] = useSearchParams()
  const initialCategory = params.get('category') ?? ''
  const [category, setCategory] = useState(initialCategory)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'new' | 'low' | 'high'>('new')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products
      .filter((p) => p.published)
      .filter((p) => (category ? p.category === category : true))
      .filter((p) =>
        q
          ? [p.name, p.description, p.tradition, p.origin, ...(p.tags ?? [])]
              .join(' ')
              .toLowerCase()
              .includes(q)
          : true,
      )
    if (sort === 'low') list.sort((a, b) => a.priceMinor - b.priceMinor)
    else if (sort === 'high') list.sort((a, b) => b.priceMinor - a.priceMinor)
    else list.sort((a, b) => b.createdAt - a.createdAt)
    return list
  }, [products, category, query, sort])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-bark">Shop crafts</h1>
      <p className="text-sm text-bark/70 mt-1">
        {filtered.length} pieces from across India.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <input
          className="input max-w-xs"
          placeholder="Search by craft, region, tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input max-w-xs"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            const next = new URLSearchParams(params)
            if (e.target.value) next.set('category', e.target.value)
            else next.delete('category')
            setParams(next, { replace: true })
          }}
        >
          <option value="">All categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="input max-w-[10rem]"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'new' | 'low' | 'high')}
        >
          <option value="new">Newest</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 mt-8 text-center text-bark/70">
          No crafts match those filters yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
