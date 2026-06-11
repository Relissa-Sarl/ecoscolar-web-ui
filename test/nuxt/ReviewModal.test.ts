import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import ReviewModal from '~/components/me/ReviewModal.vue'

const mockT = vi.fn((key: string, args?: Record<string, unknown>) => key + (args ? JSON.stringify(args) : ''))
mockNuxtImport('useI18n', () => () => ({
  t: mockT
}))

const mockCreateReview = vi.fn()
mockNuxtImport('useHistory', () => () => ({
  createReview: mockCreateReview
}))

const mockToastAdd = vi.fn()
mockNuxtImport('useToast', () => () => ({
  add: mockToastAdd
}))

const stubs = {
  UModal: {
    template: '<div><slot name="body" /><slot name="footer" /></div>',
    props: ['open', 'title']
  },
  UButton: {
    template: '<button><slot /></button>',
    props: ['disabled', 'loading']
  },
  UIcon: {
    template: '<span class="icon-mock">icon</span>',
    props: ['name']
  }
}

describe('ReviewModal', () => {
  it('does not submit review if rating is 0', async () => {
    const wrapper = mount(ReviewModal, {
      props: {
        open: true,
        transactionId: 'txn-123',
        name: 'Jane'
      },
      global: { stubs }
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(mockCreateReview).not.toHaveBeenCalled()
  })

  it('handles rating click and hover states', async () => {
    const wrapper = mount(ReviewModal, {
      props: {
        open: true,
        transactionId: 'txn-123',
        name: 'Jane'
      },
      global: { stubs }
    })

    const buttons = wrapper.findAll('button[type="button"]')
    expect(buttons.length).toBe(5)

    // Hover mouseenter
    await buttons[2].trigger('mouseenter')
    // Hover mouseleave
    await buttons[2].trigger('mouseleave')

    // Click rating 4 (index 3)
    await buttons[3].trigger('click')

    mockCreateReview.mockResolvedValueOnce(undefined)
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(mockCreateReview).toHaveBeenCalledWith('txn-123', 4, undefined)
  })

  it('submits review with comment and triggers toast/emits success', async () => {
    const wrapper = mount(ReviewModal, {
      props: {
        open: true,
        transactionId: 'txn-123',
        name: 'Jane'
      },
      global: { stubs }
    })

    // Click star 5
    const buttons = wrapper.findAll('button[type="button"]')
    await buttons[4].trigger('click')

    // Set comment text
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Excellent product!')

    mockCreateReview.mockResolvedValueOnce(undefined)
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(mockCreateReview).toHaveBeenCalledWith('txn-123', 5, 'Excellent product!')
    expect(mockToastAdd).toHaveBeenCalledWith({
      title: 'me.purchases.review_success',
      color: 'success'
    })
    expect(wrapper.emitted('success')).toBeDefined()
    expect(wrapper.emitted('success')?.[0]).toEqual([{ rating: 5, comment: 'Excellent product!' }])
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('handles submission error gracefully', async () => {
    const wrapper = mount(ReviewModal, {
      props: {
        open: true,
        transactionId: 'txn-123',
        name: 'Jane'
      },
      global: { stubs }
    })

    const buttons = wrapper.findAll('button[type="button"]')
    await buttons[2].trigger('click')

    mockCreateReview.mockRejectedValueOnce(new Error('API failure'))
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(mockCreateReview).toHaveBeenCalledWith('txn-123', 3, undefined)
    expect(mockToastAdd).toHaveBeenCalledWith({
      title: 'me.purchases.review_error',
      color: 'error'
    })
    expect(wrapper.text()).toContain('me.purchases.review_error')
  })

  it('resets form when cancel button is clicked', async () => {
    const wrapper = mount(ReviewModal, {
      props: {
        open: true,
        transactionId: 'txn-123',
        name: 'Jane'
      },
      global: { stubs }
    })

    // Click rating and enter text
    const buttons = wrapper.findAll('button[type="button"]')
    await buttons[2].trigger('click')
    await wrapper.find('textarea').setValue('Wait...')

    // Click cancel button
    const cancelBtn = wrapper.findAll('button').find(b => b.text().includes('me.purchases.cancel_review'))
    expect(cancelBtn).toBeDefined()
    await cancelBtn?.trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })
})
