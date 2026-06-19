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
  postQuestion: (id: number, content: string) => Promise<QuestionResponse>
  postAnswer: (advertId: number, questionId: number, content: string) => Promise<QuestionResponse>

  updateProductAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>
  updateServiceAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>
  updateBookAdvert: (id: number, data: Partial<ModifyAdvertForm>) => Promise<void>

  createProductAdvert: (data: CreateAdvertData) => Promise<{ id: number }>
  createServiceAdvert: (data: CreateAdvertData) => Promise<void>
  createBookAdvert: (data: CreateAdvertData) => Promise<{ id: number }>

  uploadPictures: (advertId: number, files: File[]) => Promise<void>

  deleteAdvert: (id: number) => Promise<void>
  updateAdvertStatus: (id: number, status: string) => Promise<void>
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
  const postQuestion = async (id: number, content: string) =>
    apiClient<QuestionResponse>(`${ADVERTS_PATH}/${id}/questions`, { method: 'POST', body: { content } })
  const postAnswer = async (advertId: number, questionId: number, content: string) =>
    apiClient<QuestionResponse>(`${ADVERTS_PATH}/${advertId}/questions/${questionId}/answers`, {
      method: 'POST',
      body: { content }
    })

  const updateProductAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/products/${id}`, { method: 'PUT', body: data })
  }
  const updateServiceAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/services/${id}`, { method: 'PUT', body: data })
  }
  const updateBookAdvert = async (id: number, data: Partial<ModifyAdvertForm>): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/books/${id}`, { method: 'PUT', body: data })
  }

  const createProductAdvert = async (data: CreateAdvertData): Promise<{ id: number }> => {
    return await apiClient<{ id: number }>(`${ADVERTS_PATH}/products`, { method: 'POST', body: data })
  }
  const createServiceAdvert = async (data: CreateAdvertData): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/services`, { method: 'POST', body: data })
  }
  const createBookAdvert = async (data: CreateAdvertData): Promise<{ id: number }> => {
    return await apiClient<{ id: number }>(`${ADVERTS_PATH}/books`, { method: 'POST', body: data })
  }

  const uploadPictures = async (advertId: number, files: File[]): Promise<void> => {
    if (!files.length) return
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    await apiClient<unknown>(`${ADVERTS_PATH}/${advertId}/pictures`, {
      method: 'POST',
      body: formData
    })
  }

  const deleteAdvert = async (id: number): Promise<void> => {
    apiClient<unknown>(`${ADVERTS_PATH}/${id}`, { method: 'DELETE' })
  }

  const updateAdvertStatus = async (id: number, status: string): Promise<void> => {
    await apiClient<unknown>(`${ADVERTS_PATH}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(status),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return {
    getBook,
    getProduct,
    getService,

    getAdvert,
    getQuestions,
    postQuestion,
    postAnswer,

    updateProductAdvert,
    updateServiceAdvert,
    updateBookAdvert,

    createProductAdvert,
    createServiceAdvert,
    createBookAdvert,

    uploadPictures,

    deleteAdvert,
    updateAdvertStatus
  }
}

export function getAdvertService() {
  return createAdvertService({ apiClient: useApi as ApiClient })
}
