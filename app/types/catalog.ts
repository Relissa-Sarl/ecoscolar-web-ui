/** Réponse brute du catalogue GET /api/v1/adverts (contrat ASP.NET sérialise Guid en chaîne). */
export interface AdvertCatalogApiItem {
  id: string
  title: string
  price: number
}

export type CatalogCategoryTab = 'all' | 'textbooks' | 'supplies' | 'tutoring'

export interface GradeFilterState {
  primary: boolean
  secondary: boolean
  maturite: boolean
  superieur: boolean
}

export interface SubjectFilterState {
  math: boolean
  french: boolean
  german: boolean
}

/** Données enrichies côté UI pour carte + filtres jusqu’extension API (type, image, badges…). */
export interface CatalogListing {
  id: string
  title: string
  price: number
  categoryTab: Exclude<CatalogCategoryTab, 'all'>
  badge: 'NEW' | 'USED' | 'GOOD' | 'VERIFIED_TUTOR'
  metaLine: string
  location: string
  imageUrl: string
  hourly: boolean
  /** Optionnel futur champ API (matière pour services). */
  subject?: string
  /** Pour cases « niveau » (mock). */
  gradeLevelMock?: string
}
