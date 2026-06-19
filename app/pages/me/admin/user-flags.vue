<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import PopUp from '~/components/admin/PopUp.vue'
import Sidebar from '~/components/admin/Sidebar.vue'
import UserFlagsDetailModal from '~/components/admin/UserFlagsDetailModal.vue'
import { getUserService } from '~/services/usersService'
import type { FlagAdminDto, FlaggedUserAdminResponse } from '~/types/user-report'

const store = useAdminsStore() // Used to retrieve the logged-in user for the Sidebar
const userService = getUserService()

definePageMeta({
  middleware: ['admin', 'auth']
})

// Data states
const flaggedUsers = ref<FlaggedUserAdminResponse[]>()
const isLoading = ref(true)

// Notification pop-up
const showPopUp = ref(false)
const popUpData = ref({ type: 'info' as 'info' | 'success' | 'error', title: '', description: '' })

const closePopUp = () => {
  showPopUp.value = false
  popUpData.value = { type: 'info', title: '', description: '' }
}
const triggerPopUp = (type: typeof popUpData.value.type, title: string, description: string) => {
  popUpData.value = { type, title, description }
  showPopUp.value = true
}

// Search & Filters
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!flaggedUsers.value) return []
  let result = flaggedUsers.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      user.nickname.toLowerCase().includes(q)
      || user.email.toLowerCase().includes(q)
      || user.firstName.toLowerCase().includes(q)
      || user.lastName.toLowerCase().includes(q)
    )
  }
  return result
})

// Pagination
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const changePage = (page: number) => {
  currentPage.value = page
}

watch(searchQuery, () => {
  currentPage.value = 1
})

// Details modal management (Optional, to list all flags for a specific user)
const isModalOpen = ref(false)
const selectedUserFlags = ref<FlagAdminDto[]>([])
const selectedUserNickname = ref('')

const openFlagsModal = (user: FlaggedUserAdminResponse) => {
  selectedUserFlags.value = user.flags
  selectedUserNickname.value = user.nickname
  isModalOpen.value = true
}

// Fetch data from Backend
const fetchFlaggedUsers = async () => {
  isLoading.value = true
  try {
    flaggedUsers.value = await userService.getFlaggedUsers()
  } catch {
    triggerPopUp('error', 'Error', 'Failed to load flagged users.')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await store.fetchProfile()
  await fetchFlaggedUsers()
})
</script>

<template>
  <section class="min-h-screen px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex">
    <PopUp
      :show="showPopUp"
      :pop-up-type="popUpData.type"
      :title="popUpData.title"
      :description="popUpData.description"
      :duration="3000"
      @close="closePopUp"
    />

    <Sidebar :user="store.user" />

    <div class="flex-1 p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold">
            Flagged Users
          </h1>
          <p class="text-gray-500">
            Here is the list of users who have received one or more flags.
          </p>
        </div>
      </div>

      <div class="flex gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by nickname, name, first name or email..."
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        >
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase">
            <tr>
              <th class="p-4 font-medium w-1/4">
                User
              </th>
              <th class="p-4 font-medium w-1/4">
                Email
              </th>
              <th class="p-4 font-medium w-1/4">
                Full Name
              </th>
              <th class="p-4 font-medium w-1/12 text-center">
                Flags
              </th>
              <th class="p-4 font-medium w-1/12 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            v-if="!isLoading"
            class="divide-y"
          >
            <tr
              v-for="user in paginatedUsers"
              :key="user.userId"
              class="hover:bg-gray-50 border-gray-300 dark:border-gray-800 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="p-4">
                <p class="font-bold text-emerald-600 dark:text-emerald-400">
                  {{ user.nickname }}
                </p>
                <span class="text-xs text-gray-400">ID: {{ user.userId }}</span>
              </td>
              <td class="p-4 text-sm">
                {{ user.email }}
              </td>
              <td class="p-4 text-sm">
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  {{ user.flags.length }}
                </span>
              </td>
              <td class="p-4 text-right flex justify-end">
                <button
                  class="text-gray-400 hover:text-emerald-500 transition-colors cursor-pointer"
                  title="View flag details"
                  @click="openFlagsModal(user)"
                >
                  <Icon
                    name="material-symbols:visibility-rounded"
                    class="size-6"
                  />
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td
                colspan="5"
                class="p-8 text-center text-gray-500"
              >
                Loading flagged users...
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="totalPages > 1"
          class="flex justify-between items-center p-4 border-t border-gray-300 dark:border-gray-800"
        >
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 cursor-pointer"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              :class="['px-3 py-1 text-sm rounded-lg', currentPage === page ? 'bg-emerald-800 text-white' : 'hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800']"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 cursor-pointer"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>

        <div
          v-if="!isLoading && (flaggedUsers?.length === 0 || filteredUsers.length === 0)"
          class="p-8 text-center text-gray-500"
        >
          No flagged users found.
        </div>
      </div>
    </div>
    <UserFlagsDetailModal
      :is-open="isModalOpen"
      :user-nickname="selectedUserNickname"
      :flags="selectedUserFlags"
      @close="isModalOpen = false"
    />
  </section>
</template>
