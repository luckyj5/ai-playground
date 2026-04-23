import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import { useAuth } from '../store/AuthContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user } = useAuth()

  const linkBase = 'px-3 py-2 text-sm font-medium rounded-full'
  const linkActive = 'text-terracotta-600 bg-terracotta-50'
  const linkIdle = 'text-bark/80 hover:text-terracotta-600'

  return (
    <header className="sticky top-0 z-40 border-b border-bark/10 bg-ivory/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-500 text-ivory font-display text-lg"
          >
            ॐ
          </span>
          <span className="font-display text-xl font-semibold text-bark">
            Ananta <span className="text-terracotta-500">Crafts</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/sell"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Sell
          </NavLink>
          <NavLink
            to="/returns"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Returns
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            {user ? user.name.split(' ')[0] : 'Sign in'}
          </NavLink>
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-bark text-ivory px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Cart
            {itemCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron-300 text-bark text-xs font-semibold px-1.5">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
