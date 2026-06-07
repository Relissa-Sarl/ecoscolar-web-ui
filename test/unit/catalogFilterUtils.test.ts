import { describe, expect, it } from 'vitest'
import type { CatalogListing } from '../../app/types/catalog'
import { AdvertType } from '../../app/utils/enum/advertType'
import {
  bookCategoryMatches,
  localizedRefLabel,
  toggleSelectedId,
  tutoringGradeMatches,
  tutoringSubjectMatches
} from '../../app/utils/catalogFilterUtils'

const baseListing = (overrides: Partial<CatalogListing>): CatalogListing => ({
  id: '1',
  title: 'Test',
  price: 10,
  type: AdvertType.BOOK,
  categoryTab: 'textbooks',
  metaLineKey: 'catalog.card.meta_textbooks',
  location: 'Lausanne',
  imageUrl: '',
  hourly: false,
  ...overrides
})

const bookCategories = [
  { bookCategoryId: 4, name: 'Mathématiques', nameFr: 'Mathématiques', nameIt: 'Matematica', nameDe: 'Mathematik', description: '' }
]

const schoolGrades = [
  { schoolGradeId: 3, name: 'Cycle 3 (9H-11H)', nameFr: 'Cycle 3', nameIt: 'Ciclo 3', nameDe: 'Zyklus 3', code: 'C3' }
]

const subjects = [
  { subjectId: 1, name: 'Français', nameFr: 'Français', nameIt: 'Francese', nameDe: 'Französisch', code: 'FR' }
]

describe('catalogFilterUtils', () => {
  describe('localizedRefLabel', () => {
    it('returns the French label when locale is fr', () => {
      expect(localizedRefLabel(subjects[0], 'fr')).toBe('Français')
    })

    it('falls back to name when localized field is empty', () => {
      expect(localizedRefLabel({ name: 'Default', nameFr: '', nameIt: '', nameDe: '' }, 'fr')).toBe('Default')
    })
  })

  describe('toggleSelectedId', () => {
    it('adds an id when checked', () => {
      expect(toggleSelectedId([1], 2, true)).toEqual([1, 2])
    })

    it('removes an id when unchecked', () => {
      expect(toggleSelectedId([1, 2], 1, false)).toEqual([2])
    })

    it('does not duplicate an existing id', () => {
      expect(toggleSelectedId([1], 1, true)).toEqual([1])
    })
  })

  describe('bookCategoryMatches', () => {
    it('passes when no category filter is selected', () => {
      const listing = baseListing({ bookCategoryName: 'Mathématiques' })
      expect(bookCategoryMatches([], bookCategories, listing)).toBe(true)
    })

    it('matches a textbook with the selected book category', () => {
      const listing = baseListing({ bookCategoryName: 'Mathématiques' })
      expect(bookCategoryMatches([4], bookCategories, listing)).toBe(true)
    })

    it('rejects a textbook without category metadata when a filter is active', () => {
      const listing = baseListing({ bookCategoryName: undefined })
      expect(bookCategoryMatches([4], bookCategories, listing)).toBe(false)
    })
  })

  describe('tutoringGradeMatches', () => {
    it('rejects non-tutoring listings when a grade filter is active', () => {
      const listing = baseListing({ categoryTab: 'textbooks' })
      expect(tutoringGradeMatches([3], schoolGrades, listing)).toBe(false)
    })

    it('matches tutoring with the selected school grade', () => {
      const listing = baseListing({
        categoryTab: 'tutoring',
        type: AdvertType.SERVICE,
        hourly: true,
        metaLineKey: 'catalog.card.meta_tutoring',
        schoolGradeName: 'Cycle 3 (9H-11H)'
      })
      expect(tutoringGradeMatches([3], schoolGrades, listing)).toBe(true)
    })
  })

  describe('tutoringSubjectMatches', () => {
    it('matches tutoring with the selected subject', () => {
      const listing = baseListing({
        categoryTab: 'tutoring',
        type: AdvertType.SERVICE,
        hourly: true,
        metaLineKey: 'catalog.card.meta_tutoring',
        subjectName: 'Français'
      })
      expect(tutoringSubjectMatches([1], subjects, listing)).toBe(true)
    })

    it('rejects tutoring without subject metadata when a filter is active', () => {
      const listing = baseListing({
        categoryTab: 'tutoring',
        type: AdvertType.SERVICE,
        hourly: true,
        metaLineKey: 'catalog.card.meta_tutoring'
      })
      expect(tutoringSubjectMatches([1], subjects, listing)).toBe(false)
    })
  })
})
