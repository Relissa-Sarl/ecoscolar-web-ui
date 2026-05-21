<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// TODO: replace with the connected admin name from the auth store once available
const adminName = 'Jean Dupont'

const menuItems = computed(() => [
  { label: t('admin.menu.dashboard'), to: localePath('/admin/dashboard') },
  { label: t('admin.menu.listings'), to: localePath('/admin/listings') },
  { label: t('admin.menu.users'), to: localePath('/admin/users') },
  { label: t('admin.menu.reports'), to: localePath('/admin/reports') }
])

const handleLogout = () => {
  // TODO: call auth store logout and redirect once available
}
</script>

<template>
  <div class="flex min-h-screen bg-white dark:bg-gray-950">
    <aside class="w-64 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-4">
      <nav :aria-label="t('admin.nav_label')">
        <ul class="flex flex-col gap-1">
          <li
            v-for="item in menuItems"
            :key="item.to"
          >
            <NuxtLink
              :to="item.to"
              class="block px-3 py-2 rounded text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-900 dark:hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <NuxtLink
        :to="localePath('/')"
        class="mt-auto block px-3 py-2 rounded text-sm font-medium text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {{ t('admin.menu.back_to_public') }}
      </NuxtLink>
    </aside>

    <main class="flex-1 p-6">
      <header class="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <span class="text-sm text-slate-600 dark:text-slate-400">
          {{ t('admin.logged_as', { name: adminName }) }}
        </span>
        <button
          type="button"
          class="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          @click="handleLogout"
        >
          {{ t('admin.logout') }}
        </button>
      </header>

      <slot />
    </main>
  </div>
</template>
