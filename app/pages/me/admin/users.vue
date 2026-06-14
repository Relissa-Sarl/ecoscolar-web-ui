<script lang="ts" setup>
import Sidebar from '@/components/admin/Sidebar.vue'
// import StatCard from '@/components/admin/StatCard.vue'
import UserDetailModal from '@/components/admin/UserDetailModal.vue'
import DeleteConfirmationPopup from '~/components/common/DeleteConfirmationPopup.vue'
import PopUp from '~/components/admin/PopUp.vue'
import { useAdminsStore } from '~/stores/adminsStore'
import type { User } from '~/types/user'

const store = useAdminsStore()

definePageMeta({
  middleware: ['admin', 'auth']
})

// Pop-up
const showPopUp = ref(false)
const popUpData = ref({ type: 'info' as 'info' | 'success' | 'error', title: '', description: '' })

const closePopUp = () => {
  showPopUp.value = false
  popUpData.value = { type: 'info', title: '', description: '' }
}
const triggerPopUp = (type: typeof popUpData.value.type, title: string, desc: string) => {
  popUpData.value = { type, title, description: desc }
  showPopUp.value = true
}

// Filters
const searchQuery = ref('')
const statusFilter = ref<'All' | 'Active' | 'Pending' | 'Banned'>('All')

const filteredUsers = computed(() => {
  let result = store.users.filter(u => !u.email.includes('@deleted.ecoscolar.com'))

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerCase().includes(q)
      || u.lastName?.toLowerCase().includes(q)
      || u.email?.toLowerCase().includes(q)
      || u.nickname?.toLowerCase().includes(q)
    )
  }

  if (statusFilter.value !== 'All') {
    result = result.filter((u) => {
      if (statusFilter.value === 'Banned') return u.isBanned
      if (statusFilter.value === 'Active') return !u.isBanned && u.isOnboarded
      if (statusFilter.value === 'Pending') return !u.isBanned && !u.isOnboarded
    })
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

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// User Detail Modal
const isModalOpen = ref(false)
const selectedUser = ref<User | null>(null)

const openUserModal = (user: User) => {
  selectedUser.value = user
  isModalOpen.value = true
}

// ban/unban user
const showBanConfirm = ref<boolean>(false)
const userToBan = ref<User | null>(null)

const toggleUserStatus = (id: string) => {
  showBanConfirm.value = true
  userToBan.value = store.users?.find(user => user.id === id) || null
}
const confirmBan = async () => {
  if (userToBan.value) {
    try {
      const updatedUser = await store.banUserToggle(userToBan.value)

      const index = store.users?.findIndex(u => u.id === userToBan.value?.id)

      if (index !== -1) {
        store.users![index] = updatedUser
        triggerPopUp('success', updatedUser.isBanned ? 'User Banned' : 'User Unbanned', `The user has been ${updatedUser.isBanned ? 'banned' : 'unbanned'} successfully.`)
      }

      if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      showPopUp.value = true
      triggerPopUp('error', 'User Status Update Failed', `An error occurred while updating the user status or the user cannot be banned. Please try again later.`)
    } finally {
      showBanConfirm.value = false
      userToBan.value = null
    }
  }
}

const cancelBan = () => {
  showBanConfirm.value = false
  userToBan.value = null
}

onMounted(async () => {
  await store.fetchProfile()
  await store.fetchAllUsers()
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
      <ProfileBackLink />

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold">
            User Management
          </h1>
          <p class="text-gray-500">
            Manage and moderate EcoScolar's community.
          </p>
        </div>
        <!-- <div class="flex gap-3">
          <button class="ml-auto rounded-xl text-sm font-medium px-4 py-2 bg-emerald-800 text-white hover:bg-emerald-700 transition-colors">
            + Add New User
          </button>
        </div> -->
      </div>

      <!-- Stat Section
      <div class="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Active Users"
          value="12,482"
          icon="heroicons:user-group"
          trend="↑ 12% this month"
        />
        <StatCard
          title="Seller vs Buyer Ratio"
          value="1:4"
          icon="heroicons:chart-pie"
          trend="3k : 9k"
        />
        <StatCard
          title="Pending Reports"
          value="28"
          icon="heroicons:flag"
          trend="5 high priority"
        />
      </div> -->

      <UserDetailModal
        :user="selectedUser"
        :is-open="isModalOpen"
        @close="isModalOpen = false"
      />

      <DeleteConfirmationPopup
        :show="showBanConfirm"
        title="Ban User"
        :message="userToBan && userToBan.isBanned ? 'Are you sure you want to unban this user?' : 'Are you sure you want to ban this user?'"
        cancel-text="Cancel"
        confirm-text="Confirm"
        @confirm-delete="confirmBan"
        @cancel-delete="cancelBan"
      />

      <div class="flex gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, email, or nickname..."
          class="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none focus:border-emerald-700"
        >

        <select
          v-model="statusFilter"
          class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none"
        >
          <option value="All">
            All Status
          </option>
          <option value="Active">
            Active
          </option>
          <option value="Pending">
            Pending
          </option>
          <option value="Banned">
            Banned
          </option>
        </select>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
        <table class="w-full text-left border-collapse table-fixed">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase">
              <th class="p-4 font-medium w-1/4">
                User
              </th>
              <th class="p-4 font-medium w-1/4">
                Email
              </th>
              <th class="p-4 font-medium w-1/5">
                Role
              </th> <th class="p-4 font-medium w-1/6">
                Status
              </th>
              <th class="p-4 font-medium w-1/12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            v-if="!store.isLoading"
            class="divide-y dark:divide-gray-800"
          >
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="hover:bg-gray-50 border-gray-300 dark:border-gray-800 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="p-4 flex items-center gap-3 truncate">
                <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
                </div>
                <div class="truncate">
                  <div class="font-medium truncate">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="text-xs text-gray-500 truncate">
                    @{{ user.nickname }}
                  </div>
                </div>
              </td>

              <td class="p-4 text-sm text-gray-600 dark:text-gray-400 truncate">
                {{ user.email }}
              </td>

              <td class="p-4 text-sm">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles"
                    :key="role"
                    class="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded text-xs font-medium"
                  >
                    {{ role }}
                  </span>
                </div>
              </td>

              <td class="p-4">
                <span
                  class="inline-flex items-center gap-1.5 text-xs font-medium"
                  :class="user.isBanned ? 'text-red-600' : 'text-emerald-600'"
                >
                  <span :class="['w-2 h-2 rounded-full', user.isBanned ? 'bg-red-500 text-red-600' : 'bg-emerald-500 text-emerald-600']" />
                  {{ user.isBanned ? 'Banned' : (user.isOnboarded ? 'Active' : 'Pending') }}
                </span>
              </td>

              <td class="p-4 text-right flex">
                <button
                  class="text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer"
                  @click="openUserModal(user)"
                >
                  <Icon
                    name="material-symbols:visibility-rounded"
                    class="size-6"
                  />
                </button>
                <!-- <button class="ml-2 text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer">
                  <Icon
                    name="material-symbols:flag-rounded"
                    class="size-6"
                  />
                </button> -->
                <button
                  class="ml-2 text-gray-400 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer"
                  @click="toggleUserStatus(user.id)"
                >
                  <Icon
                    name="material-symbols:block-outline"
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
                Loading users...
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
            class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50  cursor-pointer"
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
          v-if="(store.users.length === 0 && !store.isLoading) || paginatedUsers.length === 0"
          class="p-8 text-center text-gray-500"
        >
          No users found.
        </div>
      </div>
    </div>
  </section>
</template>
