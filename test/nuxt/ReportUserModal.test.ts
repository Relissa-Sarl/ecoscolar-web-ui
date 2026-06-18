import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ReportUserModal from '~/components/common/ReportUserModal.vue'

describe('ReportUserModal', () => {
  const global = {
    mocks: {
      $t: (key: string) => key
    }
  }

  it('is hidden when show is false', () => {
    const wrapper = mount(ReportUserModal, {
      props: { show: false },
      global
    })

    const modal = wrapper.find('.fixed')
    expect(modal.element.style.display).toBe('none')
  })

  it('renders correctly when show is true', () => {
    const wrapper = mount(ReportUserModal, {
      props: { show: true },
      global
    })

    const modal = wrapper.find('.fixed')
    expect(modal.element.style.display).not.toBe('none')
    // Because `$t('report.title_comment')` returns a truthy string, the ternary resolves to `$t('report.message_label')`
    expect(wrapper.text()).toContain('report.message_label')
    expect(wrapper.text()).toContain('profile.public.report.description')
  })

  it('emits close event when cancel is clicked', async () => {
    const wrapper = mount(ReportUserModal, {
      props: { show: true },
      global
    })

    const cancelBtn = wrapper.findAll('button').find(b => b.text().includes('report.cancel'))
    await cancelBtn?.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('disables submit button if message length < 5', async () => {
    const wrapper = mount(ReportUserModal, {
      props: { show: true },
      global
    })

    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('report.submit'))
    expect(submitBtn?.attributes('disabled')).toBeDefined()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('1234') // length 4

    expect(submitBtn?.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('report.error_min_length')
  })

  it('enables submit button and emits submit event if message length >= 5', async () => {
    const wrapper = mount(ReportUserModal, {
      props: { show: true },
      global
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('Valid report message')

    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('report.submit'))
    expect(submitBtn?.attributes('disabled')).toBeUndefined()

    await submitBtn?.trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0]).toEqual(['Valid report message'])
  })

  it('shows error prop if provided', () => {
    const wrapper = mount(ReportUserModal, {
      props: { show: true, error: 'Custom API error' },
      global
    })

    expect(wrapper.text()).toContain('Custom API error')
  })

  it('disables buttons when isSubmitting is true', () => {
    const wrapper = mount(ReportUserModal, {
      props: { show: true, isSubmitting: true },
      global
    })

    const buttons = wrapper.findAll('button')
    buttons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined()
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('disabled')).toBeDefined()
  })
})
