import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import ProfileReviews from '~/components/profile/ProfileReviews.vue'
import type { UserReview } from '~/types/user'

mockNuxtImport('useI18n', () => () => ({
  t: (key: string, params?: unknown) => {
    if (params) {
      return `${key}_${JSON.stringify(params)}`
    }
    return key
  },
  locale: { value: 'fr' }
}))

const mockReviews: UserReview[] = [
  {
    reviewId: 1,
    comment: 'Excellent service!',
    rating: 5,
    date: '2026-06-03T10:00:00Z',
    reviewerId: 'rev-1',
    reviewerNickname: 'Alice',
    reviewedId: 'user-123',
    reviewedNickname: 'Bob',
    transactionId: 201,
    reviewedRole: 'BUYER'
  },
  {
    reviewId: 2,
    comment: 'Good communication.',
    rating: 4,
    date: '2026-06-01T12:00:00Z',
    reviewerId: 'rev-2',
    reviewerNickname: 'Charlie',
    reviewedId: 'user-123',
    reviewedNickname: 'Bob',
    transactionId: 202,
    reviewedRole: 'SELLER'
  },
  {
    reviewId: 3,
    comment: 'Average transaction.',
    rating: 3,
    date: '2026-06-02T15:00:00Z',
    reviewerId: 'rev-3',
    reviewerNickname: 'Dave',
    reviewedId: 'user-123',
    reviewedNickname: 'Bob',
    transactionId: 203,
    reviewedRole: 'BUYER'
  }
]

