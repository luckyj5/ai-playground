import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Address, User } from '../types'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage'

type AuthContextValue = {
  user: User | null
  signIn: (email: string, name: string) => void
  signOut: () => void
  updateProfile: (patch: Partial<User>) => void
  addAddress: (addr: Address) => void
  removeAddress: (index: number) => void
  setIsSeller: (isSeller: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    loadJSON<User | null>(STORAGE_KEYS.user, null),
  )

  useEffect(() => {
    saveJSON(STORAGE_KEYS.user, user)
  }, [user])

  const signIn = useCallback<AuthContextValue['signIn']>((email, name) => {
    setUser({
      email,
      name,
      addresses: [],
      isSeller: true,
    })
  }, [])

  const signOut = useCallback(() => setUser(null), [])

  const updateProfile = useCallback<AuthContextValue['updateProfile']>(
    (patch) => {
      setUser((u) => (u ? { ...u, ...patch } : u))
    },
    [],
  )

  const addAddress = useCallback<AuthContextValue['addAddress']>((addr) => {
    setUser((u) => (u ? { ...u, addresses: [...u.addresses, addr] } : u))
  }, [])

  const removeAddress = useCallback<AuthContextValue['removeAddress']>(
    (index) => {
      setUser((u) =>
        u
          ? { ...u, addresses: u.addresses.filter((_, i) => i !== index) }
          : u,
      )
    },
    [],
  )

  const setIsSeller = useCallback<AuthContextValue['setIsSeller']>(
    (isSeller) => {
      setUser((u) => (u ? { ...u, isSeller } : u))
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user, signIn, signOut, updateProfile, addAddress, removeAddress, setIsSeller }),
    [user, signIn, signOut, updateProfile, addAddress, removeAddress, setIsSeller],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
