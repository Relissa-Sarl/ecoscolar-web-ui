import type { AdvertCatalogApiItem } from '../types/catalog'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const CATALOG_SUMMARIES_PATH = '/v1/adverts'

export interface CatalogService {
  listSummaries: () => Promise<AdvertCatalogApiItem[]>
}

export interface CatalogServiceDependencies {
  apiClient: ApiClient
}

export function createCatalogService({ apiClient }: CatalogServiceDependencies): CatalogService {
  const listSummaries = () => apiClient<AdvertCatalogApiItem[]>(CATALOG_SUMMARIES_PATH)

  return { listSummaries }
}

export function getCatalogService(): CatalogService {
  return createCatalogService({ apiClient: useApi as ApiClient })
}
