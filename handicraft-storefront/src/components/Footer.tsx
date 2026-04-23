import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-bark/10 bg-parchment/60">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-semibold text-bark">
            Ananta Crafts
          </div>
          <p className="mt-2 text-sm text-bark/70 leading-relaxed">
            Handcrafted in India. Every piece carries the hand of its maker —
            block, brush, loom and lathe.
          </p>
        </div>
        <div>
          <div className="label">Shop</div>
          <ul className="space-y-1 text-sm">
            <li><Link to="/shop" className="hover:text-terracotta-600">All crafts</Link></li>
            <li><Link to="/shop?category=Textiles+%26+Sarees" className="hover:text-terracotta-600">Textiles &amp; Sarees</Link></li>
            <li><Link to="/shop?category=Paintings+%26+Folk+Art" className="hover:text-terracotta-600">Paintings &amp; Folk Art</Link></li>
            <li><Link to="/shop?category=Jewelry" className="hover:text-terracotta-600">Jewelry</Link></li>
          </ul>
        </div>
        <div>
          <div className="label">Your Account</div>
          <ul className="space-y-1 text-sm">
            <li><Link to="/profile" className="hover:text-terracotta-600">Profile &amp; addresses</Link></li>
            <li><Link to="/orders" className="hover:text-terracotta-600">Orders</Link></li>
            <li><Link to="/returns" className="hover:text-terracotta-600">Returns policy</Link></li>
            <li><Link to="/sell" className="hover:text-terracotta-600">Sell your craft</Link></li>
          </ul>
        </div>
        <div>
          <div className="label">Help</div>
          <ul className="space-y-1 text-sm text-bark/70">
            <li>Free shipping over ₹1,500</li>
            <li>7-day easy returns</li>
            <li>UPI · Cards · COD</li>
            <li>hello@anantacrafts.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bark/10 py-4 text-center text-xs text-bark/60">
        © {new Date().getFullYear()} Ananta Crafts · Demo storefront · Part of the
        <a
          href="https://github.com/luckyj5/ai-playground"
          className="ml-1 underline hover:text-terracotta-600"
        >
          ai-playground
        </a>
      </div>
    </footer>
  )
}
