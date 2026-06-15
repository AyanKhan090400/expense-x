import { motion } from 'framer-motion'
import { buildSpendingSuggestions } from '../utils/aiSuggestions'

const priorityStyle = {
  high: 'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900',
  medium: 'border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900',
  low: 'border-slate-200 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800',
}

export function AISuggestionsPanel({ transactions }) {
  const items = buildSpendingSuggestions(transactions)

  return (
    <section aria-label="AI spending suggestions" className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          ✨
        </span>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Smart suggestions</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Heuristic insights from your last 30 days — not financial advice.
      </p>
      <ul className="space-y-2">
        {items.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border p-3 text-sm ${priorityStyle[s.priority] || priorityStyle.low}`}
          >
            <p className="font-semibold text-slate-900 dark:text-white">{s.title}</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{s.detail}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
