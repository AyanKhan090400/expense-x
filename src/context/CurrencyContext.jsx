import { createContext, useContext, useMemo } from 'react'
import { DEFAULT_CURRENCY } from '../constants/currencies'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const value = useMemo(() => ({ currency: DEFAULT_CURRENCY }), [])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
