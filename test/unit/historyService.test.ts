import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHistoryService } from '../../app/services/historyService'

const baseHistoryItem = {
  id: 'item-1',
  date: '2026-05-21T00:00:00Z',
  sellerName: 'John Doe',
  imageUrl: 'https://example.com/image.jpg'
}

describe('historyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads purchase history', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([baseHistoryItem])
    const service = createHistoryService({ apiClient })

    const result = await service.getPurchaseHistory()

    expect(apiClient).toHaveBeenCalledWith('/me/purchases')

    expect(result).toEqual([baseHistoryItem])
  })

  it('loads sales history', async () => {
    // On répète le même schéma (Arrange, Act, Assert) pour les ventes
    const apiClient = vi.fn().mockResolvedValueOnce([baseHistoryItem])
    const service = createHistoryService({ apiClient })

    const result = await service.getSalesHistory()

    expect(apiClient).toHaveBeenCalledWith('/me/sales')
    expect(result).toEqual([baseHistoryItem])
  })
})
