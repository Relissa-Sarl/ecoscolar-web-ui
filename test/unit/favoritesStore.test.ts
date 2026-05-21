import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { FavoriteAdvert } from '../../app/types/favorite'
import { useFavoritesStore } from '../../app/stores/favoritesStore'

const serviceMocks = vi.hoisted(() => ({
  listFavorites: vi.fn(),
  toggleFavorite: vi.fn()
}))

const { getFavoritesServiceMock } = vi.hoisted(() => ({
  getFavoritesServiceMock: () => serviceMocks
}))

vi.mock('../../app/services/favoritesService', () => ({
  getFavoritesService: getFavoritesServiceMock
}))

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

describe('favorites store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads favorites from the service and marks them as loaded', async () => {
    const favorite = buildFavorite(1)
    serviceMocks.listFavorites.mockResolvedValueOnce([favorite])
    const store = useFavoritesStore()
    await store.loadFavorites()
    expect(serviceMocks.listFavorites).toHaveBeenCalledTimes(1)
    expect(store.favorites).toHaveLength(1)
    expect(store.isFavorite('1')).toBe(true)
    expect(store.hasLoaded).toBe(true)
  })

  it('toggles favorites through the service', async () => {
    const favorite = buildFavorite(2)
    serviceMocks.toggleFavorite
      .mockResolvedValueOnce({ advertId: '2', isFavorite: true })
      .mockResolvedValueOnce({ advertId: '2', isFavorite: false })
    const store = useFavoritesStore()
    let result = await store.toggleFavorite({
      advertId: favorite.id,
      advert: {
        id: '2',
        title: favorite.title,
        type: favorite.type,
        condition: 'NEW',
        price: favorite.price,
        image: favorite.primaryImage
      }
    })
    expect(result.isFavorite).toBe(true)
    expect(store.isFavorite('2')).toBe(true)
    expect(serviceMocks.toggleFavorite).toHaveBeenCalledWith({
      advertId: 2,
      advert: {
        id: '2',
        title: favorite.title,
        type: favorite.type,
        condition: 'NEW',
        price: favorite.price,
        image: favorite.primaryImage
      }
    })
    result = await store.toggleFavorite({ advertId: favorite.id })
    expect(result.isFavorite).toBe(false)
    expect(store.isFavorite('2')).toBe(false)
    expect(serviceMocks.toggleFavorite).toHaveBeenCalledWith({ advertId: 2 })
  })
})
