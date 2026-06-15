import { useState } from 'react'
import { motion } from 'framer-motion'
import { FINANCIAL_TIPS } from '../constants/financialTips'
import { STORAGE_KEYS } from '../constants/storageKeys'

export function FinancialTipsWidget() {
  const [tip] = useState(
    () => FINANCIAL_TIPS[Math.floor(Math.random() * FINANCIAL_TIPS.length)],
  )
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.dismissedTips) === '1'
    } catch {
      return false
    }
  })

  if (dismissed) return null

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/30 p-4"
      aria-label="Financial tip"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          💡
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            Tip of the day
          </p>
          <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-100">{tip}</p>
        </div>
        <button
          type="button"
          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
          onClick={() => {
            try {
              sessionStorage.setItem(STORAGE_KEYS.dismissedTips, '1')
            } catch {
              /* ignore */
            }
            setDismissed(true)
          }}
        >
          Dismiss
        </button>
      </div>
    </motion.aside>
  )
}
