import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FavoriteAdvert } from '../../app/types/favorite'
import { createFavoritesService } from '../../app/services/favoritesService'

const buildFavorite = (id: number): FavoriteAdvert => ({
  id,
  type: 'BOOK',
  title: `Title ${id}`,
  price: 12,
  publicationDate: '2026-05-15T00:00:00.000Z',
  notificationDate: '2026-05-15T00:00:00.000Z',
  status: 'PUBLISHED',
  userId: 'user-1',
  sellerPseudo: 'seller',
  primaryImage: 'https://example.com/image.jpg'
})

describe('favoritesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists favorites through the API', async () => {
    const apiClient = vi
      .fn()
      .mockResolvedValueOnce([buildFavorite(1)])
    const service = createFavoritesService({
      apiClient
    })
    const favorites = await service.listFavorites()
    expect(favorites).toHaveLength(1)
    expect(apiClient).toHaveBeenCalledWith('/users/me/favorites')
  })

  it('toggles a favorite through the API using PATCH', async () => {
    const apiClient = vi
      .fn()
      .mockResolvedValueOnce({ advertId: '4', isFavorite: true })
      .mockResolvedValueOnce({ advertId: '4', isFavorite: false })
    const service = createFavoritesService({
      apiClient
    })
    const added = await service.toggleFavorite({ advertId: 4 })
    expect(added).toEqual({ advertId: '4', isFavorite: true })
    expect(apiClient).toHaveBeenNthCalledWith(1, '/users/me/favorites/4', {
      method: 'PATCH'
    })
    const removed = await service.toggleFavorite({ advertId: 4 })
    expect(removed).toEqual({ advertId: '4', isFavorite: false })
    expect(apiClient).toHaveBeenNthCalledWith(2, '/users/me/favorites/4', {
      method: 'PATCH'
    })
  })
})
