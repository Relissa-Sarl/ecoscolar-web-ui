<script setup lang="ts">
import Sidebar from '@/components/admin/Sidebar.vue'
import PopUp from '~/components/admin/PopUp.vue'
// import StatCard from '~/components/admin/StatCard.vue'
import TicketDetailModal from '~/components/admin/TicketDetailModal.vue'
import type { SupportTicketAdminDetail } from '~/types/support'
import { useAdminsStore } from '~/stores/adminsStore'
import { SupportReason } from '~/utils/enum/supportReason'

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
const reasonOptions = Object.entries(SupportReason).map(([key, value]) => ({
  key,
  value
}))
const statusFilter = ref(SupportReason.REASON_PLACEHOLDER)

const filteredTickets = computed(() => {
  let result = store.supports

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.email?.toLowerCase().includes(q)
      || t.user.firstName?.toLowerCase().includes(q)
      || t.user.nickname?.toLowerCase().includes(q)
      || t.user.lastName?.toLowerCase().includes(q)
    )
  }

  if (statusFilter.value !== SupportReason.REASON_PLACEHOLDER) {
    result = result.filter((t) => {
      if (statusFilter.value === SupportReason.ACCOUNT) return t.subject === SupportReason.ACCOUNT
      if (statusFilter.value === SupportReason.ORDER) return t.subject === SupportReason.ORDER
      if (statusFilter.value === SupportReason.BUG) return t.subject === SupportReason.BUG
      if (statusFilter.value === SupportReason.OTHER) return t.subject === SupportReason.OTHER
    })
  }

  return result
})

// Pagination
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / pageSize))

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTickets.value.slice(start, start + pageSize)
})

const changePage = (page: number) => {
  currentPage.value = page
}

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// Ticket Modal
const isModalOpen = ref(false)
const selectedTicket = ref<SupportTicketAdminDetail | null>(null)

const openTicket = (ticket: SupportTicketAdminDetail) => {
  selectedTicket.value = ticket
  isModalOpen.value = true
}

const closeTicket = () => {
  selectedTicket.value = null
  isModalOpen.value = false
}

const handleSendMessage = async (payload: string) => {
  store.isLoading = true
  try {
    const created = await store.sendMessage(selectedTicket.value!.id, payload)

    const index = store.supports?.findIndex(u => u.id === selectedTicket.value?.id)

    if (index !== -1) {
      store.supports![index]?.messages?.push(created!)
      triggerPopUp('success', 'Message Sent', 'Your message has been sent successfully.')
    }
  } catch (error) {
    console.error('Error sending message:', error)
    showPopUp.value = true
    triggerPopUp('error', 'Message Send Failed', `An error occurred while sending the message. Please try again later.`)
  } finally {
    store.isLoading = false
  }
}

onMounted(async () => {
  await store.fetchProfile()
  await store.fetchAllSupportTickets()
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
            Moderation Queue
          </h1>
          <p class="text-gray-500">
            Review and resolve community reports to keep EcoScolar safe.
          </p>
        </div>
        <!--
        <div class="flex gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
          <button class="px-4 py-1 bg-white dark:bg-gray-700 shadow rounded-md font-medium">
            Pending
          </button>
          <button class="px-4 py-1 text-gray-600 dark:text-gray-400">
            Resolved
          </button>
        </div> -->
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

      <TicketDetailModal
        :is-open="isModalOpen"
        :ticket="selectedTicket!"
        :messages="selectedTicket?.messages || []"
        :is-sending="store.isLoading"
        @close="closeTicket"
        @send="handleSendMessage"
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
          <option
            v-for="option in reasonOptions"
            :key="option.key"
            :value="option.value"
          >
            {{ option.value.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) || 'All Categories' }}
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
              <th class="p-4 font-medium w-1/4">
                Reporter
              </th>
              <th class="p-4 font-medium w-1/4">
                Subject / Description
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
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              class="hover:bg-gray-50 border-gray-300 dark:border-gray-800 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="p-4">
                <p class="font-bold">
                  Ticket #{{ ticket.id }}
                </p>
              </td>
              <td class="p-4">
                <p
                  v-if="ticket.user"
                  class="font-medium"
                >
                  {{ ticket.user.firstName }} {{ ticket.user.lastName }}
                </p>
                <p
                  v-else
                  class="font-medium"
                >
                  {{ ticket.email }}
                </p>
                <p class="font-medium">
                  {{ ticket.email }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ ticket.subject.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
                </p>
                <p class="text-xs text-gray-500 truncate w-64">
                  {{ ticket.message }}
                </p>
              </td>
              <td class="p-4 text-right flex">
                <button
                  class="ml-2 text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer"
                  @click="openTicket(ticket)"
                >
                  <Icon
                    name="material-symbols:visibility-rounded"
                    class="size-6"
                  />
                </button>
                <!-- <button
                  class="ml-2 text-gray-400 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer"
                >
                  <Icon
                    name="material-symbols:delete-rounded"
                    class="size-6"
                  />
                </button> -->
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
          v-if="(store.supports.length === 0 && !store.isLoading) || paginatedTickets.length === 0"
          class="p-8 text-center text-gray-500"
        >
          No support tickets found.
        </div>
      </div>
      <!-- Case Details & Moderator Tools
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2 p-6 bg-white rounded-xl border">
          <h2 class="font-bold mb-4">
            Case Details: #8821
          </h2>
          <div class="p-4 bg-gray-50 rounded-lg mb-4 italic">
            "I tried to purchase the organic chemistry textbook but the seller kept insisting..."
          </div>
        </div>

        <div class="p-6 bg-white rounded-xl border">
          <h2 class="font-bold mb-4">
            Moderator Tools
          </h2>
          <div class="space-y-3">
            <button class="w-full p-3 bg-gray-50 border rounded-lg text-sm">
              Send Warning to User
            </button>
            <button class="w-full p-3 bg-gray-50 border rounded-lg text-sm">
              Shadow-ban Listing
            </button>
            <button class="w-full p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold">
              Permanent IP Ban
            </button>
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>
