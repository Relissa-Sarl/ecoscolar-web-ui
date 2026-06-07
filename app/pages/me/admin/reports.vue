<script setup lang="ts">
import Sidebar from '@/components/admin/Sidebar.vue'
import PopUp from '~/components/admin/PopUp.vue'
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
      <h1 class="text-2xl font-bold mb-8">
        Rapports d'Activité
      </h1>

      <div class="grid grid-cols-4 gap-6 mb-8">
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
      </div>

      <div class="flex gap-4 mb-6">
        <button class="px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg text-sm font-medium">
          Tous les types
        </button>
        <button class="px-4 py-2 border rounded-lg text-sm dark:border-gray-700">
          Cette semaine
        </button>
        <button class="px-4 py-2 border rounded-lg text-sm dark:border-gray-700">
          Statut: En attente
        </button>
        <input
          type="text"
          placeholder="Search Reports..."
          class="ml-auto border rounded-lg px-4 py-2 text-sm w-64 dark:border-gray-700"
        >
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase">
            <tr>
              <th class="p-4">
                Report ID
              </th>
              <th class="p-4">
                Type
              </th>
              <th class="p-4">
                Reporter
              </th>
              <th class="p-4">
                Accused
              </th>
              <th class="p-4">
                Date
              </th>
              <th class="p-4">
                Status
              </th>
              <th class="p-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-800">
            <tr>
              <td class="p-4 font-medium">
                #RP-9402
              </td>
              <td class="p-4">
                Fraud
              </td>
              <td class="p-4">
                Marie Durand
              </td>
              <td class="p-4">
                TechStore_99
              </td>
              <td class="p-4">
                24 Oct, 2023
              </td>
              <td class="p-4">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>
              </td>
              <td class="p-4 text-emerald-600 font-medium cursor-pointer">
                View Details
              </td>
            </tr>
          </tbody>
        </table>
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
