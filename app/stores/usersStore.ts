import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { UpdateProfileInput, User } from '~/types/user'

import { getUserService } from '~/services/usersService'
import type ApiError from '~/types/apiError'
import { lo } from '@nuxt/ui/runtime/locale/index.js'

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
      await navigateTo('/me/profile')
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
      await navigateTo('/login')
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
      await navigateTo('/me/profile')
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
    fetchProfile,
    register,
    login,
    logout,
    updateProfile,
    clearErrors
  }
})
