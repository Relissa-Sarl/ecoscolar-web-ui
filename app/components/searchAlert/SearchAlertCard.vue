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
const matchedCount = computed(() => props.alert.matchedCount ?? 0)
const hasMatches = computed(() => matchedCount.value > 0)
const createdLabel = computed(() =>
  new Date(props.alert.createdAt).toLocaleDateString())
</script>

<template>
  <article
    class="flex h-full flex-col gap-4 rounded-3xl border bg-white p-5 shadow-sm dark:bg-slate-950"
    :class="hasMatches
      ? 'border-emerald-300 ring-2 ring-emerald-100 dark:border-emerald-700 dark:ring-emerald-950'
      : 'border-slate-200 dark:border-slate-800'"
  >
    <div>
      <div class="flex flex-wrap items-center gap-2">
        <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {{ $t('searchAlerts.subtitle') }}
        </p>
        <span
          v-if="hasMatches"
          class="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white"
        >
          {{ $t('searchAlerts.matches.badge', { count: matchedCount }) }}
        </span>
      </div>
      <h3 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
        {{ label }}
      </h3>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {{ createdLabel }}
      </p>
      <p
        class="mt-3 rounded-xl px-3 py-2 text-sm font-medium"
        :class="hasMatches
          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
          : 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400'"
      >
        {{ hasMatches
          ? $t('searchAlerts.matches.found', { count: matchedCount })
          : $t('searchAlerts.matches.none') }}
      </p>
    </div>
    <div class="mt-auto flex flex-wrap gap-3 pt-1">
      <button
        v-if="hasMatches"
        type="button"
        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        @click="emit('runSearch', alert)"
      >
        {{ $t('searchAlerts.actions.view_matches') }}
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
