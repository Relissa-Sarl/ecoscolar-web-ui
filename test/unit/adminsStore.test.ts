import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAdminsStore } from '../../app/stores/adminsStore'
import type { User } from '../../app/types/user'
import { SupportReason } from '../../app/utils/enum/supportReason'
import { AdvertStatus } from '../../app/utils/enum/advertStatus'

const mockGetMyProfile = vi.fn()
const mockGetAllUsers = vi.fn()
const mockBanUserToggle = vi.fn()
const mockGetAllSupportTickets = vi.fn()
const mockSendTicketMessage = vi.fn()
const mockGetAllAdverts = vi.fn()
const mockBlockAdvert = vi.fn()
const mockDeleteAdvert = vi.fn()
const mockGetAllAbuses = vi.fn()
const mockUpdateFlagStatus = vi.fn()
const mockDeleteFlag = vi.fn()

vi.mock('../../app/services/adminsService', () => ({
  getAdminService: () => ({
    getMyProfile: mockGetMyProfile,
    getAllUsers: mockGetAllUsers,
    banUserToggle: mockBanUserToggle,
    getAllSupportTickets: mockGetAllSupportTickets,
    sendTicketMessage: mockSendTicketMessage,
    getAllAdverts: mockGetAllAdverts,
    blockAdvert: mockBlockAdvert,
    deleteAdvert: mockDeleteAdvert,
    getAllAbuses: mockGetAllAbuses,
    updateFlagStatus: mockUpdateFlagStatus,
    deleteFlag: mockDeleteFlag
  })
}))

const mockAdminUser: User = {
  id: 'admin-1',
  firstName: 'Admin',
  lastName: 'User',
  nickname: 'admin',
  email: 'admin@test.com',
  roles: ['Admin'],
  isOnboarded: true,
  birthdayDate: '1990-01-01',
  postalCode: '1000',
  languages: [],
  location: { postalCode: '1000', city: 'Lausanne', region: 'Vaud' }
}

describe('admins store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches admin profile', async () => {
    mockGetMyProfile.mockResolvedValueOnce(mockAdminUser)
    const store = useAdminsStore()

    await store.fetchProfile()

    expect(store.user).toEqual(mockAdminUser)
    expect(store.isAuthenticated).toBe(true)
    expect(store.isAdmin).toBe(true)
    expect(store.hasLoaded).toBe(true)
  })

  it('fetches all users', async () => {
    const mockUsers = [mockAdminUser]
    mockGetAllUsers.mockResolvedValueOnce(mockUsers)
    const store = useAdminsStore()

    await store.fetchAllUsers()

    expect(store.users).toEqual(mockUsers)
    expect(store.isLoading).toBe(false)
  })

  it('toggles user ban status', async () => {
    const updatedUser = { ...mockAdminUser, isBanned: true }
    mockBanUserToggle.mockResolvedValueOnce(updatedUser)
    const store = useAdminsStore()

    const result = await store.banUserToggle(mockAdminUser)

    expect(mockBanUserToggle).toHaveBeenCalledWith(mockAdminUser.id)
    expect(result).toEqual(updatedUser)
  })

  it('fetches all support tickets', async () => {
    const mockTickets = [{ id: 1, subject: SupportReason.BUG, message: 'Help', user: mockAdminUser }]
    mockGetAllSupportTickets.mockResolvedValueOnce(mockTickets)
    const store = useAdminsStore()

    await store.fetchAllSupportTickets()

    expect(store.supports).toEqual(mockTickets)
    expect(store.isLoading).toBe(false)
  })

  it('sends a message', async () => {
    const mockMessage = { id: 10, message: 'Reply' }
    mockSendTicketMessage.mockResolvedValueOnce(mockMessage)
    const store = useAdminsStore()

    const result = await store.sendMessage(1, 'Hello')

    expect(mockSendTicketMessage).toHaveBeenCalledWith(1, 'Hello')
    expect(result).toEqual(mockMessage)
    expect(store.isSending).toBe(false)
  })

  it('fetches all adverts', async () => {
    const mockAdverts = [{ id: 1, title: 'Test', status: AdvertStatus.ACTIVE }]
    mockGetAllAdverts.mockResolvedValueOnce(mockAdverts)
    const store = useAdminsStore()

    await store.fetchAllAdverts()

    expect(store.adverts).toEqual(mockAdverts)
    expect(store.isLoading).toBe(false)
  })

  it('blocks an advert', async () => {
    const mockAdvert = { id: 1, title: 'Test', status: AdvertStatus.ACTIVE }
    const updatedAdvert = { ...mockAdvert, status: AdvertStatus.BLOCKED }
    mockBlockAdvert.mockResolvedValueOnce(updatedAdvert)
    const store = useAdminsStore()

    const result = await store.blockAdvert(mockAdvert)

    expect(mockBlockAdvert).toHaveBeenCalledWith(mockAdvert.id)
    expect(result).toEqual(updatedAdvert)
  })

  it('deletes an advert and re-fetches', async () => {
    const mockAdvert = { id: 1, title: 'Test', status: AdvertStatus.ACTIVE }
    mockDeleteAdvert.mockResolvedValueOnce([])
    mockGetAllAdverts.mockResolvedValueOnce([])
    const store = useAdminsStore()

    await store.deleteAdvert(mockAdvert)

    expect(mockDeleteAdvert).toHaveBeenCalledWith(mockAdvert.id)
    expect(mockGetAllAdverts).toHaveBeenCalled()
    expect(store.adverts).toEqual([])
  })

  it('fetches all abuses', async () => {
    const mockAbuses = [{ id: 1, reason: 'SPAM', message: 'test', status: 'PENDING', reporterUserId: 'u1', targetAdvertId: 1, reporterNickname: 'n1', reporterEmail: 'e1', advertTitle: 'a1' }]
    mockGetAllAbuses.mockResolvedValueOnce(mockAbuses)

    const store = useAdminsStore()

    await store.fetchAbuses()

    expect(store.flags).toEqual(mockAbuses)
    expect(store.isLoading).toBe(false)
  })

  it('updates flag status', async () => {
    const mockFlag = { id: 1, reason: 'SPAM', message: 'test', status: 'PENDING', reporterUserId: 'u1', targetAdvertId: 1, reporterNickname: 'n1', reporterEmail: 'e1', advertTitle: 'a1' }
    const updatedFlag = { ...mockFlag, status: 'REVIEWED' }
    mockUpdateFlagStatus.mockResolvedValueOnce(updatedFlag)

    const store = useAdminsStore()
    store.flags = [mockFlag]

    const result = await store.updateFlagStatus(1, 'REVIEWED' as TicketStatus)

    expect(mockUpdateFlagStatus).toHaveBeenCalledWith(1, 'REVIEWED')
    expect(result).toEqual(updatedFlag)
    expect(store.flags[0].status).toBe('REVIEWED')
  })

  it('deletes a flag and re-fetches', async () => {
    mockDeleteFlag.mockResolvedValueOnce(undefined)
    mockGetAllAbuses.mockResolvedValueOnce([])
    const store = useAdminsStore()

    await store.deleteFlag(1)

    expect(mockDeleteFlag).toHaveBeenCalledWith(1)
    expect(mockGetAllAbuses).toHaveBeenCalled()
    expect(store.flags).toEqual([])
  })
})
