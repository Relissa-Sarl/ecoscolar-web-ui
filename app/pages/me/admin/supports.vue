<script setup lang="ts">
import Sidebar from '@/components/admin/Sidebar.vue'
import PopUp from '~/components/common/PopUp.vue'
import StatCard from '~/components/admin/StatCard.vue'
import { useAdminsStore } from '~/stores/adminsStore'

const store = useAdminsStore()

definePageMeta({
  middleware: ['admin']
})

// Pop-up
const showPopUp = ref(false)
const popUpType = ref<'info' | 'success' | 'warning' | 'error'>('info')
const popUpTitle = ref('')
const popUpDescription = ref('')

const closePopUp = () => {
  showPopUp.value = false
  popUpTitle.value = ''
  popUpDescription.value = ''
}

onMounted(async () => {
  await store.fetchProfile()
})
</script>

<template>
  <section class="min-h-screen px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex">
    <PopUp
      :show="showPopUp"
      :pop-up-type="popUpType"
      :title="popUpTitle"
      :description="popUpDescription"
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
        <div class="flex gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
          <button class="px-4 py-1 bg-white dark:bg-gray-700 shadow rounded-md font-medium">
            Pending
          </button>
          <button class="px-4 py-1 text-gray-600 dark:text-gray-400">
            Resolved
          </button>
        </div>
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
          value="useA"
          trend="85% resolved"
          trend-color="green"
        />
        <StatCard
          title="Avg. Response Time"
          value="4.2h"
        />
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase">
            <tr>
              <th class="p-4">
                Type / ID
              </th>
              <th class="p-4">
                Reporter
              </th>
              <th class="p-4">
                Subject / Description
              </th>
              <th class="p-4">
                Status
              </th>
              <th class="p-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr>
              <td class="p-4">
                <p class="font-bold">
                  Listing #8821
                </p>
                <p class="text-xs text-gray-400">
                  High Risk
                </p>
              </td>
              <td class="p-4">
                Sarah Jenkins <br><span class="text-xs text-gray-400">Buyer</span>
              </td>
              <td class="p-4">
                <p class="font-medium">
                  Suspicious payment link requested
                </p>
                <p class="text-xs text-gray-500 truncate w-64">
                  Seller sent a link to an external site...
                </p>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Flagged</span>
              </td>
              <td class="p-4 flex gap-2 text-gray-400">
                <span>👁️</span> <span>🗑️</span> <span>🚫</span>
              </td>
            </tr>
          </tbody>
        </table>
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
