import { describe, expect, it } from 'vitest'
import {
  mapBookToAdvert,
  mapCatalogSummaryToAdvert,
  mapProductToAdvert,
  mapServiceToAdvert
} from '../../app/utils/advertDetailMappers'
import { AdvertCondition } from '../../app/utils/enum/advertCondition'
import { AdvertLanguage } from '../../app/utils/enum/advertLanguage'
import { AdvertStatus } from '../../app/utils/enum/advertStatus'
import { AdvertType } from '../../app/utils/enum/advertType'

const baseReadItem = {
  title: 'Titre test',
  description: 'Description test',
  price: 25,
  publicationDate: '2026-01-01T00:00:00Z',
  notificationDate: '2026-06-01T00:00:00Z',
  status: AdvertStatus.ACTIVE,
  userId: 'user-1',
  sellerPseudo: 'vendeur_test'
}

const catalogId = '1'

describe('advertDetailMappers', () => {
  describe('mapCatalogSummaryToAdvert', () => {
    it('maps summary fields and uses imageUrl when provided', () => {
      const advert = mapCatalogSummaryToAdvert({
        id: 1,
        title: 'Annonce mock',
        price: 12.5,
        type: AdvertType.BOOK,
        description: 'Description mock',
        isbn: '978-0',
        category: 'Manuels',
        imageUrl: 'https://example.com/cover.jpg'
      })

      expect(advert.id).toBe('1')
      expect(advert.type).toBe(AdvertType.BOOK)
      expect(advert.title).toBe('Annonce mock')
      expect(advert.price).toBe(12.5)
      expect(advert.description).toBe('Description mock')
      expect(advert.isbn).toBe('978-0')
      expect(advert.category).toBe('Manuels')
      expect(advert.image).toBe('https://example.com/cover.jpg')
      expect(advert.images).toEqual(['https://example.com/cover.jpg'])
      expect(advert.seller.username).toBe('')
    })

    it('falls back to picsum when no imageUrl is provided', () => {
      const advert = mapCatalogSummaryToAdvert({
        id: 1,
        title: 'Annonce mock',
        price: 10,
        type: AdvertType.PRODUCT,
        description: 'Sans image'
      })

      expect(advert.image).toContain('picsum.photos/seed/ecoscolar_1/')
      expect(advert.images[0]).toBe(advert.image)
    })
  })

  describe('mapBookToAdvert', () => {
    it('maps book API fields and formats condition', () => {
      const advert = mapBookToAdvert({
        id: 1,
        ...baseReadItem,
        pictures: ['https://example.com/book.jpg'],
        condition: AdvertCondition.LIKE_NEW,
        bookCategoryId: 2,
        bookCategoryLabel: 'Sciences',
        isbn: '978-123',
        author: 'Auteur',
        publisher: 'Editeur',
        edition: '2',
        writtenLanguage: AdvertLanguage.FR
      }, catalogId)

      expect(advert.id).toBe(catalogId)
      expect(advert.type).toBe(AdvertType.BOOK)
      expect(advert.authors).toBe('Auteur')
      expect(advert.category).toBe('Sciences')
      expect(advert.condition).toBe('LIKE NEW')
      expect(advert.isbn).toBe('978-123')
      expect(advert.image).toBe('https://example.com/book.jpg')
      expect(advert.seller.username).toBe('vendeur_test')
      expect(advert.seller.avatar).toContain('seed=vendeur_test')
    })
  })

  describe('mapProductToAdvert', () => {
    it('maps product API fields', () => {
      const advert = mapProductToAdvert({
        id: 2,
        ...baseReadItem,
        pictures: ['https://example.com/product.jpg'],
        condition: AdvertCondition.USED,
        productCategoryId: 3,
        productCategoryLabel: 'Fournitures'
      }, catalogId)

      expect(advert.type).toBe(AdvertType.PRODUCT)
      expect(advert.category).toBe('Fournitures')
      expect(advert.condition).toBe('USED')
      expect(advert.authors).toBe('')
      expect(advert.isbn).toBe('')
    })
  })

  describe('mapServiceToAdvert', () => {
    it('maps service API fields without condition', () => {
      const advert = mapServiceToAdvert({
        id: 3,
        ...baseReadItem,
        subjectId: 1,
        subjectLabel: 'Maths',
        schoolGradeId: 2,
        schoolGradeLabel: 'Collège',
        teachingLanguage: AdvertLanguage.FR,
        studyLevel: 'Cycle 1'
      }, catalogId)

      expect(advert.type).toBe(AdvertType.SERVICE)
      expect(advert.subject).toBe('Maths')
      expect(advert.grade).toBe('Collège')
      expect(advert.school).toBe('Cycle 1')
      expect(advert.condition).toBe('')
      expect(advert.image).toContain('picsum.photos/seed/ecoscolar_1/')
    })
  })
})
