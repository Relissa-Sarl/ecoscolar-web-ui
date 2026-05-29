import type { CreateSearchAlertInput, SearchAlert } from '../types/searchAlert'
import { hasSearchCriteria } from '../types/searchAlert'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

export interface SearchAlertsService {
  listAlerts: () => Promise<SearchAlert[]>
  createAlert: (input: CreateSearchAlertInput) => Promise<SearchAlert>
  deleteAlert: (id: number) => Promise<void>
}

export interface SearchAlertsServiceDependencies {
  apiClient: ApiClient
}

const SEARCH_ALERTS_PATH = '/users/me/search-alerts'

export function createSearchAlertsService({
  apiClient
}: SearchAlertsServiceDependencies): SearchAlertsService {
  const listAlerts = async () => apiClient<SearchAlert[]>(SEARCH_ALERTS_PATH)

  const createAlert = async (input: CreateSearchAlertInput) => {
    if (!hasSearchCriteria(input)) {
      throw new Error('At least one search criterion is required.')
    }
    return apiClient<SearchAlert>(SEARCH_ALERTS_PATH, {
      method: 'POST',
      body: input
    })
  }

  const deleteAlert = async (id: number) => {
    await apiClient<void>(`${SEARCH_ALERTS_PATH}/${id}`, {
      method: 'DELETE'
    })
  }

  return { listAlerts, createAlert, deleteAlert }
}

export function getSearchAlertsService(): SearchAlertsService {
  return createSearchAlertsService({
    apiClient: useApi as ApiClient
  })
}
