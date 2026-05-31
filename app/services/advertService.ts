import type {
  BookReadApiItem,
  ProductReadApiItem,
  ServiceReadApiItem,
  ModifyAdvertForm,
  QuestionResponse
} from '~/types/advert'

import { useApi } from '~/composables/useApi'

type ApiClient = typeof useApi

const ADVERTS_PATH = '/adverts'

export type CreateAdvertData = Partial<ModifyAdvertForm> & { pictures?: File[] }

export interface AdvertService {
  getBook: (id: number) => Promise<BookReadApiItem>
  getProduct: (id: number) => Promise<ProductReadApiItem>
  getService: (id: number) => Promise<ServiceReadApiItem>

  getAdvert: (id: number) => Promise<ModifyAdvertForm>
  getQuestions: (id: number) => Promise<QuestionResponse[]>

  updateProductAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>
  updateServiceAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>
  updateBookAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>

  createProductAdvert: (data: CreateAdvertData) => Promise<void>
  createServiceAdvert: (data: CreateAdvertData) => Promise<void>
  createBookAdvert: (data: CreateAdvertData) => Promise<void>

  deleteAdvert: (id: number) => Promise<void>
}

export interface AdvertServiceDependencies {
  apiClient: ApiClient
}

export function createAdvertService({ apiClient }: AdvertServiceDependencies): AdvertService {
  const getBook = async (id: number) =>
    apiClient<BookReadApiItem>(`${ADVERTS_PATH}/books/${id}`)

  const getProduct = async (id: number) =>
    apiClient<ProductReadApiItem>(`${ADVERTS_PATH}/products/${id}`)

  const getService = async (id: number) =>
    apiClient<ServiceReadApiItem>(`${ADVERTS_PATH}/services/${id}`)

  const getAdvert = async (id: number) => apiClient<ModifyAdvertForm>(`${ADVERTS_PATH}/${id}`)
  const getQuestions = async (id: number) => apiClient<QuestionResponse[]>(`${ADVERTS_PATH}/${id}/questions`)

  const updateProductAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/products/${id}`, { method: 'PUT', body: data })
  }
  const updateServiceAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/services/${id}`, { method: 'PUT', body: data })
  }
  const updateBookAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/books/${id}`, { method: 'PUT', body: data })
  }

  const createProductAdvert = async (data: CreateAdvertData): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/products`, { method: 'POST', body: data })
  }
  const createServiceAdvert = async (data: CreateAdvertData): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/services`, { method: 'POST', body: data })
  }
  const createBookAdvert = async (data: CreateAdvertData): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/books`, { method: 'POST', body: data })
  }

  const deleteAdvert = async (id: number): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/${id}`, { method: 'DELETE' })
  }

  return {
    getBook,
    getProduct,
    getService,

    getAdvert,
    getQuestions,

    updateProductAdvert,
    updateServiceAdvert,
    updateBookAdvert,

    createProductAdvert,
    createServiceAdvert,
    createBookAdvert,

    deleteAdvert
  }
}

export function getAdvertService() {
  return createAdvertService({ apiClient: useApi as ApiClient })
}
