import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import DisputeModal from '~/components/me/DisputeModal.vue'

mockNuxtImport('useI18n', () => () => ({
  t: (key: string, args?: Record<string, unknown>) => key + (args ? JSON.stringify(args) : '')
}))

const stubs = {
  UModal: {
    template: '<div><slot name="body" /><slot name="footer" /></div>',
    props: ['open', 'title']
  },
  UButton: {
    template: '<button><slot /></button>',
    props: ['disabled', 'loading']
  }
}

describe('DisputeModal', () => {
  it('does not submit dispute if reason is too short', async () => {
    const wrapper = mount(DisputeModal, {
      props: {
        open: true,
        transactionId: 'txn-123'
      },
      global: { stubs }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('short') // less than 10 characters

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('submits dispute and emits event if reason is valid', async () => {
    const wrapper = mount(DisputeModal, {
      props: {
        open: true,
        transactionId: 'txn-123'
      },
      global: { stubs }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('This is a valid dispute reason (long enough)')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.emitted('submit')?.[0]).toEqual(['This is a valid dispute reason (long enough)'])
  })

  it('closes modal and resets reason when cancel is clicked', async () => {
    const wrapper = mount(DisputeModal, {
      props: {
        open: true,
        transactionId: 'txn-123'
      },
      global: { stubs }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('Some reason text')

    const cancelBtn = wrapper.findAll('button').find(b => b.text().includes('me.purchases.cancel_dispute'))
    expect(cancelBtn).toBeDefined()
    await cancelBtn?.trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })
})
