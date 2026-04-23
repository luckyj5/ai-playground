import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage'
import { SEED_PRODUCTS } from '../lib/seed'

type CatalogContextValue = {
  products: Product[]
  getById: (id: string) => Product | undefined
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => Product
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void
  resetCatalog: () => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

function newId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    loadJSON<Product[]>(STORAGE_KEYS.catalog, SEED_PRODUCTS),
  )

  useEffect(() => {
    saveJSON(STORAGE_KEYS.catalog, products)
  }, [products])

  const getById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const addProduct = useCallback<CatalogContextValue['addProduct']>((p) => {
    const next: Product = { ...p, id: newId(), createdAt: Date.now() }
    setProducts((prev) => [next, ...prev])
    return next
  }, [])

  const updateProduct = useCallback<CatalogContextValue['updateProduct']>(
    (id, patch) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      )
    },
    [],
  )

  const deleteProduct = useCallback<CatalogContextValue['deleteProduct']>(
    (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    },
    [],
  )

  const resetCatalog = useCallback(() => {
    setProducts(SEED_PRODUCTS)
  }, [])

  const value = useMemo<CatalogContextValue>(
    () => ({ products, getById, addProduct, updateProduct, deleteProduct, resetCatalog }),
    [products, getById, addProduct, updateProduct, deleteProduct, resetCatalog],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}
