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

  it('uses cached favorites if already loaded and force is false', async () => {
    const favorite = buildFavorite(3)
    const store = useFavoritesStore()
    store.favorites = [favorite]
    store.hasLoaded = true

    const result = await store.loadFavorites(false)
    expect(serviceMocks.listFavorites).not.toHaveBeenCalled()
    expect(result).toEqual([favorite])
  })

  it('forces reloading when loadFavorites is called with force=true even if already loaded', async () => {
    const favorite = buildFavorite(4)
    serviceMocks.listFavorites.mockResolvedValueOnce([favorite])
    const store = useFavoritesStore()
    store.hasLoaded = true

    const result = await store.loadFavorites(true)
    expect(serviceMocks.listFavorites).toHaveBeenCalledTimes(1)
    expect(result).toEqual([favorite])
  })

  it('handles loadFavorites error with Error instance', async () => {
    const mockError = new Error('Database down')
    serviceMocks.listFavorites.mockRejectedValueOnce(mockError)
    const store = useFavoritesStore()

    await expect(store.loadFavorites()).rejects.toThrow('Database down')
    expect(store.error).toBe('Database down')
    expect(store.isLoading).toBe(false)
  })

  it('handles loadFavorites error with non-Error object', async () => {
    serviceMocks.listFavorites.mockRejectedValueOnce('Some failure string')
    const store = useFavoritesStore()

    await expect(store.loadFavorites()).rejects.toBe('Some failure string')
    expect(store.error).toBe('Unable to load favorites')
    expect(store.isLoading).toBe(false)
  })

  it('updates an existing favorite in local store when toggled to true again', async () => {
    const favorite = buildFavorite(5)
    serviceMocks.toggleFavorite
      .mockResolvedValueOnce({ advertId: '5', isFavorite: true })
      .mockResolvedValueOnce({ advertId: '5', isFavorite: true })

    const store = useFavoritesStore()

    // First toggle: adds the favorite
    await store.toggleFavorite({
      advertId: favorite.id,
      advert: {
        id: '5',
        title: 'Original Title',
        type: favorite.type,
        condition: 'NEW',
        price: favorite.price,
        image: favorite.primaryImage
      }
    })
    expect(store.favorites[0].title).toBe('Original Title')

    // Second toggle: updates it
    await store.toggleFavorite({
      advertId: favorite.id,
      advert: {
        id: '5',
        title: 'Updated Title',
        type: favorite.type,
        condition: 'NEW',
        price: favorite.price,
        image: favorite.primaryImage
      }
    })

    expect(store.favorites).toHaveLength(1)
    expect(store.favorites[0].title).toBe('Updated Title')
  })

  it('creates local favorite with empty/undefined summary details when toggled to true', async () => {
    serviceMocks.toggleFavorite.mockResolvedValueOnce({ advertId: '6', isFavorite: true })
    const store = useFavoritesStore()

    await store.toggleFavorite({
      advertId: '6'
    })

    expect(store.favorites).toHaveLength(1)
    const localFav = store.favorites[0]
    expect(localFav.id).toBe(6)
    expect(localFav.type).toBe('')
    expect(localFav.title).toBe('6')
    expect(localFav.price).toBe(0)
    expect(localFav.primaryImage).toBe('')
  })

  it('clears all favorites and marks loaded state as false', () => {
    const store = useFavoritesStore()
    store.favorites = [buildFavorite(7)]
    store.hasLoaded = true
    store.error = 'Some error'

    store.clearFavorites()

    expect(store.favorites).toHaveLength(0)
    expect(store.hasLoaded).toBe(false)
    expect(store.error).toBeNull()
  })
})
