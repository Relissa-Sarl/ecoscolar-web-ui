import type { AdvertCatalogApiItem, CatalogListing } from '../types/catalog'
import { CatalogItemCondition, CatalogServiceBadge } from '../types/catalog'

/** Catégorisation déterministe pour la démo jusqu’à champs métier réels depuis l’API. */
export function enrichCatalogItem(item: AdvertCatalogApiItem, index: number): CatalogListing {
  const tabs = ['supplies', 'textbooks', 'tutoring'] as const satisfies CatalogListing['categoryTab'][]
  const categoryTab = tabs[index % tabs.length]!

  const gradeLevels = ['primary', 'secondary', 'maturity', 'university'] as const
  const subjectCodes = ['math', 'french', 'german'] as const
  const conditions = [CatalogItemCondition.New, CatalogItemCondition.Used, CatalogItemCondition.Good]

  const base = {
    id: item.id,
    title: item.title,
    price: item.price,
    categoryTab,
    location: `${1005 + index} Lausanne`,
    imageUrl: `https://picsum.photos/seed/ecoscolar_${item.id.replace(/-/g, '').slice(0, 8)}_400/520/440`
  }

  if (categoryTab === 'supplies') {
    return {
      ...base,
      itemCondition: conditions[index % conditions.length],
      metaLineKey: 'catalog.card.meta_supplies',
      hourly: false
    }
  }

  if (categoryTab === 'textbooks') {
    return {
      ...base,
      itemCondition: conditions[index % conditions.length],
      metaLineKey: 'catalog.card.meta_textbooks',
      hourly: false,
      gradeLevel: gradeLevels[index % gradeLevels.length]
    }
  }

  return {
    ...base,
    serviceBadge: CatalogServiceBadge.VerifiedTutor,
    metaLineKey: 'catalog.card.meta_tutoring',
    hourly: true,
    subjectCode: subjectCodes[index % subjectCodes.length],
    gradeLevel: gradeLevels[index % gradeLevels.length]
  }
}

export function mapCatalogApiToListings(items: AdvertCatalogApiItem[]): CatalogListing[] {
  return items.map((row, index) => enrichCatalogItem(row, index))
}
