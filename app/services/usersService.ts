import type { User, UpdateProfileInput, PublicUser, UserReview, ResetPasswordInput, StripeStatus, StripeOnboardingLink } from '~/types/user'
import { useApi } from '../composables/useApi'
import type { MyAdvert } from '~/types/advert'
import type { FlaggedUserAdminResponse } from '~/types/user-report'

type ApiClient = typeof useApi

const AUTH_PATH = '/auth'
const USER_PATH = '/users'
const ADMIN_PATH = '/admins'

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
  deleteAccount: () => Promise<undefined>
  forgotPassword: (email: string) => Promise<undefined>
  resetPassword: (input: ResetPasswordInput) => Promise<undefined>
  getPublicProfile: (id: string) => Promise<PublicUser>
  getReviews: (userId: string) => Promise<UserReview[]>
  getMeAdvert: () => Promise<MyAdvert[]>
  createStripeOnboardingLink: () => Promise<StripeOnboardingLink>
  getStripeStatus: () => Promise<StripeStatus>
  report: (userId: string, message: string) => Promise<undefined>
  getFlaggedUsers: () => Promise<FlaggedUserAdminResponse[]>
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
      body: { email, password },
      skipAuth: true
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
   * Delete the current user's account by making a request to the API's delete account endpoint. This will typically
   * involve removing the user's data from the server and invalidating their session or token.
   * @returns A promise that resolves when the account deletion is successful.
   * The API is expected to handle the account deletion logic, such as removing the user's
   * data and invalidating their session or token, and return an appropriate response.
   */
  const deleteAccount = async () =>
    apiClient<undefined>(`${USER_PATH}/me`,
      {
        method: 'DELETE'
      })

  /**
   * Initiate a password reset request for the user with the provided email by
   * calling the API's forgot password endpoint. This will typically trigger
   * the API to send a password reset email to the user with instructions on how to reset their password.
   * @param email The email address of the user who wants to reset their password.
   * @returns A promise that resolves when the password reset request is successfully initiated.
   * The API is expected to handle the logic for sending the password reset email and return an
   * appropriate response.
   */
  const forgotPassword = async (email: string) =>
    apiClient<undefined>(`${AUTH_PATH}/forgotPassword`,
      {
        method: 'POST',
        body: { email }
      })

  /**
   * Reset the password for the user with the provided email, new password, and reset code by
   * calling the API's reset password endpoint. This operation typically requires the user to
   * have received a password reset code via email, which is used to authorize the password reset request.
   * @param input An object containing the email, new password, and reset code for the password reset operation.
   * @returns A promise that resolves when the password reset operation is complete. If the operation is successful,
   * the user's password will be updated to the new password provided. If there is an error during the
   * operation, the promise will reject with an appropriate error message.
   */
  const resetPassword = async (input: ResetPasswordInput) =>
    apiClient<undefined>(`${AUTH_PATH}/resetPassword`,
      {
        method: 'POST',
        body: input
      })

  /**
   * Retrieve the public profile of a user by their ID.
   * @param id The unique identifier of the user whose public profile is being requested.
   * @returns A promise that resolves to a PublicUser object containing the public information of the user.
   */
  const getPublicProfile = async (id: string) => apiClient<PublicUser>(`${USER_PATH}/${id}`)

  /**
   * Retrieve all reviews received for a user by their ID.
   * @param userId The unique identifier of the user whose reviews are being requested.
   * @returns A promise that resolves to an array of UserReview objects.
   */
  const getReviews = async (userId: string) => apiClient<UserReview[]>(`${USER_PATH}/${userId}/reviews`)

  const getMeAdvert = async () => apiClient<MyAdvert[]>(`${USER_PATH}/me/adverts`)

  /**
   * Create (if needed) the Stripe Connect account of the current user and generate
   * a Stripe-hosted onboarding link. The caller is expected to redirect the user to the returned URL.
   * @returns A promise that resolves to an object containing the Stripe onboarding URL.
   */
  const createStripeOnboardingLink = async () =>
    apiClient<StripeOnboardingLink>(`${USER_PATH}/me/stripe/onboarding`, {
      method: 'POST'
    })

  /**
   * Retrieve the Stripe Connect status of the current user (account ID and whether
   * the onboarding is complete, i.e. the seller can receive payouts).
   * @returns A promise that resolves to the StripeStatus of the current user.
   */
  const getStripeStatus = async () =>
    apiClient<StripeStatus>(`${USER_PATH}/me/stripe/status`)

  const report = async (userId: string, message: string) =>
    apiClient<undefined>(`${USER_PATH}/${userId}/report`, {
      method: 'POST',
      body: { reason: message }
    })

  const getFlaggedUsers = async () =>
    apiClient<FlaggedUserAdminResponse[]>(`${ADMIN_PATH}/flagged-users`)

  return {
    register,
    login,
    logout,
    getMyProfile,
    updateProfile,
    forgotPassword,
    deleteAccount,
    resetPassword,
    getPublicProfile,
    getMeAdvert,
    getReviews,
    createStripeOnboardingLink,
    getStripeStatus,
    report,
    getFlaggedUsers
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
