export interface SearchAlert {
  id: number
  q?: string | null
  isbn?: string | null
  category?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  subjects?: string | null
  grade?: string | null
  createdAt: string
}

export type CreateSearchAlertInput = Omit<SearchAlert, 'id' | 'createdAt'>

export function formatSearchAlertLabel(alert: SearchAlert): string {
  const parts = [
    alert.q,
    alert.isbn,
    alert.category,
    alert.subjects,
    alert.grade,
    alert.minPrice != null ? `≥ ${alert.minPrice} CHF` : null,
    alert.maxPrice != null ? `≤ ${alert.maxPrice} CHF` : null
  ].filter((part): part is string => Boolean(part?.trim()))

  return parts.length > 0 ? parts.join(' · ') : 'Recherche sans critère'
}

export function hasSearchCriteria(input: CreateSearchAlertInput): boolean {
  return Boolean(
    input.q?.trim()
    || input.isbn?.trim()
    || input.category?.trim()
    || input.subjects?.trim()
    || input.grade?.trim()
    || input.minPrice != null
    || input.maxPrice != null
  )
}

export function buildShopSearchQuery(alert: SearchAlert): Record<string, string> {
  const query: Record<string, string> = {}
  if (alert.q?.trim()) query.q = alert.q.trim()
  if (alert.isbn?.trim()) query.isbn = alert.isbn.trim()
  if (alert.category?.trim()) query.category = alert.category.trim()
  if (alert.subjects?.trim()) query.subjects = alert.subjects.trim()
  if (alert.grade?.trim()) query.grade = alert.grade.trim()
  if (alert.minPrice != null) query.minPrice = String(alert.minPrice)
  if (alert.maxPrice != null) query.maxPrice = String(alert.maxPrice)
  return query
}
