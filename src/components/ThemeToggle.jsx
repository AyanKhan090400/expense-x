import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative inline-flex h-10 w-16 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1 transition-colors ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-950 shadow-md text-lg"
        style={{ marginLeft: isDark ? 'auto' : 0 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.span>
    </button>
  )
}
