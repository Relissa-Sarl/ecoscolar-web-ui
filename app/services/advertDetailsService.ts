import type {
  Subject,
  SchoolGrade,
  ProductCategroy,
  Language,
  BookCategory

} from '../types/advertDetail'

import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

export interface AdvertDetailsService {
  getSubjects: () => Promise<Subject[]>
  getSchoolGrades: () => Promise<SchoolGrade[]>
  getProductCategories: () => Promise<ProductCategroy[]>
  getLanguages: () => Promise<Language[]>
  getBookCategories: () => Promise<BookCategory[]>
}

export interface AdvertDetailsServiceDependencies {
  apiClient: ApiClient
}

export function createAdvertDetailsService({ apiClient }: AdvertDetailsServiceDependencies): AdvertDetailsService {
  const getSubjects = async () =>
    apiClient<Subject[]>(`/Subjects`)
  const getSchoolGrades = async () =>
    apiClient<SchoolGrade[]>(`/SchoolGrades`)
  const getProductCategories = async () =>
    apiClient<ProductCategroy[]>(`/ProductCategories`)
  const getLanguages = async () =>
    apiClient<Language[]>(`/Languages`)
  const getBookCategories = async () =>
    apiClient<BookCategory[]>(`/BookCategories`)

  return {
    getSubjects,
    getSchoolGrades,
    getProductCategories,
    getLanguages,
    getBookCategories
  }
}

export function getAdvertDetailsService() {
  return createAdvertDetailsService({ apiClient: useApi as ApiClient })
}
