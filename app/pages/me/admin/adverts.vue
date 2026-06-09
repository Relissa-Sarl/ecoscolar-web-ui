<script setup lang="ts">
import Sidebar from '@/components/admin/Sidebar.vue'
import PopUp from '~/components/admin/PopUp.vue'
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
                  @click="triggerPopUp('info', 'Advert Details', `Title: ${advert.title}\nSeller: ${advert.sellerPseudo}\nBuyer: ${advert.buyerName || 'No buyer yet'}\nPrice: ${advert.price}\nStatus: ${advert.status}\nType: ${advert.type}`)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fill-rule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  class="ml-2 text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
                    <path
                      fill-rule="evenodd"
                      d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  class="ml-2 text-gray-400 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clip-rule="evenodd"
                    />
                  </svg>
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
          v-if="store.supports.length === 0 && !store.isLoading"
          class="p-8 text-center text-gray-500"
        >
          No support tickets found.
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
