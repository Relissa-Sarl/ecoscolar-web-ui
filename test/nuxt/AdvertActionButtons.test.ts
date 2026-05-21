import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import ActionButtons from '~/components/advert/ActionButtons.vue'
import { AdvertType } from '~/utils/enum/advertType'

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
vi.mock('~/stores/favoritesStore', () => ({
  useFavoritesStore: () => storeMock
}))
describe('AdvertActionButtons', () => {
  beforeEach(() => {
    favoriteIds.value = []
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
})
