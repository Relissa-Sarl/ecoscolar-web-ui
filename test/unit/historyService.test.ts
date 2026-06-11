import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHistoryService, type Purchase, type MySaleAdvert } from '../../app/services/historyService'
import { AdvertStatus } from '../../app/utils/enum/advertStatus'

const mockPurchase: Purchase = {
  id: 'txn-1',
  advertId: 'adv-1',
  advertTitle: 'Livre de mathématiques',
  price: 25.5,
  purchaseDate: '2026-05-21T00:00:00Z',
  status: 'COMPLETED',
  imageUrl: 'https://example.com/image.jpg',
  sellerName: 'JohnDoe'
}

const mockSale: MySaleAdvert = {
  id: 1,
  type: 'BOOK',
  title: 'Calculatrice scientifique',
  price: 45,
  publicationDate: '2026-05-20T00:00:00Z',
  notificationDate: '2026-05-21T00:00:00Z',
  status: AdvertStatus.SOLD,
  userId: 'user-1',
  sellerPseudo: 'MyPseudo',
  primaryImage: 'https://example.com/calc.jpg',
  buyerName: 'JaneSmith'
}

describe('historyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPurchaseHistory', () => {
    it('fetches purchase history successfully', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce([mockPurchase])
      const service = createHistoryService({ apiClient })

      const result = await service.getPurchaseHistory()

      expect(apiClient).toHaveBeenCalledWith('/me/purchases')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockPurchase)
    })

    it('returns empty array when api returns null or undefined', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(null)
      const service = createHistoryService({ apiClient })

      const result = await service.getPurchaseHistory()

      expect(apiClient).toHaveBeenCalledWith('/me/purchases')
      expect(result).toEqual([])
    })
  })

  describe('getSalesHistory', () => {
    it('fetches sales history successfully', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce([mockSale])
      const service = createHistoryService({ apiClient })

      const result = await service.getSalesHistory()

      expect(apiClient).toHaveBeenCalledWith('/me/sales')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockSale)
    })

    it('returns empty array when api returns null or undefined', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(null)
      const service = createHistoryService({ apiClient })

      const result = await service.getSalesHistory()

      expect(apiClient).toHaveBeenCalledWith('/me/sales')
      expect(result).toEqual([])
    })
  })

  describe('createReview', () => {
    it('posts review successfully', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.createReview('txn-123', 5, 'Great seller!')

      expect(apiClient).toHaveBeenCalledWith('/transactions/txn-123/reviews', {
        method: 'POST',
        body: { rating: 5, comment: 'Great seller!' }
      })
    })

    it('posts review with optional comment omitted', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.createReview('txn-123', 4)

      expect(apiClient).toHaveBeenCalledWith('/transactions/txn-123/reviews', {
        method: 'POST',
        body: { rating: 4, comment: undefined }
      })
    })
  })

  describe('createTransactions', () => {
    it('posts transactions creation request successfully', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.createTransactions([1, 2], 'session-123')

      expect(apiClient).toHaveBeenCalledWith('/transactions', {
        method: 'POST',
        body: { advertIds: [1, 2], stripeSessionId: 'session-123' }
      })
    })
  })
})
