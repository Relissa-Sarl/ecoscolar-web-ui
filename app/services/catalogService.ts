import type {
  AdvertCatalogDetailApiItem,
  CatalogSummaryPageApiResponse
} from '../types/catalog'
import { useApi } from '../composables/useApi'
import type { AdvertType } from '../utils/enum/advertType'

type ApiClient = typeof useApi

const CATALOG_SUMMARIES_PATH = '/adverts/summary'

export interface CatalogSearchParams {
  q?: string
  isbn?: string
  type?: AdvertType
  bookCategoryIds?: string
  schoolGradeIds?: string
  subjectIds?: string
  category?: string
  subjects?: string
  grade?: string
  sort?: 'recent' | 'price_asc' | 'price_desc'
  page?: number
  pageSize?: number
}

export interface CatalogService {
  listSummaries: (params?: CatalogSearchParams) => Promise<CatalogSummaryPageApiResponse>
  getDetail: (id: string) => Promise<AdvertCatalogDetailApiItem>
}

export interface CatalogServiceDependencies {
  apiClient: ApiClient
}

export function createCatalogService({ apiClient }: CatalogServiceDependencies): CatalogService {
  const listSummaries = (params?: CatalogSearchParams) =>
    apiClient<CatalogSummaryPageApiResponse>(CATALOG_SUMMARIES_PATH, { query: params })
  const getDetail = (id: string) =>
    apiClient<AdvertCatalogDetailApiItem>(`${CATALOG_SUMMARIES_PATH}/${id}`)
  return { listSummaries, getDetail }
}

export function getCatalogService(): CatalogService {
  return createCatalogService({ apiClient: useApi as ApiClient })
}
