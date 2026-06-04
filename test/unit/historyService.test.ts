import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHistoryService } from '../../app/services/historyService'

// 1. On crée une fausse donnée de base, comme vos collègues l'ont fait avec baseItem
const baseHistoryItem = {
  id: 'item-1',
  date: '2026-05-21T00:00:00Z',
  sellerName: 'John Doe',
  imageUrl: 'https://example.com/image.jpg'
}

describe('historyService', () => {
  beforeEach(() => {
    vi.clearAllMocks() // Nettoie les compteurs des fausses fonctions avant chaque test
  })

  it('loads purchase history', async () => {
    // 2. Préparation (Arrange) : On crée un faux client API qui va répondre avec notre fausse donnée
    const apiClient = vi.fn().mockResolvedValueOnce([baseHistoryItem])
    const service = createHistoryService({ apiClient })

    // 3. Exécution (Act) : On appelle notre fonction
    const result = await service.getPurchaseHistory()

    // 4. Vérification (Assert) : On vérifie que le faux client a été appelé avec la bonne URL
    expect(apiClient).toHaveBeenCalledWith('/history/purchases')

    expect(result).toEqual([baseHistoryItem])
  })

  it('loads sales history', async () => {
    // On répète le même schéma (Arrange, Act, Assert) pour les ventes
    const apiClient = vi.fn().mockResolvedValueOnce([baseHistoryItem])
    const service = createHistoryService({ apiClient })

    const result = await service.getSalesHistory()

    expect(apiClient).toHaveBeenCalledWith('/history/sales')
    expect(result).toEqual([baseHistoryItem])
  })
})
