import type { User, UpdateProfileInput, PublicUser } from '~/types/user'
import { useApi } from '../composables/useApi'
import type { MyAdvert } from '~/types/advert'

type ApiClient = typeof useApi

const AUTH_PATH = '/auth'
const USER_PATH = '/users'

/**
* Interface defining the contract of the UserService,
* which will be used by components to interact with user-related API endpoints.
*/
export interface UserService {
  register: (email: string, password: string) => Promise<undefined>
  login: (email: string, password: string) => Promise<undefined>
  logout: () => Promise<undefined>
  getMyProfile: () => Promise<User>
  updateProfile: (input: UpdateProfileInput) => Promise<User>
  getPublicProfile: (id: string) => Promise<PublicUser>
  getMeAdvert: () => Promise<MyAdvert[]>
}

/**
* Interface defining the dependencies required to create an instance of UserService.
*/
export interface UserServiceDependencies {
  apiClient: ApiClient
}

/**
* Factory function to create an instance of UserService with the provided dependencies.
* @param param0 An object containing the dependencies required by UserService.
* @returns An instance of UserService with methods to interact with user-related API endpoints.
*/
export function createUserService({ apiClient }: UserServiceDependencies): UserService {
  /**
   * Register a new user with the provided email and password.
   * @param email The email address of the user to register.
   * @param password The password for the new user account.
   * @returns A promise that resolves when the registration is successful. The API is expected to handle the actual registration logic and return an appropriate response.
   */
  const register = async (email: string, password: string) =>
    apiClient<undefined>(`${AUTH_PATH}/register`, {
      method: 'POST',
      body: { email, password }
    })

  /**
   * Log in a user with the provided email and password, and retrieve an authentication token upon successful login.
   * @param email The email address of the user attempting to log in.
   * @param password The password for the user account. This will be sent to the API for authentication.
   * @returns A promise that resolves to an undefined value if the login is successful. The API is expected to validate the credentials and return the appropriate response.
   */
  const login = async (email: string, password: string) =>
    apiClient<undefined>(`${AUTH_PATH}/login?useCookies=true`, {
      method: 'POST',
      body: { email, password }
    })

  /**
   * Log out the currently authenticated user by making a request to the API's logout endpoint. This will typically involve invalidating the user's session or token on the server side.
   * @returns A promise that resolves when the logout operation is successful. The API is expected to handle the logout logic, such as invalidating the user's session or token, and return an appropriate response.
   */
  const logout = async () =>
    apiClient<undefined>(`${AUTH_PATH}/logout`, {
      method: 'POST'
    })

  /**
  * Retrieve the current user's profile.
  * @returns A promise that resolves to the User object representing the current user.
  */
  const getMyProfile = async () => apiClient<User>(`${USER_PATH}/me`)

  /**
  * Update the user's profile with the provided input data.
  * @param input An object containing the fields to update in the user's profile, such as nickname, firstName, lastName, postalCode, birthdayDate, and spokenLanguages.
  * @returns A promise that resolves to the updated User object returned by the API after a successful update operation.
  */
  const updateProfile = async (input: UpdateProfileInput) =>
    apiClient<User>(`${USER_PATH}/me`,
      {
        method: 'PUT',
        body: input
      })

  /**
   * Retrieve the public profile of a user by their ID.
   * @param id The unique identifier of the user whose public profile is being requested.
   * @returns A promise that resolves to a PublicUser object containing the public information of the user.
   */
  const getPublicProfile = async (id: string) => apiClient<PublicUser>(`${USER_PATH}/${id}`)

  const getMeAdvert = async () => apiClient<MyAdvert[]>(`${USER_PATH}/me/adverts`)

  return {
    register,
    login,
    logout,
    getMyProfile,
    updateProfile,
    getPublicProfile,
    getMeAdvert
  }
}

/**
* Factory function to create an instance of UserService with the necessary dependencies.
* @returns An instance of UserService ready to be used in components.
*/
export const getUserService = () => {
  return createUserService({
    apiClient: useApi as ApiClient
  })
}
