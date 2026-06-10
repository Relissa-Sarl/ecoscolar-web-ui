import type { AdvertType } from '~/utils/enum/advertType'

export interface SearchAlert {
  id: number
  advertType?: AdvertType | null
  q?: string | null
  isbn?: string | null
  bookCategoryId?: number | null
  bookCategory?: string | null
  productCategoryId?: number | null
  productCategory?: string | null
  subjectId?: number | null
  subject?: string | null
  schoolGradeId?: number | null
  grade?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  matchedCount?: number
  createdAt: string
}

export type CreateSearchAlertInput = Omit<SearchAlert, 'id' | 'createdAt'>

export function formatSearchAlertLabel(alert: SearchAlert): string {
  const advertTypeLabels: Partial<Record<AdvertType, string>> = {
    BOOK: 'Manuels',
    PRODUCT: 'Fournitures',
    SERVICE: 'Cours & soutien'
  }

  const parts = [
    alert.advertType ? advertTypeLabels[alert.advertType] : null,
    alert.q,
    alert.isbn,
    alert.bookCategory,
    alert.productCategory,
    alert.subject,
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
    || input.bookCategoryId != null
    || input.productCategoryId != null
    || input.subjectId != null
    || input.schoolGradeId != null
    || input.minPrice != null
    || input.maxPrice != null
  )
}

export function buildShopSearchQuery(alert: SearchAlert): Record<string, string> {
  const query: Record<string, string> = {}
  if (alert.advertType?.trim()) query.type = alert.advertType.trim()
  if (alert.q?.trim()) query.q = alert.q.trim()
  if (alert.isbn?.trim()) query.isbn = alert.isbn.trim()
  if (alert.bookCategoryId != null) query.bookCategoryId = String(alert.bookCategoryId)
  if (alert.productCategoryId != null) query.productCategoryId = String(alert.productCategoryId)
  if (alert.subjectId != null) query.subjectId = String(alert.subjectId)
  if (alert.schoolGradeId != null) query.gradeId = String(alert.schoolGradeId)
  if (alert.minPrice != null) query.minPrice = String(alert.minPrice)
  if (alert.maxPrice != null) query.maxPrice = String(alert.maxPrice)
  return query
}
