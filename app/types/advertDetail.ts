export interface Subject {
  subjectId: number
  name: string
  nameFr: string
  nameIt: string
  nameDe: string
  code: string
}

export interface SchoolGrade {
  schoolGradeId: number
  name: string
  nameFr: string
  nameIt: string
  nameDe: string
  code: string
}

export interface ProductCategroy {
  productCategoryId: number
  name: string
  nameFr: string
  nameIt: string
  nameDe: string
  description: string
}

export interface Language {
  label: string
  name: string
  nameFr: string
  nameIt: string
  nameDe: string
}

export interface BookCategory {
  bookCategoryId: number
  name: string
  nameFr: string
  nameIt: string
  nameDe: string
  description: string
}
