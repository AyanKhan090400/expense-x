import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'

const ThemeContext = createContext(null)

function isValidTheme(value) {
  return value === 'dark' || value === 'light'
}

function readStoredTheme() {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEYS.theme)
  return isValidTheme(stored) ? stored : null
}

function applyClass(theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

function persistTheme(theme) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.theme, theme)
}

export function ThemeProvider({ children, profileTheme }) {
  const hasStoredTheme = useRef(readStoredTheme() !== null)

  const [theme, setThemeState] = useState(() => {
    const initial = readStoredTheme() || 'light'
    applyClass(initial)
    return initial
  })

  useEffect(() => {
    if (hasStoredTheme.current) return
    if (!isValidTheme(profileTheme)) return
    setThemeState(profileTheme)
    persistTheme(profileTheme)
    hasStoredTheme.current = true
  }, [profileTheme])

  useEffect(() => {
    applyClass(theme)
  }, [theme])

  const setTheme = (t) => {
    if (!isValidTheme(t)) return
    setThemeState(t)
    persistTheme(t)
    hasStoredTheme.current = true
  }

  const toggle = () => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      persistTheme(next)
      hasStoredTheme.current = true
      return next
    })
  }

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
