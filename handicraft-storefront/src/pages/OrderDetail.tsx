import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useOrders } from '../store/OrdersContext'
import { formatINR } from '../lib/currency'
import type { OrderStatus } from '../types'

const STATUS_STEPS: OrderStatus[] = ['placed', 'packed', 'shipped', 'delivered']
const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Placed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  return_requested: 'Return requested',
  returned: 'Returned',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { getById, advanceStatus, requestReturn, cancelOrder } = useOrders()
  const [params] = useSearchParams()
  const isNew = params.get('new') === '1'
  const [returnReason, setReturnReason] = useState('')
  const [showReturn, setShowReturn] = useState(false)

  const order = id ? getById(id) : undefined
  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-bark">Order not found</h1>
        <Link to="/orders" className="btn-secondary mt-4 inline-flex">
          View all orders
        </Link>
      </div>
    )
  }

  const stepIdx = STATUS_STEPS.indexOf(order.status as OrderStatus)
  const terminal =
    order.status === 'cancelled' ||
    order.status === 'returned' ||
    order.status === 'refunded'

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {isNew && (
        <div className="card p-5 bg-saffron-50 border-saffron-200 mb-6 animate-fade-in">
          <div className="text-sm font-medium text-saffron-700">
            Thank you — your order has been placed.
          </div>
          <div className="text-xs text-saffron-700/80 mt-1">
            You’ll get a confirmation on WhatsApp and email. Expect delivery in
            3–7 business days.
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-baseline gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-bark">
            Order {order.id}
          </h1>
          <div className="text-sm text-bark/60">
            Placed {new Date(order.createdAt).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-bark/60">Status</div>
          <div className="text-lg font-semibold text-terracotta-600">
            {STATUS_LABEL[order.status]}
          </div>
        </div>
      </div>

      {!terminal && (
        <div className="card p-5 mt-6">
          <div className="grid grid-cols-4 gap-2">
            {STATUS_STEPS.map((s, i) => {
              const active = i <= stepIdx
              return (
                <div key={s} className="text-center">
                  <div
                    className={`mx-auto h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      active
                        ? 'bg-terracotta-500 text-ivory'
                        : 'bg-bark/10 text-bark/50'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div
                    className={`mt-1 text-xs ${
                      active ? 'text-bark' : 'text-bark/50'
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-bark/60">
            {(['packed', 'shipped', 'delivered'] as OrderStatus[]).map((s) => (
              <button
                key={s}
                className="btn-ghost"
                onClick={() => advanceStatus(order.id, s)}
              >
                Simulate → {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 mt-6">
        <h2 className="font-display text-lg font-semibold text-bark">Items</h2>
        <div className="mt-3 space-y-3">
          {order.lines.map((l) => (
            <div key={l.productId} className="flex items-center gap-3">
              <img
                src={l.imageDataUrl}
                alt={l.name}
                className="h-14 w-14 rounded-lg object-cover border border-bark/10"
              />
              <div className="flex-1 min-w-0">
                <div className="text-bark truncate">{l.name}</div>
                <div className="text-xs text-bark/60">Qty {l.qty}</div>
              </div>
              <div className="font-medium text-bark">
                {formatINR(l.unitPriceMinor * l.qty)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-bark/10 mt-4 pt-3 text-sm space-y-1">
          <Row label="Subtotal" value={formatINR(order.subtotalMinor)} />
          <Row
            label={order.shippingMinor === 0 ? 'Shipping (free)' : 'Shipping'}
            value={
              order.shippingMinor === 0 ? '—' : formatINR(order.shippingMinor)
            }
          />
          <Row label="GST" value={formatINR(order.taxMinor)} />
          <div className="flex justify-between font-semibold text-bark pt-1">
            <span>Total</span>
            <span>{formatINR(order.totalMinor)}</span>
          </div>
          <div className="text-xs text-bark/60 pt-1">
            Paid via {order.payment}
          </div>
        </div>
      </div>

      <div className="card p-5 mt-6">
        <h2 className="font-display text-lg font-semibold text-bark">Shipping to</h2>
        <div className="mt-2 text-sm text-bark/80 leading-relaxed">
          {order.address.name}
          <br />
          {order.address.line1}
          {order.address.line2 ? `, ${order.address.line2}` : ''}
          <br />
          {order.address.city}, {order.address.state} {order.address.pincode}
          <br />
          {order.address.country} · {order.address.phone}
        </div>
      </div>

      {(order.status === 'delivered' ||
        order.status === 'return_requested') && (
        <div className="card p-5 mt-6">
          <h2 className="font-display text-lg font-semibold text-bark">
            Returns
          </h2>
          {order.status === 'return_requested' ? (
            <p className="text-sm text-bark/70 mt-2">
              Your return has been requested. Our pickup partner will reach out
              within 24 hours. Refund will be issued within 5–7 business days
              after quality check.
            </p>
          ) : showReturn ? (
            <div className="mt-2 space-y-2">
              <textarea
                className="input h-24"
                placeholder="Reason (damaged, not as described, wrong item…)"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="btn-primary"
                  disabled={!returnReason.trim()}
                  onClick={() => requestReturn(order.id, returnReason.trim())}
                >
                  Request return
                </button>
                <button className="btn-ghost" onClick={() => setShowReturn(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-bark/70">
                7-day return window from delivery date. We arrange pickup.
              </p>
              <button
                className="btn-secondary mt-3"
                onClick={() => setShowReturn(true)}
              >
                Start a return
              </button>
            </div>
          )}
        </div>
      )}

      {(order.status === 'placed' || order.status === 'packed') && (
        <button
          className="mt-6 text-sm text-bark/60 hover:text-terracotta-600"
          onClick={() => cancelOrder(order.id)}
        >
          Cancel this order
        </button>
      )}
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
