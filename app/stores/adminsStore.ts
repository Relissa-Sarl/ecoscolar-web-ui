import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { User } from '~/types/user'

import { getAdminService } from '~/services/adminsService'
import { getUserService } from '~/services/usersService'

/**
 * Pinia store for managing user authentication and profile state.
 * This store provides reactive state properties and actions for user registration, login, profile fetching, and error handling.
 */
export const useAdminsStore = defineStore('admins', () => {
  const user = ref<User | null>(null)
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const errors = ref<string[] | null>(null)

  const service = getAdminService()

  const userService = getUserService()

  const isAuthenticated = computed(() => !!user.value)

  const isAdmin = computed(() => !!user.value?.roles.some(role => role === 'Admin'))

  /**
   * Fetch the profile of the currently authenticated admin by calling the AdminService's getMyProfile method.
   * @param force If true, forces a reload of the admin's profile from the API even if it has already been loaded.
   * If false, returns the cached admin profile if it has already been loaded.
   * @returns A promise that resolves to the User object representing the current admin.
   */
  const fetchProfile = async (force = false) => {
    // If the admin's profile has already been loaded just return the cached value
    if (hasLoaded.value && !force)
      return user.value

    try {
      // Call the getMyProfile method of the admin service to fetch the admin's profile from the API
      user.value = await userService.getMyProfile()
    } catch {
      // ignore error details here; reset admin state
      user.value = null
    }
  }

  const fetchAllUsers = async () => {
    if (hasLoaded.value)
      return user.value

    isLoading.value = true

    try {
      // Call the getAllUsers method of the admin service to fetch all users from the API
      users.value = await service.getAllUsers()
    } catch {
      // ignore error details here; reset admin state
      users.value = []
    } finally {
      isLoading.value = false
    }
  }
  const banUserToggle = async (userToBan: User) => {
    const updatedUser = await service.banUserToggle(userToBan.id)
    return updatedUser
  }

  return {
    user,
    users,
    isLoading,
    hasLoaded,
    errors,
    isAuthenticated,
    isAdmin,
    fetchProfile,
    fetchAllUsers,
    banUserToggle
  }
})
