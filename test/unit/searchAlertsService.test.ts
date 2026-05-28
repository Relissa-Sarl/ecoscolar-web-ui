import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSearchAlertsService } from '../../app/services/searchAlertsService'

function createLocalStorageMock() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    }
  }
}

describe('searchAlertsService (mock)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates and lists alerts', async () => {
    const service = createSearchAlertsService()
    const created = await service.createAlert({ q: 'Biologie' })
    expect(created.id).toBeGreaterThan(0)
    expect(created.q).toBe('Biologie')

    const alerts = await service.listAlerts()
    expect(alerts).toHaveLength(1)
  })

  it('rejects empty criteria', async () => {
    const service = createSearchAlertsService()
    await expect(service.createAlert({})).rejects.toThrow(/criterion/i)
  })

  it('deletes an alert', async () => {
    const service = createSearchAlertsService()
    const created = await service.createAlert({ q: 'Math' })
    await service.deleteAlert(created.id)
    expect(await service.listAlerts()).toHaveLength(0)
  })
})