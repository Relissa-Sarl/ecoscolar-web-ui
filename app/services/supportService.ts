import type {
  SupportContactRequest,
  SupportContactResponse,
  SupportTicket
} from '../types/support'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const SUPPORT_PATH = '/support'
const SUPPORT_MINE_PATH = '/support/mine'

export interface SupportService {
  submitContact: (input: SupportContactRequest) => Promise<SupportContactResponse>
  listMyTickets: () => Promise<SupportTicket[]>
}

export function createSupportService({ apiClient }: { apiClient: ApiClient }): SupportService {
  return {
    submitContact: (input) =>
      apiClient<SupportContactResponse>(SUPPORT_PATH, {
        method: 'POST',
        body: input,
        skipAuth: true
      }),
    listMyTickets: () => apiClient<SupportTicket[]>(SUPPORT_MINE_PATH)
  }
}

export function getSupportService(): SupportService {
  return createSupportService({ apiClient: useApi as ApiClient })
}
