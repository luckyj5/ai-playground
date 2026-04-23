import { Link } from 'react-router-dom'
import { useOrders } from '../store/OrdersContext'
import { formatINR } from '../lib/currency'

export default function Orders() {
  const { orders } = useOrders()

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-bark">No orders yet</h1>
        <p className="mt-2 text-bark/70">
          Your placed orders will appear here with tracking and return options.
        </p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Shop crafts
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-bark">Your orders</h1>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <Link
            key={o.id}
            to={`/orders/${o.id}`}
            className="card p-4 flex flex-wrap items-center gap-4 hover:-translate-y-0.5 transition"
          >
            <div className="flex -space-x-2">
              {o.lines.slice(0, 3).map((l) => (
                <img
                  key={l.productId}
                  src={l.imageDataUrl}
                  alt={l.name}
                  className="h-12 w-12 rounded-lg object-cover border-2 border-ivory"
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-bark truncate">
                {o.lines.map((l) => l.name).join(' · ')}
              </div>
              <div className="text-xs text-bark/60">
                {new Date(o.createdAt).toLocaleDateString('en-IN')} ·{' '}
                {o.lines.reduce((s, l) => s + l.qty, 0)} items
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-bark">
                {formatINR(o.totalMinor)}
              </div>
              <div className="text-xs text-terracotta-600 font-medium capitalize">
                {o.status.replace('_', ' ')}
              </div>
            </div>
            <div className="text-sm text-bark/50">{o.id}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
