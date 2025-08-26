/**
 * USD formatting (en-US)
 */
export function formatUSD(value) {
  const num = Number(value || 0)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
}

/**
 * Venezuelan Bolívares with dot thousands and comma decimals.
 * Example: 1000.5 -> "1.000,50 Bs"
 */
export function formatVES(value) {
  const num = Number(value || 0)
  // Format with es-VE locale to ensure comma decimals and dot thousands.
  const formatted = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
  return `${formatted} Bs`
}
