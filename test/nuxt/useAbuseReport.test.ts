import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import { ReportReason } from '~/types/report'

const mockSubmitReport = vi.fn()

const mockToast = { add: vi.fn() }
const mockCookieValue = ref<string[]>([])

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key
}))

mockNuxtImport('useToast', () => () => mockToast)

mockNuxtImport('useCookie', () => () => mockCookieValue)

vi.mock('~/services/reportService', () => ({
  reportService: {
    submitReport: (...args: unknown[]) => mockSubmitReport(...args)
  }
}))

// Import after mocks are set up
const { useAbuseReport } = await import('~/composables/useAbuseReport')

describe('useAbuseReport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookieValue.value = []
    mockSubmitReport.mockReset()
  })

  it('initializes with default state', () => {
    const report = useAbuseReport()

    expect(report.isReportModalOpen.value).toBe(false)
    expect(report.isReporting.value).toBe(false)
    expect(report.reportError.value).toBeNull()
    expect(report.currentAdvertId.value).toBeNull()
    expect(report.currentCommentId.value).toBeNull()
  })

  describe('openReportModal / closeReportModal', () => {
    it('opens modal with advert ID', () => {
      const report = useAbuseReport()

      report.openReportModal(42)

      expect(report.isReportModalOpen.value).toBe(true)
      expect(report.currentAdvertId.value).toBe(42)
      expect(report.currentCommentId.value).toBeNull()
    })

    it('opens modal with advert and comment ID', () => {
      const report = useAbuseReport()

      report.openReportModal(42, 99)

      expect(report.isReportModalOpen.value).toBe(true)
      expect(report.currentAdvertId.value).toBe(42)
      expect(report.currentCommentId.value).toBe(99)
    })

    it('clears error when opening modal', () => {
      const report = useAbuseReport()
      report.reportError.value = 'previous error'

      report.openReportModal(1)

      expect(report.reportError.value).toBeNull()
    })

    it('closes modal and resets state', () => {
      const report = useAbuseReport()
      report.openReportModal(42, 99)

      report.closeReportModal()

      expect(report.isReportModalOpen.value).toBe(false)
      expect(report.currentAdvertId.value).toBeNull()
      expect(report.currentCommentId.value).toBeNull()
      expect(report.reportError.value).toBeNull()
    })
  })

  describe('hasReportedComment / hasReportedAdvert', () => {
    it('returns false when no items reported', () => {
      const report = useAbuseReport()

      expect(report.hasReportedComment(1)).toBe(false)
      expect(report.hasReportedAdvert(1)).toBe(false)
    })

    it('returns true when comment was reported', () => {
      mockCookieValue.value = ['comment:5']
      const report = useAbuseReport()

      expect(report.hasReportedComment(5)).toBe(true)
      expect(report.hasReportedComment(6)).toBe(false)
    })

    it('returns true when advert was reported', () => {
      mockCookieValue.value = ['advert:10']
      const report = useAbuseReport()

      expect(report.hasReportedAdvert(10)).toBe(true)
      expect(report.hasReportedAdvert(11)).toBe(false)
    })
  })

  describe('submitReport', () => {
    it('does nothing if no currentAdvertId is set', async () => {
      const report = useAbuseReport()

      await report.submitReport({ message: 'test' })

      expect(mockSubmitReport).not.toHaveBeenCalled()
    })

    it('submits an advert report successfully', async () => {
      mockSubmitReport.mockResolvedValueOnce({ id: 1 })
      const report = useAbuseReport()

      report.openReportModal(42)
      await report.submitReport({ message: 'This is inappropriate' })

      expect(mockSubmitReport).toHaveBeenCalledWith({
        targetAdvertId: 42,
        targetCommentId: undefined,
        reason: ReportReason.INAPPROPRIATE_ADVERT,
        message: 'This is inappropriate'
      })
      expect(report.isReportModalOpen.value).toBe(false)
      expect(mockToast.add).toHaveBeenCalledWith({
        title: 'report.success',
        color: 'success'
      })
    })

    it('submits a comment report successfully', async () => {
      mockSubmitReport.mockResolvedValueOnce({ id: 2 })
      const report = useAbuseReport()

      report.openReportModal(42, 99)
      await report.submitReport({ message: 'Offensive comment' })

      expect(mockSubmitReport).toHaveBeenCalledWith({
        targetAdvertId: 42,
        targetCommentId: 99,
        reason: ReportReason.INAPPROPRIATE_COMMENT,
        message: 'Offensive comment'
      })
    })

    it('tracks reported advert in cookie after success', async () => {
      mockSubmitReport.mockResolvedValueOnce({ id: 1 })
      const report = useAbuseReport()

      report.openReportModal(42)
      await report.submitReport({ message: 'test' })

      expect(mockCookieValue.value).toContain('advert:42')
    })

    it('tracks reported comment in cookie after success', async () => {
      mockSubmitReport.mockResolvedValueOnce({ id: 1 })
      const report = useAbuseReport()

      report.openReportModal(42, 99)
      await report.submitReport({ message: 'test' })

      expect(mockCookieValue.value).toContain('comment:99')
    })

    it('sets error_min_length on validation error', async () => {
      mockSubmitReport.mockRejectedValueOnce({
        data: { errors: { Message: ['Message too short'] } }
      })
      const report = useAbuseReport()

      report.openReportModal(42)
      await report.submitReport({ message: 'x' })

      expect(report.reportError.value).toBe('report.error_min_length')
      expect(report.isReporting.value).toBe(false)
    })

    it('sets generic error on other failures', async () => {
      mockSubmitReport.mockRejectedValueOnce(new Error('Server error'))
      const report = useAbuseReport()

      report.openReportModal(42)
      await report.submitReport({ message: 'test' })

      expect(report.reportError.value).toBe('report.error')
      expect(report.isReporting.value).toBe(false)
    })

    it('resets isReporting after submit completes', async () => {
      mockSubmitReport.mockResolvedValueOnce({ id: 1 })
      const report = useAbuseReport()

      report.openReportModal(42)
      await report.submitReport({ message: 'test' })

      expect(report.isReporting.value).toBe(false)
    })
  })
})
