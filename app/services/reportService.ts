import { useApi } from '~/composables/useApi'
import type { AbuseReportRequest, AbuseReportResponse } from '~/types/report'

export const reportService = {
  /**
   * Soumettre un signalement d'abus (annonce ou commentaire)
   */
  async submitReport(data: AbuseReportRequest): Promise<AbuseReportResponse> {
    return await useApi('/v1/reports', {
      method: 'POST',
      body: data
    })
  }
}
