export interface PurchaseHistoryItem {
  id: string
  date: string
  imageUrl?: string
  sellerName: string
}

export function createHistoryService({ apiClient }: { apiClient: any }) {
  return {
    // Fonction pour récupérer l'historique d'achats
    async getPurchaseHistory(): Promise<PurchaseHistoryItem[]> {
      // TODO : mettre à jour la bonne route avec l'API du backend
      return await apiClient('/history/purchases')
    },

    // Fonction pour récupérer l'historique de ventes
    async getSalesHistory(): Promise<PurchaseHistoryItem[]> {
      return await apiClient('/history/sales')
    }
  }
}
