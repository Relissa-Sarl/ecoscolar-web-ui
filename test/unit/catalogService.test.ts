import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogService } from '../../app/services/catalogService'
import { AdvertType } from '../../app/utils/enum/advertType'

describe('catalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists catalog summaries through the API', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([
      { id: 1, title: 'Book', price: 10, type: AdvertType.BOOK }
    ])
    const service = createCatalogService({ apiClient })

    const summaries = await service.listSummaries()

    expect(summaries).toHaveLength(1)
    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', { query: undefined })
  })

  it('passes q as query param', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([])
    const service = createCatalogService({ apiClient })

    await service.listSummaries({ q: 'math' })

    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', {
      query: { q: 'math' }
    })
  })

  it('loads catalog detail by id', async () => {
    const detail = {
      id: 1,
      title: 'Exemple annonce 1',
      price: 12.5,
      type: AdvertType.BOOK,
      description: 'Données de démonstration'
    }
    const apiClient = vi.fn().mockResolvedValueOnce(detail)
    const service = createCatalogService({ apiClient })

    const result = await service.getDetail('1')

    expect(result).toEqual(detail)
    expect(apiClient).toHaveBeenCalledWith(
      '/adverts/summary/1'
    )
  })
})
