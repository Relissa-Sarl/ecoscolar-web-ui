import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { UpdateProfileInput, User, ResetPasswordInput } from '~/types/user'

import { getUserService } from '~/services/usersService'
import type ApiError from '~/types/apiError'

/**
 * Pinia store for managing user authentication and profile state.
 * This store provides reactive state properties and actions for user registration, login, profile fetching, and error handling.
 */
export const useUsersStore = defineStore('users', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const errors = ref<string[] | null>(null)

  const service = getUserService()

  const isAuthenticated = computed(() => !!user.value)

  const isAdmin = computed(() => !!user.value?.roles.some(role => role === 'Admin'))

  const localePath = useLocalePath()

  /**
   * Fetch the profile of the currently authenticated user by calling the UserService's getMyProfile method.
   * @param force If true, forces a reload of the user's profile from the API even if it has already been loaded.
   * If false, returns the cached user profile if it has already been loaded.
   * @returns A promise that resolves to the User object representing the current user.
   */
  const fetchProfile = async (force = false) => {
    // If the user's profile has already been loaded just return the cached value
    if (hasLoaded.value && !force)
      return user.value

    isLoading.value = true

    try {
      // Call the getMyProfile method of the user service to fetch the user's profile from the API
      user.value = await service.getMyProfile()
      hasLoaded.value = true
    } catch {
      // ignore error details here; reset user state
      user.value = null
      hasLoaded.value = false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Register a new user with the provided email and password by calling the UserService's register method.
   * @param email The email address of the user to register.
   * @param password The password for the new user account.
   */
  const register = async (email: string, password: string) => {
    isLoading.value = true
    errors.value = null

    try {
      // Call the register method of the user service
      await service.register(email, password)
      await login(email, password)
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Log in a user with the provided email and password by calling the UserService's login method.
   * @param email The email address of the user to log in.
   * @param password The password for the user account.
   */
  const login = async (email: string, password: string) => {
    isLoading.value = true
    errors.value = null

    try {
      await service.login(email, password)
      // Fetch the user's profile after successful login to populate the user state
      user.value = await service.getMyProfile()
      hasLoaded.value = true

      // Redirect to profile page after successful login
      await navigateTo(localePath('/me/profile'))
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Log out the currently authenticated user by calling the UserService's logout method, and clear the user state upon successful logout.
   */
  const logout = async () => {
    isLoading.value = true
    errors.value = null

    try {
      await service.logout()
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      // Clear the user state and reset the store's state after logout
      user.value = null
      hasLoaded.value = false
      isLoading.value = false

      // Redirect to home page after logout
      await navigateTo(localePath('/login'))
    }
  }

  /**
   * Update the current user's profile with the provided input by calling the UserService's updateProfile method.
   * @param input An object containing the fields to update in the user's profile, such as nickname, firstName, lastName, postalCode, birthdayDate, and spokenLanguages.
   */
  const updateProfile = async (input: UpdateProfileInput) => {
    isLoading.value = true
    errors.value = null

    try {
      user.value = await service.updateProfile(input)
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      isLoading.value = false

      // Redirect to profile page after successful profile update
      await navigateTo(localePath('/me/profile'))
    }
  }

  /**
   * Delete the current user's account by calling the UserService's deleteAccount method, and log out the user upon successful account deletion.
   */
  const deleteAccount = async () => {
    isLoading.value = true
    errors.value = null

    try {
      await service.deleteAccount()
      await logout()
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Initiate a password reset request for the user with the provided email.
   * @param email The email address of the user who wants to reset their password.
   */
  const forgotPassword = async (email: string) => {
    isLoading.value = true
    errors.value = null

    try {
      await service.forgotPassword(email)
      hasLoaded.value = true
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
      hasLoaded.value = false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset the password for the user with the provided email, new password, and reset code by calling the UserService's resetPassword method.
   * @param email The email address of the user whose password is to be reset.
   * @param newPassword The new password to set for the user's account.
   * @param code The password reset code that was sent to the user's email address, which is required to authorize the password reset operation.
   * @returns A promise that resolves when the password reset operation is complete. If the operation is successful,
   * the user's password will be updated to the new password provided. If there is an error during the operation,
   * the promise will reject with an appropriate error message.
   */
  const resetPassword = async (input: ResetPasswordInput, confirmPassword: string) => {
    isLoading.value = true
    errors.value = null

    try {
      // Validate that the new password and confirm password fields match before attempting to reset the password
      if (input.newPassword !== confirmPassword)
        errors.value = ['passwords_do_not_match']
      else
        await service.resetPassword(input)
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      isLoading.value = false

      // Redirect to login page after successful password reset
      if (!errors.value)
        await navigateTo(localePath('/login'))
    }
  }

  /**
   * Format the errors returned from the API into a user-friendly array of error messages.
   */
  const clearErrors = () => {
    errors.value = null
  }

  return {
    user,
    isLoading,
    hasLoaded,
    errors,
    isAuthenticated,
    isAdmin,
    fetchProfile,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    forgotPassword,
    resetPassword,
    clearErrors
  }
})
