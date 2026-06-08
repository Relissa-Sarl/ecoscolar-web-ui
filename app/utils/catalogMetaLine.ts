import { AdvertType } from './enum/advertType'

export interface CatalogMetaLineInput {
  type: AdvertType
  isbn?: string | null
  category?: string | null
  subjects?: string | null
  subject?: string | null
  grade?: string | null
}

function trimValue(value?: string | null): string | undefined {
  const trimmed = value?.trim()
  return trimmed || undefined
}

export function buildCatalogMetaLine(item: CatalogMetaLineInput): string | undefined {
  if (item.type === AdvertType.BOOK) {
    return trimValue(item.isbn) ?? trimValue(item.category)
  }

  if (item.type === AdvertType.PRODUCT) {
    return trimValue(item.category)
  }

  if (item.type === AdvertType.SERVICE) {
    const subject = trimValue(item.subjects) ?? trimValue(item.subject)
    const grade = trimValue(item.grade)

    if (subject && grade) {
      return `${subject} · ${grade}`
    }

    return subject ?? grade
  }

  return undefined
}
