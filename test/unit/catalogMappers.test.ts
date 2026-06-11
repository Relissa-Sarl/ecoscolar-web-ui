import { describe, expect, it } from 'vitest'
import { enrichCatalogItem, mapCatalogApiToListings } from '../../app/utils/catalogMappers'
import { AdvertType } from '../../app/utils/enum/advertType'
import type { AdvertCatalogApiItem } from '../../app/types/catalog'

describe('catalogMappers', () => {
  const mockBookItem: AdvertCatalogApiItem = {
    id: 1,
    title: 'Math book',
    price: 35,
    type: AdvertType.BOOK,
    isbn: '123456789',
    category: 'Math'
  }

  const mockProductItem: AdvertCatalogApiItem = {
    id: 2,
    title: 'Ruler',
    price: 5,
    type: AdvertType.PRODUCT,
    category: 'Stationery'
  }

  const mockServiceItem: AdvertCatalogApiItem = {
    id: 3,
    title: 'French tutor',
    price: 40,
    type: AdvertType.SERVICE,
    subjects: 'French',
    grade: 'Primary'
  }

  describe('enrichCatalogItem', () => {
    it('enriches a BOOK item correctly', () => {
      const result = enrichCatalogItem(mockBookItem, 0)
      expect(result.categoryTab).toBe('textbooks')
      expect(result.hourly).toBe(false)
      expect(result.bookCategoryName).toBe('Math')
    })

    it('enriches a PRODUCT item correctly', () => {
      const result = enrichCatalogItem(mockProductItem, 1)
      expect(result.categoryTab).toBe('supplies')
      expect(result.hourly).toBe(false)
    })

    it('enriches a SERVICE item correctly', () => {
      const result = enrichCatalogItem(mockServiceItem, 2)
      expect(result.categoryTab).toBe('tutoring')
      expect(result.hourly).toBe(true)
      expect(result.schoolGradeName).toBe('Primary')
      expect(result.subjectName).toBe('French')
    })

    it('throws error for unknown type', () => {
      expect(() => enrichCatalogItem({ type: 'UNKNOWN_TYPE' } as any, 0)).toThrow()
    })
  })

  describe('mapCatalogApiToListings', () => {
    it('maps list of items', () => {
      const results = mapCatalogApiToListings([mockBookItem, mockProductItem, mockServiceItem])
      expect(results).toHaveLength(3)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
      expect(results[2].id).toBe('3')
    })
  })
})
