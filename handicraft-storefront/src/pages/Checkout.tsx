import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import { useCatalog } from '../store/CatalogContext'
import { useOrders } from '../store/OrdersContext'
import { useAuth } from '../store/AuthContext'
import { formatINR } from '../lib/currency'
import type { Address, OrderLine, PaymentMethod } from '../types'

const EMPTY_ADDRESS: Address = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
}

export default function Checkout() {
  const { lines, subtotalMinor, shippingMinor, taxMinor, totalMinor, clear } =
    useCart()
  const { getById } = useCatalog()
  const { placeOrder } = useOrders()
  const { user, addAddress } = useAuth()
  const navigate = useNavigate()

  const defaultAddr = user?.addresses[0] ?? EMPTY_ADDRESS
  const [address, setAddress] = useState<Address>({
    ...defaultAddr,
    name: defaultAddr.name || user?.name || '',
  })
  const [payment, setPayment] = useState<PaymentMethod>('UPI')
  const [saveAddr, setSaveAddr] = useState(true)
  const [placing, setPlacing] = useState(false)

  const isValid = useMemo(
    () =>
      address.name.trim() &&
      address.phone.trim().length >= 10 &&
      address.line1.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      /^\d{6}$/.test(address.pincode.trim()),
    [address],
  )

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-bark">Your cart is empty</h1>
      </div>
    )
  }

  async function handlePlace() {
    if (!isValid || placing) return
    setPlacing(true)

    // Simulate payment processing (UPI/card/netbanking auth).
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
      taxMinor,
      totalMinor,
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
            <Field
              label="Full name"
              value={address.name}
              onChange={(v) => setAddress({ ...address, name: v })}
            />
            <Field
              label="Phone"
              value={address.phone}
              onChange={(v) => setAddress({ ...address, phone: v })}
              placeholder="10-digit mobile"
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
              label="State"
              value={address.state}
              onChange={(v) => setAddress({ ...address, state: v })}
            />
            <Field
              label="PIN code"
              value={address.pincode}
              onChange={(v) => setAddress({ ...address, pincode: v })}
              placeholder="6 digits"
            />
            <Field label="Country" value="India" onChange={() => {}} disabled />
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
        </section>

        <section className="card p-5">
          <h2 className="font-display text-lg font-semibold text-bark">
            Payment method
          </h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {(['UPI', 'Card', 'Netbanking', 'COD'] as const).map((m) => (
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
                  <div className="font-medium text-bark">
                    {m === 'UPI' && 'UPI (GPay · PhonePe · Paytm)'}
                    {m === 'Card' && 'Credit / Debit card'}
                    {m === 'Netbanking' && 'Netbanking'}
                    {m === 'COD' && 'Cash on Delivery'}
                  </div>
                  <div className="text-xs text-bark/60 mt-0.5">
                    {m === 'UPI' &&
                      'Instant · zero fees · recommended for Indian shoppers'}
                    {m === 'Card' && 'Visa · Mastercard · RuPay · Amex · all secure'}
                    {m === 'Netbanking' && 'All major Indian banks supported'}
                    {m === 'COD' && '₹29 handling · pay when it arrives'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-bark/60">
            Demo build — no real money moves. Wire this to Razorpay / Stripe in
            production; see <code>docs/architecture.md</code>.
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
                  {formatINR(p.priceMinor * l.qty)}
                </div>
              </div>
            )
          })}
        </div>
        <div className="border-t border-bark/10 pt-3 space-y-1 text-sm">
          <Row label="Subtotal" value={formatINR(subtotalMinor)} />
          <Row
            label={shippingMinor === 0 ? 'Shipping (free)' : 'Shipping'}
            value={shippingMinor === 0 ? '—' : formatINR(shippingMinor)}
          />
          <Row label="GST (5%)" value={formatINR(taxMinor)} />
          <div className="flex justify-between font-semibold text-bark pt-1">
            <span>Total</span>
            <span>{formatINR(totalMinor)}</span>
          </div>
        </div>
        <button
          className="btn-primary w-full disabled:opacity-50"
          disabled={!isValid || placing}
          onClick={() => void handlePlace()}
        >
          {placing
            ? 'Processing…'
            : payment === 'COD'
              ? `Place order (${formatINR(totalMinor)})`
              : `Pay ${formatINR(totalMinor)}`}
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
