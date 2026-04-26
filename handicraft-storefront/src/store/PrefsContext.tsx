import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadJSON, saveJSON } from '../lib/storage'
import type { Currency } from '../lib/regions'

const PREFS_KEY = 'ac.prefs.v1'

type Prefs = {
  /** Currency the buyer wants to see across the storefront. INR base prices
   *  are converted via the indicative FX in lib/regions.ts. */
  currency: Currency
}

const DEFAULT_PREFS: Prefs = {
  currency: 'USD',
}

type PrefsContextValue = Prefs & {
  setCurrency: (c: Currency) => void
}

const PrefsContext = createContext<PrefsContextValue | null>(null)

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(() =>
    loadJSON<Prefs>(PREFS_KEY, DEFAULT_PREFS),
  )

  useEffect(() => {
    saveJSON(PREFS_KEY, prefs)
  }, [prefs])

  const setCurrency = useCallback((currency: Currency) => {
    setPrefs((p) => ({ ...p, currency }))
  }, [])

  const value = useMemo<PrefsContextValue>(
    () => ({ ...prefs, setCurrency }),
    [prefs, setCurrency],
  )

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider')
  return ctx
}
