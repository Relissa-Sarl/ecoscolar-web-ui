import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { SupportTicketSummary } from '../../app/types/support'
import { useSupportTicketsStore } from '../../app/stores/supportTicketsStore'

const serviceMocks = vi.hoisted(() => ({
  submitContact: vi.fn(),
  listMyTickets: vi.fn(),
  getMyTicket: vi.fn(),
  listTicketMessages: vi.fn(),
  sendTicketMessage: vi.fn()
}))

const { getSupportServiceMock } = vi.hoisted(() => ({
  getSupportServiceMock: () => serviceMocks
}))

vi.mock('../../app/services/supportService', () => ({
  getSupportService: getSupportServiceMock
}))

const buildTicket = (id: number): SupportTicketSummary => ({
  id,
  email: 'user@example.com',
  subject: 'Suivi de commande',
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

  it('loads ticket detail and messages successfully', async () => {
    const ticketDetail = { id: 1, email: 'user@example.com', subject: 'Subject', message: 'First msg', createdAt: '' }
    const ticketMessages = [{ id: 10, body: 'Reply 1', createdAt: '', isFromSupport: true }]
    serviceMocks.getMyTicket.mockResolvedValueOnce(ticketDetail)
    serviceMocks.listTicketMessages.mockResolvedValueOnce(ticketMessages)

    const store = useSupportTicketsStore()
    const result = await store.loadTicketDetail(1)

    expect(serviceMocks.getMyTicket).toHaveBeenCalledWith(1)
    expect(serviceMocks.listTicketMessages).toHaveBeenCalledWith(1)
    expect(store.currentTicket).toEqual(ticketDetail)
    expect(store.messages).toEqual(ticketMessages)
    expect(store.conversationEnabled).toBe(true)
    expect(result).toEqual({ ticket: ticketDetail, messages: ticketMessages })
  })

  it('falls back to cache or loaded tickets list on 404', async () => {
    const error404 = { statusCode: 404 }
    serviceMocks.getMyTicket.mockRejectedValueOnce(error404)
    serviceMocks.listMyTickets.mockResolvedValueOnce([
      { id: 1, email: 'user@example.com', subject: 'Subject', message: 'Cached msg', createdAt: '' }
    ])
    serviceMocks.listTicketMessages.mockResolvedValueOnce([])

    const store = useSupportTicketsStore()
    const result = await store.loadTicketDetail(1)

    expect(store.currentTicket).toEqual({
      id: 1,
      email: 'user@example.com',
      subject: 'Subject',
      createdAt: '',
      message: 'Cached msg'
    })
    expect(result?.ticket.message).toBe('Cached msg')
  })

  it('disables conversation if listing messages returns 404', async () => {
    const ticketDetail = { id: 1, email: 'user@example.com', subject: 'Subject', message: 'First msg', createdAt: '' }
    serviceMocks.getMyTicket.mockResolvedValueOnce(ticketDetail)
    serviceMocks.listTicketMessages.mockRejectedValueOnce({ statusCode: 404 })

    const store = useSupportTicketsStore()
    await store.loadTicketDetail(1)

    expect(store.conversationEnabled).toBe(false)
    expect(store.messages).toEqual([])
  })

  it('sends message successfully and appends it', async () => {
    const store = useSupportTicketsStore()
    store.messages = []
    store.conversationEnabled = true

    const createdMessage = { id: 20, body: 'New msg', createdAt: '', isFromSupport: false }
    serviceMocks.sendTicketMessage.mockResolvedValueOnce(createdMessage)

    const result = await store.sendMessage(1, 'New msg')

    expect(serviceMocks.sendTicketMessage).toHaveBeenCalledWith(1, 'New msg')
    expect(store.messages).toContainEqual(createdMessage)
    expect(result).toEqual(createdMessage)
  })

  it('does not send message if conversation is disabled', async () => {
    const store = useSupportTicketsStore()
    store.conversationEnabled = false

    const result = await store.sendMessage(1, 'New msg')

    expect(serviceMocks.sendTicketMessage).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('clears error correctly', () => {
    const store = useSupportTicketsStore()
    store.error = 'Some error'
    store.clearError()
    expect(store.error).toBeNull()
  })
})
