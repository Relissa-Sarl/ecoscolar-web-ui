import type { AdvertCatalogApiItem, CatalogListing } from '../types/catalog'
import { CatalogItemCondition, CatalogServiceBadge } from '../types/catalog'
import { AdvertType } from './enum/advertType'
import { buildCatalogMetaLine } from './catalogMetaLine'

function assertNever(value: never): never {
  throw new Error(`Unknown advert type: ${String(value)}`)
}

function categoryTabFromApiType(type: AdvertCatalogApiItem['type']): CatalogListing['categoryTab'] {
  switch (type) {
    case AdvertType.BOOK:
      return 'textbooks'
    case AdvertType.PRODUCT:
      return 'supplies'
    case AdvertType.SERVICE:
      return 'tutoring'
    default:
      return assertNever(type)
  }
}

export function enrichCatalogItem(item: AdvertCatalogApiItem, index: number): CatalogListing {
  const categoryTab = categoryTabFromApiType(item.type)
  const conditions = [CatalogItemCondition.New, CatalogItemCondition.Used, CatalogItemCondition.Good]

  const metaLine = buildCatalogMetaLine({
    type: item.type,
    isbn: item.isbn,
    category: item.category,
    subjects: item.subjects,
    grade: item.grade
  })

  const base = {
    id: String(item.id),
    title: item.title,
    price: item.price,
    type: item.type,
    sellerId: item.sellerId != null ? String(item.sellerId) : undefined,
    categoryTab,
    metaLine,
    location: `${1005 + index} Lausanne`,
    imageUrl: item.imageUrl ?? undefined,
    bookCategoryName: item.category ?? undefined,
    schoolGradeName: item.grade ?? undefined,
    subjectName: item.subjects ?? undefined
  }

  if (categoryTab === 'supplies') {
    return {
      ...base,
      itemCondition: conditions[index % conditions.length],
      hourly: false
    }
  }

  if (categoryTab === 'textbooks') {
    return {
      ...base,
      itemCondition: conditions[index % conditions.length],
      hourly: false
    }
  }

  return {
    ...base,
    serviceBadge: CatalogServiceBadge.VerifiedTutor,
    hourly: true
  }
}

export function mapCatalogApiToListings(items: AdvertCatalogApiItem[]): CatalogListing[] {
  return items.map((row, index) => enrichCatalogItem(row, index))
}
