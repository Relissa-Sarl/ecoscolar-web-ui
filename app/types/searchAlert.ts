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
