import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createUserService } from '../../app/services/usersService'

const profileFixture = {
  id: 'user-1',
  nickname: 'demo',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@example.com',
  postalCode: '1000',
  birthdayDate: '2000-01-01',
  isOnboarded: true,
  location: { postalCode: '1000', city: 'Lausanne', region: 'VD' },
  spokenLanguages: []
}

describe('T8-2 · intégration route protégée JWT (usersService → API)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('appelle GET /users/me pour récupérer le profil authentifié', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce(profileFixture)
    const service = createUserService({ apiClient })

    const profile = await service.getMyProfile()

    expect(apiClient).toHaveBeenCalledWith('/users/me')
    expect(profile.email).toBe('demo@example.com')
  })

  it('propage une 401 quand la route protégée refuse l’accès', async () => {
    const apiClient = vi.fn().mockRejectedValue({ statusCode: 401 })
    const service = createUserService({ apiClient })

    await expect(service.getMyProfile()).rejects.toMatchObject({ statusCode: 401 })
  })
})
