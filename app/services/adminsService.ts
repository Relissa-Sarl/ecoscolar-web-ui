import type { User } from '~/types/user'
import { useApi } from '../composables/useApi'
import type { SupportTicketAdminDetail, SupportTicketMessage } from '~/types/support'
import type { MySaleAdvert } from './historyService'

type ApiClient = typeof useApi

const ADMIN_PATH = '/admins'
const USER_PATH = '/users'
const ADVERT_PATH = '/adverts'

/**
* Interface defining the contract of the AdminService,
* which will be used by components to interact with admin-related API endpoints.
*/
export interface AdminService {
  getMyProfile: () => Promise<User>
  getAllUsers: () => Promise<User[]>
  banUserToggle: (id: string) => Promise<User>
  getAllSupportTickets: () => Promise<SupportTicketAdminDetail[]>
  sendTicketMessage: (id: number, body: string) => Promise<SupportTicketMessage>
  getAllAdverts: () => Promise<MySaleAdvert[]>
  blockAdvert: (id: number) => Promise<MySaleAdvert>
  deleteAdvert: (id: number) => Promise<MySaleAdvert[]>
}

/**
* Interface defining the dependencies required to create an instance of AdminService.
*/
export interface AdminServiceDependencies {
  apiClient: ApiClient
}

/**
* Factory function to create an instance of AdminService with the provided dependencies.
* @param param0 An object containing the dependencies required by AdminService.
* @returns An instance of AdminService with methods to interact with admin-related API endpoints.
*/
export function createadminService({ apiClient }: AdminServiceDependencies): AdminService {
  const getMyProfile = async () => apiClient<User>(`${USER_PATH}/me`)
  const getAllUsers = async () => apiClient<User[]>(`${ADMIN_PATH}/users`)

  const banUserToggle = async (id: string) => apiClient<User>(`${ADMIN_PATH}/${id}/ban`, {
    method: 'PATCH'
  })

  const getAllSupportTickets = async () => apiClient<SupportTicketAdminDetail[]>(`${ADMIN_PATH}/supports`)

  const sendTicketMessage = async (id: number, message: string) => apiClient<SupportTicketMessage>(`${ADMIN_PATH}/supports/${id}/message`, {
    method: 'POST',
    body: { message }
  })

  const getAllAdverts = async () => apiClient<MySaleAdvert[]>(`${ADVERT_PATH}`)

  const blockAdvert = async (id: number) => apiClient<MySaleAdvert>(`${ADMIN_PATH}/${id}/block`, {
    method: 'PATCH'
  })

  const deleteAdvert = async (id: number) => apiClient<MySaleAdvert[]>(`${ADVERT_PATH}/${id}`, {
    method: 'DELETE'
  })

  return {
    getMyProfile,
    getAllUsers,
    banUserToggle,
    getAllSupportTickets,
    sendTicketMessage,
    getAllAdverts,
    blockAdvert,
    deleteAdvert
  }
}

/**
* Factory function to create an instance of AdminService with the necessary dependencies.
* @returns An instance of AdminService ready to be used in components.
*/
export const getAdminService = () => {
  return createadminService({
    apiClient: useApi as ApiClient
  })
}
