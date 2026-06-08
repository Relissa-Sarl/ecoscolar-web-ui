<script setup lang="ts">
import { computed } from 'vue'
import type { SupportTicketSummary } from '~/types/support'

const props = defineProps<{
  ticket: SupportTicketSummary
}>()

const localePath = useLocalePath()

const createdLabel = computed(() =>
  new Date(props.ticket.createdAt).toLocaleString())
</script>

<template>
  <NuxtLink
    :to="localePath(`/me/support-requests/${ticket.id}`)"
    class="group flex w-full items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-700"
  >
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">
        {{ $t('support.list.ticket_label', { id: ticket.id }) }}
      </p>
      <h3 class="mt-1 truncate text-lg font-semibold text-slate-900 group-hover:text-emerald-900 dark:text-white dark:group-hover:text-emerald-200">
        {{ $t('support.reasons.' + ticket.subject) }}
      </h3>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {{ createdLabel }} · {{ ticket.email }}
      </p>
    </div>
    <span
      class="shrink-0 text-slate-400 transition group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="h-5 w-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </span>
  </NuxtLink>
</template>
