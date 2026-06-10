import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import PurchaseCard from '~/components/me/PurchaseCard.vue'
import type { Purchase } from '~/services/historyService'

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

const mockPurchase: Purchase = {
  id: 'txn-1',
  advertId: 'adv-123',
  advertTitle: 'Calculatrice Graphique',
  price: 55,
  purchaseDate: '2026-05-21T10:00:00Z',
  status: 'COMPLETED',
  imageUrl: 'https://example.com/calc.jpg',
  sellerName: 'JaneDoe'
}

describe('PurchaseCard', () => {
  it('renders correctly with all information', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: mockPurchase },
      global: { stubs }
    })

    // Check texts
    expect(wrapper.text()).toContain('COMPLETED')
    expect(wrapper.text()).toContain('Calculatrice Graphique')
    expect(wrapper.text()).toContain('JaneDoe')
    expect(wrapper.text()).toContain('55 CHF')
    expect(wrapper.text()).toContain('me.purchases.seller_label')
    // COMPLETED purchases show the details toggle instead of the view advert link
    expect(wrapper.text()).toContain('me.purchases.actions.details')
    expect(wrapper.text()).not.toContain('me.purchases.view_advert')

    // Check image
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/calc.jpg')

    // Check fallback UIcon is absent
    const fallbackIcon = wrapper.find('.icon-mock')
    expect(fallbackIcon.exists()).toBe(false)
  })

  it('shows view advert link instead of details for an ongoing purchase', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: { ...mockPurchase, status: 'PAID_WAITING_SHIPPING' } },
      global: { stubs }
    })

    expect(wrapper.text()).toContain('me.purchases.view_advert')
    expect(wrapper.text()).not.toContain('me.purchases.actions.details')
  })

  it('renders fallback icon when imageUrl is empty', () => {
    const purchaseWithoutImage = { ...mockPurchase, imageUrl: null }
    const wrapper = mount(PurchaseCard, {
      props: { purchase: purchaseWithoutImage },
      global: { stubs }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.icon-mock').exists()).toBe(true)
  })

  it('displays the correct status text for COMPLETED status', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: { ...mockPurchase, status: 'COMPLETED' } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('COMPLETED')
  })

  it('displays the correct status text for PENDING status', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: { ...mockPurchase, status: 'PENDING' } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('PENDING')
  })

  it('displays the raw status text as fallback for unknown status', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: { ...mockPurchase, status: 'UNKNOWN' } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('UNKNOWN')
  })

  it('renders leave review button for completed purchase', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: mockPurchase },
      global: { stubs }
    })
    const btn = wrapper.findAll('button').find(b => b.text().includes('me.purchases.leave_review'))
    expect(btn?.exists()).toBe(true)
  })

  it('does not render leave review button for pending purchase', () => {
    const pendingPurchase = { ...mockPurchase, status: 'PENDING' }
    const wrapper = mount(PurchaseCard, {
      props: { purchase: pendingPurchase },
      global: { stubs }
    })
    const btns = wrapper.findAll('button').filter(b => b.text().includes('me.purchases.leave_review'))
    expect(btns.length).toBe(0)
  })

  it('hides leave review button and renders Stars component when already reviewed', () => {
    const reviewedPurchase = {
      ...mockPurchase,
      review: { rating: 4, comment: 'Nice' }
    }
    const wrapper = mount(PurchaseCard, {
      props: { purchase: reviewedPurchase },
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
    expect(wrapper.find('.stars-mock').text()).toContain('4 stars')
  })
})
