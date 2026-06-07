import { describe, expect, it } from 'vitest'
import { buildCatalogMetaLine } from '../../app/utils/catalogMetaLine'
import { AdvertType } from '../../app/utils/enum/advertType'

describe('buildCatalogMetaLine', () => {
  it('returns the ISBN for a book when available', () => {
    expect(buildCatalogMetaLine({
      type: AdvertType.BOOK,
      isbn: '978-3-16-148410-0',
      category: 'Fiction'
    })).toBe('978-3-16-148410-0')
  })

  it('falls back to the book category when ISBN is missing', () => {
    expect(buildCatalogMetaLine({
      type: AdvertType.BOOK,
      category: 'Mathématiques'
    })).toBe('Mathématiques')
  })

  it('returns the product category for supplies', () => {
    expect(buildCatalogMetaLine({
      type: AdvertType.PRODUCT,
      category: 'Fournitures'
    })).toBe('Fournitures')
  })

  it('joins subject and grade for tutoring services', () => {
    expect(buildCatalogMetaLine({
      type: AdvertType.SERVICE,
      subjects: 'Mathématiques',
      grade: 'Collège'
    })).toBe('Mathématiques · Collège')
  })

  it('returns undefined when no metadata is available', () => {
    expect(buildCatalogMetaLine({ type: AdvertType.PRODUCT })).toBeUndefined()
  })
})
