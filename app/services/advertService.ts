import type { ModifyAdvertForm } from '../types/advert'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const ADVERTS_PATH = 'v1/adverts'

export interface AdvertService {
  getAdvert: (id: number) => Promise<ModifyAdvertForm>

  updateProductAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>
  updateServiceAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>
  updateBookAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>

  createProductAdvert: (data: any) => Promise<void>
  createServiceAdvert: (data: any) => Promise<void>
  createBookAdvert: (data: any) => Promise<void>
}

export interface AdvertServiceDependencies {
  apiClient: ApiClient
}

export function createAdvertService({ apiClient }: AdvertServiceDependencies): AdvertService {
  const getAdvert = (id: number) => apiClient<ModifyAdvertForm>(`${ADVERTS_PATH}/${id}`)

  const updateProductAdvert = (id: number, data: Partial<ModifyAdvertForm>) => apiClient(`${ADVERTS_PATH}/products/${id}`, { method: 'PUT', body: data })
  const updateServiceAdvert = (id: number, data: Partial<ModifyAdvertForm>) => apiClient(`${ADVERTS_PATH}/services/${id}`, { method: 'PUT', body: data })
  const updateBookAdvert = (id: number, data: Partial<ModifyAdvertForm>) => apiClient(`${ADVERTS_PATH}/books/${id}`, { method: 'PUT', body: data })

  const createProductAdvert = (data: any) => apiClient(`${ADVERTS_PATH}/products`, { method: 'POST', body: data })
  const createServiceAdvert = (data: any) => apiClient(`${ADVERTS_PATH}/services`, { method: 'POST', body: data })
  const createBookAdvert = (data: any) => apiClient(`${ADVERTS_PATH}/books`, { method: 'POST', body: data })

  return {
    getAdvert,

    updateProductAdvert,
    updateServiceAdvert,
    updateBookAdvert,

    createProductAdvert,
    createServiceAdvert,
    createBookAdvert
  }
}

export function getAdvertService(): AdvertService {
  return createAdvertService({ apiClient: useApi as ApiClient })
}
