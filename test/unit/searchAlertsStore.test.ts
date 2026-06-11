import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { SearchAlert } from '../../app/types/searchAlert'
import { useSearchAlertsStore } from '../../app/stores/searchAlertsStore'

const serviceMocks = vi.hoisted(() => ({
  listAlerts: vi.fn(),
  createAlert: vi.fn(),
  deleteAlert: vi.fn()
}))

const { getSearchAlertsServiceMock } = vi.hoisted(() => ({
  getSearchAlertsServiceMock: () => serviceMocks
}))

vi.mock('../../app/services/searchAlertsService', () => ({
  getSearchAlertsService: getSearchAlertsServiceMock
}))

const buildAlert = (id: number, q = 'Biologie'): SearchAlert => ({
  id,
  q,
  isbn: null,
  category: null,
  minPrice: null,
  maxPrice: null,
  subjects: null,
  grade: null,
  createdAt: '2026-05-19T12:00:00.000Z'
})

describe('searchAlerts store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads alerts from the service and marks them as loaded', async () => {
    serviceMocks.listAlerts.mockResolvedValueOnce([buildAlert(1)])
    const store = useSearchAlertsStore()

    await store.loadAlerts()

    expect(serviceMocks.listAlerts).toHaveBeenCalledTimes(1)
    expect(store.alerts).toHaveLength(1)
    expect(store.hasLoaded).toBe(true)
  })

  it('creates an alert through the service and prepends it to the list', async () => {
    serviceMocks.createAlert.mockResolvedValueOnce(buildAlert(2, 'Calculatrice'))
    const store = useSearchAlertsStore()

    const created = await store.createAlert({ q: 'Calculatrice' })

    expect(created.q).toBe('Calculatrice')
    expect(store.alerts[0]?.id).toBe(2)
    expect(store.hasLoaded).toBe(true)
  })

  it('deletes an alert through the service', async () => {
    serviceMocks.listAlerts.mockResolvedValueOnce([buildAlert(3, 'Math')])
    serviceMocks.deleteAlert.mockResolvedValueOnce(undefined)
    const store = useSearchAlertsStore()
    await store.loadAlerts()

    await store.deleteAlert(3)

    expect(serviceMocks.deleteAlert).toHaveBeenCalledWith(3)
    expect(store.alerts).toHaveLength(0)
  })

  it('handles standard Error when loading alerts fails', async () => {
    const testError = new Error('Database connection failed')
    serviceMocks.listAlerts.mockRejectedValueOnce(testError)
    const store = useSearchAlertsStore()

    await expect(store.loadAlerts()).rejects.toThrow(testError)
    expect(store.error).toBe('Database connection failed')
    expect(store.isLoading).toBe(false)
  })

  it('handles non-Error objects when loading alerts fails', async () => {
    serviceMocks.listAlerts.mockRejectedValueOnce('Some string error')
    const store = useSearchAlertsStore()

    await expect(store.loadAlerts()).rejects.toBe('Some string error')
    expect(store.error).toBe('Unable to load search alerts')
    expect(store.isLoading).toBe(false)
  })

  it('does not call the service if already loaded and force is false', async () => {
    serviceMocks.listAlerts.mockResolvedValueOnce([buildAlert(1)])
    const store = useSearchAlertsStore()

    await store.loadAlerts()
    expect(serviceMocks.listAlerts).toHaveBeenCalledTimes(1)

    const result = await store.loadAlerts()
    expect(serviceMocks.listAlerts).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(1)
  })

  it('calls the service if already loaded and force is true', async () => {
    serviceMocks.listAlerts.mockResolvedValue([buildAlert(1)])
    const store = useSearchAlertsStore()

    await store.loadAlerts()
    expect(serviceMocks.listAlerts).toHaveBeenCalledTimes(1)

    await store.loadAlerts(true)
    expect(serviceMocks.listAlerts).toHaveBeenCalledTimes(2)
  })

  it('clears alerts successfully', async () => {
    serviceMocks.listAlerts.mockResolvedValueOnce([buildAlert(1)])
    const store = useSearchAlertsStore()
    await store.loadAlerts()
    expect(store.hasLoaded).toBe(true)
    expect(store.alerts).toHaveLength(1)

    store.clearAlerts()
    expect(store.alerts).toHaveLength(0)
    expect(store.hasLoaded).toBe(false)
    expect(store.error).toBeNull()
  })
})
