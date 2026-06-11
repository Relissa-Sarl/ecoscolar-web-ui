import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { User } from '../../app/types/user'
import onboardingMiddleware from '~/middleware/onboarding.global'

const { mockUsersStore, mockNavigateTo } = vi.hoisted(() => ({
  mockUsersStore: {
    isAuthenticated: false,
    user: null as User | null
  },
  mockNavigateTo: vi.fn(path => path)
}))

mockNuxtImport('useUsersStore', () => () => mockUsersStore)
mockNuxtImport('navigateTo', () => mockNavigateTo)
mockNuxtImport('useLocalePath', () => () => (path: string) => `locale:${path}`)

type MiddlewareParam = Parameters<typeof onboardingMiddleware>[0]

describe('onboarding global middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsersStore.isAuthenticated = false
    mockUsersStore.user = null
  })

  it('allows access to allowed routes like "/"', () => {
    const to = { path: '/' }
    const result = onboardingMiddleware(to as unknown as MiddlewareParam)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('allows access to language prefixed allowed routes like "/de/support"', () => {
    const to = { path: '/de/support' }
    const result = onboardingMiddleware(to as unknown as MiddlewareParam)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('allows access to wildcard support paths like "/me/support-requests/123"', () => {
    const to = { path: '/me/support-requests/123' }
    const result = onboardingMiddleware(to as unknown as MiddlewareParam)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects to /login if trying to access protected route "/register/step-2" without auth', () => {
    const to = { path: '/register/step-2' }
    onboardingMiddleware(to as unknown as MiddlewareParam)
    expect(mockNavigateTo).toHaveBeenCalledWith('locale:/login')
  })

  it('redirects to / if user is already onboarded and tries to access "/register/step-2"', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isOnboarded: true } as User
    const to = { path: '/register/step-2' }
    onboardingMiddleware(to as unknown as MiddlewareParam)
    expect(mockNavigateTo).toHaveBeenCalledWith('locale:/')
  })

  it('does not redirect if user is onboarded but trying to access an allowed route', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isOnboarded: true } as User
    const to = { path: '/support' }
    const result = onboardingMiddleware(to as unknown as MiddlewareParam)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects to /register/step-2 if user is authenticated but not onboarded on a non-allowed route', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isOnboarded: false } as User
    const to = { path: '/some-other-protected-route' }
    onboardingMiddleware(to as unknown as MiddlewareParam)
    expect(mockNavigateTo).toHaveBeenCalledWith('locale:/register/step-2')
  })
})
