export interface SupportContactRequest {
  email: string
  subject: string
  message: string
}

export interface SupportContactResponse {
  id: number
}

export interface SupportTicket {
  id: number
  email: string
  subject: string
  message: string
  createdAt: string
}
