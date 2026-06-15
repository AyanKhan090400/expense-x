import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'

export function filterByMonth(transactions, monthStart) {
  const end = endOfMonth(monthStart)
  return transactions.filter((t) => {
    const d = new Date(t.date)
    return isWithinInterval(d, { start: monthStart, end })
  })
}

export function summarizeMonth(transactions, monthStart) {
  const slice = filterByMonth(transactions, monthStart)
  let income = 0
  let expense = 0
  for (const t of slice) {
    const amt = Number(t.amount) || 0
    if (t.type === 'income') income += amt
    else expense += amt
  }
  return { income, expense, savings: income - expense, balance: income - expense }
}

export function categoryTotals(transactions, type) {
  const map = {}
  for (const t of transactions) {
    if (t.type !== type) continue
    const amt = Number(t.amount) || 0
    map[t.category] = (map[t.category] || 0) + amt
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function weeklyBarData(transactions) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 })
  const end = endOfWeek(new Date(), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })
  return days.map((day) => {
    const label = format(day, 'EEE')
    let expense = 0
    let income = 0
    for (const t of transactions) {
      const d = new Date(t.date)
      if (format(d, 'yyyy-MM-dd') !== format(day, 'yyyy-MM-dd')) continue
      const amt = Number(t.amount) || 0
      if (t.type === 'expense') expense += amt
      else income += amt
    }
    return { label, expense, income }
  })
}

export function monthlyLineData(transactions, monthsBack) {
  const out = []
  const now = new Date()
  for (let i = monthsBack - 1; i >= 0; i--) {
    const ms = startOfMonth(subMonths(now, i))
    const { income, expense } = summarizeMonth(transactions, ms)
    out.push({
      label: format(ms, 'MMM yy'),
      net: income - expense,
      expense,
      income,
    })
  }
  return out
}

export function budgetSpendForCategory(transactions, category, monthStart) {
  const slice = filterByMonth(transactions, monthStart).filter(
    (t) => t.type === 'expense' && (category === '__all__' || t.category === category),
  )
  return slice.reduce((acc, t) => acc + (Number(t.amount) || 0), 0)
}
