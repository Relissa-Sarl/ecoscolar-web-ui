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
})
