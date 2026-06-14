import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogService } from '../../app/services/catalogService'
import { AdvertType } from '../../app/utils/enum/advertType'

describe('catalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists catalog summaries through the API', async () => {
    const page = {
      items: [{ id: 1, title: 'Book', price: 10, type: AdvertType.BOOK }],
      page: 1,
      pageSize: 9,
      totalItems: 1,
      totalPages: 1
    }
    const apiClient = vi.fn().mockResolvedValueOnce(page)
    const service = createCatalogService({ apiClient })

    const summaries = await service.listSummaries()

    expect(summaries).toEqual(page)
    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', { query: undefined })
  })

  it('passes filters and pagination as query params', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({
      items: [],
      page: 2,
      pageSize: 9,
      totalItems: 0,
      totalPages: 1
    })
    const service = createCatalogService({ apiClient })

    await service.listSummaries({
      q: 'math',
      type: AdvertType.BOOK,
      bookCategoryIds: '1,2',
      category: 'Mathematics',
      sort: 'price_asc',
      page: 2,
      pageSize: 9
    })

    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', {
      query: {
        q: 'math',
        type: AdvertType.BOOK,
        bookCategoryIds: '1,2',
        category: 'Mathematics',
        sort: 'price_asc',
        page: 2,
        pageSize: 9
      }
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
