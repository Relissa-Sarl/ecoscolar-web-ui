// app/composables/useHistory.ts
import { useApi } from './useApi'

// 1. Les interfaces exactes fournies par le back-end

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
  status: number // 0 = ACTIVE, 1 = INACTIVE, 2 = SOLD
  userId: string
  sellerPseudo: string
  primaryImage?: string | null
  buyerName?: string | null
}

// 2. Le composable
export const useHistory = () => {

  // Fonction pour récupérer les achats
  const getPurchases = async (): Promise<Purchase[]> => {
    try {
      // On utilise useApi pour appeler la vraie route back-end
      const data = await useApi<Purchase[]>('/me/purchases', { skipAuth: true })
      // L'API renvoie les mocks directement, on les retourne
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des achats :', error)
      return []
    }
  }

  // Fonction pour récupérer les ventes/annonces
  const getSales = async (): Promise<MySaleAdvert[]> => {
    try {
      // On utilise useApi pour appeler la vraie route back-end
      const data = await useApi<MySaleAdvert[]>('/me/sales')
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes :', error)
      return []
    }
  }

  return {
    getPurchases,
    getSales
  }
}
