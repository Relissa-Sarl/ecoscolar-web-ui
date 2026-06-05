// app/composables/useHistory.ts
import { getHistoryService } from '~/services/historyService'
import type { Purchase, MySaleAdvert } from '~/services/historyService'

export type { Purchase, MySaleAdvert }

// Composable to manage user purchase and sales history
export const useHistory = () => {
  const service = getHistoryService()

  /**
   * Fetches the purchase history.
   */
  const getPurchases = async (): Promise<Purchase[]> => {
    try {
      return await service.getPurchaseHistory()
    } catch (error) {
      console.error('Error retrieving purchase history:', error)
      return []
    }
  }

  /**
   * Fetches the sales history.
   */
  const getSales = async (): Promise<MySaleAdvert[]> => {
    try {
      return await service.getSalesHistory()
    } catch (error) {
      console.error('Error retrieving sales history:', error)
      return []
    }
  }

  return {
    getPurchases,
    getSales
  }
}
