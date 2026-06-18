import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Import after mocks are set up
import { usePublicUser } from '~/composables/usePublicUser'

const { mockGetPublicProfile, mockGetReviews, mockReport } = vi.hoisted(() => ({
  mockGetPublicProfile: vi.fn(),
  mockGetReviews: vi.fn(),
  mockReport: vi.fn()
}))

const mockToastAdd = vi.fn()
const mockCookieValue = ref<string[]>([])

vi.mock('#imports', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  useToast: () => ({ add: mockToastAdd }),
  useCookie: () => mockCookieValue,
  useAsyncData: (key: string, fetcher: () => Promise<unknown> | unknown) => {
    const data = ref<unknown>(null)
    const pending = ref(true)
    const error = ref<unknown>(null)

    const res = fetcher()
    if (res && typeof res === 'object' && 'then' in res && typeof res.then === 'function') {
      res.then((r: unknown) => {
        data.value = r
        pending.value = false
      }).catch((err: unknown) => {
        error.value = err
        pending.value = false
      })
    } else {
      data.value = res
      pending.value = false
    }

    return { data, pending, error }
  }
}))

vi.mock('~/services/usersService', () => ({
  getUserService: () => ({
    getPublicProfile: mockGetPublicProfile,
    getReviews: mockGetReviews,
    report: mockReport
  })
}))

describe('usePublicUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookieValue.value = []
  })

  it('fetches user and reviews successfully', async () => {
    mockGetPublicProfile.mockResolvedValueOnce({ id: 'u1', username: 'john' })
    mockGetReviews.mockResolvedValueOnce([{ id: 'r1', rating: 5 }])

    const { user, reviews, isLoading, displayError } = usePublicUser('u1')

    // Initially pending
    expect(isLoading.value).toBe(true)

    // Wait for fetchers
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(isLoading.value).toBe(false)
    expect(user.value).toEqual({ id: 'u1', username: 'john' })
    expect(reviews.value).toEqual([{ id: 'r1', rating: 5 }])
    expect(displayError.value).toBe(null)
  })

  it('handles error when fetching profile', async () => {
    mockGetPublicProfile.mockRejectedValueOnce(new Error('Not found'))
    mockGetReviews.mockResolvedValueOnce([])

    const { isLoading, displayError } = usePublicUser('u1')

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(isLoading.value).toBe(false)
    expect(displayError.value).toBe('profile.public.error')
  })

  it('opens and closes report modal', () => {
    const { isReportModalOpen, openReportModal, closeReportModal } = usePublicUser('u1')

    expect(isReportModalOpen.value).toBe(false)

    openReportModal()
    expect(isReportModalOpen.value).toBe(true)

    closeReportModal()
    expect(isReportModalOpen.value).toBe(false)
  })

  it('reports a user successfully', async () => {
    mockReport.mockResolvedValueOnce({})

    const { reportUser, hasReportedUser, isReportModalOpen } = usePublicUser('u1')
    isReportModalOpen.value = true

    await reportUser('Inappropriate content')

    expect(mockReport).toHaveBeenCalledWith('u1', 'Inappropriate content')
    expect(mockCookieValue.value).toContain('u1')
    expect(hasReportedUser.value).toBe(true)
    expect(mockToastAdd).toHaveBeenCalledWith({
      title: 'report.success',
      color: 'success'
    })
    expect(isReportModalOpen.value).toBe(false)
  })

  it('does not open modal or report if already reported', async () => {
    mockCookieValue.value = ['u1']

    const { openReportModal, isReportModalOpen, reportUser } = usePublicUser('u1')

    openReportModal()
    expect(isReportModalOpen.value).toBe(false) // stays false

    await reportUser('Another report')
    expect(mockReport).not.toHaveBeenCalled()
  })

  it('handles report error due to min length', async () => {
    mockReport.mockRejectedValueOnce({
      data: { errors: { Message: ['Too short'] } }
    })

    const { reportUser, reportError } = usePublicUser('u1')

    await reportUser('bad')

    expect(reportError.value).toBe('report.error_min_length')
  })

  it('handles general report error', async () => {
    mockReport.mockRejectedValueOnce(new Error('Network Error'))

    const { reportUser, reportError } = usePublicUser('u1')

    await reportUser('Inappropriate content')

    expect(reportError.value).toBe('report.error')
  })
})
