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
describe('favorites store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })
  it('loads favorites from the service and marks them as loaded', async () => {
    const favorite = buildFavorite('advert-1')
    serviceMocks.listFavorites.mockResolvedValueOnce([favorite])
    const store = useFavoritesStore()
    await store.loadFavorites()
    expect(serviceMocks.listFavorites).toHaveBeenCalledTimes(1)
    expect(store.favorites).toHaveLength(1)
    expect(store.isFavorite('advert-1')).toBe(true)
    expect(store.hasLoaded).toBe(true)
  })
  it('toggles favorites through the service', async () => {
    const favorite = buildFavorite('advert-2')
    serviceMocks.toggleFavorite
      .mockResolvedValueOnce({ advertId: favorite.advertId, isFavorite: true })
      .mockResolvedValueOnce({ advertId: favorite.advertId, isFavorite: false })
    const store = useFavoritesStore()
    // Toggle to add
    let result = await store.toggleFavorite({
      advertId: favorite.advertId,
      advert: favorite.advert
    })
    expect(result.isFavorite).toBe(true)
    expect(store.isFavorite('advert-2')).toBe(true)
    expect(serviceMocks.toggleFavorite).toHaveBeenCalledWith({
      advertId: 'advert-2',
      advert: favorite.advert
    })
    // Toggle to remove
    result = await store.toggleFavorite({ advertId: favorite.advertId })
    expect(result.isFavorite).toBe(false)
    expect(store.isFavorite('advert-2')).toBe(false)
    expect(serviceMocks.toggleFavorite).toHaveBeenCalledWith({ advertId: 'advert-2' })
  })
})
