import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import UserFlagsDetailModal from '~/components/admin/UserFlagsDetailModal.vue'

const stubs = {
  Icon: { template: '<span class="icon-stub">icon</span>' }
}

const mockFlags = [
  { flagId: 101, reason: 'SPAM_CONTENT', reporterNickname: 'Reporter1', reporterEmail: 'r1@test.com' },
  { flagId: 102, reason: 'INAPPROPRIATE_BEHAVIOR', reporterNickname: 'Reporter2', reporterEmail: 'r2@test.com' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any

describe('UserFlagsDetailModal', () => {
  it('does not render when isOpen is false', () => {
    const wrapper = mount(UserFlagsDetailModal, {
      props: { isOpen: false, userNickname: 'BadGuy', flags: mockFlags },
      global: { stubs }
    })

    expect(wrapper.find('.fixed').exists()).toBe(false)
  })

  it('renders correctly when isOpen is true', () => {
    const wrapper = mount(UserFlagsDetailModal, {
      props: { isOpen: true, userNickname: 'BadGuy', flags: mockFlags },
      global: { stubs }
    })

    expect(wrapper.find('.fixed').exists()).toBe(true)
    expect(wrapper.text()).toContain('Reports for BadGuy')
    expect(wrapper.text()).toContain('#101')
    expect(wrapper.text()).toContain('SPAM CONTENT') // tests replace(/_/g, ' ')
    expect(wrapper.text()).toContain('Reporter1')
    expect(wrapper.text()).toContain('INAPPROPRIATE BEHAVIOR')
    expect(wrapper.text()).toContain('Reporter2')
  })

  it('shows no reports message if flags array is empty', () => {
    const wrapper = mount(UserFlagsDetailModal, {
      props: { isOpen: true, userNickname: 'GoodGuy', flags: [] },
      global: { stubs }
    })

    expect(wrapper.text()).toContain('No reports found.')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(UserFlagsDetailModal, {
      props: { isOpen: true, userNickname: 'BadGuy', flags: mockFlags },
      global: { stubs }
    })

    const closeBtn = wrapper.find('button')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when background is clicked', async () => {
    const wrapper = mount(UserFlagsDetailModal, {
      props: { isOpen: true, userNickname: 'BadGuy', flags: mockFlags },
      global: { stubs }
    })

    const bg = wrapper.find('.fixed')
    await bg.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
