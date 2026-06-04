import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { SupportTicket } from '../../app/types/support'
import { useSupportTicketsStore } from '../../app/stores/supportTicketsStore'

const serviceMocks = vi.hoisted(() => ({
  submitContact: vi.fn(),
  listMyTickets: vi.fn()
}))

const { getSupportServiceMock } = vi.hoisted(() => ({
  getSupportServiceMock: () => serviceMocks
}))

vi.mock('../../app/services/supportService', () => ({
  getSupportService: getSupportServiceMock
}))

const buildTicket = (id: number): SupportTicket => ({
  id,
  email: 'user@example.com',
  subject: 'Suivi de commande',
  message: 'Ma commande EDU-123 n\'est pas arrivée.',
  createdAt: '2026-06-04T10:00:00.000Z'
})

describe('UC-02 · supportTickets store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads tickets from the service and marks them as loaded', async () => {
    serviceMocks.listMyTickets.mockResolvedValueOnce([buildTicket(1)])
    const store = useSupportTicketsStore()

    await store.loadTickets()

    expect(serviceMocks.listMyTickets).toHaveBeenCalledTimes(1)
    expect(store.tickets).toHaveLength(1)
    expect(store.hasLoaded).toBe(true)
    expect(store.error).toBeNull()
  })

  it('skips reload when tickets are already loaded', async () => {
    serviceMocks.listMyTickets.mockResolvedValueOnce([buildTicket(1)])
    const store = useSupportTicketsStore()
    await store.loadTickets()

    const cached = await store.loadTickets()

    expect(serviceMocks.listMyTickets).toHaveBeenCalledTimes(1)
    expect(cached).toHaveLength(1)
  })

  it('reloads tickets when force is true', async () => {
    serviceMocks.listMyTickets
      .mockResolvedValueOnce([buildTicket(1)])
      .mockResolvedValueOnce([buildTicket(1), buildTicket(2)])
    const store = useSupportTicketsStore()
    await store.loadTickets()

    await store.loadTickets(true)

    expect(serviceMocks.listMyTickets).toHaveBeenCalledTimes(2)
    expect(store.tickets).toHaveLength(2)
  })

  it('clears cached tickets', async () => {
    serviceMocks.listMyTickets.mockResolvedValueOnce([buildTicket(1)])
    const store = useSupportTicketsStore()
    await store.loadTickets()

    store.clearTickets()

    expect(store.tickets).toHaveLength(0)
    expect(store.hasLoaded).toBe(false)
    expect(store.error).toBeNull()
  })

  it('stores an error when loading fails', async () => {
    serviceMocks.listMyTickets.mockRejectedValueOnce(new Error('Network error'))
    const store = useSupportTicketsStore()

    await expect(store.loadTickets()).rejects.toThrow('Network error')
    expect(store.error).toBe('Network error')
    expect(store.isLoading).toBe(false)
  })

  it('stores a generic error when the failure is not an Error instance', async () => {
    serviceMocks.listMyTickets.mockRejectedValueOnce('server-down')
    const store = useSupportTicketsStore()

    await expect(store.loadTickets()).rejects.toBe('server-down')
    expect(store.error).toBe('Unable to load support tickets')
  })
})
