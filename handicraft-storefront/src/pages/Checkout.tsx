import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import { useCatalog } from '../store/CatalogContext'
import { useOrders } from '../store/OrdersContext'
import { useAuth } from '../store/AuthContext'
import { formatINR } from '../lib/currency'
import {
  COUNTRIES,
  PAYMENT_HINT,
  PAYMENT_LABEL,
  PAYMENT_METHODS_BY_REGION,
  formatMoney,
  getCountry,
  isIndia,
  regionFor,
  shippingMinorFor,
  taxFor,
  type CountryCode,
} from '../lib/regions'
import type { Address, OrderLine, PaymentMethod } from '../types'

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

export default function Checkout() {
  const { lines, subtotalMinor, clear } = useCart()
  const { getById } = useCatalog()
  const { placeOrder } = useOrders()
  const { user, addAddress } = useAuth()
  const navigate = useNavigate()

  const seedAddr = user?.addresses[0]
  const [address, setAddress] = useState<Address>(() =>
    seedAddr
      ? {
          ...EMPTY_ADDRESS,
          ...seedAddr,
          countryCode: seedAddr.countryCode ?? 'IN',
          country: seedAddr.country ?? 'India',
          name: seedAddr.name || user?.name || '',
        }
      : { ...EMPTY_ADDRESS, name: user?.name ?? '' },
  )

  const country = getCountry(address.countryCode)
  const region = regionFor(address.countryCode)
  const allowedPayments = PAYMENT_METHODS_BY_REGION[region]
  const [payment, setPayment] = useState<PaymentMethod>(allowedPayments[0])
  const [saveAddr, setSaveAddr] = useState(true)
  const [placing, setPlacing] = useState(false)

  // Re-derive totals based on shipping country.
  const shippingMinor = shippingMinorFor(address.countryCode, subtotalMinor)
  const tax = taxFor(address.countryCode, subtotalMinor)
  const totalMinor = subtotalMinor + shippingMinor + tax.minor

  const isValid = useMemo(() => {
    if (
      !address.name.trim() ||
      address.phone.trim().length < 7 ||
      !address.line1.trim() ||
      !address.city.trim() ||
      !address.pincode.trim()
    )
      return false
    // India enforces a strict 6-digit PIN and a state.
    if (isIndia(address.countryCode)) {
      return !!address.state.trim() && /^\d{6}$/.test(address.pincode.trim())
    }
    return true
  }, [address])

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-bark">Your cart is empty</h1>
      </div>
    )
  }

  function onCountryChange(code: CountryCode) {
    const c = getCountry(code)
    setAddress((a) => ({ ...a, countryCode: code, country: c.name }))
    const nextRegion = regionFor(code)
    const nextAllowed = PAYMENT_METHODS_BY_REGION[nextRegion]
    if (!nextAllowed.includes(payment)) {
      setPayment(nextAllowed[0])
    }
  }

  async function handlePlace() {
    if (!isValid || placing) return
    setPlacing(true)

    // Simulate payment processing (UPI/card/PayPal/Apple-Pay/etc.).
    await new Promise((r) => setTimeout(r, payment === 'COD' ? 400 : 1100))

    const orderLines: OrderLine[] = lines.flatMap((l) => {
      const p = getById(l.productId)
      if (!p) return []
      return [
        {
          productId: p.id,
          name: p.name,
          imageDataUrl: p.imageDataUrl,
          qty: l.qty,
          unitPriceMinor: p.priceMinor,
        },
      ]
    })

    const order = placeOrder({
      lines: orderLines,
      subtotalMinor,
      shippingMinor,
      taxMinor: tax.minor,
      totalMinor,
      currency: country.currency,
      address,
      payment,
    })

    if (saveAddr && user) {
      const exists = user.addresses.some(
        (a) =>
          a.line1 === address.line1 &&
          a.pincode === address.pincode &&
          a.name === address.name,
      )
      if (!exists) addAddress(address)
    }

    clear()
    navigate(`/orders/${order.id}?new=1`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-[1fr,360px] gap-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-bark">Checkout</h1>

        <section className="card p-5">
          <h2 className="font-display text-lg font-semibold text-bark">
            Delivery address
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Country / region</label>
              <select
                className="input"
                value={address.countryCode}
                onChange={(e) => onCountryChange(e.target.value as CountryCode)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} · pay in {c.currency}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Full name"
              value={address.name}
              onChange={(v) => setAddress({ ...address, name: v })}
            />
            <Field
              label="Phone"
              value={address.phone}
              onChange={(v) => setAddress({ ...address, phone: v })}
              placeholder={
                isIndia(address.countryCode) ? '10-digit mobile' : 'Incl. country code'
              }
            />
            <Field
              label="Address line 1"
              value={address.line1}
              onChange={(v) => setAddress({ ...address, line1: v })}
              wide
            />
            <Field
              label="Address line 2"
              value={address.line2 ?? ''}
              onChange={(v) => setAddress({ ...address, line2: v })}
              wide
            />
            <Field
              label="City"
              value={address.city}
              onChange={(v) => setAddress({ ...address, city: v })}
            />
            <Field
              label={isIndia(address.countryCode) ? 'State' : 'State / Province'}
              value={address.state}
              onChange={(v) => setAddress({ ...address, state: v })}
            />
            <Field
              label={isIndia(address.countryCode) ? 'PIN code' : 'Postal / ZIP'}
              value={address.pincode}
              onChange={(v) => setAddress({ ...address, pincode: v })}
              placeholder={isIndia(address.countryCode) ? '6 digits' : 'e.g. 94110'}
            />
            <Field label="Country" value={country.name} onChange={() => {}} disabled />
          </div>
          {user && (
            <label className="mt-3 flex items-center gap-2 text-sm text-bark/80">
              <input
                type="checkbox"
                checked={saveAddr}
                onChange={(e) => setSaveAddr(e.target.checked)}
              />
              Save this address to my profile
            </label>
          )}
          {!isIndia(address.countryCode) && (
            <p className="mt-3 text-xs text-bark/60">
              International orders ship via DHL / FedEx Express. Duties &amp;
              local taxes are collected by the carrier on delivery.
            </p>
          )}
        </section>

        <section className="card p-5">
          <h2 className="font-display text-lg font-semibold text-bark">
            Payment method
          </h2>
          <div className="text-xs text-bark/60 mt-1">
            {region === 'IN'
              ? 'India rail · processed by Razorpay in production'
              : 'Global rail · processed by Stripe / PayPal in production'}
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {allowedPayments.map((m) => (
              <label
                key={m}
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                  payment === m
                    ? 'border-terracotta-500 bg-terracotta-50'
                    : 'border-bark/15 hover:bg-parchment/40'
                }`}
              >
                <input
                  type="radio"
                  className="mt-1"
                  checked={payment === m}
                  onChange={() => setPayment(m)}
                  name="payment"
                />
                <div>
                  <div className="font-medium text-bark">{PAYMENT_LABEL[m]}</div>
                  <div className="text-xs text-bark/60 mt-0.5">{PAYMENT_HINT[m]}</div>
                </div>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-bark/60">
            Demo build — no real money moves. Wire this to Razorpay (India) or
            Stripe / PayPal (global) in production; see{' '}
            <code>docs/architecture.md</code>.
          </p>
        </section>
      </div>

      <aside className="card p-5 h-fit sticky top-20 space-y-3">
        <h2 className="font-display text-lg font-semibold text-bark">Order summary</h2>
        <div className="space-y-2 max-h-72 overflow-auto pr-1">
          {lines.map((l) => {
            const p = getById(l.productId)
            if (!p) return null
            return (
              <div key={l.productId} className="flex items-center gap-3 text-sm">
                <img
                  src={p.imageDataUrl}
                  alt={p.name}
                  className="h-10 w-10 rounded-md object-cover border border-bark/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-bark">{p.name}</div>
                  <div className="text-xs text-bark/60">Qty {l.qty}</div>
                </div>
                <div className="text-bark font-medium">
                  {formatMoney(p.priceMinor * l.qty, country.currency)}
                </div>
              </div>
            )
          })}
        </div>
        <div className="border-t border-bark/10 pt-3 space-y-1 text-sm">
          <Row
            label="Subtotal"
            value={formatMoney(subtotalMinor, country.currency)}
          />
          <Row
            label={shippingMinor === 0 ? 'Shipping (free)' : 'Shipping'}
            value={
              shippingMinor === 0
                ? '—'
                : formatMoney(shippingMinor, country.currency)
            }
          />
          <Row
            label={tax.label}
            value={
              tax.minor === 0
                ? tax.note
                  ? 'On delivery'
                  : '—'
                : formatMoney(tax.minor, country.currency)
            }
          />
          <div className="flex justify-between font-semibold text-bark pt-1">
            <span>Total</span>
            <span>{formatMoney(totalMinor, country.currency)}</span>
          </div>
          {country.currency !== 'INR' && (
            <div className="text-[11px] text-bark/50 pt-1">
              ≈ {formatINR(totalMinor)} · indicative FX, locked at payment
            </div>
          )}
        </div>
        <button
          className="btn-primary w-full disabled:opacity-50"
          disabled={!isValid || placing}
          onClick={() => void handlePlace()}
        >
          {placing
            ? 'Processing…'
            : payment === 'COD'
              ? `Place order (${formatMoney(totalMinor, country.currency)})`
              : `Pay ${formatMoney(totalMinor, country.currency)}`}
        </button>
      </aside>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  wide,
  placeholder,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  wide?: boolean
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <label className="label">{label}</label>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
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
