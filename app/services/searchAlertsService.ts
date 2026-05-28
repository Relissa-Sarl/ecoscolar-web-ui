import type { CreateSearchAlertInput, SearchAlert } from '../types/searchAlert'
import { hasSearchCriteria } from '../types/searchAlert'

const STORAGE_KEY = 'ecoscolar-search-alerts'

export interface SearchAlertsService {
  listAlerts: () => Promise<SearchAlert[]>
  createAlert: (input: CreateSearchAlertInput) => Promise<SearchAlert>
  deleteAlert: (id: number) => Promise<void>
}

function readStorage(): SearchAlert[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SearchAlert[]) : []
  } catch {
    return []
  }
}

function writeStorage(alerts: SearchAlert[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
}

function nextId(alerts: SearchAlert[]): number {
  return alerts.reduce((max, alert) => Math.max(max, alert.id), 0) + 1
}

export function createSearchAlertsService(): SearchAlertsService {
  const listAlerts = async () =>
    [...readStorage()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const createAlert = async (input: CreateSearchAlertInput) => {
    if (!hasSearchCriteria(input)) {
      throw new Error('At least one search criterion is required.')
    }

    const alert: SearchAlert = {
      id: nextId(readStorage()),
      q: input.q?.trim() || null,
      isbn: input.isbn?.trim() || null,
      category: input.category?.trim() || null,
      minPrice: input.minPrice ?? null,
      maxPrice: input.maxPrice ?? null,
      subjects: input.subjects?.trim() || null,
      grade: input.grade?.trim() || null,
      createdAt: new Date().toISOString()
    }

    const alerts = readStorage()
    alerts.unshift(alert)
    writeStorage(alerts)
    return alert
  }

  const deleteAlert = async (id: number) => {
    writeStorage(readStorage().filter(alert => alert.id !== id))
  }

  return { listAlerts, createAlert, deleteAlert }
}

export function getSearchAlertsService(): SearchAlertsService {
  return createSearchAlertsService()
}
