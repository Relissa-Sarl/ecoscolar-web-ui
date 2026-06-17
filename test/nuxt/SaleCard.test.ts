import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import SaleCard from '~/components/me/SaleCard.vue'
import ReviewModal from '~/components/me/ReviewModal.vue'
import type { MySaleAdvert } from '~/services/historyService'
import { AdvertStatus } from '~/utils/enum/advertStatus'

const { mockRefreshNuxtData } = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn()
}))
mockNuxtImport('refreshNuxtData', () => mockRefreshNuxtData)

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
  locale: { value: 'fr' }
}))

mockNuxtImport('useLocalePath', () => () => (path: string) => path)

const mockCreateReview = vi.fn()
mockNuxtImport('useHistory', () => () => ({
  createReview: mockCreateReview
}))

const mockToastAdd = vi.fn()
mockNuxtImport('useToast', () => () => ({
  add: mockToastAdd
}))

const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  UModal: { template: '<div><slot name="body" /><slot name="footer" /></div>' },
  UButton: { template: '<button><slot /></button>' },
  UIcon: { template: '<span class="icon-mock">icon</span>' },
  Stars: { template: '<div class="stars-mock"><slot /></div>' },
  ReviewModal: { template: '<div class="review-modal-mock">modal-stub</div>' }
}

const mockSale: MySaleAdvert = {
  id: 1,
  type: 'BOOK',
  title: 'Calculatrice scientifique',
  price: 45,
  publicationDate: '2026-05-20T00:00:00Z',
  notificationDate: '2026-05-21T00:00:00Z',
  status: AdvertStatus.ACTIVE,
  userId: 'user-1',
  sellerPseudo: 'MyPseudo',
  primaryImage: 'https://example.com/calc.jpg',
  buyerName: ''
}

describe('SaleCard', () => {
  it('renders correctly with all information for ACTIVE status', () => {
    const wrapper = mount(SaleCard, {
      props: { sale: mockSale },
      global: { stubs }
    })

    // Check texts
    expect(wrapper.text()).toContain('me.sales.status.active')
    expect(wrapper.text()).toContain('Calculatrice scientifique')
    expect(wrapper.text()).toContain('45.00 CHF')
    expect(wrapper.text()).toContain('me.sales.view')

    // buyerName should not be shown
    expect(wrapper.text()).not.toContain('me.sales.buyer_label')

    // Check image
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/calc.jpg')
  })

  it('shows buyer information only when status is SOLD and buyerName is present', () => {
    const soldSale = { ...mockSale, status: AdvertStatus.SOLD, buyerName: 'JohnDoe' }
    const wrapper = mount(SaleCard, {
      props: { sale: soldSale },
      global: { stubs }
    })

    expect(wrapper.text()).toContain('me.sales.status.sold')
    expect(wrapper.text()).toContain('me.sales.buyer_label')
    expect(wrapper.text()).toContain('JohnDoe')

    // Edit button shouldn't be visible for SOLD
    expect(wrapper.text()).not.toContain('me.sales.edit')
  })

  it('hides edit button when status is EXPIRED', () => {
    const expiredSale = { ...mockSale, status: AdvertStatus.EXPIRED }
    const wrapper = mount(SaleCard, {
      props: { sale: expiredSale },
      global: { stubs }
    })

    expect(wrapper.text()).toContain('me.sales.status.expired')
    expect(wrapper.text()).not.toContain('me.sales.edit')
  })

  it('does not show edit button when status is PAUSED (edit was removed from SaleCard)', () => {
    const pausedSale = { ...mockSale, status: AdvertStatus.PAUSED }
    const wrapper = mount(SaleCard, {
      props: { sale: pausedSale },
      global: { stubs }
    })

    expect(wrapper.text()).toContain('me.sales.status.paused')
    expect(wrapper.text()).not.toContain('me.sales.edit')
  })

  it('renders fallback icon when primaryImage is empty', () => {
    const noImageSale = { ...mockSale, primaryImage: null }
    const wrapper = mount(SaleCard, {
      props: { sale: noImageSale },
      global: { stubs }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.icon-mock').exists()).toBe(true)
  })

  it('renders leave review button for SOLD status', () => {
    const soldSale = { ...mockSale, status: AdvertStatus.SOLD, buyerName: 'JohnDoe' }
    const wrapper = mount(SaleCard, {
      props: { sale: soldSale },
      global: { stubs }
    })
    const btn = wrapper.findAll('button').find(b => b.text().includes('me.purchases.leave_review'))
    expect(btn?.exists()).toBe(true)
  })

  it('does not render leave review button for ACTIVE status', () => {
    const wrapper = mount(SaleCard, {
      props: { sale: mockSale },
      global: { stubs }
    })
    const btns = wrapper.findAll('button').filter(b => b.text().includes('me.purchases.leave_review'))
    expect(btns.length).toBe(0)
  })

  it('hides leave review button and renders Stars component when already reviewed', () => {
    const reviewedSale = {
      ...mockSale,
      status: AdvertStatus.SOLD,
      buyerName: 'JohnDoe',
      review: { rating: 5, comment: 'Amazing!' }
    }
    const wrapper = mount(SaleCard, {
      props: { sale: reviewedSale },
      global: {
        stubs: {
          ...stubs,
          Stars: { template: '<div class="stars-mock">{{ rating }} stars</div>', props: ['rating'] }
        }
      }
    })
    const btns = wrapper.findAll('button').filter(b => b.text().includes('me.purchases.leave_review'))
    expect(btns.length).toBe(0)
    expect(wrapper.find('.stars-mock').exists()).toBe(true)
    expect(wrapper.find('.stars-mock').text()).toContain('5 stars')
  })

  it('falls back to raw date string on formatting error', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementationOnce(() => {
      throw new Error('Locale formatting error')
    })
    const wrapper = mount(SaleCard, {
      props: { sale: { ...mockSale, publicationDate: 'invalid-date' } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('invalid-date')
    spy.mockRestore()
  })

  it('renders raw status name for unknown status badge', () => {
    const wrapper = mount(SaleCard, {
      props: { sale: { ...mockSale, status: 'UNKNOWN' as unknown as AdvertStatus } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('UNKNOWN')
  })

  it('emits confirm-shipping when confirm button is clicked', async () => {
    const wrapper = mount(SaleCard, {
      props: {
        sale: {
          ...mockSale,
          transactionStatus: 'PAID_WAITING_SHIPPING',
          transactionId: 456
        }
      },
      global: { stubs }
    })
    const btn = wrapper.find('button')
    expect(btn.text()).toContain('me.sales.actions.confirm_shipping')
    await btn.trigger('click')

    expect(wrapper.emitted('confirm-shipping')?.[0]).toEqual([456])
  })

  it('updates localReview and refreshes Nuxt data when review is successfully submitted', async () => {
    const soldSale = { ...mockSale, status: AdvertStatus.SOLD, buyerName: 'JohnDoe', review: null }
    const wrapper = mount(SaleCard, {
      props: { sale: soldSale },
      global: { stubs }
    })

    const reviewModal = wrapper.findComponent(ReviewModal)
    expect(reviewModal.exists()).toBe(true)

    // Trigger the success event from the ReviewModal stub
    await reviewModal.vm.$emit('success', { rating: 4, comment: 'Nice!' })

    // It should update the review UI (e.g. show the rating / hide leave review button)
    expect((wrapper.vm as unknown as { localReview: { rating: number, comment: string | null } | null }).localReview).toEqual({ rating: 4, comment: 'Nice!' })
    expect(mockRefreshNuxtData).toHaveBeenCalledWith('user-sales')
  })
})
