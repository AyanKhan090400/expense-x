import { useState } from 'react'
import toast from 'react-hot-toast'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../context/AuthContext'
import { listAllTransactions } from '../services/transactions'
import { Button } from '../components/Button'
import { SEO } from '../components/SEO'
import { exportTransactionsCsv, exportTransactionsPdf } from '../utils/exportReports'

export function Reports() {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)

  const loadRows = async () => {
    if (!user) return []
    return listAllTransactions(user.uid)
  }

  const onCsv = async () => {
    setBusy(true)
    try {
      const rows = await loadRows()
      if (!rows.length) {
        toast.error('No transactions to export.')
        return
      }
      exportTransactionsCsv(rows)
      toast.success('CSV downloaded')
    } catch (e) {
      toast.error(e?.message || 'Export failed')
    } finally {
      setBusy(false)
    }
  }

  const onPdf = async () => {
    setBusy(true)
    try {
      const rows = await loadRows()
      if (!rows.length) {
        toast.error('No transactions to export.')
        return
      }
      exportTransactionsPdf(rows, 'Expense X Transactions')
      toast.success('PDF generated')
    } catch (e) {
      toast.error(e?.message || 'Export failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SEO title="Reports" path={ROUTES.reports} />
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Export your ledger for accountants, audits, or offline backups. Exports respect your latest Firestore
            data (up to 5,000 recent rows).
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Downloads</h2>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-5">
            <li>CSV opens in Excel, Google Sheets, or any spreadsheet tool.</li>
            <li>PDF is optimized for quick sharing and archival.</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={onCsv} disabled={busy}>
              Export CSV
            </Button>
            <Button variant="secondary" onClick={onPdf} disabled={busy}>
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
