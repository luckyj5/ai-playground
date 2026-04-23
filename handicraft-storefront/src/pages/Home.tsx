import { Link } from 'react-router-dom'
import { useCatalog } from '../store/CatalogContext'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { products } = useCatalog()
  const featured = products.filter((p) => p.published).slice(0, 6)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-50 via-ivory to-saffron-50">
        <div className="absolute inset-0 bg-block-print [background-size:22px_22px] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-slide-up">
            <div className="chip">Handmade in India · GI-tagged origins</div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-bark leading-tight">
              Snap a photo.
              <br />
              Launch your craft.
            </h1>
            <p className="mt-4 text-bark/75 text-lg max-w-md">
              Kalakar Bazaar is a modern storefront for Indian heritage crafts —
              block prints, Pattachitra, Dhokra, blue pottery. Upload a photo,
              we’ll draft the listing. You sell, we handle the story.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/sell" className="btn-primary">
                List a product
              </Link>
              <Link to="/shop" className="btn-secondary">
                Shop crafts
              </Link>
            </div>
            <div className="mt-6 text-sm text-bark/60 flex flex-wrap gap-x-6 gap-y-1">
              <span>✓ Free shipping over ₹1,500</span>
              <span>✓ 7-day easy returns</span>
              <span>✓ UPI · Cards · COD</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featured.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.imageDataUrl}
                alt={p.name}
                className="w-full aspect-square rounded-2xl object-cover shadow-craft border border-bark/10"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-bark">Featured crafts</h2>
            <p className="text-sm text-bark/70">
              Curated this week from artisan clusters across India.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-medium text-terracotta-600 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'From photo to listing',
            body: 'Upload one photo. We draft name, category, craft tradition, origin, price and tags — edit and publish in under a minute.',
            emoji: '📸',
          },
          {
            title: 'Fair for artisans',
            body: 'Profile page and story section for every maker. Transparent pricing, GI-tags called out, no middlemen.',
            emoji: '🪡',
          },
          {
            title: 'Trusted commerce',
            body: 'Cart, checkout, UPI / card / COD, GST on invoice, 7-day returns with pickup — the basics, done well.',
            emoji: '🧾',
          },
        ].map((c) => (
          <div key={c.title} className="card p-5">
            <div className="text-2xl">{c.emoji}</div>
            <div className="mt-2 font-display text-lg font-semibold text-bark">
              {c.title}
            </div>
            <p className="mt-1 text-sm text-bark/70 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
