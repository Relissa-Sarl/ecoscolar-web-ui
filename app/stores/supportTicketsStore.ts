import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SupportTicket } from '../types/support'
import { getSupportService } from '../services/supportService'

export const useSupportTicketsStore = defineStore('supportTickets', () => {
  const tickets = ref<SupportTicket[]>([])
  const isLoading = ref(false)
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

  const clearTickets = () => {
    tickets.value = []
    hasLoaded.value = false
    error.value = null
  }

  return {
    tickets,
    isLoading,
    hasLoaded,
    error,
    loadTickets,
    clearTickets
  }
})
