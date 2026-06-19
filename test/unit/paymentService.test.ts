import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPaymentService } from '../../app/services/paymentService'

describe('paymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a checkout session through the API using POST', async () => {
    const mockResponse = { url: 'https://checkout.stripe.com/pay/cs_test_123' }
    const apiClient = vi.fn().mockResolvedValueOnce(mockResponse)

    const service = createPaymentService({ apiClient })

    const requestPayload = { productId: 456 }
    const response = await service.createCheckoutSession(requestPayload)

    expect(response).toEqual(mockResponse)
    expect(apiClient).toHaveBeenCalledWith('/payments/checkout', {
      method: 'POST',
      body: requestPayload
    })
  })
})
