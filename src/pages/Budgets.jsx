import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { startOfMonth } from 'date-fns'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../context/AuthContext'
import { useExpenseData } from '../context/ExpenseDataContext'
import { useCategories } from '../hooks/useCategories'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { SEO } from '../components/SEO'
import { validateBudget } from '../utils/validation'
import { budgetSpendForCategory } from '../utils/dashboardStats'
import { formatMoney } from '../utils/currency'

export function Budgets() {
  const { profile, user } = useAuth()
  const categories = useCategories(profile)
  const { budgets, transactions, addBudget, updateBudget, deleteBudget, pushNotification } = useExpenseData()

  const monthStart = startOfMonth(new Date())

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '',
    category: '',
    limit: '',
    period: 'monthly',
    warnPercent: '80',
  })
  const [errors, setErrors] = useState({})

  const enriched = useMemo(() => {
    return budgets.map((b) => {
      const spent = budgetSpendForCategory(transactions, b.category, monthStart)
      const limit = Number(b.limit) || 0
      const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0
      return { ...b, spent, limit, pct }
    })
  }, [budgets, transactions, monthStart])

  const openNew = () => {
    setEditing(null)
    setForm({
      name: '',
      category: '',
      limit: '',
      period: 'monthly',
      warnPercent: '80',
    })
    setErrors({})
    setOpen(true)
  }

  const openEdit = (b) => {
    setEditing(b)
    setForm({
      name: b.name,
      category: b.category,
      limit: String(b.limit),
      period: b.period || 'monthly',
      warnPercent: String(b.warnPercent ?? 80),
    })
    setErrors({})
    setOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...form, limit: form.limit, name: form.name }
    const v = validateBudget({ ...payload, category: form.category || '' })
    setErrors(v)
    if (Object.keys(v).length) return
    try {
      if (editing) {
        await updateBudget(editing.id, {
          name: form.name,
          category: form.category,
          limit: Number(form.limit),
          period: form.period,
          warnPercent: Number(form.warnPercent),
        })
        toast.success('Budget updated')
      } else {
        await addBudget({
          name: form.name,
          category: form.category,
          limit: Number(form.limit),
          period: form.period,
          warnPercent: Number(form.warnPercent),
        })
        toast.success('Budget created')
      }
      setOpen(false)
    } catch (err) {
      toast.error(err?.message || 'Could not save budget')
    }
  }

  const remove = async (b) => {
    if (!window.confirm(`Delete budget “${b.name}”?`)) return
    try {
      await deleteBudget(b.id)
      toast.success('Budget removed')
    } catch (e) {
      toast.error(e?.message || 'Error')
    }
  }

  const checkAlerts = async () => {
    if (!user) return
    for (const b of enriched) {
      if (b.pct >= (b.warnPercent || 80) && b.pct < 100) {
        await pushNotification({
          type: 'budget',
          title: 'Budget warning',
          message: `${b.name} is at ${b.pct}% of the limit.`,
        })
      }
      if (b.pct >= 100) {
        await pushNotification({
          type: 'budget',
          title: 'Budget exceeded',
          message: `${b.name} has crossed its spending limit.`,
        })
      }
    }
    toast.success('Budget alerts synced to notifications.')
  }

  return (
    <>
      <SEO title="Budgets" path={ROUTES.budgets} />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Budget planner</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Limits, warnings, and progress for this month.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={checkAlerts}>
              Sync alerts
            </Button>
            <Button size="sm" onClick={openNew}>
              + New budget
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {enriched.map((b) => (
            <article
              key={b.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">{b.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {b.category === '__all__' ? 'All spending' : b.category} · {b.period}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    b.pct >= 100
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : b.pct >= (b.warnPercent || 80)
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {b.pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    b.pct >= 100 ? 'bg-red-500' : b.pct >= (b.warnPercent || 80) ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, b.pct)}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {formatMoney(b.spent)} of {formatMoney(b.limit)}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(b)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(b)}>
                  Delete
                </Button>
              </div>
            </article>
          ))}
          {enriched.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-sm md:col-span-2">No budgets yet. Create your first cap.</p>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit budget' : 'New budget'}>
        <form onSubmit={save} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
            >
              <option value="">Select…</option>
              <option value="__all__">All spending</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
          </div>
          <Input
            label="Monthly limit (Rs)"
            type="number"
            min="0"
            step="0.01"
            value={form.limit}
            onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
            error={errors.limit}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Period</label>
              <select
                value={form.period}
                onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <Input
              label="Warn at %"
              type="number"
              min="1"
              max="100"
              value={form.warnPercent}
              onChange={(e) => setForm((f) => ({ ...f, warnPercent: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
