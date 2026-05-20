import type { AdvertCatalogApiItem } from '../types/catalog'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const CATALOG_SUMMARIES_PATH = '/v1/adverts/summary'

export interface CatalogSearchParams {
  q?: string
  isbn?: string
}

export interface CatalogService {
  listSummaries: (params?: CatalogSearchParams) => Promise<AdvertCatalogApiItem[]>
}

export interface CatalogServiceDependencies {
  apiClient: ApiClient
}

export function createCatalogService({ apiClient }: CatalogServiceDependencies): CatalogService {
  const listSummaries = (params?: CatalogSearchParams) =>
    apiClient<AdvertCatalogApiItem[]>(CATALOG_SUMMARIES_PATH, { query: params })
  return { listSummaries }
}

export function getCatalogService(): CatalogService {
  return createCatalogService({ apiClient: useApi as ApiClient })
}