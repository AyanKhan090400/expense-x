import { format, subDays } from 'date-fns'

/**
 * Rule-based spending insights (no external API). Uses last 30 days of expenses.
 */
export function buildSpendingSuggestions(transactions) {
  const cutoff = subDays(new Date(), 30)
  const expenses = transactions.filter(
    (t) => t.type === 'expense' && new Date(t.date) >= cutoff,
  )
  if (expenses.length === 0) {
    return [
      {
        id: 'empty',
        title: 'Start tracking',
        detail: 'Add a few expenses to unlock personalized spending insights.',
        priority: 'low',
      },
    ]
  }

  const byCat = {}
  let total = 0
  for (const t of expenses) {
    byCat[t.category] = (byCat[t.category] || 0) + Number(t.amount)
    total += Number(t.amount)
  }
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const top = sorted[0]
  const suggestions = []

  if (top && total > 0) {
    const pct = Math.round((top[1] / total) * 100)
    if (pct >= 35) {
      suggestions.push({
        id: 'top-heavy',
        title: `${top[0]} is ${pct}% of recent spending`,
        detail: `Consider a weekly cap for ${top[0]} or set a budget alert in Expense X.`,
        priority: 'high',
      })
    }
  }

  const recurring = expenses.filter((t) => t.recurring).length
  if (recurring >= 3) {
    suggestions.push({
      id: 'recurring',
      title: 'Recurring charges add up',
      detail: 'Audit recurring expenses in Reports and cancel what you no longer use.',
      priority: 'medium',
    })
  }

  const dining = byCat['Food'] || 0
  if (dining > total * 0.25 && total > 10000) {
    suggestions.push({
      id: 'food',
      title: 'Food spending is elevated',
      detail: 'Meal planning or a grocery list often reduces food costs by 10–20%.',
      priority: 'medium',
    })
  }

  suggestions.push({
    id: 'snapshot',
    title: `Last 30 days: ${format(cutoff, 'MMM d')} – ${format(new Date(), 'MMM d')}`,
    detail: `You logged ${expenses.length} expenses in PKR. Keep tagging for sharper charts.`,
    priority: 'low',
  })

  return suggestions.slice(0, 5)
}
