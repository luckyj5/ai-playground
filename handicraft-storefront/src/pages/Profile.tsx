import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useOrders } from '../store/OrdersContext'
import type { Address } from '../types'
import { COUNTRIES, getCountry, type CountryCode } from '../lib/regions'

const EMPTY_ADDRESS: Address = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  countryCode: 'IN',
  country: 'India',
}

export default function Profile() {
  const { user, signIn, signOut, updateProfile, addAddress, removeAddress } =
    useAuth()
  const { orders } = useOrders()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [addr, setAddr] = useState<Address>(EMPTY_ADDRESS)

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold text-bark">Sign in</h1>
        <p className="text-sm text-bark/70 mt-1">
          This demo uses a lightweight local session — no password, no server.
          Plug this into OTP / Google / Apple in production.
        </p>
        <div className="card p-5 mt-5 space-y-3">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button
            className="btn-primary w-full"
            disabled={!name.trim() || !email.includes('@')}
            onClick={() => signIn(email.trim(), name.trim())}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-[260px,1fr] gap-8">
      <aside className="card p-5 h-fit">
        <div className="h-14 w-14 rounded-full bg-terracotta-500 text-ivory flex items-center justify-center font-display text-xl">
          {user.name[0]?.toUpperCase()}
        </div>
        <div className="mt-3 font-display text-lg font-semibold text-bark">
          {user.name}
        </div>
        <div className="text-sm text-bark/60">{user.email}</div>
        <div className="mt-4 space-y-2 text-sm">
          <Link to="/orders" className="block hover:text-terracotta-600">
            Orders ({orders.length})
          </Link>
          <Link to="/sell" className="block hover:text-terracotta-600">
            Your craft shelf
          </Link>
          <Link to="/returns" className="block hover:text-terracotta-600">
            Returns policy
          </Link>
        </div>
        <button
          onClick={signOut}
          className="mt-5 text-xs text-bark/50 hover:text-terracotta-600"
        >
          Sign out
        </button>
      </aside>

      <div className="space-y-6">
        <section className="card p-5">
          <h2 className="font-display text-lg font-semibold text-bark">
            Profile
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={user.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                className="input"
                value={user.phone ?? ''}
                onChange={(e) => updateProfile({ phone: e.target.value })}
                placeholder="10-digit mobile"
              />
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-lg font-semibold text-bark">
            Saved addresses
          </h2>
          {user.addresses.length === 0 ? (
            <p className="text-sm text-bark/60 mt-2">
              No addresses yet. Add one below — we’ll pre-fill it at checkout.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {user.addresses.map((a, i) => (
                <div
                  key={`${a.line1}-${i}`}
                  className="rounded-xl border border-bark/10 p-3 flex gap-3"
                >
                  <div className="flex-1 text-sm text-bark/80">
                    <div className="font-medium text-bark">{a.name}</div>
                    <div>
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ''}
                    </div>
                    <div>
                      {a.city}, {a.state} {a.pincode}
                    </div>
                    <div className="text-bark/60">
                      {a.country ?? 'India'} · {a.phone}
                    </div>
                  </div>
                  <button
                    className="text-xs text-bark/50 hover:text-terracotta-600"
                    onClick={() => removeAddress(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-bark/10 pt-4">
            <div className="label">Add a new address</div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Full name"
                value={addr.name}
                onChange={(e) => setAddr({ ...addr, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Phone"
                value={addr.phone}
                onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
              />
              <input
                className="input col-span-2"
                placeholder="Address line 1"
                value={addr.line1}
                onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
              />
              <input
                className="input col-span-2"
                placeholder="Address line 2 (optional)"
                value={addr.line2 ?? ''}
                onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
              />
              <input
                className="input"
                placeholder="City"
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
              />
              <input
                className="input"
                placeholder="State"
                value={addr.state}
                onChange={(e) => setAddr({ ...addr, state: e.target.value })}
              />
              <input
                className="input"
                placeholder="PIN / ZIP code"
                value={addr.pincode}
                onChange={(e) => setAddr({ ...addr, pincode: e.target.value })}
              />
              <select
                className="input col-span-2"
                value={addr.countryCode}
                onChange={(e) => {
                  const code = e.target.value as CountryCode
                  const c = getCountry(code)
                  setAddr({ ...addr, countryCode: code, country: c.name })
                }}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-secondary mt-3"
              disabled={
                !addr.name || !addr.line1 || !addr.city || !addr.pincode
              }
              onClick={() => {
                addAddress(addr)
                setAddr(EMPTY_ADDRESS)
              }}
            >
              Save address
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
