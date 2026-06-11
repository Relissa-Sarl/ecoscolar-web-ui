import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHistory } from '~/composables/useHistory'

const mockHistoryService = {
  getPurchaseHistory: vi.fn(),
  getSalesHistory: vi.fn(),
  createReview: vi.fn()
}

vi.mock('~/services/historyService', () => ({
  getHistoryService: () => mockHistoryService
}))

describe('useHistory composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.error to not pollute test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('getPurchases returns list on success', async () => {
    const mockPurchases = [{ id: 'p1', advertId: 'a1', advertTitle: 'Book', price: 10, purchaseDate: '2026', status: 'pending', sellerName: 'seller' }]
    mockHistoryService.getPurchaseHistory.mockResolvedValueOnce(mockPurchases)

    const { getPurchases } = useHistory()
    const result = await getPurchases()

    expect(mockHistoryService.getPurchaseHistory).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockPurchases)
  })

  it('getPurchases returns empty array on failure', async () => {
    mockHistoryService.getPurchaseHistory.mockRejectedValueOnce(new Error('Network error'))

    const { getPurchases } = useHistory()
    const result = await getPurchases()

    expect(mockHistoryService.getPurchaseHistory).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  it('getSales returns list on success', async () => {
    const mockSales = [{ id: 1, type: 'book', title: 'Ad', price: 20, publicationDate: '2026', notificationDate: '2026', status: 'ACTIVE', userId: 'user1', sellerPseudo: 'seller', buyerName: 'buyer' }]
    mockHistoryService.getSalesHistory.mockResolvedValueOnce(mockSales)

    const { getSales } = useHistory()
    const result = await getSales()

    expect(mockHistoryService.getSalesHistory).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockSales)
  })

  it('getSales returns empty array on failure', async () => {
    mockHistoryService.getSalesHistory.mockRejectedValueOnce(new Error('Network error'))

    const { getSales } = useHistory()
    const result = await getSales()

    expect(mockHistoryService.getSalesHistory).toHaveBeenCalledTimes(1)
    expect(result).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  it('createReview calls service method', async () => {
    mockHistoryService.createReview.mockResolvedValueOnce(undefined)

    const { createReview } = useHistory()
    await createReview('t1', 5, 'Good')

    expect(mockHistoryService.createReview).toHaveBeenCalledWith('t1', 5, 'Good')
  })
})
