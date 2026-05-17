import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FavoriteAdvert } from '../../app/types/favorite'
import { createFavoritesService } from '../../app/services/favoritesService'

const buildFavorite = (advertId: string): FavoriteAdvert => ({
  id: `fav-${advertId}`,
  advertId,
  createdAt: '2026-05-15T00:00:00.000Z',
  advert: {
    id: advertId,
    title: `Title ${advertId}`,
    category: 'Textbooks',
    condition: 'NEW',
    price: 12,
    image: 'https://example.com/image.jpg'
  }
})

describe('favoritesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('lists favorites through the API', async () => {
    const apiClient = vi
      .fn()
      .mockResolvedValueOnce([buildFavorite('advert-1')])
    const service = createFavoritesService({
      apiClient
    })
    const favorites = await service.listFavorites()
    expect(favorites).toHaveLength(1)
    expect(apiClient).toHaveBeenCalledWith('/favorites') // Vérification si l'endpoint a été bien appelé
  })
  it('toggles a favorite through the API using PATCH', async () => {
    const apiClient = vi
      .fn()
      .mockResolvedValueOnce({ advertId: 'advert-4', isFavorite: true }) // Premier appel
      .mockResolvedValueOnce({ advertId: 'advert-4', isFavorite: false }) // Deuxième appel
    // Injection de dépendances de apiClient
    const service = createFavoritesService({
      apiClient
    })
    // Premier appel pour ajouter un favori
    const added = await service.toggleFavorite({ advertId: 'advert-4' })
    expect(added).toEqual({ advertId: 'advert-4', isFavorite: true })
    expect(apiClient).toHaveBeenNthCalledWith(1, '/favorites/advert-4', {
      method: 'PATCH'
    })
    // Deuxième appel pour enlever le favori
    const removed = await service.toggleFavorite({ advertId: 'advert-4' })
    expect(removed).toEqual({ advertId: 'advert-4', isFavorite: false })
    expect(apiClient).toHaveBeenNthCalledWith(2, '/favorites/advert-4', {
      method: 'PATCH'
    })
  })
})
