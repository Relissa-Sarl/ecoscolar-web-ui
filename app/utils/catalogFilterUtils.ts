import type { BookCategory, SchoolGrade, Subject } from '@/types/advertDetail'
import type { CatalogListing } from '@/types/catalog'

type LocalizedRef = {
  name: string
  nameFr: string
  nameIt: string
  nameDe: string
}

export function localizedRefLabel(item: LocalizedRef, locale: string): string {
  switch (locale) {
    case 'fr': return item.nameFr || item.name
    case 'it': return item.nameIt || item.name
    case 'de': return item.nameDe || item.name
    default: return item.name
  }
}

export function toggleSelectedId(current: number[], id: number, checked: boolean): number[] {
  if (checked)
    return current.includes(id) ? current : [...current, id]
  return current.filter(x => x !== id)
}

function selectedCanonicalNames<T extends { name: string }>(
  items: T[],
  selectedIds: number[],
  idKey: keyof T
): string[] {
  return selectedIds
    .map(id => items.find(item => item[idKey] === id)?.name)
    .filter((name): name is string => Boolean(name))
}

export function bookCategoryMatches(
  selectedIds: number[],
  bookCategories: BookCategory[],
  listing: CatalogListing
): boolean {
  if (selectedIds.length === 0)
    return true
  if (listing.categoryTab !== 'textbooks' || !listing.bookCategoryName)
    return false
  const names = selectedCanonicalNames(bookCategories, selectedIds, 'bookCategoryId')
  return names.includes(listing.bookCategoryName)
}

export function tutoringGradeMatches(
  selectedIds: number[],
  schoolGrades: SchoolGrade[],
  listing: CatalogListing
): boolean {
  if (selectedIds.length === 0)
    return true
  if (listing.categoryTab !== 'tutoring' || !listing.schoolGradeName)
    return false
  const names = selectedCanonicalNames(schoolGrades, selectedIds, 'schoolGradeId')
  return names.includes(listing.schoolGradeName)
}

export function tutoringSubjectMatches(
  selectedIds: number[],
  subjects: Subject[],
  listing: CatalogListing
): boolean {
  if (selectedIds.length === 0)
    return true
  if (listing.categoryTab !== 'tutoring' || !listing.subjectName)
    return false
  const names = selectedCanonicalNames(subjects, selectedIds, 'subjectId')
  return names.includes(listing.subjectName)
}
