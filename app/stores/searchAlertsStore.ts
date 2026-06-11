import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CreateSearchAlertInput, SearchAlert } from '../types/searchAlert'
import { getSearchAlertsService } from '../services/searchAlertsService'

export const useSearchAlertsStore = defineStore('searchAlerts', () => {
  const alerts = ref<SearchAlert[]>([])
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const error = ref<string | null>(null)
  const service = getSearchAlertsService()

  const loadAlerts = async (force = false) => {
    if (hasLoaded.value && !force) return alerts.value

    isLoading.value = true
    error.value = null
    try {
      alerts.value = await service.listAlerts()
      hasLoaded.value = true
      return alerts.value
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load search alerts'
      throw cause
    } finally {
      isLoading.value = false
    }
  }

  const createAlert = async (input: CreateSearchAlertInput) => {
    error.value = null
    const created = await service.createAlert(input)
    const alert = {
      ...created,
      ...input,
      id: created.id,
      createdAt: created.createdAt
    }
    alerts.value = [alert, ...alerts.value.filter(a => a.id !== created.id)]
    hasLoaded.value = true
    return alert
  }

  const deleteAlert = async (id: number) => {
    error.value = null
    await service.deleteAlert(id)
    alerts.value = alerts.value.filter(alert => alert.id !== id)
    hasLoaded.value = true
  }

  const clearAlerts = () => {
    alerts.value = []
    hasLoaded.value = false
    error.value = null
  }

  return {
    alerts,
    isLoading,
    hasLoaded,
    error,
    loadAlerts,
    createAlert,
    deleteAlert,
    clearAlerts
  }
})
