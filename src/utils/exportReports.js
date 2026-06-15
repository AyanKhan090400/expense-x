import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

export function exportTransactionsCsv(transactions, filename = 'transactions.csv') {
  const headers = [
    'Title',
    'Type',
    'Amount',
    'Category',
    'Date',
    'Payment',
    'Tags',
    'Notes',
  ]
  const rows = transactions.map((t) => [
    escapeCsv(t.title),
    t.type,
    t.amount,
    t.category,
    t.date,
    t.paymentMethod ?? '',
    (t.tags || []).join(';'),
    escapeCsv(t.notes || ''),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, filename)
}

function escapeCsv(s) {
  const str = String(s ?? '')
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export function exportTransactionsPdf(transactions, title = 'Transaction Report') {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(title, 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated ${format(new Date(), 'PPpp')}`, 14, 26)

  autoTable(doc, {
    startY: 32,
    head: [['Title', 'Type', 'Amount', 'Category', 'Date']],
    body: transactions.map((t) => [
      t.title,
      t.type,
      String(t.amount),
      t.category,
      t.date,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [12, 117, 199] },
  })

  doc.save(`report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}
