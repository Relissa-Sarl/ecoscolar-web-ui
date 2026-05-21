import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdvertService } from '../../app/services/advertService'
import { AdvertCondition } from '../../app/utils/enum/advertCondition'
import { AdvertLanguage } from '../../app/utils/enum/advertLanguage'
import { AdvertStatus } from '../../app/utils/enum/advertStatus'

const baseItem = {
  title: 'Test',
  description: 'Description',
  price: 10,
  publicationDate: '2026-01-01T00:00:00Z',
  notificationDate: '2026-06-01T00:00:00Z',
  status: AdvertStatus.ACTIVE,
  userId: 'user-1',
  sellerPseudo: 'seller'
}

describe('advertService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads book detail by id', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({
      id: 1,
      ...baseItem,
      pictures: [],
      condition: AdvertCondition.NEW,
      bookCategoryId: 1,
      bookCategoryLabel: 'General',
      isbn: '978-0',
      author: 'Author',
      publisher: 'Publisher',
      edition: '1',
      writtenLanguage: AdvertLanguage.FR
    })
    const service = createAdvertService({ apiClient })

    await service.getBook(1)

    expect(apiClient).toHaveBeenCalledWith('/adverts/books/1')
  })

  it('loads product detail by id', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({
      id: 2,
      ...baseItem,
      pictures: [],
      condition: AdvertCondition.USED,
      productCategoryId: 3,
      productCategoryLabel: 'Fournitures'
    })
    const service = createAdvertService({ apiClient })

    await service.getProduct(2)

    expect(apiClient).toHaveBeenCalledWith('/adverts/products/2')
  })

  it('loads service detail by id', async () => {
    const apiClient = vi.fn().mockResolvedValueOnce({
      id: 3,
      ...baseItem,
      subjectId: 1,
      subjectLabel: 'Math',
      schoolGradeId: 2,
      schoolGradeLabel: 'Collège',
      teachingLanguage: AdvertLanguage.FR,
      studyLevel: 'Cycle 1'
    })
    const service = createAdvertService({ apiClient })

    await service.getService(3)

    expect(apiClient).toHaveBeenCalledWith('/adverts/services/3')
  })
})
