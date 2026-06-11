import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AdminSupports from '../../app/pages/me/admin/supports.vue'
import { SupportReason } from '../../app/utils/enum/supportReason'

const storeMock = {
  user: { firstName: 'John' },
  supports: [
    { id: 1, email: 'user1@test.com', subject: SupportReason.BUG, message: 'I found a bug', user: { firstName: 'Alice', lastName: 'Doe', nickname: 'alice' }, messages: [] },
    { id: 2, email: 'user2@test.com', subject: SupportReason.ACCOUNT, message: 'Account issue', user: null, messages: [] }
  ],
  isLoading: false,
  fetchProfile: vi.fn(),
  fetchAllSupportTickets: vi.fn(),
  sendMessage: vi.fn()
}

vi.mock('~/stores/adminsStore', () => ({
  useAdminsStore: () => storeMock
}))

vi.mock('@/components/admin/Sidebar.vue', () => ({
  default: { template: '<div>Sidebar</div>' }
}))
vi.mock('~/components/admin/TicketDetailModal.vue', () => ({
  default: { props: ['isOpen'], template: '<div v-if="isOpen">TicketDetailModal</div>' }
}))
vi.mock('~/components/admin/PopUp.vue', () => ({
  default: { template: '<div>PopUp</div>' }
}))

describe('Admin Supports Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    storeMock.isLoading = false
  })

  it('renders support tickets list correctly', async () => {
    const wrapper = mount(AdminSupports, {
      global: {
        stubs: {
          Sidebar: true,
          TicketDetailModal: true,
          PopUp: true,
          Icon: true
        }
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Ticket #1')
    expect(wrapper.text()).toContain('Alice Doe')
    expect(wrapper.text()).toContain('Ticket #2')
    expect(wrapper.text()).toContain('user2@test.com')
  })

  it('filters tickets by search query', async () => {
    const wrapper = mount(AdminSupports, {
      global: {
        stubs: {
          Sidebar: true,
          TicketDetailModal: true,
          PopUp: true,
          Icon: true
        }
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Alice')
    await flushPromises()

    expect(wrapper.text()).toContain('Ticket #1')
    expect(wrapper.text()).not.toContain('Ticket #2')
  })

  it('filters tickets by search query on email even if user is null', async () => {
    const wrapper = mount(AdminSupports, {
      global: {
        stubs: {
          Sidebar: true,
          TicketDetailModal: true,
          PopUp: true,
          Icon: true
        }
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('user2')
    await flushPromises()

    expect(wrapper.text()).toContain('Ticket #2')
    expect(wrapper.text()).not.toContain('Ticket #1')
  })
})
