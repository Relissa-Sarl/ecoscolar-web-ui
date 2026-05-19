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

      // Fetch the user's profile after successful login to populate the user state
      // user.value = await service.getMyProfile()
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
    // fetchProfile,
    register,
    login
    // logout,
    // updateProfile
  }
})
