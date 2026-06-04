import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SupportTicketSummary } from '../../app/types/support'
import { createSupportService } from '../../app/services/supportService'

const buildSummary = (id: number): SupportTicketSummary => ({
  id,
  email: 'user@example.com',
  subject: 'Signaler un bug',
  createdAt: '2026-06-04T10:00:00.000Z'
})

describe('UC-02 · supportService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits a contact request without auth', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({ id: 42 })
    const service = createSupportService({ apiClient })

    const response = await service.submitContact({
      email: 'user@example.com',
      subject: 'Signaler un bug',
      message: 'Le bouton favoris ne répond plus sur mobile.'
    })

    expect(response.id).toBe(42)
    expect(apiClient).toHaveBeenCalledWith('/support', {
      method: 'POST',
      body: {
        email: 'user@example.com',
        subject: 'Signaler un bug',
        message: 'Le bouton favoris ne répond plus sur mobile.'
      },
      skipAuth: true
    })
  })

  it('lists my tickets through the protected route', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([buildSummary(1)])
    const service = createSupportService({ apiClient })

    const tickets = await service.listMyTickets()

    expect(tickets).toHaveLength(1)
    expect(tickets[0]).not.toHaveProperty('message')
    expect(apiClient).toHaveBeenCalledWith('/support/mine')
  })

  it('loads ticket detail and conversation', async () => {
    const apiClient = vi.fn()
      .mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        subject: 'Signaler un bug',
        message: 'Description initiale.',
        createdAt: '2026-06-04T10:00:00.000Z'
      })
      .mockResolvedValueOnce([
        {
          id: 10,
          body: 'Merci, nous revenons vers vous.',
          isFromSupport: true,
          createdAt: '2026-06-04T11:00:00.000Z'
        }
      ])
      .mockResolvedValueOnce({
        id: 11,
        body: 'Merci pour la réponse.',
        isFromSupport: false,
        createdAt: '2026-06-04T12:00:00.000Z'
      })

    const service = createSupportService({ apiClient })

    const detail = await service.getMyTicket(1)
    const messages = await service.listTicketMessages(1)
    const sent = await service.sendTicketMessage(1, 'Merci pour la réponse.')

    expect(detail.message).toBe('Description initiale.')
    expect(messages).toHaveLength(1)
    expect(sent.isFromSupport).toBe(false)
    expect(apiClient).toHaveBeenCalledWith('/support/mine/1/messages', {
      method: 'POST',
      body: { message: 'Merci pour la réponse.' }
    })
  })
})
