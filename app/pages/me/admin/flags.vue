<script lang="ts" setup>
import FlagDetailModal from '~/components/admin/FlagDetailModal.vue'
import FlagStatusModale from '~/components/admin/FlagStatusModale.vue'
import PopUp from '~/components/admin/PopUp.vue'
import Sidebar from '~/components/admin/Sidebar.vue'
import DeleteConfirmationPopup from '~/components/common/DeleteConfirmationPopup.vue'
import { ReportReason, type AbuseReportAdminResponse } from '~/types/report'
import { TicketStatus } from '~/utils/enum/TicketStatus'

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
const triggerPopUp = (type: typeof popUpData.value.type, title: string, description: string) => {
  popUpData.value = { type, title, description }
  showPopUp.value = true
}

// Filters
const searchQuery = ref('')
const reasonOptions = Object.entries(ReportReason).map(([key, value]) => ({
  key,
  value
}))
const statusOptions = Object.entries(TicketStatus).map(([key, value]) => ({
  key,
  value
}))
const statusFilter = ref('All')
const reasonFilter = ref('All')

const filteredFlags = computed(() => {
  // let result = store.flags
  let result = store.flags

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(f =>
      f.message.toLowerCase().includes(q)
    )
  }

  if (statusFilter.value !== 'All') {
    result = result.filter((f) => {
      for (const option of statusOptions) {
        if (statusFilter.value === option.value) {
          return f.status === option.key
        }
      }
    })
  }

  if (reasonFilter.value !== 'All') {
    result = result.filter((f) => {
      for (const option of reasonOptions) {
        if (reasonFilter.value === option.value) {
          return f.reason === option.key
        }
      }
    })
  }

  return result
})

// Pagination
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.ceil(filteredFlags.value.length / pageSize))

const paginatedFlags = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredFlags.value.slice(start, start + pageSize)
})

const changePage = (page: number) => {
  currentPage.value = page
}

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// Flag details modal
const isModalOpen = ref(false)
const selectedFlag = ref<AbuseReportAdminResponse | null>(null)

const openFlag = (flag: AbuseReportAdminResponse) => {
  selectedFlag.value = flag
  isModalOpen.value = true
}

const closeFlag = () => {
  selectedFlag.value = null
  isModalOpen.value = false
}

// status modal
const isStatusModalOpen = ref(false)
const selectedStatusFlag = ref<AbuseReportAdminResponse | null>(null)

const openStatus = (flag: AbuseReportAdminResponse) => {
  selectedStatusFlag.value = flag
  isStatusModalOpen.value = true
}

const closeStatus = () => {
  selectedStatusFlag.value = null
  isStatusModalOpen.value = false
}

const updateStatus = ({ id, status }: { id: number, status: TicketStatus }) => {
  if (selectedStatusFlag.value) {
    try {
      // await store.updateFlagStatus(id, status)
      console.log('Updated status:', id, status)
      const StatusChange = selectedStatusFlag.value.status !== status

      if (StatusChange) {
        triggerPopUp('error', 'Flag Update Failed', `An error occurred while updating the flag status. Please try again later.`)
      } else {
        triggerPopUp('success', 'Flag Updated', `updated successfully.`)
      }
      if (paginatedFlags.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
      }
    } catch (error) {
      console.error('Error toggling flag status:', error)
      triggerPopUp('error', 'Error Updating Flag', `An error occurred while trying to update the flag.`)
      return
    } finally {
      showDeleteConfirm.value = false
      flagToDelete.value = null
    }
  }
}

// Delete flag

const showDeleteConfirm = ref<boolean>(false)
const flagToDelete = ref<AbuseReportAdminResponse | null>(null)

const deleteFlag = (flagId: number) => {
  showDeleteConfirm.value = true
  flagToDelete.value = store.flags.find(f => f.id === flagId) || null
}

