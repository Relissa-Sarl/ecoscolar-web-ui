import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { User } from '../../app/types/user'
import authMiddleware from '~/middleware/auth'

const { mockUsersStore, mockNavigateTo } = vi.hoisted(() => ({
  mockUsersStore: {
    isAuthenticated: false,
    user: null as User | null,
    logout: vi.fn()
  },
  mockNavigateTo: vi.fn(path => path)
}))

mockNuxtImport('useUsersStore', () => () => mockUsersStore)
mockNuxtImport('navigateTo', () => mockNavigateTo)

type MiddlewareParam = Parameters<typeof authMiddleware>[0]

describe('auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsersStore.isAuthenticated = false
    mockUsersStore.user = null
    mockUsersStore.logout.mockReset()
  })

  it('redirects unauthenticated users to /login', () => {
    mockUsersStore.isAuthenticated = false

    const result = authMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
    expect(result).toBe('/login')
  })

  it('allows authenticated, non-banned users through', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isBanned: false } as User

    const result = authMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects banned users to /denied and calls logout', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isBanned: true } as User

    authMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(mockUsersStore.logout).toHaveBeenCalled()
    expect(mockNavigateTo).toHaveBeenCalledWith('/denied')
  })

  it('allows authenticated user with isBanned=false and no roles', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isBanned: false, roles: [] } as unknown as User

    const result = authMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('allows authenticated user when user object has no isBanned (undefined)', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = {} as User

    const result = authMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
