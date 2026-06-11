import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '~/composables/useApi'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const mockRuntimeConfig = {
  public: {
    apiBase: 'https://config-api.com/api'
  }
}
const mockUseRuntimeConfig = vi.fn(() => mockRuntimeConfig)
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)

const mockHeaders = { cookie: 'session=123' }
const mockUseRequestHeaders = vi.fn(() => mockHeaders)
vi.stubGlobal('useRequestHeaders', mockUseRequestHeaders)

const mockCookie = { value: 'logged_in' }
const mockUseCookie = vi.fn(() => mockCookie)
vi.stubGlobal('useCookie', mockUseCookie)

const mockNavigateTo = vi.fn()
vi.stubGlobal('navigateTo', mockNavigateTo)

describe('useApi composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRuntimeConfig.public.apiBase = 'https://config-api.com/api'
    mockCookie.value = 'logged_in'
    mockUseRuntimeConfig.mockReturnValue(mockRuntimeConfig)
  })

  it('uses runtime config apiBase by default', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    await useApi('/test')

    expect(mockUseRuntimeConfig).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
      baseURL: 'https://config-api.com/api',
      credentials: 'include'
    }))
  })

  it('falls back to environment variable if useRuntimeConfig throws (e.g. context loss)', async () => {
    mockUseRuntimeConfig.mockImplementationOnce(() => {
      throw new Error('No Nuxt context')
    })
    
    const originalEnv = process.env.NUXT_PUBLIC_API_BASE
    process.env.NUXT_PUBLIC_API_BASE = 'https://env-api.com/api'

    mockFetch.mockResolvedValueOnce({ success: true })
    await useApi('/test')

    expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
      baseURL: 'https://env-api.com/api'
    }))

    process.env.NUXT_PUBLIC_API_BASE = originalEnv
  })

  it('does not capture cookies if import.meta.server is false', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    await useApi('/test')
    expect(mockUseRequestHeaders).not.toHaveBeenCalled()
  })

  it('onResponseError redirects to / on 401 when skipAuth is false', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    await useApi('/test', { skipAuth: false })

    const fetchOptions = mockFetch.mock.calls[0][1]
    expect(fetchOptions.onResponseError).toBeDefined()

    const mockResponse = { status: 401 }
    await fetchOptions.onResponseError({ response: mockResponse })

    expect(mockUseCookie).toHaveBeenCalledWith('ecoscolar_logged_in')
    expect(mockCookie.value).toBeNull()
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })

  it('onResponseError does not redirect on 401 when skipAuth is true', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    await useApi('/test', { skipAuth: true })

    const fetchOptions = mockFetch.mock.calls[0][1]
    const mockResponse = { status: 401 }
    await fetchOptions.onResponseError({ response: mockResponse })

    expect(mockUseCookie).not.toHaveBeenCalled()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('onResponseError does not redirect on non-401 errors', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    await useApi('/test', { skipAuth: false })

    const fetchOptions = mockFetch.mock.calls[0][1]
    const mockResponse = { status: 500 }
    await fetchOptions.onResponseError({ response: mockResponse })

    expect(mockUseCookie).not.toHaveBeenCalled()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('onResponseError catches navigateTo redirection errors safely', async () => {
    mockNavigateTo.mockRejectedValueOnce(new Error('Navigation cancelled'))
    mockFetch.mockResolvedValueOnce({ success: true })
    
    await useApi('/test', { skipAuth: false })
    const fetchOptions = mockFetch.mock.calls[0][1]
    
    const mockResponse = { status: 401 }
    await expect(fetchOptions.onResponseError({ response: mockResponse })).resolves.not.toThrow()
  })
})
