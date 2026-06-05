import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'

import PurchasesPage from '~/pages/me/purchases.vue'

const asyncDataMock = vi.hoisted(() => vi.fn())
mockNuxtImport('useAsyncData', () => asyncDataMock)
mockNuxtImport('useI18n', () => () => ({ t: (key: string) => key }))
mockNuxtImport('useLocalePath', () => () => (path: string) => path)

// Mock Nuxt components
const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  PurchaseCard: {
    template: '<div class="mock-purchase-card">Purchase Card</div>'
  }
}

describe('Purchases Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when data is empty', async () => {
    asyncDataMock.mockResolvedValueOnce({
      data: ref([]),
      pending: ref(false),
      error: ref(null)
    })

    const wrapper = await mountSuspended(PurchasesPage, { global: { stubs } })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('me.purchases.empty_title')
    expect(wrapper.text()).toContain('me.purchases.empty_placeholder')
    expect(wrapper.text()).toContain('me.purchases.explore_cta')
    expect(wrapper.find('.mock-purchase-card').exists()).toBe(false)
  })

  it('renders purchase cards when data is available', async () => {
    asyncDataMock.mockResolvedValueOnce({
      data: ref([
        { id: '1', title: 'Test 1' },
        { id: '2', title: 'Test 2' }
      ]),
      pending: ref(false),
      error: ref(null)
    })

    const wrapper = await mountSuspended(PurchasesPage, { global: { stubs } })
    await wrapper.vm.$nextTick()

    const cards = wrapper.findAll('.mock-purchase-card')
    expect(cards.length).toBe(2)
    expect(wrapper.text()).not.toContain('me.purchases.empty_title')
  })
})
