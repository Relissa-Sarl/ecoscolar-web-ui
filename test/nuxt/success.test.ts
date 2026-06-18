import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import SuccessPage from '~/pages/success.vue'

const mockClearCart = vi.fn()
vi.mock('~/stores/cartStore', () => ({
  useCartStore: () => ({
    clearCart: mockClearCart
  })
}))

// Mock components
const stubs = {
  SuccessIcon: true,
  SuccessMainMessage: true,
  SuccessInfos: true,
  PaymentStateButton: true
}

const { mockGetSession } = vi.hoisted(() => ({
  mockGetSession: vi.fn()
}))

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key
}))

mockNuxtImport('useSeoMeta', () => vi.fn())

const mockRouteQuery = { stripeSessionId: 'sess_123', orderId: 'ord_123' }
mockNuxtImport('useRoute', () => () => ({
  query: mockRouteQuery
}))

vi.mock('~/services/paymentService', () => ({
  getPaymentService: () => ({
    getSession: mockGetSession
  })
}))

describe('Success Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteQuery.stripeSessionId = 'sess_123'
    mockRouteQuery.orderId = 'ord_123'
  })

  it('renders correctly and fetches session details', async () => {
    mockGetSession.mockResolvedValueOnce({ amountTotal: 5000 }) // 50.00 CHF
    const wrapper = mount(SuccessPage, {
      global: {
        stubs
      }
    })

    // Wait for onMounted
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockGetSession).toHaveBeenCalledWith('sess_123')
    expect(mockClearCart).toHaveBeenCalled()

    // Check if the component mounts SuccessInfos with correct props
    const infosComponent = wrapper.findComponent({ name: 'SuccessInfos' })
    expect(infosComponent.exists()).toBe(true)
    expect(infosComponent.props('totalAmount')).toBe(50) // 5000 / 100
    expect(infosComponent.props('orderNumber')).toBe('ord_123')
  })

  it('handles errors when fetching session details gracefully', async () => {
    mockGetSession.mockRejectedValueOnce(new Error('Session error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(SuccessPage, {
      global: {
        stubs
      }
    })

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(consoleSpy).toHaveBeenCalledWith('Failed to retrieve checkout session details:', expect.any(Error))

    const infosComponent = wrapper.findComponent({ name: 'SuccessInfos' })
    expect(infosComponent.props('totalAmount')).toBe(null)

    consoleSpy.mockRestore()
  })
})
