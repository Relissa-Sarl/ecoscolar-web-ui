import type { AdvertType } from '@/utils/enum/advertType'

/** Réponse brute GET /api/v1/adverts/summary (id = AdvertId). */
export interface AdvertCatalogApiItem {
  id: number
  title: string
  price: number
  type: AdvertType
  isbn?: string | null
  category?: string | null
  subjects?: string | null
  grade?: string | null
}

export interface AdvertCatalogDetailApiItem extends AdvertCatalogApiItem {
  description: string
  imageUrl?: string | null
}

export type CatalogCategoryTab = 'all' | 'textbooks' | 'supplies' | 'tutoring'

/** État d’un article physique (fournitures / manuels). */
export enum CatalogItemCondition {
  New = 'NEW',
  Used = 'USED',
  Good = 'GOOD'
}

/** Badge réservé aux annonces service (ex. tuteur vérifié). */
export enum CatalogServiceBadge {
  VerifiedTutor = 'VERIFIED_TUTOR'
}

export const CATALOG_CONDITION_BADGE_CLASS: Record<CatalogItemCondition, string> = {
  [CatalogItemCondition.New]: 'bg-emerald-600 text-white',
  [CatalogItemCondition.Used]: 'bg-amber-400 text-emerald-950',
  [CatalogItemCondition.Good]: 'bg-sky-400 text-emerald-950'
}

export const CATALOG_SERVICE_BADGE_CLASS: Record<CatalogServiceBadge, string> = {
  [CatalogServiceBadge.VerifiedTutor]: 'bg-emerald-800 text-white'
}

export interface CatalogListing {
  id: string
  title: string
  price: number
  type: AdvertType
  categoryTab: Exclude<CatalogCategoryTab, 'all'>
  itemCondition?: CatalogItemCondition
  serviceBadge?: CatalogServiceBadge
  metaLine?: string
  location: string
  imageUrl: string
  hourly: boolean
  bookCategoryName?: string
  schoolGradeName?: string
  subjectName?: string
  seller?: string
}

export interface CatalogFetchResult {
  items: AdvertCatalogApiItem[]
  fromFallback: boolean
  hadError: boolean
}
