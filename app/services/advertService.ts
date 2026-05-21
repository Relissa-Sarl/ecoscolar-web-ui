import type {
  BookReadApiItem,
  ProductReadApiItem,
  ServiceReadApiItem,
  ModifyAdvertForm
} from '../types/advert'

import type { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const ADVERTS_PATH = 'v1/adverts'

export interface AdvertService {
  getBook: (id: number) => Promise<BookReadApiItem>
  getProduct: (id: number) => Promise<ProductReadApiItem>
  getService: (id: number) => Promise<ServiceReadApiItem>
}

export interface AdvertServiceDependencies {
  apiClient: ApiClient
}

export type CreateAdvertData = Partial<ModifyAdvertForm> & { pictures?: File[] }

export interface AdvertService {
  getAdvert: (id: number) => Promise<ModifyAdvertForm>
  getMeAdvert: () => Promise<ModifyAdvertForm[]>

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
  const getBook = (id: number) =>
    apiClient<BookReadApiItem>(`${ADVERTS_PATH}/books/${id}`)

  const getProduct = (id: number) =>
    apiClient<ProductReadApiItem>(`${ADVERTS_PATH}/products/${id}`)

  const getService = (id: number) =>
    apiClient<ServiceReadApiItem>(`${ADVERTS_PATH}/services/${id}`)

  const getAdvert = (id: number) => apiClient<ModifyAdvertForm>(`${ADVERTS_PATH}/${id}`)
  const getMeAdvert = () => apiClient<ModifyAdvertForm[]>(`${ADVERTS_PATH}/users/me/adverts`)

  const updateProductAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/products/${id}`, { method: 'PUT', body: data })
  }
  const updateServiceAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/services/${id}`, { method: 'PUT', body: data })
  }
  const updateBookAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/books/${id}`, { method: 'PUT', body: data })
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
    await apiClient<unknown>(`${ADVERTS_PATH}/${id}`, { method: 'DELETE' })
  }

  return {
    getBook,
    getProduct,
    getService,

    getAdvert,
    getMeAdvert,

    updateProductAdvert,
    updateServiceAdvert,
    updateBookAdvert,

    createProductAdvert,
    createServiceAdvert,
    createBookAdvert,

    deleteAdvert
  }
}
