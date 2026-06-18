import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import FlagStatusModale from '~/components/admin/FlagStatusModale.vue'

const stubs = {
  Icon: { template: '<span class="icon-stub">icon</span>' }
}

const mockFlag = {
  id: 1,
  reporterId: 'u1',
  flaggedId: 'u2',
  status: 'PENDING',
  reason: 'SPAM',
  createdAt: '2024-01-01T00:00:00Z'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

describe('FlagStatusModale', () => {
  it('does not render when isOpen is false', () => {
    const wrapper = mount(FlagStatusModale, {
      props: { isOpen: false, flag: mockFlag },
      global: { stubs }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders correctly when isOpen is true', () => {
    const wrapper = mount(FlagStatusModale, {
      props: { isOpen: true, flag: mockFlag },
      global: { stubs }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Change Flag Status')

    // Select should have options
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    // Check current value
    expect((select.element as HTMLSelectElement).value).toBe('PENDING')
  })

  it('disables save button if status has not changed', () => {
    const wrapper = mount(FlagStatusModale, {
      props: { isOpen: true, flag: mockFlag },
      global: { stubs }
    })

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('Save Changes'))
    expect(saveBtn?.attributes('disabled')).toBeDefined()
  })

  it('enables save button and emits update when status changes', async () => {
    const wrapper = mount(FlagStatusModale, {
      props: { isOpen: true, flag: mockFlag },
      global: { stubs }
    })

    const select = wrapper.find('select')
    await select.setValue('RESOLVED')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('Save Changes'))
    expect(saveBtn?.attributes('disabled')).toBeUndefined()

    await saveBtn?.trigger('click')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')?.[0]).toEqual([{ id: 1, status: 'RESOLVED' }])
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when close buttons are clicked', async () => {
    const wrapper = mount(FlagStatusModale, {
      props: { isOpen: true, flag: mockFlag },
      global: { stubs }
    })

    const closeBtns = wrapper.findAll('button').filter(b => b.text().includes('Cancel') || b.attributes('aria-label') === 'Fermer')
    expect(closeBtns.length).toBeGreaterThan(0)

    await closeBtns[0]?.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
