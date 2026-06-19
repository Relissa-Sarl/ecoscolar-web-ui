import type { TicketStatus } from '~/utils/enum/TicketStatus'

export enum ReportReason {
  INAPPROPRIATE_ADVERT = 'INAPPROPRIATE_ADVERT',
  INAPPROPRIATE_COMMENT = 'INAPPROPRIATE_COMMENT'
}

export interface AbuseReportRequest {
  targetAdvertId: number
  targetCommentId?: number
  reason: ReportReason
  message: string
}

export interface AbuseReportResponse {
  id: number
  targetAdvertId: number
  targetCommentId?: number
  reporterUserId: string
  reason: ReportReason
  message: string
  createdAt: string
}

export interface AbuseReportAdminResponse {
  id: number
  targetAdvertId: number
  targetCommentId?: number
  reporterUserId: string
  reason: ReportReason
  message: string
  status: TicketStatus
  createdAt: string
  reporterNickname: string
  reporterEmail: string
  sellerId: string
  sellerNickname: string
  sellerEmail: string
  advertTitle: string
  advertDescription: string
  advertPrice: number
  commentContent?: string
  commentAnswer?: string
  authorId?: string
  authorNickname?: string
  authorEmail?: string
}
