import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import PurchaseCard from '~/components/me/PurchaseCard.vue'
import type { Purchase } from '~/services/historyService'

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
  locale: { value: 'fr' }
}))

mockNuxtImport('useLocalePath', () => () => (path: string) => path)

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
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })

    // Check texts
    expect(wrapper.text()).toContain('COMPLETED')
    expect(wrapper.text()).toContain('Calculatrice Graphique')
    expect(wrapper.text()).toContain('JaneDoe')
    expect(wrapper.text()).toContain('55 CHF')
    expect(wrapper.text()).toContain('me.purchases.seller_label')
    expect(wrapper.text()).toContain('me.purchases.view_advert')

    // Check image
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/calc.jpg')

    // Check fallback SVG is absent
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(false)
  })

  it('renders fallback svg when imageUrl is empty', () => {
    const purchaseWithoutImage = { ...mockPurchase, imageUrl: null }
    const wrapper = mount(PurchaseCard, {
      props: { purchase: purchaseWithoutImage },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('displays the correct status text for COMPLETED status', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: { ...mockPurchase, status: 'COMPLETED' } },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('COMPLETED')
  })

  it('displays the correct status text for PENDING status', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: { ...mockPurchase, status: 'PENDING' } },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('PENDING')
  })

  it('displays the raw status text as fallback for unknown status', () => {
    const wrapper = mount(PurchaseCard, {
      props: { purchase: { ...mockPurchase, status: 'UNKNOWN' } },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('UNKNOWN')
  })
})
