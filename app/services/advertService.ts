import type {
  BookReadApiItem,
  ProductReadApiItem,
  ServiceReadApiItem
} from '../types/advert'

import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const BOOKS_PATH = '/v1/adverts/books'
const PRODUCTS_PATH = '/v1/adverts/products'
const SERVICES_PATH = '/v1/adverts/services'

export interface AdvertService {
  getBook: (id: number) => Promise<BookReadApiItem>
  getProduct: (id: number) => Promise<ProductReadApiItem>
  getService: (id: number) => Promise<ServiceReadApiItem>
}

export interface AdvertServiceDependencies {
  apiClient: ApiClient
}

export function createAdvertService({ apiClient }: AdvertServiceDependencies): AdvertService {
  const getBook = (id: number) =>
    apiClient<BookReadApiItem>(`${BOOKS_PATH}/${id}`)

  const getProduct = (id: number) =>
    apiClient<ProductReadApiItem>(`${PRODUCTS_PATH}/${id}`)

  const getService = (id: number) =>
    apiClient<ServiceReadApiItem>(`${SERVICES_PATH}/${id}`)

  return { getBook, getProduct, getService }
}

export function getAdvertService(): AdvertService {
  return createAdvertService({ apiClient: useApi as ApiClient })
}
