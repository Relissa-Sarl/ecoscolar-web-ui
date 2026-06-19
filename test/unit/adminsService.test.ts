import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createadminService } from '../../app/services/adminsService'

describe('adminsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets current admin profile', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({ id: 'admin-1', firstName: 'Admin' })
    const service = createadminService({ apiClient })

    await service.getMyProfile()

    expect(apiClient).toHaveBeenCalledWith('/users/me')
  })

  it('gets all users', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([])
    const service = createadminService({ apiClient })

    await service.getAllUsers()

    expect(apiClient).toHaveBeenCalledWith('/admins/users')
  })

  it('toggles ban status for a user', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({ id: 'user-1', isBanned: true })
    const service = createadminService({ apiClient })

    await service.banUserToggle('user-1')

    expect(apiClient).toHaveBeenCalledWith('/admins/user-1/ban', {
      method: 'PATCH',
      skipAuth: true
    })
  })

  it('gets all support tickets', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([])
    const service = createadminService({ apiClient })

    await service.getAllSupportTickets()

    expect(apiClient).toHaveBeenCalledWith('/admins/supports')
  })

  it('sends a ticket message', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({ id: 1, message: 'Reply' })
    const service = createadminService({ apiClient })

    await service.sendTicketMessage(123, 'Hello')

    expect(apiClient).toHaveBeenCalledWith('/admins/supports/123/message', {
      method: 'POST',
      body: { message: 'Hello' }
    })
  })

  it('gets all adverts', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([])
    const service = createadminService({ apiClient })

    await service.getAllAdverts()

    expect(apiClient).toHaveBeenCalledWith('/adverts')
  })

  it('blocks an advert', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({ id: 1, status: 'BLOCKED' })
    const service = createadminService({ apiClient })

    await service.blockAdvert(456)

    expect(apiClient).toHaveBeenCalledWith('/admins/456/block', {
      method: 'PATCH'
    })
  })

  it('deletes an advert', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([])
    const service = createadminService({ apiClient })

    await service.deleteAdvert(789)

    expect(apiClient).toHaveBeenCalledWith('/adverts/789', {
      method: 'DELETE'
    })
  })

  it('gets all abuses', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([])
    const service = createadminService({ apiClient })

    await service.getAllAbuses()

    expect(apiClient).toHaveBeenCalledWith('/admins/abuses')
  })

  it('updates flag status', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({ id: 1, status: 'REVIEWED' })
    const service = createadminService({ apiClient })

    await service.updateFlagStatus(1, 'REVIEWED' as TicketStatus)

    expect(apiClient).toHaveBeenCalledWith('/admins/abuses/1/status', {
      method: 'PATCH',
      body: { status: 'REVIEWED' },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('deletes a flag', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce(undefined)
    const service = createadminService({ apiClient })

    await service.deleteFlag(1)

    expect(apiClient).toHaveBeenCalledWith('/admins/abuses/1', {
      method: 'DELETE'
    })
  })
})
