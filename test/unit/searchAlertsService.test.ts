import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SearchAlert } from '../../app/types/searchAlert'
import { createSearchAlertsService } from '../../app/services/searchAlertsService'

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

describe('searchAlertsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists alerts through the API', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([buildAlert(1)])
    const service = createSearchAlertsService({ apiClient })

    const alerts = await service.listAlerts()

    expect(alerts).toHaveLength(1)
    expect(apiClient).toHaveBeenCalledWith('/users/me/search-alerts')
  })

  it('creates an alert through the API', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce(buildAlert(2, 'Calculatrice'))
    const service = createSearchAlertsService({ apiClient })

    const created = await service.createAlert({ q: 'Calculatrice' })

    expect(created.q).toBe('Calculatrice')
    expect(apiClient).toHaveBeenCalledWith('/users/me/search-alerts', {
      method: 'POST',
      body: { q: 'Calculatrice' }
    })
  })

  it('rejects empty criteria', async () => {
    const apiClient = vi.fn()
    const service = createSearchAlertsService({ apiClient })

    await expect(service.createAlert({})).rejects.toThrow(/criterion/i)
    expect(apiClient).not.toHaveBeenCalled()
  })

  it('deletes an alert through the API', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce(undefined)
    const service = createSearchAlertsService({ apiClient })

    await service.deleteAlert(3)

    expect(apiClient).toHaveBeenCalledWith('/users/me/search-alerts/3', {
      method: 'DELETE'
    })
  })
})
