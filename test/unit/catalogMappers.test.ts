import { describe, expect, it } from 'vitest'
import { enrichCatalogItem } from '../../app/utils/catalogMappers'
import { AdvertType } from '../../app/utils/enum/advertType'

describe('catalogMappers', () => {
  it('should map sellerId from AdvertCatalogApiItem to CatalogListing', () => {
    const apiItem = {
      id: 1,
      title: 'Test Advert',
      price: 10,
      type: AdvertType.BOOK,
      sellerId: 123
    }

    const result = enrichCatalogItem(apiItem, 0)

    expect(result.sellerId).toBe('123')
  })

  it('should handle missing sellerId', () => {
    const apiItem = {
      id: 1,
      title: 'Test Advert',
      price: 10,
      type: AdvertType.BOOK
    }

    const result = enrichCatalogItem(apiItem, 0)

    expect(result.sellerId).toBeUndefined()
  })

  it('should map basic fields correctly', () => {
    const apiItem = {
      id: 42,
      title: 'Science Book',
      price: 25.5,
      type: AdvertType.BOOK,
      category: 'Science'
    }

    const result = enrichCatalogItem(apiItem, 5)

    expect(result.id).toBe('42')
    expect(result.title).toBe('Science Book')
    expect(result.price).toBe(25.5)
    expect(result.type).toBe(AdvertType.BOOK)
    expect(result.categoryTab).toBe('textbooks')
    expect(result.bookCategoryName).toBe('Science')
  })
})
