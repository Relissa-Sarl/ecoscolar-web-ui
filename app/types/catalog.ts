import type { AdvertType } from '@/utils/enum/advertType'

/** Réponse brute GET /api/v1/adverts/summary (Guid sérialisé en string). */
export interface AdvertCatalogApiItem {
  id: string
  title: string
  price: number
  type: AdvertType
  isbn?: string | null
  category?: string | null
  subject?: string | null
  grade?: string | null
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

export type CatalogGradeLevel = 'primary' | 'secondary' | 'maturity' | 'university'

export type CatalogSubjectCode = 'math' | 'french' | 'german'

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

export const CATALOG_CONDITION_BADGE_CLASS: Record<CatalogItemCondition, string> = {
  [CatalogItemCondition.New]: 'bg-emerald-600 text-white',
  [CatalogItemCondition.Used]: 'bg-amber-400 text-emerald-950',
  [CatalogItemCondition.Good]: 'bg-sky-400 text-emerald-950'
}

export const CATALOG_SERVICE_BADGE_CLASS: Record<CatalogServiceBadge, string> = {
  [CatalogServiceBadge.VerifiedTutor]: 'bg-emerald-800 text-white'
}

/** Données enrichies côté UI pour carte + filtres jusqu’extension API. */
export interface CatalogListing {
  id: string
  title: string
  price: number
  categoryTab: Exclude<CatalogCategoryTab, 'all'>
  /** Condition physique (fournitures / manuels uniquement). */
  itemCondition?: CatalogItemCondition
  /** Badge service (tutorat uniquement). */
  serviceBadge?: CatalogServiceBadge
  /** Clé i18n pour la ligne de métadonnée sous le visuel. */
  metaLineKey: string
  location: string
  imageUrl: string
  hourly: boolean
  subjectCode?: CatalogSubjectCode
  gradeLevel?: CatalogGradeLevel
}

export interface CatalogFetchResult {
  items: AdvertCatalogApiItem[]
  fromFallback: boolean
  hadError: boolean
}
