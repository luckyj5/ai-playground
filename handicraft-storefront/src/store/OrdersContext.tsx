import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Order, OrderStatus } from '../types'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage'

type OrdersContextValue = {
  orders: Order[]
  getById: (id: string) => Order | undefined
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'statusHistory' | 'status'>) => Order
  advanceStatus: (id: string, status: OrderStatus, note?: string) => void
  requestReturn: (id: string, reason: string) => void
  cancelOrder: (id: string) => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

function newOrderId(): string {
  const n = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')
  return `AC-${new Date().getFullYear()}-${n}`
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() =>
    loadJSON<Order[]>(STORAGE_KEYS.orders, []),
  )

  useEffect(() => {
    saveJSON(STORAGE_KEYS.orders, orders)
  }, [orders])

  const getById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  )

  const placeOrder = useCallback<OrdersContextValue['placeOrder']>((partial) => {
    const id = newOrderId()
    const now = Date.now()
    const order: Order = {
      ...partial,
      id,
      createdAt: now,
      status: 'placed',
      statusHistory: [{ status: 'placed', at: now }],
    }
    setOrders((prev) => [order, ...prev])
    return order
  }, [])

  const advanceStatus = useCallback<OrdersContextValue['advanceStatus']>(
    (id, status, note) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status,
                statusHistory: [...o.statusHistory, { status, at: Date.now(), note }],
              }
            : o,
        ),
      )
    },
    [],
  )

  const requestReturn = useCallback<OrdersContextValue['requestReturn']>(
    (id, reason) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status: 'return_requested',
                statusHistory: [
                  ...o.statusHistory,
                  { status: 'return_requested', at: Date.now(), note: reason },
                ],
              }
            : o,
        ),
      )
    },
    [],
  )

  const cancelOrder = useCallback<OrdersContextValue['cancelOrder']>((id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'cancelled',
              statusHistory: [
                ...o.statusHistory,
                { status: 'cancelled', at: Date.now() },
              ],
            }
          : o,
      ),
    )
  }, [])

  const value = useMemo<OrdersContextValue>(
    () => ({ orders, getById, placeOrder, advanceStatus, requestReturn, cancelOrder }),
    [orders, getById, placeOrder, advanceStatus, requestReturn, cancelOrder],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider')
  return ctx
}
