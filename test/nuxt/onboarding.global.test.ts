import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { mockUsersStore, mockNavigateTo } = vi.hoisted(() => ({
  mockUsersStore: {
    isAuthenticated: false,
    user: null as any
  },
  mockNavigateTo: vi.fn((path) => path)
}))

mockNuxtImport('useUsersStore', () => () => mockUsersStore)
mockNuxtImport('navigateTo', () => mockNavigateTo)
mockNuxtImport('useLocalePath', () => () => (path: string) => `locale:${path}`)

// Import the middleware AFTER mocks are declared and hoisted
import onboardingMiddleware from '~/middleware/onboarding.global'

describe('onboarding global middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsersStore.isAuthenticated = false
    mockUsersStore.user = null
  })

  it('allows access to allowed routes like "/"', () => {
    const to = { path: '/' }
    const result = onboardingMiddleware(to as any)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('allows access to language prefixed allowed routes like "/de/support"', () => {
    const to = { path: '/de/support' }
    const result = onboardingMiddleware(to as any)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('allows access to wildcard support paths like "/me/support-requests/123"', () => {
    const to = { path: '/me/support-requests/123' }
    const result = onboardingMiddleware(to as any)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects to /login if trying to access protected route "/register/step-2" without auth', () => {
    const to = { path: '/register/step-2' }
    onboardingMiddleware(to as any)
    expect(mockNavigateTo).toHaveBeenCalledWith('locale:/login')
  })

  it('redirects to / if user is already onboarded and tries to access "/register/step-2"', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isOnboarded: true }
    const to = { path: '/register/step-2' }
    onboardingMiddleware(to as any)
    expect(mockNavigateTo).toHaveBeenCalledWith('locale:/')
  })

  it('does not redirect if user is onboarded but trying to access an allowed route', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isOnboarded: true }
    const to = { path: '/support' }
    const result = onboardingMiddleware(to as any)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects to /register/step-2 if user is authenticated but not onboarded on a non-allowed route', () => {
    mockUsersStore.isAuthenticated = true
    mockUsersStore.user = { isOnboarded: false }
    const to = { path: '/some-other-protected-route' }
    onboardingMiddleware(to as any)
    expect(mockNavigateTo).toHaveBeenCalledWith('locale:/register/step-2')
  })
})
