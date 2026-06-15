export function validateTransaction(data) {
  const errors = {}
  if (!data.title?.trim()) errors.title = 'Title is required'
  const amount = Number(data.amount)
  if (Number.isNaN(amount) || amount <= 0) errors.amount = 'Enter a valid amount'
  if (!data.category) errors.category = 'Category is required'
  if (!data.date) errors.date = 'Date is required'
  if (!data.type || !['income', 'expense'].includes(data.type))
    errors.type = 'Type must be income or expense'
  return errors
}

export function validateBudget(data) {
  const errors = {}
  if (!data.name?.trim()) errors.name = 'Name is required'
  const limit = Number(data.limit)
  if (Number.isNaN(limit) || limit <= 0) errors.limit = 'Enter a valid limit'
  if (data.category == null || data.category === '')
    errors.category = 'Pick a category or all spending'
  return errors
}

export function validateGoal(data) {
  const errors = {}
  if (!data.title?.trim()) errors.title = 'Title is required'
  const target = Number(data.targetAmount)
  if (Number.isNaN(target) || target <= 0) errors.targetAmount = 'Target must be positive'
  if (!data.deadline) errors.deadline = 'Deadline is required'
  return errors
}
