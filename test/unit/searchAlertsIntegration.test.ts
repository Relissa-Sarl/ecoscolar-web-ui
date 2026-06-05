import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { SearchAlert } from '../../app/types/searchAlert'
import { createSearchAlertsService } from '../../app/services/searchAlertsService'
import { useSearchAlertsStore } from '../../app/stores/searchAlertsStore'

const storeServiceMocks = vi.hoisted(() => ({
  listAlerts: vi.fn(),
  createAlert: vi.fn(),
  deleteAlert: vi.fn()
}))

vi.mock('../../app/services/searchAlertsService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../app/services/searchAlertsService')>()
  return {
    ...actual,
    getSearchAlertsService: () => storeServiceMocks
  }
})

const buildAlert = (id: number, q = 'Biologie'): SearchAlert => ({
  id,
  q,
  isbn: null,
  category: null,
  minPrice: null,
  maxPrice: null,
  subjects: null,
  grade: null,
  createdAt: '2026-05-29T12:00:00.000Z'
})

describe('T5 · intégration alertes recherche (service → API)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enchaîne create, list et delete via /users/me/search-alerts', async () => {
    const created = buildAlert(1, 'Biologie')
    const apiClient = vi.fn()
      .mockResolvedValueOnce(created)
      .mockResolvedValueOnce([created])
      .mockResolvedValueOnce(undefined)

    const service = createSearchAlertsService({ apiClient })

    await service.createAlert({ q: 'Biologie' })
    const alerts = await service.listAlerts()
    await service.deleteAlert(1)

    expect(apiClient).toHaveBeenNthCalledWith(1, '/users/me/search-alerts', {
      method: 'POST',
      body: { q: 'Biologie' }
    })
    expect(apiClient).toHaveBeenNthCalledWith(2, '/users/me/search-alerts')
    expect(apiClient).toHaveBeenNthCalledWith(3, '/users/me/search-alerts/1', {
      method: 'DELETE'
    })
    expect(alerts).toHaveLength(1)
  })

  it('propage une 401 quand la route protégée refuse l’accès', async () => {
    const apiClient = vi.fn().mockRejectedValue({ statusCode: 401 })
    const service = createSearchAlertsService({ apiClient })

    await expect(service.listAlerts()).rejects.toMatchObject({ statusCode: 401 })
  })
})

describe('T5 · intégration store alertes recherche (store → service)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('enchaîne create, load et delete dans le store Pinia', async () => {
    const created = buildAlert(2, 'Calculatrice')
    storeServiceMocks.createAlert.mockResolvedValueOnce(created)
    storeServiceMocks.listAlerts.mockResolvedValueOnce([created])
    storeServiceMocks.deleteAlert.mockResolvedValueOnce(undefined)

    const store = useSearchAlertsStore()

    await store.createAlert({ q: 'Calculatrice' })
    expect(store.alerts).toHaveLength(1)

    await store.loadAlerts(true)
    expect(storeServiceMocks.listAlerts).toHaveBeenCalledTimes(1)

    await store.deleteAlert(2)
    expect(store.alerts).toHaveLength(0)
    expect(storeServiceMocks.deleteAlert).toHaveBeenCalledWith(2)
  })
})
