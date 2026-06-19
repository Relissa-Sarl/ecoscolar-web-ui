import type { CheckoutRequest, CheckoutResponse } from '../types/payment'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

export interface PaymentService {
  createCheckoutSession: (dto: CheckoutRequest) => Promise<CheckoutResponse>
  reserveTutoring: (advertId: number, hours: number) => Promise<CheckoutResponse>
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

  // Tutoring is sold through its own reservation flow (hours + escrow), not the cart checkout.
  const reserveTutoring = async (advertId: number, hours: number) =>
    apiClient<CheckoutResponse>(`/tutoring/${advertId}/reserve`, {
      method: 'POST',
      body: { hours }
    })

  const getSession = async (sessionId: string) =>
    apiClient<{ amountTotal: number | null }>(`${PAYMENTS_PATH}/session/${sessionId}`, {
      method: 'GET'
    })

  return {
    createCheckoutSession,
    reserveTutoring,
    getSession
  }
}

export const getPaymentService = () => {
  return createPaymentService({
    apiClient: useApi as ApiClient
  })
}
