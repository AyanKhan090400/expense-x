import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../context/AuthContext'
import { useExpenseData } from '../context/ExpenseDataContext'
import { useCategories } from '../hooks/useCategories'
import { useVoiceExpense } from '../hooks/useVoiceExpense'
import { TransactionForm } from '../components/TransactionForm'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { SEO } from '../components/SEO'
import { formatMoney } from '../utils/currency'
import { Input } from '../components/Input'

const PAGE_SIZE = 10

export function Transactions() {
  const { profile } = useAuth()
  const categories = useCategories(profile)
  const { transactions, addTx, updateTx, deleteTx, loading } = useExpenseData()
  const { listen, listening, supported } = useVoiceExpense()

  const [voicePrefill, setVoicePrefill] = useState(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState('date-desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formNonce, setFormNonce] = useState(0)

  const filtered = useMemo(() => {
    let rows = [...transactions]
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.notes || '').toLowerCase().includes(q) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(q)),
      )
    }
    if (category) rows = rows.filter((t) => t.category === category)
    if (type) rows = rows.filter((t) => t.type === type)
    rows.sort((a, b) => {
      const ad = new Date(a.date).getTime()
      const bd = new Date(b.date).getTime()
      const aa = Number(a.amount)
      const ba = Number(b.amount)
      switch (sort) {
        case 'date-asc':
          return ad - bd
        case 'amount-desc':
          return ba - aa
        case 'amount-asc':
          return aa - ba
        default:
          return bd - ad
      }
    })
    return rows
  }, [transactions, search, category, type, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const slice = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    setVoicePrefill(null)
    setFormNonce((n) => n + 1)
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setVoicePrefill(null)
    setFormNonce((n) => n + 1)
    setModalOpen(true)
  }

  const onVoice = async () => {
    try {
      const parsed = await listen()
      setVoicePrefill(parsed)
      setEditing(null)
      setFormNonce((n) => n + 1)
      setModalOpen(true)
      toast.success('Voice captured — review and save.')
    } catch {
      /* toast in hook */
    }
  }

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete “${t.title}”?`)) return
    try {
      await deleteTx(t.id)
      toast.success('Deleted')
    } catch (e) {
      toast.error(e?.message || 'Could not delete')
    }
  }

  return (
    <>
      <SEO title="Transactions" path={ROUTES.transactions} />
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, sort, and paginate your ledger.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {supported && (
              <Button type="button" variant="secondary" onClick={onVoice} disabled={listening}>
                {listening ? 'Listening…' : '🎙️ Voice add'}
              </Button>
            )}
            <Button type="button" onClick={openCreate}>
              + Add transaction
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 grid lg:grid-cols-5 gap-3">
          <Input
            placeholder="Search title, notes, tags…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            aria-label="Search transactions"
          />
          <select
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
            value={type}
            onChange={(e) => {
              setType(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by type"
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort transactions"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount high → low</option>
            <option value="amount-asc">Amount low → high</option>
          </select>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Adjust filters or add your first transaction."
            action={<Button onClick={openCreate}>Add transaction</Button>}
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-left text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950/40">
                {slice.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {t.title}
                      {t.recurring && (
                        <span className="ml-2 text-[10px] uppercase font-bold text-brand-600">Recurring</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t.category}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{t.date}</td>
                    <td className="px-4 py-3 capitalize">{t.type}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">
                      {t.type === 'income' ? '+' : '−'}
                      {formatMoney(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {t.receiptUrl && (
                        <a
                          href={t.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline"
                        >
                          Receipt
                        </a>
                      )}
                      <button type="button" className="text-brand-600 hover:underline" onClick={() => openEdit(t)}>
                        Edit
                      </button>
                      <button type="button" className="text-red-600 hover:underline" onClick={() => handleDelete(t)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-3 text-sm">
            <Button
              variant="secondary"
              size="sm"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-slate-600 dark:text-slate-300">
              Page {pageSafe} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setVoicePrefill(null)
        }}
        title={editing ? 'Edit transaction' : 'New transaction'}
      >
        <TransactionForm
          key={formNonce}
          categories={categories}
          initial={editing || voicePrefill}
          onSubmit={async (data) => {
            if (editing) {
              await updateTx(editing.id, data)
            } else {
              await addTx(data)
            }
            setModalOpen(false)
            setVoicePrefill(null)
          }}
          onCancel={() => {
            setModalOpen(false)
            setVoicePrefill(null)
          }}
        />
      </Modal>
    </>
  )
}
