<script setup lang="ts">
import Sidebar from '@/components/admin/Sidebar.vue'
import StatCard from '~/components/admin/StatCard.vue'
import { useAdminsStore } from '~/stores/adminsStore'

const store = useAdminsStore()

definePageMeta({
  middleware: ['admin', 'auth']
})

onMounted(async () => {
  await store.fetchProfile()
  await store.fetchAllSupportTickets()
  await store.fetchAllUsers()
  await store.fetchAllAdverts()
})
</script>

<template>
  <section class="min-h-screen px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex">
    <Sidebar :user="store.user" />

    <div class="flex-1 p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold">
            Dashboard administrator
          </h1>
          <p class="text-gray-500">
            Welcome back, {{ store.user?.firstName }}! Here you can manage users, support tickets, and view platform statistics.
          </p>
        </div>
      </div>

      <div
        v-if="!store.isLoading"
        class="grid grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          title="Total tickets opened"
          :value="store.supports.length"
        />
        <StatCard
          title="Total adverts opened"
          :value="store.adverts.filter(a => a.status === 'ACTIVE').length"
        />
        <StatCard
          title="Total flags"
          :value="2"
        />
        <StatCard
          title="Total users"
          :value="store.users.length"
        />
      </div>
      <div
        v-else
        class="grid grid-cols-3 gap-6 mb-8"
      >
        <p>
          Aucune donnée à afficher pour le moment.
        </p>
      </div>
    </div>
  </section>
</template>
