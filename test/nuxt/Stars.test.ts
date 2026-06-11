import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Stars from '~/components/profile/Stars.vue'

describe('Stars component', () => {
  it('renders correctly with default rating and showText', () => {
    const wrapper = mount(Stars, {
      props: {
        rating: 4.2
      },
      global: {
        stubs: {
          UIcon: { template: '<span class="icon-mock">icon</span>' }
        }
      }
    })

    expect(wrapper.text()).toContain('4.2')
    expect(wrapper.text()).not.toContain('(')
  })

  it('renders rating count when count is specified', () => {
    const wrapper = mount(Stars, {
      props: {
        rating: 3.5,
        count: 12
      },
      global: {
        stubs: {
          UIcon: { template: '<span class="icon-mock">icon</span>' }
        }
      }
    })

    expect(wrapper.text()).toContain('3.5')
    expect(wrapper.text()).toContain('(12)')
  })

  it('does not render text when showText is false', () => {
    const wrapper = mount(Stars, {
      props: {
        rating: 4.8,
        showText: false
      },
      global: {
        stubs: {
          UIcon: { template: '<span class="icon-mock">icon</span>' }
        }
      }
    })

    expect(wrapper.text()).not.toContain('4.8')
  })

  it('renders correct number of stars based on maxRating', () => {
    const wrapper = mount(Stars, {
      props: {
        rating: 4,
        maxRating: 7
      },
      global: {
        stubs: {
          UIcon: {
            template: '<span class="icon-mock" :data-name="name">icon</span>',
            props: ['name']
          }
        }
      }
    })

    const stars = wrapper.findAll('.icon-mock')
    expect(stars.length).toBe(7)
    const activeStars = stars.filter(s => s.attributes('data-name') === 'i-material-symbols-star')
    const outlineStars = stars.filter(s => s.attributes('data-name') === 'i-material-symbols-star-outline')
    expect(activeStars.length).toBe(4)
    expect(outlineStars.length).toBe(3)
  })
})
