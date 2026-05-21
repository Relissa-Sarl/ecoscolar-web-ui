import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createUserService } from '../../app/services/usersService'
import { createAdvertService } from '../../app/services/advertService'
import { AdvertCondition } from '../../app/utils/enum/advertCondition'
import { AdvertLanguage } from '../../app/utils/enum/advertLanguage'

describe('T8-5 · intégration flux inscription → annonce', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enchaîne register, login et récupération du profil', async () => {
    const apiClient = vi.fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        id: 'user-flow-1',
        nickname: 'flow',
        firstName: 'Flow',
        lastName: 'User',
        email: 'flow@example.com',
        postalCode: '1000',
        birthdayDate: '2000-01-01',
        isOnboarded: true,
        location: { postalCode: '1000', city: 'Lausanne', region: 'VD' },
        spokenLanguages: []
      })

    const service = createUserService({ apiClient })

    await service.register('flow@example.com', 'Password123!')
    await service.login('flow@example.com', 'Password123!')
    const profile = await service.getMyProfile()

    expect(apiClient).toHaveBeenNthCalledWith(1, '/auth/register', expect.objectContaining({ method: 'POST' }))
    expect(apiClient).toHaveBeenNthCalledWith(2, '/auth/login?useCookies=true', expect.objectContaining({ method: 'POST' }))
    expect(apiClient).toHaveBeenNthCalledWith(3, '/users/me')
    expect(profile.email).toBe('flow@example.com')
  })

  it('envoie la création d’annonce livre après authentification simulée', async () => {
    const apiClient = vi.fn().mockResolvedValue(undefined)
    const advertService = createAdvertService({ apiClient })

    const payload = {
      title: 'Manuel après inscription',
      description: 'Description du livre',
      price: 20,
      author: 'A. Test',
      publisher: 'Pub',
      edition: '1',
      isbn: '978-3-16-148410-0',
      bookCategoryId: 1,
      writtenLanguage: AdvertLanguage.FR,
      condition: AdvertCondition.NEW
    }

    await advertService.createBookAdvert(payload)

    expect(apiClient).toHaveBeenCalledWith('/adverts/books', {
      method: 'POST',
      body: payload
    })
  })
})
