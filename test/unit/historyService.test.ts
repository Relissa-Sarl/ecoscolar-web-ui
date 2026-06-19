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

  describe('transaction actions', () => {
    it('confirmShipping calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.confirmShipping('txn-123')

      expect(apiClient).toHaveBeenCalledWith('/me/sales/txn-123/confirm-shipping', {
        method: 'POST'
      })
    })

    it('confirmReception calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.confirmReception('txn-123')

      expect(apiClient).toHaveBeenCalledWith('/transactions/txn-123/confirm-receipt', {
        method: 'PUT'
      })
    })

    it('cancelPurchase calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.cancelPurchase('txn-123')

      expect(apiClient).toHaveBeenCalledWith('/me/purchases/txn-123/cancel', {
        method: 'POST'
      })
    })

    it('disputePurchase calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.disputePurchase('txn-123', 'Item not as described', 'Details')

      expect(apiClient).toHaveBeenCalledWith('/transactions/txn-123/dispute', {
        method: 'POST',
        body: { reason: 'Item not as described', description: 'Details' }
      })
    })
  })

  describe('tutoring transaction actions', () => {
    it('acceptTutoringTransaction calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.acceptTutoringTransaction('42')

      expect(apiClient).toHaveBeenCalledWith('/tutoring/transactions/42/accept', { method: 'PATCH' })
    })

    it('refuseTutoringTransaction calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.refuseTutoringTransaction('42')

      expect(apiClient).toHaveBeenCalledWith('/tutoring/transactions/42/refuse', { method: 'PATCH' })
    })

    it('confirmTutoringTransaction calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.confirmTutoringTransaction('42')

      expect(apiClient).toHaveBeenCalledWith('/tutoring/transactions/42/confirm', { method: 'PATCH' })
    })

    it('markTutoringRendered calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createHistoryService({ apiClient })

      await service.markTutoringRendered('42')

      expect(apiClient).toHaveBeenCalledWith('/tutoring/transactions/42/mark-rendered', { method: 'PATCH' })
    })

    it('getTutorContact calls API correctly', async () => {
      const contact = { name: 'Tutor', phoneNumber: '+41 79 000 00 00', email: 'tutor@test.ch' }
      const apiClient = vi.fn().mockResolvedValueOnce(contact)
      const service = createHistoryService({ apiClient })

      const result = await service.getTutorContact('42')

      expect(apiClient).toHaveBeenCalledWith('/tutoring/transactions/42/tutor-contact')
      expect(result).toEqual(contact)
    })
  })
})