describe('ProfileReviews Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with an empty reviews list', () => {
    const wrapper = mount(ProfileReviews, {
      props: {
        reviews: []
      },
      global: {
        stubs: {
          UIcon: true
        }
      }
    })

    // Assert that average rating shows 0.0
    const avgRating = wrapper.find('[data-test="average-rating"]')
    expect(avgRating.exists()).toBe(true)
    expect(avgRating.text()).toBe('0.0')

    // Assert reviews count is rendered
    const count = wrapper.find('[data-test="reviews-count"]')
    expect(count.exists()).toBe(true)
    expect(count.text()).toBe('profile.reviews.count_{"count":0}')

    // Assert empty state is displayed
    const emptyState = wrapper.find('[data-test="empty-state"]')
    expect(emptyState.exists()).toBe(true)
    expect(emptyState.text()).toContain('profile.reviews.empty')

    // Assert that no review items are rendered
    const items = wrapper.findAll('[data-test="review-item"]')
    expect(items.length).toBe(0)
  })

  it('renders average rating, count, and star distribution correctly when reviews are provided', () => {
    const wrapper = mount(ProfileReviews, {
      props: {
        reviews: mockReviews
      },
      global: {
        stubs: {
          UIcon: true
        }
      }
    })

    // Average rating: (5 + 4 + 3) / 3 = 4.0
    const avgRating = wrapper.find('[data-test="average-rating"]')
    expect(avgRating.exists()).toBe(true)
    expect(avgRating.text()).toBe('4.0')

    // Reviews count key with parameters serialized
    const count = wrapper.find('[data-test="reviews-count"]')
    expect(count.exists()).toBe(true)
    expect(count.text()).toBe('profile.reviews.count_{"count":3}')

    // Verify rating distributions count (5-star count=1, 4-star count=1, 3-star count=1, others=0)
    const dist5 = wrapper.find('[data-test="distribution-5"] [data-test="count"]')
    expect(dist5.text()).toBe('1')

    const dist4 = wrapper.find('[data-test="distribution-4"] [data-test="count"]')
    expect(dist4.text()).toBe('1')

    const dist3 = wrapper.find('[data-test="distribution-3"] [data-test="count"]')
    expect(dist3.text()).toBe('1')

    const dist2 = wrapper.find('[data-test="distribution-2"] [data-test="count"]')
    expect(dist2.text()).toBe('0')

    const dist1 = wrapper.find('[data-test="distribution-1"] [data-test="count"]')
    expect(dist1.text()).toBe('0')

    // Expect empty state is not displayed
    expect(wrapper.find('[data-test="empty-state"]').exists()).toBe(false)

    // Expect 3 review items
    const items = wrapper.findAll('[data-test="review-item"]')
    expect(items.length).toBe(3)
  })

  it('filters reviews by role when selecting filter tabs', async () => {
    const wrapper = mount(ProfileReviews, {
      props: {
        reviews: mockReviews
      },
      global: {
        stubs: {
          UIcon: true
        }
      }
    })

    // Initially all 3 reviews are shown
    expect(wrapper.findAll('[data-test="review-item"]').length).toBe(3)

    // Filter by BUYER (should be 2: Alice and Dave)
    const buyerTab = wrapper.find('[data-test="filter-buyer"]')
    expect(buyerTab.exists()).toBe(true)
    await buyerTab.trigger('click')
    await flushPromises()

    const buyerItems = wrapper.findAll('[data-test="review-item"]')
    expect(buyerItems.length).toBe(2)
    expect(buyerItems[0]!.find('[data-test="reviewer-nickname"]').text()).toBe('Alice')
    expect(buyerItems[1]!.find('[data-test="reviewer-nickname"]').text()).toBe('Dave')

    // Filter by SELLER (should be 1: Charlie)
    const sellerTab = wrapper.find('[data-test="filter-seller"]')
    expect(sellerTab.exists()).toBe(true)
    await sellerTab.trigger('click')
    await flushPromises()

    const sellerItems = wrapper.findAll('[data-test="review-item"]')
    expect(sellerItems.length).toBe(1)
    expect(sellerItems[0]!.find('[data-test="reviewer-nickname"]').text()).toBe('Charlie')

    // Filter by ALL (should be 3)
    const allTab = wrapper.find('[data-test="filter-all"]')
    expect(allTab.exists()).toBe(true)
    await allTab.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('[data-test="review-item"]').length).toBe(3)
  })

  it('sorts reviews based on selected sort option', async () => {
    const wrapper = mount(ProfileReviews, {
      props: {
        reviews: mockReviews
      },
      global: {
        stubs: {
          UIcon: true
        }
      }
    })

    // Default sorting is date_desc (recent first)
    // 2026-06-03 (Alice), 2026-06-02 (Dave), 2026-06-01 (Charlie)
    let items = wrapper.findAll('[data-test="review-item"]')
    expect(items[0]!.find('[data-test="reviewer-nickname"]').text()).toBe('Alice')
    expect(items[1]!.find('[data-test="reviewer-nickname"]').text()).toBe('Dave')
    expect(items[2]!.find('[data-test="reviewer-nickname"]').text()).toBe('Charlie')

    // Change sorting to date_asc (oldest first)
    const sortSelect = wrapper.find('[data-test="review-sort"]')
    expect(sortSelect.exists()).toBe(true)
    await sortSelect.setValue('date_asc')
    await flushPromises()

    items = wrapper.findAll('[data-test="review-item"]')
    expect(items[0]!.find('[data-test="reviewer-nickname"]').text()).toBe('Charlie')
    expect(items[1]!.find('[data-test="reviewer-nickname"]').text()).toBe('Dave')
    expect(items[2]!.find('[data-test="reviewer-nickname"]').text()).toBe('Alice')

    // Change sorting to rating_desc (best rating first)
    await sortSelect.setValue('rating_desc')
    await flushPromises()

    items = wrapper.findAll('[data-test="review-item"]')
    expect(items[0]!.find('[data-test="reviewer-nickname"]').text()).toBe('Alice') // 5 stars
    expect(items[1]!.find('[data-test="reviewer-nickname"]').text()).toBe('Charlie') // 4 stars
    expect(items[2]!.find('[data-test="reviewer-nickname"]').text()).toBe('Dave') // 3 stars

    // Change sorting to rating_asc (worst rating first)
    await sortSelect.setValue('rating_asc')
    await flushPromises()

    items = wrapper.findAll('[data-test="review-item"]')
    expect(items[0]!.find('[data-test="reviewer-nickname"]').text()).toBe('Dave') // 3 stars
    expect(items[1]!.find('[data-test="reviewer-nickname"]').text()).toBe('Charlie') // 4 stars
    expect(items[2]!.find('[data-test="reviewer-nickname"]').text()).toBe('Alice') // 5 stars
  })
})
