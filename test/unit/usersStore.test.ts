import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { useUsersStore } from '../../app/stores/usersStore'
import type { User } from '../../app/types/user'
import formatErrors from '../../app/utils/formatErrors'

const serviceMocks = vi.hoisted(() => ({
  getMyProfile: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
  deleteAccount: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn()
}))

vi.mock('../../app/services/usersService', () => ({
  getUserService: () => serviceMocks
}))

const navigateToMock = vi.fn()
const cookieMock = ref<string | null>(null)

vi.stubGlobal('navigateTo', navigateToMock)
vi.stubGlobal('useLocalePath', () => (path: string) => path)
vi.stubGlobal('useCookie', (name: string) => {
  return cookieMock
})
vi.stubGlobal('formatErrors', formatErrors)

const buildUser = (id: string): User => ({
  id,
  nickname: 'TestUser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@ecoscolar.ch',
  postalCode: '1000',
  birthdayDate: '2010-01-01',
  isOnboarded: true,
  isBanned: false,
  location: { postalCode: '1000', city: 'Lausanne', region: 'Vaud' },
  languages: [],
  roles: ['User']
})

describe('users store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    navigateToMock.mockReset()
    cookieMock.value = null
    Object.values(serviceMocks).forEach(mock => mock.mockReset())
    vi.clearAllMocks()
  })

  describe('fetchProfile', () => {
    it('returns cached user if already loaded', async () => {
      const store = useUsersStore()
      const cachedUser = buildUser('user-1')
      store.user = cachedUser
      store.hasLoaded = true

      const result = await store.fetchProfile()
      expect(result).toStrictEqual(cachedUser)
      expect(serviceMocks.getMyProfile).not.toHaveBeenCalled()
    })

    it('returns null if there is no session and not forced', async () => {
      const store = useUsersStore()
      const result = await store.fetchProfile()
      expect(result).toBeNull()
      expect(serviceMocks.getMyProfile).not.toHaveBeenCalled()
    })

    it('calls getMyProfile and updates state when forced or session cookie exists', async () => {
      const store = useUsersStore()
      const mockUserProfile = buildUser('user-2')
      serviceMocks.getMyProfile.mockResolvedValueOnce(mockUserProfile)
      cookieMock.value = 'true'

      await store.fetchProfile()

      expect(serviceMocks.getMyProfile).toHaveBeenCalledTimes(1)
      expect(store.user).toEqual(mockUserProfile)
      expect(store.hasLoaded).toBe(true)
    })

    it('resets state on fetch error', async () => {
      const store = useUsersStore()
      store.user = buildUser('old-user')
      store.hasLoaded = true
      cookieMock.value = 'true'
      serviceMocks.getMyProfile.mockRejectedValueOnce(new Error('Auth failed'))

      await store.fetchProfile(true)

      expect(store.user).toBeNull()
      expect(store.hasLoaded).toBe(false)
      expect(cookieMock.value).toBeNull()
    })
  })

  describe('register', () => {
    it('registers and logs in successfully', async () => {
      const store = useUsersStore()
      serviceMocks.register.mockResolvedValueOnce(undefined)
      serviceMocks.login.mockResolvedValueOnce(undefined)
      const mockUserProfile = buildUser('user-new')
      serviceMocks.getMyProfile.mockResolvedValueOnce(mockUserProfile)

      await store.register('new@ecoscolar.ch', 'Pass123!')

      expect(serviceMocks.register).toHaveBeenCalledWith('new@ecoscolar.ch', 'Pass123!')
      expect(serviceMocks.login).toHaveBeenCalledWith('new@ecoscolar.ch', 'Pass123!')
      expect(store.user).toEqual(mockUserProfile)
      expect(store.errors).toBeNull()
    })

    it('handles registration failure errors', async () => {
      const store = useUsersStore()
      const apiError = {
        data: {
          errors: {
            DuplicateUserName: ['Email already exists']
          }
        }
      }
      serviceMocks.register.mockRejectedValueOnce(apiError)

      await store.register('fail@ecoscolar.ch', 'Pass123!')

      expect(store.errors).toEqual(['DuplicateUserName'])
      expect(store.user).toBeNull()
    })
  })

  describe('login', () => {
    it('logs in, sets cookie, fetches profile, and redirects to profile', async () => {
      const store = useUsersStore()
      serviceMocks.login.mockResolvedValueOnce(undefined)
      const mockUserProfile = buildUser('user-auth')
      serviceMocks.getMyProfile.mockResolvedValueOnce(mockUserProfile)

      await store.login('auth@ecoscolar.ch', 'Pass123!')

      expect(serviceMocks.login).toHaveBeenCalledWith('auth@ecoscolar.ch', 'Pass123!')
      expect(cookieMock.value).toBe('true')
      expect(store.user).toEqual(mockUserProfile)
      expect(store.hasLoaded).toBe(true)
      expect(navigateToMock).toHaveBeenCalledWith('/me/profile')
    })
  })

  describe('logout', () => {
    it('logs out and redirects to login page', async () => {
      const store = useUsersStore()
      store.user = buildUser('user-logout')
      store.hasLoaded = true
      cookieMock.value = 'true'
      serviceMocks.logout.mockResolvedValueOnce(undefined)

      await store.logout()

      expect(serviceMocks.logout).toHaveBeenCalledTimes(1)
      expect(store.user).toBeNull()
      expect(store.hasLoaded).toBe(false)
      expect(cookieMock.value).toBeNull()
      expect(navigateToMock).toHaveBeenCalledWith('/login')
    })
  })

  describe('updateProfile', () => {
    it('updates user profile successfully and redirects to profile page', async () => {
      const store = useUsersStore()
      const updatedUser = buildUser('user-update')
      updatedUser.nickname = 'NewNick'
      serviceMocks.updateProfile.mockResolvedValueOnce(updatedUser)

      const input = { nickname: 'NewNick', firstName: 'T', lastName: 'U', postalCode: '2000', birthdayDate: '2010-01-01', spokenLanguages: [] }
      await store.updateProfile(input)

      expect(serviceMocks.updateProfile).toHaveBeenCalledWith(input)
      expect(store.user).toEqual(updatedUser)
      expect(navigateToMock).toHaveBeenCalledWith('/me/profile')
    })
  })

  describe('deleteAccount', () => {
    it('deletes user account and triggers logout', async () => {
      const store = useUsersStore()
      serviceMocks.deleteAccount.mockResolvedValueOnce(undefined)
      serviceMocks.logout.mockResolvedValueOnce(undefined)

      await store.deleteAccount()

      expect(serviceMocks.deleteAccount).toHaveBeenCalledTimes(1)
      expect(serviceMocks.logout).toHaveBeenCalledTimes(1)
    })
  })

  describe('forgotPassword', () => {
    it('calls service and marks as loaded', async () => {
      const store = useUsersStore()
      serviceMocks.forgotPassword.mockResolvedValueOnce(undefined)

      await store.forgotPassword('user@ecoscolar.ch')

      expect(serviceMocks.forgotPassword).toHaveBeenCalledWith('user@ecoscolar.ch')
      expect(store.hasLoaded).toBe(true)
    })
  })

  describe('resetPassword', () => {
    it('validates password matching before calling service', async () => {
      const store = useUsersStore()
      const input = { email: 'user@ecoscolar.ch', newPassword: 'P1', code: '123' }

      await store.resetPassword(input, 'P2')

      expect(store.errors).toEqual(['passwords_do_not_match'])
      expect(serviceMocks.resetPassword).not.toHaveBeenCalled()
    })

    it('resets password successfully and redirects to login', async () => {
      const store = useUsersStore()
      const input = { email: 'user@ecoscolar.ch', newPassword: 'P1', code: '123' }
      serviceMocks.resetPassword.mockResolvedValueOnce(undefined)

      await store.resetPassword(input, 'P1')

      expect(serviceMocks.resetPassword).toHaveBeenCalledWith(input)
      expect(store.errors).toBeNull()
      expect(navigateToMock).toHaveBeenCalledWith('/login')
    })
  })

  describe('clearErrors', () => {
    it('resets errors to null', () => {
      const store = useUsersStore()
      store.errors = ['err']
      store.clearErrors()
      expect(store.errors).toBeNull()
    })
  })
})
