import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import ActionButtons from '~/components/advert/ActionButtons.vue'
import { AdvertType } from '~/utils/enum/advertType'
import type { CartStoreItem } from '~/stores/cartStore'

const { navigateToMock, useToastMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn().mockResolvedValue(undefined),
  useToastMock: vi.fn().mockReturnValue({
    add: vi.fn()
  })
}))

mockNuxtImport('navigateTo', () => navigateToMock)
mockNuxtImport('useToast', () => useToastMock)
mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key
}))

const favoriteIds = ref<string[]>([])
const storeMock = {
  hasLoaded: false,
  isLoading: false,
  loadFavorites: vi.fn().mockResolvedValue(undefined),
  isFavorite: (advertId: string) => favoriteIds.value.includes(advertId),
  toggleFavorite: vi.fn(async ({ advertId }: { advertId: string }) => {
    const wasFavorite = favoriteIds.value.includes(advertId)
    favoriteIds.value = wasFavorite
      ? favoriteIds.value.filter(id => id !== advertId)
      : [...favoriteIds.value, advertId]
    return {
      favorite: null,
      isFavorite: !wasFavorite
    }
  })
}
const cartStoreMock = {
  items: [] as CartStoreItem[],
  hasLoaded: false,
  isLoading: false,
  loadCart: vi.fn().mockResolvedValue(undefined),
  addToCart: vi.fn().mockResolvedValue(undefined)
}
vi.mock('~/stores/favoritesStore', () => ({
  useFavoritesStore: () => storeMock
}))
vi.mock('~/stores/cartStore', () => ({
  useCartStore: () => cartStoreMock
}))
describe('AdvertActionButtons', () => {
  beforeEach(() => {
    favoriteIds.value = []
    cartStoreMock.items = []
    vi.clearAllMocks()
  })
  it('toggles the favorite state and emits the new value', async () => {
    const wrapper = mount(ActionButtons, {
      props: {
        advert: {
          id: 'advert-1',
          title: 'Biology: A Global Approach, 12th Edition',
          type: AdvertType.BOOK,
          condition: 'NEW CONDITION',
          price: 84.5,
          image: 'https://example.com/image.jpg'
        }
      },
      global: {
        mocks: {
          $t: (key: string) => key
        }
      }
    })
    expect(storeMock.loadFavorites).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button[aria-label="advert.actions.favorite_add"]').attributes('aria-pressed')).toBe('false')
    await wrapper.get('button[aria-label="advert.actions.favorite_add"]').trigger('click')
    await flushPromises()
    expect(storeMock.toggleFavorite).toHaveBeenCalledWith({
      advertId: 'advert-1',
      advert: {
        id: 'advert-1',
        title: 'Biology: A Global Approach, 12th Edition',
        type: AdvertType.BOOK,
        condition: 'NEW CONDITION',
        price: 84.5,
        image: 'https://example.com/image.jpg'
      }
    })
    expect(wrapper.emitted('favorite')?.[0]).toEqual([true])
    expect(wrapper.get('button[aria-label="advert.actions.favorite_remove"]').attributes('aria-pressed')).toBe('true')
  })

  it('adds the advert to the cart on buy action', async () => {
    const wrapper = mount(ActionButtons, {
      props: {
        advert: {
          id: 'advert-123',
          title: 'Chemistry Book',
          type: AdvertType.BOOK,
          condition: 'NEW CONDITION',
          price: 45.0,
          image: 'https://example.com/chem.jpg'
        }
      },
      global: {
        mocks: {
          $t: (key: string) => key
        }
      }
    })

    await wrapper.get('button.bg-green-700').trigger('click')
    await flushPromises()

    expect(cartStoreMock.addToCart).toHaveBeenCalledWith(expect.objectContaining({
      id: 'advert-123',
      title: 'Chemistry Book',
      price: 45.0,
      categoryTab: 'textbooks',
      imageUrl: 'https://example.com/chem.jpg'
    }))
    expect(wrapper.emitted('cartAdd')?.[0]).toEqual([])
  })

  it('disables the add-to-cart button and changes text when item is in cart', async () => {
    cartStoreMock.items = [{
      listing: {
        id: 'advert-123',
        title: 'Chemistry Book',
        price: 45.0,
        categoryTab: 'textbooks',
        metaLineKey: 'catalog.card.meta_textbooks',
        location: '',
        imageUrl: 'https://example.com/chem.jpg',
        hourly: false
      },
      quantity: 1
    }]
    const wrapper = mount(ActionButtons, {
      props: {
        advert: {
          id: 'advert-123',
          title: 'Chemistry Book',
          type: AdvertType.BOOK,
          condition: 'NEW CONDITION',
          price: 45.0,
          image: 'https://example.com/chem.jpg'
        }
      },
      global: {
        mocks: {
          $t: (key: string) => key
        }
      }
    })

    const button = wrapper.get('button[disabled]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toContain('advert.actions.already_in_cart')
  })
})
