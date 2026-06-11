<script lang="ts" setup>
import type { User } from '~/types/user'

defineProps<{
  user: User | null
}>()
const menu = [
  { name: 'Dashboard', path: '/me/admin', icon: 'heroicons:squares-2x2' },
  { name: 'Support', path: '/me/admin/supports', icon: 'heroicons:shield-check' },
  { name: 'Adverts', path: '/me/admin/adverts', icon: 'heroicons:megaphone' },
  { name: 'Users', path: '/me/admin/users', icon: 'heroicons:user-group' }
]
</script>

<template>
  <aside class="w-64 h-screen bg-white border-r flex flex-col justify-between p-6 px-4 py-10 text-gray-900 border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
    <div>
      <h1 class="text-xl font-bold text-emerald-800 dark:text-emerald-500 mb-8">
        EcoScolar
      </h1>
      <nav class="space-y-4">
        <NuxtLink
          v-for="item in menu"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 p-2 rounded-lg"
          active-class="bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100"
        >
          <Icon :name="item.icon" />
          {{ item.name }}
        </NuxtLink>
      </nav>
    </div>
    <NuxtLink
      class="flex items-center gap-3 p-2 border-t border-gray-300 dark:border-gray-800 pt-4"
      to="/me/profile"
    >
      <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas&backgroundColor=2d3748"
        alt="User Avatar"
        class="w-12 h-12 rounded-full object-cover border-4 border-emerald-50 dark:border-slate-900"
      >

      <div>
        <p class="font-bold text-sm">
          {{ user?.firstName }} {{ user?.lastName }}
        </p>
        <p class="text-xs text-gray-500">
          {{ user?.roles?.join(', ') }}
        </p>
      </div>
    </NuxtLink>
  </aside>
</template>
