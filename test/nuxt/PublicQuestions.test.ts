import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PublicQuestions from '~/components/advert/PublicQuestions.vue'

const globalOptions = {
  mocks: {
    $t: (key: string, params?: Record<string, unknown>) => {
      if (key === 'advert.detail.questions_count')
        return `${params?.count as number} questions`
      return key
    }
  },
  stubs: {
    UButton: {
      template: '<button><slot /></button>'
    }
  }
}

describe('PublicQuestions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the empty state and ask input when asking is allowed', () => {
    const wrapper = mount(PublicQuestions, {
      props: {
        seller: {
          avatar: '',
          username: 'SellerName',
          zip: '75000',
          rating: 5,
          reviews: 10
        },
        questions: [],
        canAsk: true
      },
      global: globalOptions
    })

    expect(wrapper.text()).toContain('advert.detail.no_public_questions')
    expect(wrapper.find('input[placeholder="advert.detail.ask_placeholder"]').exists()).toBe(true)
  })

  it('emits a question when the ask button is clicked', async () => {
    const wrapper = mount(PublicQuestions, {
      props: {
        seller: {
          avatar: '',
          username: 'SellerName',
          zip: '75000',
          rating: 5,
          reviews: 10
        },
        canAsk: true
      },
      global: globalOptions
    })

    const input = wrapper.get('input[placeholder="advert.detail.ask_placeholder"]')
    await input.setValue('Is this still available?')
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('ask-question')?.[0]).toEqual(['Is this still available?'])
    expect((wrapper.get('input[placeholder="advert.detail.ask_placeholder"]').element as HTMLInputElement).value).toBe('')
  })

  it('renders seller answer input for unanswered questions when answer mode is enabled', () => {
    const wrapper = mount(PublicQuestions, {
      props: {
        seller: {
          avatar: '',
          username: 'SellerName',
          zip: '75000',
          rating: 5,
          reviews: 10
        },
        questions: [
          {
            commentId: 12,
            authorId: 'user-1',
            author: 'Student',
            content: 'Is this still available?',
            createdAt: '2026-05-31T10:48:38.392Z',
            answer: '',
            answeredAt: null
          }
        ],
        canAsk: false,
        canAnswer: true
      },
      global: globalOptions
    })

    expect(wrapper.find('input[placeholder="advert.detail.answer_placeholder"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('advert.detail.answer_submit')
  })

  it('emits an answer for unanswered questions when seller answers', async () => {
    const wrapper = mount(PublicQuestions, {
      props: {
        seller: {
          avatar: '',
          username: 'SellerName',
          zip: '75000',
          rating: 5,
          reviews: 10
        },
        questions: [
          {
            commentId: 12,
            authorId: 'user-1',
            author: 'Student',
            content: 'Is this still available?',
            createdAt: '2026-05-31T10:48:38.392Z',
            answer: '',
            answeredAt: null
          }
        ],
        canAsk: false,
        canAnswer: true
      },
      global: globalOptions
    })

    const input = wrapper.get('input[placeholder="advert.detail.answer_placeholder"]')
    await input.setValue('Yes, it is available.')
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('answer-question')?.[0]).toEqual([
      {
        questionId: 12,
        text: 'Yes, it is available.'
      }
    ])
  })
})
