import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import BookingModal from '~/components/booking/BookingModal.vue'

const { mockCreateCheckoutSession } = vi.hoisted(() => ({
  mockCreateCheckoutSession: vi.fn()
}))

mockNuxtImport('useI18n', () => () => ({
  t: (key: string, params?: Record<string, unknown>) => {
    if (params) {
      return `${key} ${JSON.stringify(params)}`
    }
    return key
  }
}))

vi.mock('~/services/paymentService', () => ({
  getPaymentService: () => ({
    createCheckoutSession: mockCreateCheckoutSession
  })
}))

const stubs = {
  Teleport: { template: '<div><slot /></div>' },
  Icon: { template: '<span class="icon-stub">icon</span>' },
  Transition: { template: '<div><slot /></div>' }
}

const mockAdvert = {
  id: 1,
  title: 'Math Tutoring',
  price: 50,
  minHours: 1,
  maxHours: 10,
  seller: { username: 'johndoe' },
  subject: 'Math',
  grade: 'High School',
  school: 'EPFL'
}

describe('BookingModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render content when isOpen is false', () => {
    const wrapper = mount(BookingModal, {
      props: { isOpen: false, advert: mockAdvert },
      global: { stubs }
    })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders correctly when isOpen is true', () => {
    const wrapper = mount(BookingModal, {
      props: { isOpen: true, advert: mockAdvert },
      global: { stubs }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Math Tutoring')
    expect(wrapper.text()).toContain('johndoe')
    expect(wrapper.text()).toContain('Math')
    expect(wrapper.text()).toContain('High School')

    // Calculates total correctly
    // 1 session * 50 = 50
    // Platform fee = 50 * 0.10 = 5
    // Total = 55
    expect(wrapper.text()).toContain('55.00 CHF')
  })

  it('increments and decrements sessions within limits', async () => {
    const wrapper = mount(BookingModal, {
      props: { isOpen: true, advert: mockAdvert },
      global: { stubs }
    })

    const incrementBtn = wrapper.find('button[aria-label="booking.increase"]')
    const decrementBtn = wrapper.find('button[aria-label="booking.decrease"]')

    // Increment to 2
    await incrementBtn.trigger('click')

    // Total should update: 2 * 50 = 100, fee = 10, total = 110
    expect(wrapper.text()).toContain('110.00 CHF')

    // Decrement back to 1
    await decrementBtn.trigger('click')
    expect(wrapper.text()).toContain('55.00 CHF')
  })

  it('calls checkout service on confirm', async () => {
    const wrapper = mount(BookingModal, {
      props: { isOpen: true, advert: mockAdvert },
      global: { stubs }
    })

    const mockUrl = 'https://stripe.com/checkout/456'
    mockCreateCheckoutSession.mockResolvedValueOnce({ url: mockUrl })

    const originalLocation = window.location
    delete (window as unknown as Record<string, unknown>).location
    window.location = { ...originalLocation, href: '' }

    const buttons = wrapper.findAll('button')
    const confirmBtn = buttons.find(b => b.text().includes('booking.confirm'))

    expect(confirmBtn).toBeDefined()
    await confirmBtn?.trigger('click')

    expect(mockCreateCheckoutSession).toHaveBeenCalledWith({
      productId: 1,
      sessions: 1
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(window.location.href).toBe(mockUrl)

    window.location = originalLocation
  })

  it('displays error if checkout fails', async () => {
    const wrapper = mount(BookingModal, {
      props: { isOpen: true, advert: mockAdvert },
      global: { stubs }
    })

    mockCreateCheckoutSession.mockRejectedValueOnce(new Error('Checkout error'))

    const buttons = wrapper.findAll('button')
    const confirmBtn = buttons.find(b => b.text().includes('booking.confirm'))

    await confirmBtn?.trigger('click')
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Checkout error')
  })

  it('emits close event', async () => {
    const wrapper = mount(BookingModal, {
      props: { isOpen: true, advert: mockAdvert },
      global: { stubs }
    })

    const closeBtn = wrapper.find('button[aria-label="booking.close"]')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
