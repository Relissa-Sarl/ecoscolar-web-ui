<script setup lang="ts">
import Sidebar from '@/components/admin/Sidebar.vue'
import PopUp from '~/components/admin/PopUp.vue'
import AdvertDetailModal from '~/components/admin/AdvertDetailModal.vue'
import DeleteConfirmationPopup from '~/components/common/DeleteConfirmationPopup.vue'
// import StatCard from '~/components/admin/StatCard.vue'
import { useAdminsStore } from '~/stores/adminsStore'
import { AdvertStatus } from '~/utils/enum/advertStatus'
import { AdvertType } from '~/utils/enum/advertType'

const store = useAdminsStore()

definePageMeta({
  middleware: ['admin']
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
const advertStatus = Object.entries(AdvertStatus).map(([key, value]) => ({
  key,
  value
}))
const advertTypes = Object.entries(AdvertType).map(([key, value]) => ({
  key,
  value
}))
const statusFilterTypes = ref('All')
const statusFilterStatus = ref('All')

const filteredAdverts = computed(() => {
  let result = store.adverts

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.title?.toLowerCase().includes(q)
      || a.buyerName?.toLowerCase().includes(q)
      || a.sellerPseudo?.toLowerCase().includes(q)
    )
  }

  if (statusFilterStatus.value !== 'All') {
    result = result.filter((a) => {
      if (statusFilterStatus.value === AdvertStatus.ACTIVE) return a.status === AdvertStatus.ACTIVE
      if (statusFilterStatus.value === AdvertStatus.EXPIRED) return a.status === AdvertStatus.EXPIRED
      if (statusFilterStatus.value === AdvertStatus.PAUSED) return a.status === AdvertStatus.PAUSED
      if (statusFilterStatus.value === AdvertStatus.SOLD) return a.status === AdvertStatus.SOLD
      if (statusFilterStatus.value === AdvertStatus.BLOCKED) return a.status === AdvertStatus.BLOCKED
    })
  }

  if (statusFilterTypes.value !== 'All') {
    result = result.filter((a) => {
      if (statusFilterTypes.value === AdvertType.BOOK) return a.type === AdvertType.BOOK
      if (statusFilterTypes.value === AdvertType.PRODUCT) return a.type === AdvertType.PRODUCT
      if (statusFilterTypes.value === AdvertType.SERVICE) return a.type === AdvertType.SERVICE
    })
  }

  return result
})

// Pagination
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.ceil(filteredAdverts.value.length / pageSize))

const paginatedAdverts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAdverts.value.slice(start, start + pageSize)
})

const changePage = (page: number) => {
  currentPage.value = page
}

watch([searchQuery, statusFilterStatus], () => {
  currentPage.value = 1
})

// advert Modal
const isModalOpen = ref(false)
const selectedAdvert = ref<MySaleAdvert | null>(null)

const openAdvert = (advert: MySaleAdvert) => {
  selectedAdvert.value = advert
  isModalOpen.value = true
}

const closeAdvert = () => {
  selectedAdvert.value = null
  isModalOpen.value = false
}

// block advert
const showBlockConfirm = ref<boolean>(false)
const advertToBlock = ref<MySaleAdvert | null>(null)

const blockAdvert = (id: number) => {
  showBlockConfirm.value = true
  advertToBlock.value = store.adverts?.find(advert => advert.id === id) || null
}
const confirmBlock = async () => {
  if (advertToBlock.value) {
    try {
      const updatedAdvert = await store.blockAdvert(advertToBlock.value)

      const index = store.adverts?.findIndex(a => a.id === advertToBlock.value?.id)

      if (index !== -1) {
        store.adverts![index] = updatedAdvert
        triggerPopUp('success', 'Advert Blocked', `blocked successfully.`)
      }
      if (paginatedAdverts.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
      }
    } catch (error) {
      console.error('Error toggling advert status:', error)
      showPopUp.value = true
      triggerPopUp('error', 'Advert Status Update Failed', `An error occurred while updating the advert status or the advert is already blocked. Please try again later.`)
    } finally {
      showBlockConfirm.value = false
      advertToBlock.value = null
    }
  }
}

const cancelBlock = () => {
  showBlockConfirm.value = false
  advertToBlock.value = null
}

// delete advert
const showDeleteConfirm = ref<boolean>(false)
const advertToDelete = ref<MySaleAdvert | null>(null)

