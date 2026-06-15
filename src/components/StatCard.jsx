import { motion } from 'framer-motion'
import { formatMoney } from '../utils/currency'

export function StatCard({ label, value, sub, icon, delay = 0 }) {
  const display = typeof value === 'number' ? formatMoney(value) : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {display}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/50 text-xl">
            {icon}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />
    </motion.div>
  )
}
