import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import CheckoutPage from '~/pages/checkout.vue'

// Mock imports
const { mockCreateCheckoutSession } = vi.hoisted(() => ({
  mockCreateCheckoutSession: vi.fn()
}))

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key
}))

const mockRouteQuery = { advertId: '123' }
mockNuxtImport('useRoute', () => () => ({
  query: mockRouteQuery
}))

// Mock payment service
vi.mock('~/services/paymentService', () => ({
  getPaymentService: () => ({
    createCheckoutSession: mockCreateCheckoutSession
  })
}))

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteQuery.advertId = '123'
  })

  it('renders correctly', () => {
    const wrapper = mount(CheckoutPage)
    expect(wrapper.text()).toContain('checkout.title')
    expect(wrapper.text()).toContain('checkout.instruction')
    expect(wrapper.text()).toContain('checkout.address_label')
    expect(wrapper.text()).toContain('checkout.submit')
  })

  it('shows error if address is missing', async () => {
    const wrapper = mount(CheckoutPage)

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.text()).toContain('checkout.errors.address_required')
  })

  it('calls createCheckoutSession and redirects on success', async () => {
    const wrapper = mount(CheckoutPage)

    // Fill the address
    const textarea = wrapper.find('textarea')
    await textarea.setValue('123 Test St')

    // Mock success response
    const mockUrl = 'https://stripe.com/checkout/123'
    mockCreateCheckoutSession.mockResolvedValueOnce({ url: mockUrl })

    // We can mock window.location.href
    const originalLocation = window.location
    delete (window as unknown as Record<string, unknown>).location
    window.location = { ...originalLocation, href: '' } as any

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(mockCreateCheckoutSession).toHaveBeenCalledWith({ productId: 123 })
    // wait for promises
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(window.location.href).toBe(mockUrl)

    // Restore
    window.location = originalLocation as any
  })

  it('shows error if init fails', async () => {
    const wrapper = mount(CheckoutPage)

    const textarea = wrapper.find('textarea')
    await textarea.setValue('123 Test St')

    mockCreateCheckoutSession.mockResolvedValueOnce(null)

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('checkout.errors.init_failed')
  })

  it('shows general error on catch', async () => {
    const wrapper = mount(CheckoutPage)

    const textarea = wrapper.find('textarea')
    await textarea.setValue('123 Test St')

    mockCreateCheckoutSession.mockRejectedValueOnce(new Error('Network error'))

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Network error')
  })
})
