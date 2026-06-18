import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ReportReason } from '../../app/types/report'
import type { AbuseReportRequest, AbuseReportResponse } from '../../app/types/report'

const mockUseApi = vi.fn()

vi.mock('../../app/composables/useApi', () => ({
  useApi: (...args: unknown[]) => mockUseApi(...args)
}))

// Re-import after mock is set up so the module uses the mocked useApi
const { reportService } = await import('../../app/services/reportService')

describe('reportService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitReport', () => {
    it('posts to /reports with the report data', async () => {
      const request: AbuseReportRequest = {
        targetAdvertId: 1,
        reason: ReportReason.INAPPROPRIATE_ADVERT,
        message: 'This advert is inappropriate'
      }

      const response: AbuseReportResponse = {
        id: 42,
        targetAdvertId: 1,
        reporterUserId: 'user-1',
        reason: ReportReason.INAPPROPRIATE_ADVERT,
        message: 'This advert is inappropriate',
        createdAt: '2026-06-18T10:00:00Z'
      }

      mockUseApi.mockResolvedValueOnce(response)

      const result = await reportService.submitReport(request)

      expect(mockUseApi).toHaveBeenCalledTimes(1)
      expect(mockUseApi).toHaveBeenCalledWith('/reports', {
        method: 'POST',
        body: request
      })
      expect(result).toEqual(response)
    })

    it('submits a comment report with targetCommentId', async () => {
      const request: AbuseReportRequest = {
        targetAdvertId: 5,
        targetCommentId: 10,
        reason: ReportReason.INAPPROPRIATE_COMMENT,
        message: 'Offensive comment'
      }

      const response: AbuseReportResponse = {
        id: 43,
        targetAdvertId: 5,
        targetCommentId: 10,
        reporterUserId: 'user-2',
        reason: ReportReason.INAPPROPRIATE_COMMENT,
        message: 'Offensive comment',
        createdAt: '2026-06-18T11:00:00Z'
      }

      mockUseApi.mockResolvedValueOnce(response)

      const result = await reportService.submitReport(request)

      expect(mockUseApi).toHaveBeenCalledWith('/reports', {
        method: 'POST',
        body: request
      })
      expect(result).toEqual(response)
    })

    it('propagates API errors', async () => {
      const request: AbuseReportRequest = {
        targetAdvertId: 1,
        reason: ReportReason.INAPPROPRIATE_ADVERT,
        message: 'Test'
      }

      mockUseApi.mockRejectedValueOnce(new Error('Server error'))

      await expect(reportService.submitReport(request)).rejects.toThrow('Server error')
    })
  })
})
