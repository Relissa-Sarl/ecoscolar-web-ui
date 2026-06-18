import { useApi } from '../composables/useApi'
import type { AdvertStatus } from '../utils/enum/advertStatus'

type ApiClient = typeof useApi

export interface ReviewDto {
  rating: number
  comment?: string | null
}

export interface Purchase {
  id: string
  advertId: string
  advertTitle: string
  price: number
  purchaseDate: string
  status: string
  imageUrl?: string | null
  sellerName: string
  orderNumber?: string | null
  type?: string
  review?: ReviewDto | null
  sessions?: number
}

export interface TutorContact {
  name: string
  phoneNumber?: string | null
  email?: string | null
}

export interface MySaleAdvert {
  id: number
  type: string
  title: string
  price: number
  publicationDate: string
  notificationDate: string
  status: AdvertStatus
  userId: string
  sellerPseudo: string
  primaryImage?: string | null
  buyerName: string
  transactionId?: number
  transactionStatus?: string
  review?: ReviewDto | null
  expiresInDays?: number
}

export interface HistoryServiceDependencies {
  apiClient: ApiClient
}

export interface HistoryService {
  getPurchaseHistory: () => Promise<Purchase[]>
  getSalesHistory: () => Promise<MySaleAdvert[]>
  confirmShipping: (transactionId: string) => Promise<void>
  confirmReception: (transactionId: string) => Promise<void>
  cancelPurchase: (transactionId: string) => Promise<void>
  disputePurchase: (transactionId: string, reason: string, description: string) => Promise<void>
  createReview: (transactionId: string, rating: number, comment?: string) => Promise<void>
  createTransactions: (advertIds: number[], stripeSessionId: string | null) => Promise<CreatedTransaction[]>
  renewAdvert: (advertId: string | number) => Promise<void>
  acceptTutoringTransaction: (transactionId: string) => Promise<void>
  refuseTutoringTransaction: (transactionId: string) => Promise<void>
  confirmTutoringTransaction: (transactionId: string) => Promise<void>
  markTutoringRendered: (transactionId: string) => Promise<void>
  getTutorContact: (transactionId: string) => Promise<TutorContact>
}

export interface CreatedTransaction {
  transactionId: number
  advertId: number
  orderNumber?: string | null
}

export function createHistoryService({ apiClient }: HistoryServiceDependencies): HistoryService {
  return {
    async getPurchaseHistory(): Promise<Purchase[]> {
      const data = await apiClient<Purchase[]>('/me/purchases')
      return data || []
    },

    async getSalesHistory(): Promise<MySaleAdvert[]> {
      const data = await apiClient<MySaleAdvert[]>('/me/sales')
      return data || []
    },

    async confirmShipping(transactionId: string): Promise<void> {
      await apiClient(`/me/sales/${transactionId}/confirm-shipping`, { method: 'POST' })
    },

    async confirmReception(transactionId: string): Promise<void> {
      await apiClient(`/transactions/${transactionId}/confirm-receipt`, { method: 'PUT' })
    },

    async cancelPurchase(transactionId: string): Promise<void> {
      await apiClient(`/me/purchases/${transactionId}/cancel`, { method: 'POST' })
    },

    async disputePurchase(transactionId: string, reason: string, description: string): Promise<void> {
      await apiClient(`/transactions/${transactionId}/dispute`, {
        method: 'POST',
        body: { reason, description }
      })
    },

    async createReview(transactionId: string, rating: number, comment?: string): Promise<void> {
      await apiClient<unknown>(`/transactions/${transactionId}/reviews`, {
        method: 'POST',
        body: { rating, comment }
      })
    },

    async createTransactions(advertIds: number[], stripeSessionId: string | null): Promise<CreatedTransaction[]> {
      return await apiClient<CreatedTransaction[]>('/transactions', {
        method: 'POST',
        body: { advertIds, stripeSessionId }
      })
    },

    async renewAdvert(advertId: string | number): Promise<void> {
      await apiClient(`/me/sales/${advertId}/renew`, { method: 'POST' })
    },

    async acceptTutoringTransaction(transactionId: string): Promise<void> {
      await apiClient(`/tutoring/transactions/${transactionId}/accept`, { method: 'PATCH' })
    },

    async refuseTutoringTransaction(transactionId: string): Promise<void> {
      await apiClient(`/tutoring/transactions/${transactionId}/refuse`, { method: 'PATCH' })
    },

    async confirmTutoringTransaction(transactionId: string): Promise<void> {
      await apiClient(`/tutoring/transactions/${transactionId}/confirm`, { method: 'PATCH' })
    },

    async markTutoringRendered(transactionId: string): Promise<void> {
      await apiClient(`/tutoring/transactions/${transactionId}/mark-rendered`, { method: 'PATCH' })
    },

    async getTutorContact(transactionId: string): Promise<TutorContact> {
      return await apiClient<TutorContact>(`/tutoring/transactions/${transactionId}/tutor-contact`)
    }
  }
}

export const getHistoryService = () => {
  return createHistoryService({
    apiClient: useApi as ApiClient
  })
}
