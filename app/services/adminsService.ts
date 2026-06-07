import type { User } from '~/types/user'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

const ADMIN_PATH = '/admins'

/**
* Interface defining the contract of the AdminService,
* which will be used by components to interact with admin-related API endpoints.
*/
export interface AdminService {
  getAllUsers: () => Promise<User[]>
  banUserToggle: (id: string) => Promise<User>
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
  const getAllUsers = async () => apiClient<User[]>(`${ADMIN_PATH}`)

  const banUserToggle = async (id: string) => apiClient<User>(`${ADMIN_PATH}/${id}/ban`, {
    method: 'PATCH'
  })

  return {
    getAllUsers,
    banUserToggle
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
