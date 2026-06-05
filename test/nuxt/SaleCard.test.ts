import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import SaleCard from '~/components/me/SaleCard.vue'
import type { MySaleAdvert } from '~/services/historyService'
import { AdvertStatus } from '~/utils/enum/advertStatus'

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
  locale: { value: 'fr' }
}))

mockNuxtImport('useLocalePath', () => () => (path: string) => path)

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
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })

    // Check texts
    expect(wrapper.text()).toContain('me.sales.status.active')
    expect(wrapper.text()).toContain('Calculatrice scientifique')
    expect(wrapper.text()).toContain('45 CHF')
    expect(wrapper.text()).toContain('me.sales.view')
    expect(wrapper.text()).toContain('me.sales.edit')

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
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
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
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })

    expect(wrapper.text()).toContain('me.sales.status.expired')
    expect(wrapper.text()).not.toContain('me.sales.edit')
  })

  it('shows edit button when status is PAUSED', () => {
    const pausedSale = { ...mockSale, status: AdvertStatus.PAUSED }
    const wrapper = mount(SaleCard, {
      props: { sale: pausedSale },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })

    expect(wrapper.text()).toContain('me.sales.status.paused')
    expect(wrapper.text()).toContain('me.sales.edit')
  })

  it('renders fallback svg when primaryImage is empty', () => {
    const noImageSale = { ...mockSale, primaryImage: null }
    const wrapper = mount(SaleCard, {
      props: { sale: noImageSale },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
