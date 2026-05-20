import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogService } from '../../app/services/catalogService'
import { AdvertType } from '../../app/utils/enum/advertType'

describe('catalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists catalog summaries through the API', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([
      { id: '11111111-1111-1111-1111-111111111111', title: 'Book', price: 10, type: AdvertType.BOOK }
    ])
    const service = createCatalogService({ apiClient })

    const summaries = await service.listSummaries()

    expect(summaries).toHaveLength(1)
    expect(apiClient).toHaveBeenCalledWith('/v1/adverts/summary', { query: undefined })
  })

  it('passes q as query param', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([])
    const service = createCatalogService({ apiClient })

    await service.listSummaries({ q: 'math' })

    expect(apiClient).toHaveBeenCalledWith('/v1/adverts/summary', {
      query: { q: 'math' }
    })
  })
})
