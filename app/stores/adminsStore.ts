import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { User } from '~/types/user'

import { getAdminService } from '~/services/adminsService'
import type { SupportTicketAdminDetail } from '~/types/support'
import type { MySaleAdvert } from '~/composables/useHistory'

/**
 * Pinia store for managing user authentication and profile state.
 * This store provides reactive state properties and actions for user registration, login, profile fetching, and error handling.
 */
export const useAdminsStore = defineStore('admins', () => {
  const user = ref<User | null>(null)
  const users = ref<User[]>([])
  const supports = ref<SupportTicketAdminDetail[]>([])
  const adverts = ref<(MySaleAdvert)[]>([])
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const isSending = ref(false)
  const errors = ref<string[] | null>(null)

  const service = getAdminService()

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
      user.value = await service.getMyProfile()
    } catch {
      // ignore error details here; reset admin state
      user.value = null
    }
  }

  /**
   * Fetch all users by calling the AdminService's getAllUsers method.
   * @returns A promise that resolves to an array of User objects representing all users in the system. If the users have already been loaded, returns the cached array of users.
   */
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

  /**
   * Toggle the ban status of a user by calling the AdminService's banUserToggle method with the user's ID.
   * @param id The ID of the user whose ban status is to be toggled.
   * @returns A promise that resolves to the updated User object after the ban status has been toggled.
   */
  const banUserToggle = async (userToBan: User) => {
    const updatedUser = await service.banUserToggle(userToBan.id)
    return updatedUser
  }

  /**
   * Fetch all support tickets by calling the AdminService's getAllSupportTickets method.
   * @returns A promise that resolves to an array of SupportTicketSummary objects representing all support tickets in the system. If the support tickets have already been loaded, returns the cached array of support tickets.
   */
  const fetchAllSupportTickets = async () => {
    if (hasLoaded.value)
      return user.value

    isLoading.value = true

    try {
      // Call the getAllSupportTickets method of the admin service to fetch all support tickets from the API
      supports.value = await service.getAllSupportTickets()
    } catch {
      // ignore error details here; reset admin state
      supports.value = []
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (id: number, body: string) => {
    isSending.value = true
    try {
      const created = await service.sendTicketMessage(id, body)
      return created
    } catch {
      // ignore error details here; reset admin state
    } finally {
      isSending.value = false
    }
  }

  const fetchAllAdverts = async () => {
    if (hasLoaded.value)
      return user.value

    isLoading.value = true

    try {
      adverts.value = await service.getAllAdverts()
    } catch {
      // ignore error details here; reset admin state
    } finally {
      isLoading.value = false
    }
  }

  const blockAdvertToggle = async (advertToBlock: MySaleAdvert) => {
    const updatedAdvert = await service.blockAdvertToggle(advertToBlock.id)
    return updatedAdvert
  }

  return {
    user,
    users,
    adverts,
    supports,
    isLoading,
    hasLoaded,
    errors,
    isAuthenticated,
    isAdmin,
    fetchProfile,
    fetchAllUsers,
    banUserToggle,
    fetchAllSupportTickets,
    sendMessage,
    fetchAllAdverts,
    blockAdvertToggle
  }
})
