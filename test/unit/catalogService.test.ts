import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogService } from '../../app/services/catalogService'

describe('catalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists catalog summaries through the API', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce([
      { id: '11111111-1111-1111-1111-111111111111', title: 'Book', price: 10 }
    ])
    const service = createCatalogService({ apiClient })

    const summaries = await service.listSummaries()

    expect(summaries).toHaveLength(1)
    expect(apiClient).toHaveBeenCalledWith('/v1/adverts')
  })
})
