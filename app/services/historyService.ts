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
  review?: ReviewDto | null
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
  review?: ReviewDto | null
}

export interface HistoryServiceDependencies {
  apiClient: ApiClient
}

export interface HistoryService {
  getPurchaseHistory: () => Promise<Purchase[]>
  getSalesHistory: () => Promise<MySaleAdvert[]>
  createReview: (transactionId: string, rating: number, comment?: string) => Promise<void>
}

export function createHistoryService({ apiClient }: HistoryServiceDependencies): HistoryService {
  return {
    /**
     * Retrieves the purchase history of the current user.
     */
    async getPurchaseHistory(): Promise<Purchase[]> {
      const data = await apiClient<Purchase[]>('/me/purchases')
      return data || []
    },

    /**
     * Retrieves the sales history of the current user.
     */
    async getSalesHistory(): Promise<MySaleAdvert[]> {
      const data = await apiClient<MySaleAdvert[]>('/me/sales')
      return data || []
    },

    /**
     * Creates a review for a transaction.
     */
    async createReview(transactionId: string, rating: number, comment?: string): Promise<void> {
      await apiClient<unknown>(`/transactions/${transactionId}/reviews`, {
        method: 'POST',
        body: { rating, comment }
      })
    }
  }
}

export const getHistoryService = () => {
  return createHistoryService({
    apiClient: useApi as ApiClient
  })
}
