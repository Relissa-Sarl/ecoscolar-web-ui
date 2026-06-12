export function formatPrice(value: number | string | undefined | null): string {
  if (value == null) return '0.00'
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return '0.00'

  return new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue)
}
