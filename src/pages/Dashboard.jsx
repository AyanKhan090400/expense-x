import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format, isFuture, parseISO, startOfMonth } from 'date-fns'
import { ROUTES } from '../constants/routes'
import { useExpenseData } from '../context/ExpenseDataContext'
import { StatCard } from '../components/StatCard'
import { CardSkeleton } from '../components/Skeleton'
import { FinancialTipsWidget } from '../components/FinancialTipsWidget'
import { AISuggestionsPanel } from '../components/AISuggestionsPanel'
import { SEO } from '../components/SEO'
import { formatMoney } from '../utils/currency'
import { budgetSpendForCategory, summarizeMonth } from '../utils/dashboardStats'
import { Button } from '../components/Button'

export function Dashboard() {
  const { transactions, budgets, goals, loading } = useExpenseData()

  const monthStart = startOfMonth(new Date())
  const { income, expense, savings } = useMemo(
    () => summarizeMonth(transactions, monthStart),
    [transactions, monthStart],
  )

  const totalBalance = useMemo(() => {
    let bal = 0
    for (const t of transactions) {
      const amt = Number(t.amount) || 0
      bal += t.type === 'income' ? amt : -amt
    }
    return bal
  }, [transactions])

  const recent = useMemo(() => transactions.slice(0, 6), [transactions])

  const upcomingBills = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return transactions
      .filter((t) => {
        if (t.type !== 'expense') return false
        if (t.billDueDate && t.billDueDate >= today) return true
        if (t.category === 'Bills' && t.date >= today) return true
        return false
      })
      .slice(0, 5)
  }, [transactions])

  const budgetCards = useMemo(() => {
    return budgets.slice(0, 4).map((b) => {
      const spent = budgetSpendForCategory(transactions, b.category, monthStart)
      const limit = Number(b.limit) || 0
      const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0
      return { ...b, spent, limit, pct }
    })
  }, [budgets, transactions, monthStart])

  const activeGoals = useMemo(() => goals.slice(0, 3), [goals])

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <SEO title="Dashboard" description="Your Expense X dashboard." path={ROUTES.dashboard} />
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Month of {format(monthStart, 'MMMM yyyy')} · All amounts in PKR
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={ROUTES.transactions}>
              <Button size="sm">Manage transactions</Button>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total balance"
            value={totalBalance}
            icon="💰"
            delay={0}
            sub="All-time income minus expenses"
          />
          <StatCard label="Income (month)" value={income} icon="📥" delay={0.05} />
          <StatCard label="Expenses (month)" value={expense} icon="📤" delay={0.1} />
          <StatCard
            label="Savings (month)"
            value={savings}
            icon="🏦"
            delay={0.15}
            sub="Income − expenses"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Budget progress</h2>
                <Link to={ROUTES.budgets} className="text-sm font-medium text-brand-600 hover:underline">
                  View all
                </Link>
              </div>
              {budgetCards.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No budgets yet. Create one to track limits.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {budgetCards.map((b) => (
                    <li key={b.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-800 dark:text-slate-100">{b.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {formatMoney(b.spent)} / {formatMoney(b.limit)}
                        </span>
                      </div>
                      <div
                        className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={b.pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            b.pct >= 100 ? 'bg-red-500' : b.pct >= (b.warnPercent || 80) ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent transactions</h2>
                <Link to={ROUTES.transactions} className="text-sm font-medium text-brand-600 hover:underline">
                  See all
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {recent.map((t) => (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.category} · {t.date}
                      </p>
                    </div>
                    <span
                      className={
                        t.type === 'income'
                          ? 'text-emerald-600 font-semibold'
                          : 'text-slate-900 dark:text-white font-semibold'
                      }
                    >
                      {t.type === 'income' ? '+' : '−'}
                      {formatMoney(t.amount)}
                    </span>
                  </li>
                ))}
                {recent.length === 0 && (
                  <li className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">No transactions yet.</li>
                )}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <FinancialTipsWidget />
            <AISuggestionsPanel transactions={transactions} />

            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming bills</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {upcomingBills.map((t) => (
                  <li key={t.id} className="flex justify-between gap-2">
                    <span className="text-slate-700 dark:text-slate-200 truncate">{t.title}</span>
                    <span className="text-slate-500 dark:text-slate-400 shrink-0">
                      {t.billDueDate || t.date}
                    </span>
                  </li>
                ))}
                {upcomingBills.length === 0 && (
                  <li className="text-slate-500 dark:text-slate-400">No upcoming bills flagged.</li>
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Saving goals</h2>
                <Link to={ROUTES.goals} className="text-sm font-medium text-brand-600 hover:underline">
                  Manage
                </Link>
              </div>
              <ul className="mt-3 space-y-3">
                {activeGoals.map((g) => {
                  const target = Number(g.targetAmount) || 0
                  const saved = Number(g.savedAmount) || 0
                  const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0
                  const overdue =
                    g.deadline && !isFuture(parseISO(g.deadline)) && pct < 100
                  return (
                    <li key={g.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-800 dark:text-slate-100">{g.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{format(parseISO(g.deadline), 'MMM d')}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${overdue ? 'bg-red-500' : 'bg-brand-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {formatMoney(saved)} of {formatMoney(target)}
                      </p>
                    </li>
                  )
                })}
                {activeGoals.length === 0 && (
                  <li className="text-sm text-slate-500 dark:text-slate-400">No goals yet — add one to stay motivated.</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
