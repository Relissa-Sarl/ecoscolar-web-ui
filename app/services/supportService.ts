import type {
  SupportContactRequest,
  SupportContactResponse,
  SupportTicketDetail,
  SupportTicketMessage,
  SupportTicketSummary
} from '../types/support'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const TICKETS_PATH = '/tickets'

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
      apiClient<SupportContactResponse>(TICKETS_PATH, {
        method: 'POST',
        body: input,
        skipAuth: true
      }),
    listMyTickets: () => apiClient<SupportTicketSummary[]>(TICKETS_PATH),
    getMyTicket: id => apiClient<SupportTicketDetail>(`${TICKETS_PATH}/${id}`),
    listTicketMessages: id =>
      apiClient<SupportTicketMessage[]>(`${TICKETS_PATH}/${id}/messages`),
    sendTicketMessage: (id, message) =>
      apiClient<SupportTicketMessage>(`${TICKETS_PATH}/${id}/messages`, {
        method: 'POST',
        body: { message }
      })
  }
}

export function getSupportService(): SupportService {
  return createSupportService({ apiClient: useApi as ApiClient })
}
