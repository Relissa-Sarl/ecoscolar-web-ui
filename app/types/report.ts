export enum ReportReason {
  INAPPROPRIATE_ADVERT = 'INAPPROPRIATE_ADVERT',
  INAPPROPRIATE_COMMENT = 'INAPPROPRIATE_COMMENT'
}

export interface AbuseReportRequest {
  targetSellerId: string
  targetCommentId?: number
  reason: ReportReason
  message: string
}

export interface AbuseReportResponse {
  id: number
  targetSellerId: string
  targetCommentId?: number
  reporterUserId: string
  reason: ReportReason
  message: string
  createdAt: string
}