const deleteAdvert = (id: number) => {
  showDeleteConfirm.value = true
  advertToDelete.value = store.adverts?.find(advert => advert.id === id) || null
}
const confirmDelete = async () => {
  if (advertToDelete.value) {
    try {
      await store.deleteAdvert(advertToDelete.value)

      const isStillPresent = store.adverts.some(a => a.id === advertToDelete.value?.id)

      if (isStillPresent) {
        triggerPopUp('error', 'Advert Status Update Failed', `An error occurred while deleting the advert. Please try again later.`)
      } else {
        triggerPopUp('success', 'Advert Deleted', `deleted successfully.`)
      }
      if (paginatedAdverts.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
      }
    } catch (error) {
      console.error('Error toggling advert status:', error)
      showPopUp.value = true
      triggerPopUp('error', 'Advert Status Update Failed', `An error occurred while deleting the advert. Please try again later.`)
    } finally {
      showDeleteConfirm.value = false
      advertToDelete.value = null
    }
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  advertToDelete.value = null
}

onMounted(async () => {
  await store.fetchProfile()
  await store.fetchAllAdverts()
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
            Adverts Management
          </h1>
          <p class="text-gray-500">
            View and manage all user adverts, including pending approvals and reported listings.
          </p>
        </div>
      </div>

      <!-- <div class="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="TOTAL REPORTS"
          value="1,284"
        />
        <StatCard
          title="OPEN DISPUTES"
          value="42"
        />
        <StatCard
          title="RESOLVED TODAY"
          value="15"
        />
        <StatCard
          title="AVG. RESOLUTION TIME"
          value="4.2h"
        />
      </div> -->

      <AdvertDetailModal
        :is-open="isModalOpen"
        :advert="selectedAdvert!"
        :is-sending="store.isLoading"
        @close="closeAdvert"
      />
      <DeleteConfirmationPopup
        :show="showBlockConfirm"
        title="Block Advert"
        message="Are you sure you want to block this advert? This action cannot be undone."
        cancel-text="Cancel"
        confirm-text="Confirm"
        @confirm-delete="confirmBlock"
        @cancel-delete="cancelBlock"
      />
      <DeleteConfirmationPopup
        :show="showDeleteConfirm"
        title="Delete Advert"
        message="Are you sure you want to delete this advert? This action cannot be undone."
        cancel-text="Cancel"
        confirm-text="Confirm"
        @confirm-delete="confirmDelete"
        @cancel-delete="cancelDelete"
      />
      <div class="flex gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title, seller, or buyer..."
          class="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none focus:border-emerald-700"
        >

        <select
          v-model="statusFilterTypes"
          class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none"
        >
          <option value="All">
            All Types
          </option>
          <option
            v-for="option in advertTypes"
            :key="option.key"
            :value="option.value"
          >
            {{ option.value.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
          </option>
        </select>

        <select
          v-model="statusFilterStatus"
          class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none"
        >
          <option value="All">
            All Statuses
          </option>
          <option
            v-for="option in advertStatus"
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
              <th class="p-4 font-medium w-1/4">
                Title
              </th>
              <th class="p-4 font-medium w-1/4">
                Seller
              </th>
              <th class="p-4 font-medium w-1/4">
                Price
              </th>
              <th class="p-4 font-medium w-1/12">
                Type
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
              v-for="advert in paginatedAdverts"
              :key="advert.id"
              class="hover:bg-gray-50 border-gray-300 dark:border-gray-800 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="p-4">
                <p class="font-bold">
                  {{ advert.title }}
                </p>
              </td>
              <td class="p-4">
                <p
                  v-if="advert.sellerPseudo"
                  class="font-medium"
                >
                  {{ advert.sellerPseudo }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ advert.price }} CHF<span v-if="advert.type === 'SERVICE'">/h</span>
                </p>
                <p class="text-xs text-gray-500 truncate w-64">
                  {{ advert.buyerName || 'No buyer yet' }}
                </p>
              </td>
              <td class="p-4">
                <p
                  class="font-medium"
                >
                  {{ advert.type.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ advert.status.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
                </p>
              </td>
              <td class="p-4 text-right flex">
                <button
                  class="ml-2 text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer"
                  @click="openAdvert(advert)"
                >
                  <Icon
                    name="material-symbols:visibility-rounded"
                    class="size-6"
                  />
                </button>
                <button
                  class="ml-2 text-gray-400 transition-colors font-medium text-sm"
                  :disabled="advert.status === AdvertStatus.BLOCKED || advert.status === AdvertStatus.SOLD || advert.status === AdvertStatus.PAUSED"
                  :class="advert.status === AdvertStatus.BLOCKED || advert.status === AdvertStatus.SOLD || advert.status === AdvertStatus.PAUSED ? 'disabled:opacity-50 hover:text-gray-400' : 'hover:text-red-600 cursor-pointer'"
                  @click="blockAdvert(advert.id)"
                >
                  <Icon
                    name="material-symbols:block-outline"
                    class="size-6"
                  />
                </button>
                <button
                  class="ml-2 text-gray-400 transition-colors font-medium text-sm"
                  :disabled="advert.status === AdvertStatus.SOLD || advert.status === AdvertStatus.PAUSED"
                  :class="advert.status === AdvertStatus.SOLD || advert.status === AdvertStatus.PAUSED ? 'disabled:opacity-50 hover:text-gray-400' : 'hover:text-red-600 cursor-pointer'"
                  @click="deleteAdvert(advert.id)"
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
                Loading support tickets...
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
          v-if="(store.adverts.length === 0 && !store.isLoading) || paginatedAdverts.length === 0"
          class="p-8 text-center text-gray-500"
        >
          No adverts found.
        </div>
      </div>

      <!-- Trend Analysis & Urgent Tasks
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2 p-6 bg-white dark:bg-gray-900 rounded-xl border">
          <h3 class="font-bold mb-4">
            Trend Analysis
          </h3>
          <div class="h-40 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            Graphique
          </div>
        </div>
        <div class="p-6 bg-white dark:bg-gray-900 rounded-xl border">
          <h3 class="font-bold mb-4">
            Urgent Tasks
          </h3>
          <div class="space-y-4">
            <div class="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded text-sm">
              <p class="font-bold">
                Fraud spike detected
              </p>
              <p class="text-xs">
                High volume from IP range...
              </p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>
