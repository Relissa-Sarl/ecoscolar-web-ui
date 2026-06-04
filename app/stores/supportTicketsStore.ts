import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  SupportTicketDetail,
  SupportTicketMessage,
  SupportTicketSummary
} from '../types/support'
import { getSupportService } from '../services/supportService'

const getStatusCode = (cause: unknown): number | undefined => {
  if (typeof cause === 'object' && cause !== null && 'statusCode' in cause)
    return (cause as { statusCode: number }).statusCode
  return undefined
}

const detailFromList = (
  rows: SupportTicketSummary[],
  id: number
): SupportTicketDetail | null => {
  const row = rows.find(t => t.id === id)
  if (!row?.message) return null
  return {
    id: row.id,
    email: row.email,
    subject: row.subject,
    createdAt: row.createdAt,
    message: row.message
  }
}

export const useSupportTicketsStore = defineStore('supportTickets', () => {
  const tickets = ref<SupportTicketSummary[]>([])
  const currentTicket = ref<SupportTicketDetail | null>(null)
  const messages = ref<SupportTicketMessage[]>([])
  const conversationEnabled = ref(true)
  const isLoading = ref(false)
  const isSending = ref(false)
  const hasLoaded = ref(false)
  const error = ref<string | null>(null)
  const service = getSupportService()

  const loadTickets = async (force = false) => {
    if (hasLoaded.value && !force) return tickets.value

    isLoading.value = true
    error.value = null
    try {
      tickets.value = await service.listMyTickets()
      hasLoaded.value = true
      return tickets.value
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load support tickets'
      throw cause
    } finally {
      isLoading.value = false
    }
  }

  const loadTicketDetail = async (id: number) => {
    isLoading.value = true
    error.value = null
    currentTicket.value = null
    messages.value = []
    conversationEnabled.value = true

    try {
      let ticket: SupportTicketDetail | null = null

      try {
        ticket = await service.getMyTicket(id)
      } catch (cause) {
        if (getStatusCode(cause) !== 404) throw cause

        if (!tickets.value.length)
          await loadTickets(true).catch(() => undefined)

        ticket = detailFromList(tickets.value, id)
      }

      if (!ticket) {
        error.value = 'Support ticket not found'
        return null
      }

      currentTicket.value = ticket

      try {
        messages.value = await service.listTicketMessages(id)
      } catch (cause) {
        if (getStatusCode(cause) === 404) {
          messages.value = []
          conversationEnabled.value = false
        } else {
          throw cause
        }
      }

      return { ticket, messages: messages.value }
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load support ticket'
      throw cause
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (id: number, body: string) => {
    if (!conversationEnabled.value)
      return

    isSending.value = true
    error.value = null
    try {
      const created = await service.sendTicketMessage(id, body)
      messages.value = [...messages.value, created]
      return created
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to send message'
      throw cause
    } finally {
      isSending.value = false
    }
  }

  const clearTickets = () => {
    tickets.value = []
    currentTicket.value = null
    messages.value = []
    conversationEnabled.value = true
    hasLoaded.value = false
    error.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    tickets,
    currentTicket,
    messages,
    conversationEnabled,
    isLoading,
    isSending,
    hasLoaded,
    error,
    loadTickets,
    loadTicketDetail,
    sendMessage,
    clearTickets,
    clearError
  }
})
