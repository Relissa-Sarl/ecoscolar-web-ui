import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import UserFlagsPage from '~/pages/me/admin/user-flags.vue'
import UserFlagsDetailModal from '~/components/admin/UserFlagsDetailModal.vue'
import PopUp from '~/components/admin/PopUp.vue'

const mockFetchProfile = vi.fn()
mockNuxtImport('useAdminsStore', () => () => ({
  user: { id: 1, name: 'Admin' },
  fetchProfile: mockFetchProfile
}))

const { mockGetFlaggedUsers } = vi.hoisted(() => ({
  mockGetFlaggedUsers: vi.fn()
}))

vi.mock('~/services/usersService', () => ({
  getUserService: () => ({
    getFlaggedUsers: mockGetFlaggedUsers
  })
}))

const stubs = {
  PopUp: true,
  Sidebar: true,
  UserFlagsDetailModal: true,
  Icon: true
}

const mockFlaggedUsers = [
  {
    userId: 'u1',
    nickname: 'BadUser',
    email: 'bad@test.com',
    firstName: 'Bad',
    lastName: 'User',
    flags: [{ flagId: 1, reason: 'SPAM', reporterNickname: 'GoodUser' }]
  },
  {
    userId: 'u2',
    nickname: 'Spammer',
    email: 'spam@test.com',
    firstName: 'Spam',
    lastName: 'Mer',
    flags: [{ flagId: 2, reason: 'INAPPROPRIATE', reporterNickname: 'GoodUser' }, { flagId: 3, reason: 'SCAM', reporterNickname: 'User2' }]
  }
]

describe('UserFlagsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly and fetches flagged users', async () => {
    mockGetFlaggedUsers.mockResolvedValueOnce(mockFlaggedUsers)

    const wrapper = mount(UserFlagsPage, {
      global: { stubs }
    })

    expect(wrapper.text()).toContain('Loading flagged users...')

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockFetchProfile).toHaveBeenCalled()
    expect(mockGetFlaggedUsers).toHaveBeenCalled()

    expect(wrapper.text()).toContain('BadUser')
    expect(wrapper.text()).toContain('Spammer')
    expect(wrapper.text()).toContain('bad@test.com')
  })

  it('filters users by search query', async () => {
    mockGetFlaggedUsers.mockResolvedValueOnce(mockFlaggedUsers)

    const wrapper = mount(UserFlagsPage, {
      global: { stubs }
    })

    await new Promise(resolve => setTimeout(resolve, 0))

    const input = wrapper.find('input')
    await input.setValue('bad')

    expect(wrapper.text()).toContain('BadUser')
    expect(wrapper.text()).not.toContain('Spammer')
  })

  it('opens details modal when clicking on action button', async () => {
    mockGetFlaggedUsers.mockResolvedValueOnce(mockFlaggedUsers)

    const wrapper = mount(UserFlagsPage, {
      global: { stubs }
    })

    await new Promise(resolve => setTimeout(resolve, 0))

    const buttons = wrapper.findAll('button[title="View flag details"]')
    expect(buttons.length).toBe(2)

    await buttons[0].trigger('click')

    const modal = wrapper.findComponent(UserFlagsDetailModal)
    expect(modal.exists()).toBe(true)
    expect(modal.props('isOpen')).toBe(true)
    expect(modal.props('userNickname')).toBe('BadUser')
    expect(modal.props('flags')).toEqual(mockFlaggedUsers[0].flags)
  })

  it('shows error popup if fetching fails', async () => {
    mockGetFlaggedUsers.mockRejectedValueOnce(new Error('API error'))

    const wrapper = mount(UserFlagsPage, {
      global: { stubs }
    })

    await new Promise(resolve => setTimeout(resolve, 0))

    const popup = wrapper.findComponent(PopUp)
    expect(popup.exists()).toBe(true)
    expect(popup.props('show')).toBe(true)
    expect(popup.props('popUpType')).toBe('error')
    expect(popup.props('title')).toBe('Error')
  })
})
