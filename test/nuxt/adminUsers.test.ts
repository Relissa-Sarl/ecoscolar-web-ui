import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AdminUsers from '../../app/pages/me/admin/users.vue'

const storeMock = {
  user: { firstName: 'John' },
  users: [
    { id: '1', firstName: 'Alice', lastName: 'Doe', nickname: 'alice', email: 'alice@test.com', roles: ['User'], isBanned: false, isOnboarded: true, badReviewsCount: 0, alerteTooBadReviews: false },
    { id: '2', firstName: 'Bob', lastName: 'Smith', nickname: 'bob', email: 'bob@test.com', roles: ['User'], isBanned: true, isOnboarded: true, badReviewsCount: 6, alerteTooBadReviews: true }
  ],
  isLoading: false,
  fetchProfile: vi.fn(),
  fetchAllUsers: vi.fn(),
  banUserToggle: vi.fn()
}

vi.mock('~/stores/adminsStore', () => ({
  useAdminsStore: () => storeMock
}))

vi.mock('@/components/admin/Sidebar.vue', () => ({
  default: { template: '<div>Sidebar</div>' }
}))
vi.mock('@/components/admin/UserDetailModal.vue', () => ({
  default: { template: '<div>UserDetailModal</div>' }
}))
vi.mock('~/components/common/DeleteConfirmationPopup.vue', () => ({
  default: { template: '<div>DeleteConfirmationPopup</div>' }
}))
vi.mock('~/components/admin/PopUp.vue', () => ({
  default: { template: '<div>PopUp</div>' }
}))

describe('Admin Users Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    storeMock.isLoading = false
  })

  it('renders user list correctly', async () => {
    const wrapper = mount(AdminUsers, {
      global: {
        stubs: {
          Sidebar: true,
          UserDetailModal: true,
          DeleteConfirmationPopup: true,
          PopUp: true,
          Icon: true,
          ProfileBackLink: true
        }
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Alice Doe')
    expect(wrapper.text()).toContain('Bob Smith')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Banned')
  })

  it('highlights users with too many bad reviews', async () => {
    const wrapper = mount(AdminUsers, {
      global: {
        stubs: {
          Sidebar: true,
          UserDetailModal: true,
          DeleteConfirmationPopup: true,
          PopUp: true,
          Icon: true,
          ProfileBackLink: true
        }
      }
    })

    await flushPromises()

    // Flagged user (Bob, 6 bad reviews) shows the alert badge; Alice (0) does not
    expect(wrapper.text()).toContain('6 bad reviews')
    expect(wrapper.text()).not.toContain('0 bad reviews')
  })

  it('filters users by search query', async () => {
    const wrapper = mount(AdminUsers, {
      global: {
        stubs: {
          Sidebar: true,
          UserDetailModal: true,
          DeleteConfirmationPopup: true,
          PopUp: true,
          Icon: true,
          ProfileBackLink: true
        }
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Alice')
    await flushPromises()

    expect(wrapper.text()).toContain('Alice Doe')
    expect(wrapper.text()).not.toContain('Bob Smith')
  })

  it('toggles user status shows confirmation popup', async () => {
    const wrapper = mount(AdminUsers, {
      global: {
        stubs: {
          Sidebar: true,
          UserDetailModal: true,
          DeleteConfirmationPopup: {
            props: ['show', 'title', 'message'],
            template: '<div v-if="show" id="confirm-popup">{{title}}: {{message}}</div>'
          },
          PopUp: true,
          Icon: true,
          ProfileBackLink: true
        }
      }
    })

    await flushPromises()

    const banButtons = wrapper.findAll('button').filter(b => b.html().includes('block-outline'))
    await banButtons[0]?.trigger('click')

    expect(wrapper.find('#confirm-popup').exists()).toBe(true)
    expect(wrapper.find('#confirm-popup').text()).toContain('Ban User')
  })
})
