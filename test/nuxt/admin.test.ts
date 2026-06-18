import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import adminMiddleware from '~/middleware/admin'

const { mockUsersStore, mockNavigateTo } = vi.hoisted(() => ({
  mockUsersStore: {
    isAdmin: false
  },
  mockNavigateTo: vi.fn(path => path)
}))

mockNuxtImport('useUsersStore', () => () => mockUsersStore)
mockNuxtImport('navigateTo', () => mockNavigateTo)

type MiddlewareParam = Parameters<typeof adminMiddleware>[0]

describe('admin middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsersStore.isAdmin = false
  })

  it('redirects non-admin users to /', () => {
    mockUsersStore.isAdmin = false

    const result = adminMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(mockNavigateTo).toHaveBeenCalledWith('/')
    expect(result).toBe('/')
  })

  it('allows admin users through', () => {
    mockUsersStore.isAdmin = true

    const result = adminMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects when isAdmin is falsy (default state)', () => {
    // isAdmin is already false by default
    adminMiddleware({} as MiddlewareParam, {} as MiddlewareParam)

    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })
})
