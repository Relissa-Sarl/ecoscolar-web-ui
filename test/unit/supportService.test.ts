import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SupportTicket } from '../../app/types/support'
import { createSupportService } from '../../app/services/supportService'

const buildTicket = (id: number): SupportTicket => ({
  id,
  email: 'user@example.com',
  subject: 'Signaler un bug',
  message: 'Le bouton favoris ne répond plus sur mobile.',
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
    const apiClient = vi.fn().mockResolvedValueOnce([buildTicket(1)])
    const service = createSupportService({ apiClient })

    const tickets = await service.listMyTickets()

    expect(tickets).toHaveLength(1)
    expect(apiClient).toHaveBeenCalledWith('/support/mine')
  })
})
