import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdvertService } from '../../app/services/advertService'
import { AdvertCondition } from '../../app/utils/enum/advertCondition'
import { AdvertLanguage } from '../../app/utils/enum/advertLanguage'

describe('T4-6 · création annonces (advertService → API)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('livre (T8-3)', () => {
    it('envoie POST /adverts/books avec le payload livre', async () => {
      const apiClient = vi.fn().mockResolvedValue(undefined)
      const service = createAdvertService({ apiClient })

      const payload = {
        title: 'Manuel de biologie',
        description: 'Livre en bon état pour le gymnase.',
        price: 25,
        author: 'A. Dupont',
        publisher: 'Helbing',
        edition: '3e',
        isbn: '978-3-16-148410-0',
        bookCategoryId: 1,
        writtenLanguage: AdvertLanguage.FR,
        condition: AdvertCondition.NEW
      }

      await service.createBookAdvert(payload)

      expect(apiClient).toHaveBeenCalledWith('/adverts/books', {
        method: 'POST',
        body: payload
      })
    })

    it('accepte un payload minimal pour POST /adverts/books', async () => {
      const apiClient = vi.fn().mockResolvedValue(undefined)
      const service = createAdvertService({ apiClient })

      await service.createBookAdvert({ title: 'Brouillon' })

      expect(apiClient).toHaveBeenCalledWith('/adverts/books', {
        method: 'POST',
        body: { title: 'Brouillon' }
      })
    })
  })

  describe('produit', () => {
    it('envoie POST /adverts/products avec le payload produit', async () => {
      const apiClient = vi.fn().mockResolvedValue(undefined)
      const service = createAdvertService({ apiClient })

      const payload = {
        title: 'Calculatrice Casio',
        description: 'Peu utilisée, état neuf.',
        price: 42.99,
        userId: 'user-1',
        condition: AdvertCondition.NEW,
        productCategoryId: 3
      }

      await service.createProductAdvert(payload)

      expect(apiClient).toHaveBeenCalledWith('/adverts/products', {
        method: 'POST',
        body: payload
      })
    })

    it('accepte un payload minimal pour POST /adverts/products', async () => {
      const apiClient = vi.fn().mockResolvedValue(undefined)
      const service = createAdvertService({ apiClient })

      await service.createProductAdvert({ title: 'Brouillon produit' })

      expect(apiClient).toHaveBeenCalledWith('/adverts/products', {
        method: 'POST',
        body: { title: 'Brouillon produit' }
      })
    })
  })

  describe('service', () => {
    it('envoie POST /adverts/services avec le payload service', async () => {
      const apiClient = vi.fn().mockResolvedValue(undefined)
      const service = createAdvertService({ apiClient })

      const payload = {
        title: 'Cours de maths',
        description: 'Soutien scolaire en ligne.',
        price: 35,
        userId: 'user-1',
        subjectId: 1,
        schoolLevelId: 2,
        teachingLanguage: AdvertLanguage.FR,
        specificStudyLevel: 'Cycle 1'
      }

      await service.createServiceAdvert(payload)

      expect(apiClient).toHaveBeenCalledWith('/adverts/services', {
        method: 'POST',
        body: payload
      })
    })

    it('accepte un payload minimal pour POST /adverts/services', async () => {
      const apiClient = vi.fn().mockResolvedValue(undefined)
      const service = createAdvertService({ apiClient })

      await service.createServiceAdvert({ title: 'Brouillon service' })

      expect(apiClient).toHaveBeenCalledWith('/adverts/services', {
        method: 'POST',
        body: { title: 'Brouillon service' }
      })
    })
  })
})
