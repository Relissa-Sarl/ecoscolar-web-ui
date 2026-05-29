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
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- En-tête + lien retour boutique : copie la structure de favorites.vue -->
      <!-- États : loading / error / empty / grille SearchAlertCard -->
    </section>
  </div>
</template>
