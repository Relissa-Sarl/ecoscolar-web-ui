import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { User, UpdateProfileInput, UserToken } from '~/types/user'

import { getUserService } from '~/services/usersService'

export const useUsersStore = defineStore('users', () => {
  const user = ref<User | null>(null)
})
