import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartLine } from '../types'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage'
import { useCatalog } from './CatalogContext'

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotalMinor: number
  shippingMinor: number
  taxMinor: number
  totalMinor: number
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const FREE_SHIPPING_THRESHOLD_MINOR = 150000 // ₹1500
const FLAT_SHIPPING_MINOR = 9900 // ₹99
const GST_RATE = 0.05 // 5% on handicrafts (illustrative)

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog()
  const [lines, setLines] = useState<CartLine[]>(() =>
    loadJSON<CartLine[]>(STORAGE_KEYS.cart, []),
  )

  useEffect(() => {
    saveJSON(STORAGE_KEYS.cart, lines)
  }, [lines])

  const add = useCallback<CartContextValue['add']>((productId, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + qty } : l,
        )
      }
      return [...prev, { productId, qty }]
    })
  }, [])

  const setQty = useCallback<CartContextValue['setQty']>((productId, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    )
  }, [])

  const remove = useCallback<CartContextValue['remove']>((productId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const { subtotalMinor, itemCount } = useMemo(() => {
    let subtotal = 0
    let count = 0
    for (const line of lines) {
      const p = products.find((x) => x.id === line.productId)
      if (!p) continue
      subtotal += p.priceMinor * line.qty
      count += line.qty
    }
    return { subtotalMinor: subtotal, itemCount: count }
  }, [lines, products])

  const shippingMinor =
    subtotalMinor === 0 || subtotalMinor >= FREE_SHIPPING_THRESHOLD_MINOR
      ? 0
      : FLAT_SHIPPING_MINOR

  const taxMinor = Math.round(subtotalMinor * GST_RATE)
  const totalMinor = subtotalMinor + shippingMinor + taxMinor

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotalMinor,
      shippingMinor,
      taxMinor,
      totalMinor,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, itemCount, subtotalMinor, shippingMinor, taxMinor, totalMinor, add, setQty, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
