import { apiClient } from '~/utils/apiClient'
import type { AbuseReportRequest, AbuseReportResponse } from '~/types/report'

export const reportService = {
  /**
   * Soumettre un signalement d'abus (annonce ou commentaire)
   */
  async submitReport(data: AbuseReportRequest): Promise<AbuseReportResponse> {
    return await apiClient('/reports', {
      method: 'POST',
      body: data
    })
  }
}
