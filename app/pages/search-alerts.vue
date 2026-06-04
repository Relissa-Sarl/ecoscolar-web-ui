<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import { useSearchAlertsStore } from '~/stores/searchAlertsStore'
import { buildShopSearchQuery, type SearchAlert } from '~/types/searchAlert'

const localePath = useLocalePath()
const searchAlertsStore = useSearchAlertsStore()
const deletingId = ref<number | null>(null)

await searchAlertsStore.loadAlerts().catch(() => undefined)

const alerts = computed(() => searchAlertsStore.alerts)

async function handleDelete(id: number) {
  deletingId.value = id
  try {
    await searchAlertsStore.deleteAlert(id)
  } finally {
    deletingId.value = null
  }
}

async function handleRunSearch(alert: SearchAlert) {
  await navigateTo({
    path: localePath('/shop'),
    query: buildShopSearchQuery(alert)
  })
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {{ $t('searchAlerts.subtitle') }}
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {{ $t('searchAlerts.title') }}
          </h1>
        </div>
        <NuxtLink
          :to="localePath('/shop')"
          class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          {{ $t('searchAlerts.actions.back_to_shop') }}
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div
        v-if="searchAlertsStore.isLoading"
        class="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        {{ $t('searchAlerts.status.loading') }}
      </div>

      <!-- Error -->
      <div
        v-else-if="searchAlertsStore.error"
        class="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
      >
        {{ $t('searchAlerts.status.error') }}
      </div>

      <!-- Empty -->
      <div
        v-else-if="alerts.length === 0"
        class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900"
      >
        <p class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ $t('searchAlerts.empty.title') }}
        </p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {{ $t('searchAlerts.empty.message') }}
        </p>
        <NuxtLink
          :to="localePath('/shop')"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          {{ $t('searchAlerts.actions.browse_shop') }}
        </NuxtLink>
      </div>

      <!-- List -->
      <div
        v-else
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <SearchAlertCard
          v-for="item in alerts"
          :key="item.id"
          :alert="item"
          :deleting="deletingId === item.id"
          @delete="handleDelete"
          @run-search="handleRunSearch"
        />
      </div>
    </section>
  </div>
</template>
