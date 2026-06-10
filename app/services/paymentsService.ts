import { useRuntimeConfig, useNuxtApp } from '#imports'

export interface CheckoutRequestDto {
  advertId: number
  shippingAddress: string
}

export interface CheckoutResponseDto {
  url: string
}

export function getPaymentsService() {
  const config = useRuntimeConfig()
  const { $authFetch } = useNuxtApp() as unknown as { $authFetch: <T>(url: string, options?: unknown) => Promise<T> }
  const baseUrl = config.public.apiBaseUrl

  const checkout = async (request: CheckoutRequestDto): Promise<CheckoutResponseDto> => {
    return await $authFetch<CheckoutResponseDto>(`${baseUrl}/Payments/checkout`, {
      method: 'POST',
      body: request
    })
  }

  return {
    checkout
  }
}
