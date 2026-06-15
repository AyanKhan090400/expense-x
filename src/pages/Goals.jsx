import { useState } from 'react'
import toast from 'react-hot-toast'
import { format, parseISO, isFuture } from 'date-fns'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../context/AuthContext'
import { useExpenseData } from '../context/ExpenseDataContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { SEO } from '../components/SEO'
import { validateGoal } from '../utils/validation'
import { formatMoney } from '../utils/currency'

export function Goals() {
  const { user } = useAuth()
  const { goals, addGoal, updateGoal, deleteGoal, pushNotification } = useExpenseData()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: '',
    targetAmount: '',
    savedAmount: '0',
    deadline: '',
  })
  const [errors, setErrors] = useState({})

  const openNew = () => {
    setEditing(null)
    setForm({ title: '', targetAmount: '', savedAmount: '0', deadline: '' })
    setErrors({})
    setOpen(true)
  }

  const openEdit = (g) => {
    setEditing(g)
    setForm({
      title: g.title,
      targetAmount: String(g.targetAmount),
      savedAmount: String(g.savedAmount ?? 0),
      deadline: g.deadline,
    })
    setErrors({})
    setOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    const v = validateGoal({
      title: form.title,
      targetAmount: form.targetAmount,
      deadline: form.deadline,
    })
    setErrors(v)
    if (Object.keys(v).length) return
    try {
      if (editing) {
        await updateGoal(editing.id, {
          title: form.title,
          targetAmount: Number(form.targetAmount),
          savedAmount: Number(form.savedAmount),
          deadline: form.deadline,
        })
        toast.success('Goal updated')
      } else {
        await addGoal({
          title: form.title,
          targetAmount: Number(form.targetAmount),
          savedAmount: Number(form.savedAmount),
          deadline: form.deadline,
        })
        toast.success('Goal created')
      }
      setOpen(false)
    } catch (err) {
      toast.error(err?.message || 'Could not save goal')
    }
  }

  const remove = async (g) => {
    if (!window.confirm(`Delete goal “${g.title}”?`)) return
    try {
      await deleteGoal(g.id)
      toast.success('Goal removed')
    } catch (e) {
      toast.error(e?.message || 'Error')
    }
  }

  const remind = async (g) => {
    if (!user) return
    const target = Number(g.targetAmount) || 0
    const saved = Number(g.savedAmount) || 0
    await pushNotification({
      type: 'goal',
      title: 'Goal check-in',
      message: `${g.title}: ${formatMoney(saved)} saved of ${formatMoney(target)}.`,
    })
    toast.success('Reminder added to notifications.')
  }

  return (
    <>
      <SEO title="Saving goals" path={ROUTES.goals} />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saving goals</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Targets, deadlines, and progress you can feel.</p>
          </div>
          <Button size="sm" onClick={openNew}>
            + New goal
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const target = Number(g.targetAmount) || 0
            const saved = Number(g.savedAmount) || 0
            const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0
            const upcoming = g.deadline && isFuture(parseISO(g.deadline))
            return (
              <article
                key={g.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">{g.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Due {g.deadline ? format(parseISO(g.deadline), 'PP') : '—'}
                      {upcoming && ' · upcoming'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-brand-600">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {formatMoney(saved)} of {formatMoney(target)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(g)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => remind(g)}>
                    Remind me
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(g)}>
                    Delete
                  </Button>
                </div>
              </article>
            )
          })}
          {goals.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-sm md:col-span-2">No goals yet. Start with one realistic target.</p>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit goal' : 'New goal'}>
        <form onSubmit={save} className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            error={errors.title}
          />
          <Input
            label="Target amount (Rs)"
            type="number"
            min="0"
            step="0.01"
            value={form.targetAmount}
            onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
            error={errors.targetAmount}
          />
          <Input
            label="Saved so far (Rs)"
            type="number"
            min="0"
            step="0.01"
            value={form.savedAmount}
            onChange={(e) => setForm((f) => ({ ...f, savedAmount: e.target.value }))}
          />
          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            error={errors.deadline}
          />
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
