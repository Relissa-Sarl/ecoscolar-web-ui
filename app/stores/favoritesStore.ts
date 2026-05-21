import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getFavoriteAdvertId, type FavoriteAdvert, type FavoriteAdvertInput } from '../types/favorite'
import { getFavoritesService } from '../services/favoritesService'

export interface ToggleFavoriteResult {
  advertId: string
  isFavorite: boolean
}
export const useFavoritesStore = defineStore('favorites', () => {
  // Liste des favoris
  const favorites = ref<FavoriteAdvert[]>([])
  // Indique si on fait un appel à l'API pour recharger les favoris
  const isLoading = ref(false)
  // Évite de faire des appels non nécessaires à l'api une fois les données chargées.
  const hasLoaded = ref(false)
  // Message d'erreur en cas de problème lors du chargement ou de la mise à jour des favoris
  const error = ref<string | null>(null)
  const favoriteIds = computed(() => new Set(favorites.value.map(getFavoriteAdvertId)))
  const service = getFavoritesService()
  const isFavorite = (advertId: string) => favoriteIds.value.has(advertId)
  // Permet d'ajouter ou mettre à jour un favori dans le store
  const upsertFavorite = (favorite: FavoriteAdvert) => {
    const favoriteId = getFavoriteAdvertId(favorite)
    const index = favorites.value.findIndex(item => getFavoriteAdvertId(item) === favoriteId)
    if (index >= 0) {
      favorites.value[index] = favorite
      return
    }
    favorites.value = [favorite, ...favorites.value]
  }
  // Créé un FavoriteAdvert pour le mettre dans le store (optimiste après toggle)
  const createLocalFavorite = (input: FavoriteAdvertInput): FavoriteAdvert => {
    const id = typeof input.advertId === 'number' ? input.advertId : Number(input.advertId)
    const now = new Date().toISOString()
    const summary = input.advert
    return {
      id,
      type: summary?.type ?? '',
      title: summary?.title ?? String(input.advertId),
      price: summary?.price ?? 0,
      publicationDate: now,
      notificationDate: now,
      status: '',
      userId: '',
      sellerPseudo: '',
      primaryImage: summary?.image ?? ''
    }
  }
  const loadFavorites = async (force = false) => {
    if (hasLoaded.value && !force) {
      return favorites.value
    }
    isLoading.value = true
    error.value = null
    try {
      // Appel au service -> api pour récupérer la liste des favoris
      favorites.value = await service.listFavorites()
      hasLoaded.value = true
      return favorites.value
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load favorites'
      throw cause
    } finally {
      isLoading.value = false
    }
  }
  const toggleFavorite = async (input: FavoriteAdvertInput): Promise<ToggleFavoriteResult> => {
    error.value = null
    // Appel au service -> api
    const result = await service.toggleFavorite(input)
    // Ajout ou suppression du favori dans le store
    if (result.isFavorite) {
      upsertFavorite(createLocalFavorite(input))
    } else {
      favorites.value = favorites.value.filter(
        favorite => getFavoriteAdvertId(favorite) !== result.advertId
      )
    }
    hasLoaded.value = true
    return result
  }
  // Permet de supprimer la liste des favorites si un autre utilisateur se connecte sur le même navigateur (déconnexion)
  const clearFavorites = () => {
    favorites.value = []
    hasLoaded.value = false
    error.value = null
  }
  return {
    favorites,
    favoriteIds,
    isLoading,
    hasLoaded,
    error,
    isFavorite,
    loadFavorites,
    toggleFavorite,
    clearFavorites
  }
})
