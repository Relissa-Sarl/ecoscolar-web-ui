import type { AdvertCatalogApiItem, AdvertCatalogDetailApiItem } from '../types/catalog'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const CATALOG_SUMMARIES_PATH = '/adverts/summary'

export interface CatalogSearchParams {
  q?: string
  isbn?: string
}

export interface CatalogService {
  listSummaries: (params?: CatalogSearchParams) => Promise<AdvertCatalogApiItem[]>
  getDetail: (id: string) => Promise<AdvertCatalogDetailApiItem>
}

export interface CatalogServiceDependencies {
  apiClient: ApiClient
}

export function createCatalogService({ apiClient }: CatalogServiceDependencies): CatalogService {
  const listSummaries = (params?: CatalogSearchParams) =>
    apiClient<AdvertCatalogApiItem[]>(CATALOG_SUMMARIES_PATH, { query: params })
  const getDetail = (id: string) =>
    apiClient<AdvertCatalogDetailApiItem>(`${CATALOG_SUMMARIES_PATH}/${id}`)
  return { listSummaries, getDetail }
}

export function getCatalogService(): CatalogService {
  return createCatalogService({ apiClient: useApi as ApiClient })
}
