import { CURRENCY_SYMBOLS, DEFAULT_CURRENCY } from '../constants/currencies'

export function formatMoney(amount, currencyCode = DEFAULT_CURRENCY) {
  const value = Number(amount) || 0
  if (currencyCode === 'PKR') {
    try {
      return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0,
      }).format(value)
    } catch {
      return `${CURRENCY_SYMBOLS.PKR}${value.toLocaleString('en-PK')}`
    }
  }
  const sym = CURRENCY_SYMBOLS[currencyCode] ?? CURRENCY_SYMBOLS.PKR
  return `${sym}${value.toFixed(0)}`
}
