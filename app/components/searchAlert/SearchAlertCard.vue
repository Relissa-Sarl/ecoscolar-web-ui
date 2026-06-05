<script setup lang="ts">
import { computed } from 'vue'
import type { SearchAlert } from '@/types/searchAlert'
import { formatSearchAlertLabel } from '@/types/searchAlert'

const props = defineProps<{
  alert: SearchAlert
  deleting?: boolean
}>()

const emit = defineEmits<{
  delete: [id: number]
  runSearch: [alert: SearchAlert]
}>()

const label = computed(() => formatSearchAlertLabel(props.alert))
const createdLabel = computed(() =>
  new Date(props.alert.createdAt).toLocaleDateString())
</script>

<template>
  <article class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div>
      <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">
        {{ $t('searchAlerts.subtitle') }}
      </p>
      <h3 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
        {{ label }}
      </h3>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {{ createdLabel }}
      </p>
    </div>
    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        @click="emit('runSearch', alert)"
      >
        {{ $t('searchAlerts.actions.run_search') }}
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
        :disabled="deleting"
        @click="emit('delete', alert.id)"
      >
        {{ deleting ? $t('searchAlerts.actions.deleting') : $t('searchAlerts.actions.delete') }}
      </button>
    </div>
  </article>
</template>
