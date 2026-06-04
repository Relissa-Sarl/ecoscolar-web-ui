import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { SupportTicket } from '../../app/types/support'
import { createSupportService } from '../../app/services/supportService'
import { useSupportTicketsStore } from '../../app/stores/supportTicketsStore'

const storeServiceMocks = vi.hoisted(() => ({
  submitContact: vi.fn(),
  listMyTickets: vi.fn()
}))

vi.mock('../../app/services/supportService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../app/services/supportService')>()
  return {
    ...actual,
    getSupportService: () => storeServiceMocks
  }
})

const buildTicket = (id: number, subject = 'Suivi de commande'): SupportTicket => ({
  id,
  email: 'user@example.com',
  subject,
  message: 'Ma commande EDU-123 n\'est pas arrivée.',
  createdAt: '2026-06-04T10:00:00.000Z'
})

describe('UC-02 · intégration support (service → API)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enchaîne submit puis list via /support et /support/mine', async () => {
    const apiClient = vi.fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce([buildTicket(1)])

    const service = createSupportService({ apiClient })

    await service.submitContact({
      email: 'user@example.com',
      subject: 'Suivi de commande',
      message: 'Ma commande EDU-123 n\'est pas arrivée.'
    })
    const tickets = await service.listMyTickets()

    expect(apiClient).toHaveBeenNthCalledWith(1, '/support', {
      method: 'POST',
      body: {
        email: 'user@example.com',
        subject: 'Suivi de commande',
        message: 'Ma commande EDU-123 n\'est pas arrivée.'
      },
      skipAuth: true
    })
    expect(apiClient).toHaveBeenNthCalledWith(2, '/support/mine')
    expect(tickets).toHaveLength(1)
    expect(tickets[0]?.subject).toBe('Suivi de commande')
  })

  it('propage une 401 quand /support/mine refuse l’accès', async () => {
    const apiClient = vi.fn().mockRejectedValue({ statusCode: 401 })
    const service = createSupportService({ apiClient })

    await expect(service.listMyTickets()).rejects.toMatchObject({ statusCode: 401 })
  })
})

describe('UC-02 · intégration store support (store → service)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('enchaîne clear cache puis reload après un nouvel envoi', async () => {
    storeServiceMocks.listMyTickets
      .mockResolvedValueOnce([buildTicket(1)])
      .mockResolvedValueOnce([buildTicket(2, 'Signaler un bug')])

    const store = useSupportTicketsStore()

    await store.loadTickets()
    expect(store.tickets).toHaveLength(1)

    store.clearTickets()
    expect(store.hasLoaded).toBe(false)

    await store.loadTickets()
    expect(store.tickets).toHaveLength(1)
    expect(store.tickets[0]?.id).toBe(2)
    expect(storeServiceMocks.listMyTickets).toHaveBeenCalledTimes(2)
  })
})
