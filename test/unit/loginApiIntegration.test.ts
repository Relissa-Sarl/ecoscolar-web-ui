import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createUserService } from '../../app/services/usersService'

describe('T8-1 · intégration login API (usersService → API)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envoie email et mot de passe à POST /auth/login?useCookies=true', async () => {
    const apiClient = vi.fn().mockResolvedValue(undefined)
    const service = createUserService({ apiClient })

    await service.login('test@example.com', 'Password123!')

    expect(apiClient).toHaveBeenCalledWith('/auth/login?useCookies=true', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'Password123!' }
    })
  })

  it('propage une erreur API lorsque les identifiants sont invalides', async () => {
    const apiClient = vi.fn().mockRejectedValue({ statusCode: 401 })
    const service = createUserService({ apiClient })

    await expect(service.login('bad@example.com', 'wrong'))
      .rejects.toMatchObject({ statusCode: 401 })
  })
})
