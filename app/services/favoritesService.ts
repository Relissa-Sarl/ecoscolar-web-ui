import type { FavoriteAdvert, FavoriteAdvertInput } from '../types/favorite'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

// Réponse envoyée par l'api lors du toggle d'une annonce en favori
interface ToggleFavoriteApiResponse {
  advertId: string
  isFavorite: boolean
}
// Contrat du service favoritesService
export interface FavoritesService {
  listFavorites: () => Promise<FavoriteAdvert[]>
  toggleFavorite: (input: FavoriteAdvertInput) => Promise<ToggleFavoriteApiResponse>
}

export interface FavoritesServiceDependencies {
  apiClient: ApiClient
}

const FAVORITES_PATH = '/favorites'

export function createFavoritesService({ apiClient }: FavoritesServiceDependencies): FavoritesService {
  // /favorites
  const listFavorites = async () => apiClient<FavoriteAdvert[]>(FAVORITES_PATH)

  // /favorites/:advertId (PATCH)
  const toggleFavorite = async (input: FavoriteAdvertInput) =>
    apiClient<ToggleFavoriteApiResponse>(`${FAVORITES_PATH}/${input.advertId}`, {
      method: 'PATCH'
    })

  return {
    listFavorites,
    toggleFavorite
  }
}

export const getFavoritesService = () => {
  return createFavoritesService({
    apiClient: useApi as ApiClient
  })
}
