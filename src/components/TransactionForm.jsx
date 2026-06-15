import { useState } from 'react'
import toast from 'react-hot-toast'
import { Input, TextArea } from './Input'
import { Button } from './Button'
import { validateTransaction } from '../utils/validation'
import { uploadReceipt } from '../services/storage'
import { useAuth } from '../context/AuthContext'

const PAYMENT_METHODS = ['Card', 'Cash', 'Bank Transfer', 'Digital Wallet', 'Other']

const empty = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'Card',
  notes: '',
  tags: '',
  recurring: false,
  recurringRule: '',
  billDueDate: '',
}

function buildForm(initial) {
  if (!initial) return { ...empty }
  return {
    title: initial.title || '',
    amount: String(initial.amount ?? ''),
    type: initial.type || 'expense',
    category: initial.category || '',
    date: initial.date || empty.date,
    paymentMethod: initial.paymentMethod || 'Card',
    notes: initial.notes || '',
    tags: (initial.tags || []).join(', '),
    recurring: Boolean(initial.recurring),
    recurringRule: initial.recurringRule || '',
    billDueDate: initial.billDueDate || '',
  }
}

export function TransactionForm({
  categories,
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save transaction',
}) {
  const { user } = useAuth()
  const [form, setForm] = useState(() => buildForm(initial))
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    const v = validateTransaction(payload)
    setErrors(v)
    if (Object.keys(v).length) {
      toast.error('Please fix the highlighted fields.')
      return
    }
    setSaving(true)
    try {
      let receiptUrl = initial?.receiptUrl || ''
      if (file && user) {
        receiptUrl = await uploadReceipt(user.uid, file)
      }
      await onSubmit({
        ...payload,
        receiptUrl: receiptUrl || initial?.receiptUrl || '',
      })
      toast.success(initial ? 'Transaction updated' : 'Transaction added')
      if (!initial) setForm({ ...empty, date: new Date().toISOString().slice(0, 10) })
      setFile(null)
    } catch (err) {
      toast.error(err?.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          name="title"
          label="Title"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        <Input
          name="amount"
          label="Amount (Rs)"
          type="number"
          step="0.01"
          min="0"
          value={form.amount}
          onChange={handleChange}
          error={errors.amount}
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input name="date" label="Date" type="date" value={form.date} onChange={handleChange} error={errors.date} />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
          >
            {PAYMENT_METHODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TextArea name="notes" label="Notes" value={form.notes} onChange={handleChange} />
      <Input
        name="tags"
        label="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
        placeholder="coffee, work, tax-deductible"
      />

      <div className="space-y-2 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="recurring" checked={form.recurring} onChange={handleChange} />
          Recurring transaction
        </label>
        {form.recurring && (
          <Input
            name="recurringRule"
            label="Recurring rule (e.g. monthly on 1st)"
            value={form.recurringRule}
            onChange={handleChange}
          />
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Receipt image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 dark:file:bg-brand-950 dark:file:text-brand-300"
          />
          {initial?.receiptUrl && (
            <a
              href={initial.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-600 hover:underline"
            >
              View current receipt
            </a>
          )}
        </div>
        <Input
          name="billDueDate"
          label="Bill due date (optional)"
          type="date"
          value={form.billDueDate}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
