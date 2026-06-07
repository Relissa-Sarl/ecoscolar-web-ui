<script setup lang="ts">
import Sidebar from '@/components/admin/Sidebar.vue'
import PopUp from '~/components/admin/PopUp.vue'
import StatCard from '~/components/admin/StatCard.vue'
import TicketDetailModal from '~/components/admin/TicketDetailModal.vue'
import type { SupportTicketAdminDetail } from '~/types/support'
import { useAdminsStore } from '~/stores/adminsStore'

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
  await store.getAllSupportTickets()
})
</script>

<template>
  <section class="min-h-screen px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex">
    <!-- <pre>{{ store.supports }}</pre> -->
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

      <div class="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Flagged Listings"
          value="42"
          trend="+12% this week"
          trend-color="red"
        />
        <StatCard
          title="User Fraud Reports"
          value="store.supports.length"
          trend="85% resolved"
          trend-color="green"
        />
        <StatCard
          title="Avg. Response Time"
          value="4.2h"
        />
      </div>

      <TicketDetailModal
        :is-open="isModalOpen"
        :ticket="selectedTicket!"
        :messages="selectedTicket?.messages || []"
        :is-sending="store.isLoading"
        @close="closeTicket"
        @send="handleSendMessage"
      />

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase">
            <tr>
              <th class="p-4">
                ID
              </th>
              <th class="p-4">
                Reporter
              </th>
              <th class="p-4">
                Subject / Description
              </th>
              <th class="p-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            v-if="!store.isLoading"
            class="divide-y"
          >
            <tr
              v-for="support in store.supports"
              :key="support.id"
            >
              <td class="p-4">
                <p class="font-bold">
                  Ticket #{{ support.id }}
                </p>
              </td>
              <td class="p-4">
                <p
                  v-if="support.user"
                  class="font-medium"
                >
                  {{ support.user.firstName }} {{ support.user.lastName }}
                </p>
                <p
                  v-else
                  class="font-medium"
                >
                  {{ support.email }}
                </p>
                <p class="font-medium">
                  {{ support.email }}
                </p>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  {{ support.subject }}
                </p>
                <p class="text-xs text-gray-500 truncate w-64">
                  {{ support.message }}
                </p>
              </td>
              <td class="p-4 text-right flex">
                <button
                  class="text-gray-400 hover:text-emerald-800 transition-colors font-medium text-sm cursor-pointer"
                  @click="openTicket(support)"
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
          v-if="store.supports.length === 0 && !store.isLoading"
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
