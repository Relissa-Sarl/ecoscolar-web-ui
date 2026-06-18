import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'

import SalesPage from '~/pages/me/sales.vue'

const asyncDataMock = vi.hoisted(() => vi.fn())
mockNuxtImport('useAsyncData', () => asyncDataMock)
mockNuxtImport('useI18n', () => () => ({ t: (key: string) => key }))
mockNuxtImport('useLocalePath', () => () => (path: string) => path)

// Mock Nuxt components
const stubs = {
  NuxtLink: {
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  },
  SaleCard: {
    template: '<div class="mock-sale-card">Sale Card</div>'
  }
}

describe('Sales Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when data is empty', async () => {
    asyncDataMock.mockResolvedValueOnce({
      data: ref([]),
      pending: ref(false),
      error: ref(null)
    })

    const wrapper = await mountSuspended(SalesPage, { global: { stubs } })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('me.sales.empty_title')
    expect(wrapper.text()).toContain('me.sales.empty_placeholder')
    expect(wrapper.text()).toContain('me.sales.sell_cta')
    expect(wrapper.get('a').attributes('href')).toBe('/adverts/create-advert')
    expect(wrapper.find('.mock-sale-card').exists()).toBe(false)
  }, 15000)

  it('renders sale cards when data is available', async () => {
    asyncDataMock.mockResolvedValueOnce({
      data: ref([
        { id: 1, title: 'Test Sale 1' },
        { id: 2, title: 'Test Sale 2' }
      ]),
      pending: ref(false),
      error: ref(null)
    })

    const wrapper = await mountSuspended(SalesPage, { global: { stubs } })
    await wrapper.vm.$nextTick()

    const cards = wrapper.findAll('.mock-sale-card')
    expect(cards.length).toBe(2)
    expect(wrapper.text()).not.toContain('me.sales.empty_title')
  }, 15000)

  it('renders one card per tutoring package on the same advert', async () => {
    asyncDataMock.mockResolvedValueOnce({
      data: ref([
        { id: 42, transactionId: 101, title: 'Tutorat maths', transactionStatus: 'PAID_WAITING_ACCEPTANCE' },
        { id: 42, transactionId: 102, title: 'Tutorat maths', transactionStatus: 'PAID_WAITING_COMPLETION' }
      ]),
      pending: ref(false),
      error: ref(null)
    })

    const wrapper = await mountSuspended(SalesPage, { global: { stubs } })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.mock-sale-card').length).toBe(2)
  }, 15000)
})
