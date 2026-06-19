import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCartService } from '../../app/services/cartService'
import type { CartItemDto } from '../../app/types/cart'

describe('cartService', () => {
  const mockCartItems: CartItemDto[] = [
    {
      advertId: 1,
      type: 'BOOK',
      title: 'Math book',
      price: 15,
      sellerPseudo: 'Alice',
      primaryImage: 'https://example.com/math.jpg',
      shippingCost: 2,
      status: 'AVAILABLE'
    },
    {
      advertId: 2,
      type: 'BOOK',
      title: 'French book',
      price: 20,
      sellerPseudo: 'Bob',
      primaryImage: null,
      shippingCost: 0,
      status: 'AVAILABLE'
    }
  ]

  let apiClient: ReturnType<typeof vi.fn>

  beforeEach(() => {
    apiClient = vi.fn()
    vi.clearAllMocks()
  })

  describe('getCartItems', () => {
    it('calls the /cart endpoint and returns items', async () => {
      apiClient.mockResolvedValueOnce(mockCartItems)
      const service = createCartService({ apiClient })

      const result = await service.getCartItems()

      expect(apiClient).toHaveBeenCalledTimes(1)
      expect(apiClient).toHaveBeenCalledWith('/cart')
      expect(result).toEqual(mockCartItems)
    })

    it('returns empty array when no items', async () => {
      apiClient.mockResolvedValueOnce([])
      const service = createCartService({ apiClient })

      const result = await service.getCartItems()

      expect(result).toEqual([])
    })

    it('propagates API errors', async () => {
      apiClient.mockRejectedValueOnce(new Error('Network error'))
      const service = createCartService({ apiClient })

      await expect(service.getCartItems()).rejects.toThrow('Network error')
    })
  })

  describe('addToCart', () => {
    it('posts to /cart with the dto and returns the created item', async () => {
      const newItem: CartItemDto = {
        advertId: 3,
        type: 'BOOK',
        title: 'Science book',
        price: 25,
        sellerPseudo: 'Charlie',
        primaryImage: null,
        shippingCost: 3,
        status: 'AVAILABLE'
      }
      apiClient.mockResolvedValueOnce(newItem)
      const service = createCartService({ apiClient })

      const result = await service.addToCart({ advertId: 3 })

      expect(apiClient).toHaveBeenCalledTimes(1)
      expect(apiClient).toHaveBeenCalledWith('/cart', {
        method: 'POST',
        body: { advertId: 3 }
      })
      expect(result).toEqual(newItem)
    })

    it('propagates API errors on add', async () => {
      apiClient.mockRejectedValueOnce(new Error('Conflict'))
      const service = createCartService({ apiClient })

      await expect(service.addToCart({ advertId: 1 })).rejects.toThrow('Conflict')
    })
  })

  describe('removeFromCart', () => {
    it('sends DELETE to /cart/:advertId', async () => {
      apiClient.mockResolvedValueOnce(undefined)
      const service = createCartService({ apiClient })

      await service.removeFromCart(42)

      expect(apiClient).toHaveBeenCalledTimes(1)
      expect(apiClient).toHaveBeenCalledWith('/cart/42', {
        method: 'DELETE'
      })
    })

    it('propagates API errors on remove', async () => {
      apiClient.mockRejectedValueOnce(new Error('Not found'))
      const service = createCartService({ apiClient })

      await expect(service.removeFromCart(99)).rejects.toThrow('Not found')
    })
  })
})
