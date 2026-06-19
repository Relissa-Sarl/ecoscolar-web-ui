import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import guestMiddleware from '~/middleware/guest'

const { mockUsersStore, mockNavigateTo } = vi.hoisted(() => ({
  mockUsersStore: {
    isAuthenticated: false
  },
  mockNavigateTo: vi.fn(path => path)
}))

mockNuxtImport('useUsersStore', () => () => mockUsersStore)
mockNuxtImport('navigateTo', () => mockNavigateTo)

type MiddlewareParam = Parameters<typeof guestMiddleware>[0]

describe('guest middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsersStore.isAuthenticated = false
  })

  it('redirects authenticated users to /', () => {
    mockUsersStore.isAuthenticated = true

    const result = guestMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(mockNavigateTo).toHaveBeenCalledWith('/')
    expect(result).toBe('/')
  })

  it('allows unauthenticated (guest) users through', () => {
    mockUsersStore.isAuthenticated = false

    const result = guestMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('does not redirect when isAuthenticated is false (default)', () => {
    const result = guestMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
