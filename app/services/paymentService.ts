import type { CheckoutRequest, CheckoutResponse } from '../types/payment'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

export interface PaymentService {
  createCheckoutSession: (dto: CheckoutRequest) => Promise<CheckoutResponse>
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

  return {
    createCheckoutSession
  }
}

export const getPaymentService = () => {
  return createPaymentService({
    apiClient: useApi as ApiClient
  })
}