const confirmDelete = () => {
  if (flagToDelete.value) {
    try {
      // await store.deleteFlag(flagToDelete.value)

      const isStillPresent = store.flags.some(f => f.id === flagToDelete.value?.id)

      if (isStillPresent) {
        triggerPopUp('error', 'Flag Delete Failed', `An error occurred while deleting the flag. Please try again later.`)
      } else {
        triggerPopUp('success', 'Flag Deleted', `deleted successfully.`)
      }
      if (paginatedFlags.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
      }
    } catch (error) {
      console.error('Error toggling flag status:', error)
      triggerPopUp('error', 'Error Deleting Flag', `An error occurred while trying to delete the flag.`)
      return
    } finally {
      showDeleteConfirm.value = false
      flagToDelete.value = null
    }
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  flagToDelete.value = null
}

onMounted(async () => {
  await store.fetchProfile()
  await store.fetchAbuses()
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
            Flags Reported
          </h1>
          <p class="text-gray-500">
            Here you can view all the flags that have been reported by users.
          </p>
        </div>
      </div>

      <!-- <div class="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Flagged Listings"
          value="42"
          trend="+12% this week"
          trend-color="red"
        />
        <StatCard
          title="User Fraud Reports"
          :value="store.supports.length"
          trend="85% resolved"
          trend-color="green"
        />
        <StatCard
          title="Avg. Response Time"
          value="4.2h"
        />
      </div> -->

      <FlagDetailModal
        :is-open="isModalOpen"
        :flag="selectedFlag"
        @close="closeFlag"
      />
      <FlagStatusModale
        :is-open="isStatusModalOpen"
        :flag="selectedStatusFlag"
        @close="closeStatus"
        @update="updateStatus"
      />
      <DeleteConfirmationPopup
        :show="showDeleteConfirm"
        title="Delete Flag"
        description="Are you sure you want to delete this flag? This action cannot be undone."
        cancel-text="Cancel"
        confirm-text="Confirm"
        @confirm-delete="confirmDelete"
        @cancel-delete="cancelDelete"
      />
      <div class="flex gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by listing, user, or reason..."
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        >

        <select
          v-model="reasonFilter"
          class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none"
        >
          <option value="All">
            All reasons
          </option>
          <option
            v-for="option in reasonOptions"
            :key="option.key"
            :value="option.value"
          >
            {{ option.value.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()).replace(/_/g, ' ') }}
          </option>
        </select>

        <select
          v-model="statusFilter"
          class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none"
        >
          <option value="All">
            All Statuses
          </option>
          <option
            v-for="option in statusOptions"
            :key="option.key"
            :value="option.value"
          >
            {{ option.value.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
          </option>
        </select>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase">
            <tr>
              <th class="p-4 font-medium w-1/12">
                ID
              </th>
              <th class="p-4 font-medium w-1/12">
                Reason
              </th>
              <th class="p-4 font-medium w-1/4">
                Message
              </th>
              <th class="p-4 font-medium w-1/4">
                Reported By
              </th>
              <th class="p-4 font-medium w-1/4">
                Reported On
              </th>
              <th class="p-4 font-medium w-1/12">
                Status
              </th>
              <th class="p-4 font-medium w-1/12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            v-if="!store.isLoading"
            class="divide-y"
          >
            <tr
              v-for="flag in paginatedFlags"
              :key="flag.id"
              class="hover:bg-gray-50 border-gray-300 dark:border-gray-800 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="p-4">
                <p class="font-bold">
                  Flag #{{ flag.id }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ flag.reason.toLocaleLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()).replace(/_/g, ' ') }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ flag.message }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ flag.reporterNickname }}
                </p>
                <p class="font-sm text-gray-500">
                  {{ flag.reporterEmail }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ flag.advertTitle }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ flag.status.toLocaleLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) }}
                </p>
              </td>
              <td class="p-4 text-right flex">
                <button
                  class="ml-2 text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer"
                  @click="openFlag(flag)"
                >
                  <Icon
                    name="material-symbols:visibility-rounded"
                    class="size-6"
                  />
                </button>
                <button
                  class="ml-2 text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer"
                  @click="openStatus(flag)"
                >
                  <Icon
                    name="material-symbols:settings-rounded"
                    class="size-6"
                  />
                </button>
                <button
                  class="ml-2 text-gray-400 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer"
                  @click="deleteFlag(flag.id)"
                >
                  <Icon
                    name="material-symbols:delete-rounded"
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
                Loading flags...
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
          v-if="!store.isLoading && (store.flags.length === 0 || paginatedFlags.length === 0)"
          class="p-8 text-center text-gray-500"
        >
          No flags found.
        </div>
      </div>
    </div>
  </section>
</template>
