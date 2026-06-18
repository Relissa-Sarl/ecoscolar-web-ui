import type { CheckoutRequest, CheckoutResponse } from '../types/payment'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

export interface PaymentService {
  createCheckoutSession: (dto: CheckoutRequest) => Promise<CheckoutResponse>
  getSession: (sessionId: string) => Promise<{ amountTotal: number | null }>
}

export interface PaymentServiceDependencies {
  apiClient: ApiClient
}

const PAYMENTS_PATH = '/payments'

export function createPaymentService({ apiClient }: PaymentServiceDependencies): PaymentService {
  const createCheckoutSession = async (dto: CheckoutRequest) =>
    apiClient<CheckoutResponse>(`${PAYMENTS_PATH}/checkout`, {
      method: 'POST',
      body: dto
    })

  const getSession = async (sessionId: string) =>
    apiClient<{ amountTotal: number | null }>(`${PAYMENTS_PATH}/session/${sessionId}`, {
      method: 'GET'
    })

  return {
    createCheckoutSession,
    getSession
  }
}

export const getPaymentService = () => {
  return createPaymentService({
    apiClient: useApi as ApiClient
  })
}
