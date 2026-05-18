import type { AdvertCatalogApiItem, CatalogListing } from '../types/catalog'

/** Catégorisation déterministe pour la maquette jusqu’à champs métier réels depuis l’API. */
export function enrichCatalogItem(item: AdvertCatalogApiItem, index: number): CatalogListing {
  const tabs = ['supplies', 'textbooks', 'tutoring'] as const satisfies CatalogListing['categoryTab'][]
  const categoryTab = tabs[index % tabs.length]!

  const metaByTab: Record<(typeof tabs)[number], { metaLine: string; hourly: boolean; subject?: string; grade?: string }> = {
    supplies: {
      metaLine: 'Cat. fournitures',
      hourly: false
    },
    textbooks: {
      metaLine: 'ISBN — disponible après scan',
      hourly: false,
      grade: ['Primaire', 'Secondaire', 'Maturité', 'Supérieur'][index % 4]
    },
    tutoring: {
      metaLine: 'Répétiteur • 4 séances mini',
      hourly: true,
      subject: ['Mathématiques', 'Français', 'Allemand'][index % 3],
      grade: ['Primaire', 'Secondaire', 'Maturité', 'Supérieur'][index % 4]
    }
  }

  const slot = metaByTab[categoryTab]

  const bookBadges = ['NEW', 'USED', 'GOOD'] as const
  const badge: CatalogListing['badge'] =
    categoryTab === 'tutoring'
      ? 'VERIFIED_TUTOR'
      : bookBadges[index % bookBadges.length]!

  const seed = item.id.replace(/-/g, '').slice(0, 8)
  const imageUrl = `https://picsum.photos/seed/ecoscolar_${seed}_400/520/440`

  return {
    id: item.id,
    title: item.title,
    price: item.price,
    categoryTab,
    badge,
    metaLine: slot.metaLine,
    location: `${1005 + index} Lausanne`,
    imageUrl,
    hourly: slot.hourly,
    subject: slot.subject,
    gradeLevelMock: slot.grade
  }
}

export function mapCatalogApiToListings(items: AdvertCatalogApiItem[]): CatalogListing[] {
  return items.map((row, index) => enrichCatalogItem(row, index))
}
