import { useMemo, useState } from 'react'
import { subDays } from 'date-fns'
import { ROUTES } from '../constants/routes'
import { useExpenseData } from '../context/ExpenseDataContext'
import { SpendingPie, SpendingBar, SpendingLine } from '../components/AnalyticsCharts'
import { SEO } from '../components/SEO'
import { categoryTotals, monthlyLineData, weeklyBarData } from '../utils/dashboardStats'
import { formatMoney } from '../utils/currency'

export function Analytics() {
  const { transactions, loading } = useExpenseData()

  const [range, setRange] = useState('30')

  const filtered = useMemo(() => {
    const days = Number(range) || 30
    const cutoff = subDays(new Date(), days)
    return transactions.filter((t) => new Date(t.date) >= cutoff)
  }, [transactions, range])

  const pieData = useMemo(() => {
    return categoryTotals(filtered, 'expense').filter((d) => d.value > 0)
  }, [filtered])

  const barData = useMemo(() => weeklyBarData(transactions), [transactions])
  const lineData = useMemo(() => monthlyLineData(transactions, 6), [transactions])

  const totals = useMemo(() => {
    let inc = 0
    let exp = 0
    for (const t of filtered) {
      const a = Number(t.amount) || 0
      if (t.type === 'income') inc += a
      else exp += a
    }
    return { inc, exp, net: inc - exp }
  }, [filtered])

  return (
    <>
      <SEO title="Analytics" path={ROUTES.analytics} />
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visualize habits with pie, bar, and line charts.</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="range" className="text-sm text-slate-600 dark:text-slate-300">
              Range
            </label>
            <select
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading charts…</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                ['Income', totals.inc, 'text-emerald-600'],
                ['Expenses', totals.exp, 'text-orange-500'],
                ['Net', totals.net, totals.net >= 0 ? 'text-brand-600' : 'text-red-500'],
              ].map(([label, val, cls]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                >
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
                  <p className={`mt-2 text-2xl font-bold tabular-nums ${cls}`}>{formatMoney(val)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Selected range · PKR</p>
                </div>
              ))}
            </div>

            <div className="grid xl:grid-cols-2 gap-6">
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Spending by category</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Expenses in selected range</p>
                <div className="mt-4">
                  <SpendingPie data={pieData} />
                </div>
              </section>
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">This week</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Income vs expenses by day</p>
                <div className="mt-4">
                  <SpendingBar data={barData} />
                </div>
              </section>
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 xl:col-span-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly trend</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 6 calendar months</p>
                <div className="mt-4">
                  <SpendingLine data={lineData} />
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </>
  )
}
