import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { User } from '~/types/user'

import { getUserService } from '~/services/usersService'
import type ApiError from '~/types/apiError'

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
    errors.value = null

    try {
      // Call the getMyProfile method of the user service to fetch the user's profile from the API
      user.value = await service.getMyProfile()
      hasLoaded.value = true
    } catch (e) {
      // If an error occurs while fetching the user's profile, format the error messages and update the store's state accordingly
      errors.value = formatErrors(e as ApiError)
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
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      isLoading.value = false

      // Redirect to login page after successful registration
      if (!errors.value)
        await navigateTo('/login')
    }
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    errors.value = null

    try {
      await service.login(email, password)
      console.log('Login successful')
      // Fetch the user's profile after successful login to populate the user state
      user.value = await service.getMyProfile()
      hasLoaded.value = true

      // Redirect to home page after successful login
      await navigateTo('/')
    } catch (e) {
      errors.value = formatErrors(e as ApiError)
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    hasLoaded,
    errors,
    isAuthenticated,
    fetchProfile,
    register,
    login
    // logout,
    // updateProfile
  }
})
