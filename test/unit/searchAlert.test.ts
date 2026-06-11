import { describe, expect, it } from 'vitest'
import {
  formatSearchAlertLabel,
  hasSearchCriteria,
  buildShopSearchQuery,
  type SearchAlert,
  type CreateSearchAlertInput
} from '../../app/types/searchAlert'
import { AdvertType } from '../../app/utils/enum/advertType'

describe('searchAlert utilities', () => {
  describe('formatSearchAlertLabel', () => {
    it('returns formatted label with all parts present', () => {
      const alert: SearchAlert = {
        id: 1,
        advertType: AdvertType.BOOK,
        q: 'physics',
        isbn: '1234567890',
        bookCategory: 'Science',
        productCategory: 'Notebooks',
        subject: 'Maths',
        grade: 'High School',
        minPrice: 10,
        maxPrice: 50,
        createdAt: '2026-06-11T00:00:00Z'
      }

      const label = formatSearchAlertLabel(alert)
      expect(label).toBe('Manuels · physics · 1234567890 · Science · Notebooks · Maths · High School · ≥ 10 CHF · ≤ 50 CHF')
    })

    it('handles partially filled search alerts', () => {
      const alert: SearchAlert = {
        id: 2,
        advertType: AdvertType.SERVICE,
        subject: 'German',
        createdAt: '2026-06-11T00:00:00Z'
      }

      const label = formatSearchAlertLabel(alert)
      expect(label).toBe('Cours & soutien · German')
    })

    it('returns fallback string when no criteria are present', () => {
      const alert: SearchAlert = {
        id: 3,
        createdAt: '2026-06-11T00:00:00Z'
      }

      const label = formatSearchAlertLabel(alert)
      expect(label).toBe('Recherche sans critère')
    })
  })

  describe('hasSearchCriteria', () => {
    it('returns true when any valid criteria is present', () => {
      const inputs: CreateSearchAlertInput[] = [
        { q: 'physics', createdAt: '', advertType: null },
        { isbn: '123-45', createdAt: '', advertType: null },
        { bookCategoryId: 1, createdAt: '', advertType: null },
        { productCategoryId: 2, createdAt: '', advertType: null },
        { subjectId: 3, createdAt: '', advertType: null },
        { schoolGradeId: 4, createdAt: '', advertType: null },
        { minPrice: 10, createdAt: '', advertType: null },
        { maxPrice: 100, createdAt: '', advertType: null }
      ]

      for (const input of inputs) {
        expect(hasSearchCriteria(input)).toBe(true)
      }
    })

    it('returns false when no criteria are present or only whitespace', () => {
      const input: CreateSearchAlertInput = {
        q: '   ',
        createdAt: '',
        advertType: null
      }
      expect(hasSearchCriteria(input)).toBe(false)
    })
  })

  describe('buildShopSearchQuery', () => {
    it('builds a correct query record with alert attributes', () => {
      const alert: SearchAlert = {
        id: 1,
        advertType: AdvertType.PRODUCT,
        q: 'ruler',
        isbn: '978-3-16-148410-0',
        bookCategoryId: 10,
        productCategoryId: 20,
        subjectId: 30,
        schoolGradeId: 40,
        minPrice: 5,
        maxPrice: 25,
        createdAt: ''
      }

      const query = buildShopSearchQuery(alert)
      expect(query).toEqual({
        type: 'PRODUCT',
        q: 'ruler',
        isbn: '978-3-16-148410-0',
        bookCategoryId: '10',
        productCategoryId: '20',
        subjectId: '30',
        gradeId: '40',
        minPrice: '5',
        maxPrice: '25'
      })
    })

    it('ignores empty, null or undefined attributes', () => {
      const alert: SearchAlert = {
        id: 2,
        createdAt: ''
      }

      const query = buildShopSearchQuery(alert)
      expect(query).toEqual({})
    })
  })
})
