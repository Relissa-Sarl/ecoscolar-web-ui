import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AdminDashboard from '../../app/pages/me/admin/index.vue'

const storeMock = {
  user: { firstName: 'John' },
  supports: [1, 2],
  adverts: [{ status: 'ACTIVE' }, { status: 'SOLD' }],
  users: [1, 2, 3],
  isLoading: false,
  fetchProfile: vi.fn(),
  fetchAllSupportTickets: vi.fn(),
  fetchAllUsers: vi.fn(),
  fetchAllAdverts: vi.fn()
}

vi.mock('~/stores/adminsStore', () => ({
  useAdminsStore: () => storeMock
}))

// Mock components used in the page
vi.mock('@/components/admin/Sidebar.vue', () => ({
  default: { template: '<div id="sidebar"></div>' }
}))
vi.mock('~/components/admin/StatCard.vue', () => ({
  default: { props: ['title', 'value'], template: '<div class="stat-card">{{title}}: {{value}}</div>' }
}))

describe('Admin Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly and fetches data on mount', async () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        stubs: {
          Icon: true
        }
      }
    })

    await flushPromises()

    expect(storeMock.fetchProfile).toHaveBeenCalled()
    expect(storeMock.fetchAllSupportTickets).toHaveBeenCalled()
    expect(storeMock.fetchAllUsers).toHaveBeenCalled()
    expect(storeMock.fetchAllAdverts).toHaveBeenCalled()

    expect(wrapper.text()).toContain('Welcome back, John!')
    expect(wrapper.text()).toContain('Total tickets opened: 2')
    expect(wrapper.text()).toContain('Total adverts opened: 1')
    expect(wrapper.text()).toContain('Total users: 3')
  })

  it('shows loading message when isLoading is true', async () => {
    storeMock.isLoading = true
    const wrapper = mount(AdminDashboard)

    expect(wrapper.text()).toContain('Aucune donnée à afficher pour le moment.')
  })
})
