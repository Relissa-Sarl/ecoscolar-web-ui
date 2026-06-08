import { useApi } from '../composables/useApi'
import type { AdvertStatus } from '../utils/enum/advertStatus'

type ApiClient = typeof useApi

export interface Purchase {
  id: string
  advertId: string
  advertTitle: string
  price: number
  purchaseDate: string
  status: string
  imageUrl?: string | null
  sellerName: string
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
  disputePurchase: (transactionId: string) => Promise<void>
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

    async confirmShipping(transactionId: string): Promise<void> {
      await apiClient(`/me/sales/${transactionId}/confirm-shipping`, { method: 'POST' })
    },

    async confirmReception(transactionId: string): Promise<void> {
      await apiClient(`/me/purchases/${transactionId}/confirm-reception`, { method: 'POST' })
    },

    async cancelPurchase(transactionId: string): Promise<void> {
      await apiClient(`/me/purchases/${transactionId}/cancel`, { method: 'POST' })
    },

    async disputePurchase(transactionId: string): Promise<void> {
      await apiClient(`/me/purchases/${transactionId}/dispute`, { method: 'POST' })
    }
  }
}

export const getHistoryService = () => {
  return createHistoryService({
    apiClient: useApi as ApiClient
  })
}
