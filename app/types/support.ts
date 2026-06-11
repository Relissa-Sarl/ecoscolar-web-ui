export interface SupportContactRequest {
  email: string
  subject: string
  message: string
}

export interface SupportContactResponse {
  id: number
}

/** Liste — le message initial peut être absent (API récente) ou présent (API Docker actuelle). */
export interface SupportTicketSummary {
  id: number
  email: string
  subject: string
  createdAt: string
  message?: string
}

export interface SupportTicketDetail extends SupportTicketSummary {
  message: string
}

export interface SupportTicketMessage {
  id: number
  body: string
  isFromSupport: boolean
  createdAt: string
}

export interface SupportTicketAdminDetail extends SupportTicketDetail {
  userId: string
  user: {
    firstName: string
    lastName: string
    nickname: string
    email: string
  }
  messages: SupportTicketMessage[]
}

/** @deprecated Utiliser SupportTicketSummary pour la liste */
export type SupportTicket = SupportTicketDetail
