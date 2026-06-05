import type {
  SupportContactRequest,
  SupportContactResponse,
  SupportTicketDetail,
  SupportTicketMessage,
  SupportTicketSummary
} from '../types/support'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const SUPPORT_PATH = '/support'
const SUPPORT_MINE_PATH = '/support/mine'

export interface SupportService {
  submitContact: (input: SupportContactRequest) => Promise<SupportContactResponse>
  listMyTickets: () => Promise<SupportTicketSummary[]>
  getMyTicket: (id: number) => Promise<SupportTicketDetail>
  listTicketMessages: (id: number) => Promise<SupportTicketMessage[]>
  sendTicketMessage: (id: number, message: string) => Promise<SupportTicketMessage>
}

export function createSupportService({ apiClient }: { apiClient: ApiClient }): SupportService {
  return {
    submitContact: input =>
      apiClient<SupportContactResponse>(SUPPORT_PATH, {
        method: 'POST',
        body: input,
        skipAuth: true
      }),
    listMyTickets: () => apiClient<SupportTicketSummary[]>(SUPPORT_MINE_PATH),
    getMyTicket: id => apiClient<SupportTicketDetail>(`${SUPPORT_MINE_PATH}/${id}`),
    listTicketMessages: id =>
      apiClient<SupportTicketMessage[]>(`${SUPPORT_MINE_PATH}/${id}/messages`),
    sendTicketMessage: (id, message) =>
      apiClient<SupportTicketMessage>(`${SUPPORT_MINE_PATH}/${id}/messages`, {
        method: 'POST',
        body: { message }
      })
  }
}

export function getSupportService(): SupportService {
  return createSupportService({ apiClient: useApi as ApiClient })
}
