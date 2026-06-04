<script setup lang="ts">
import { computed } from 'vue'
import type { SupportTicket } from '~/types/support'

const props = defineProps<{
  ticket: SupportTicket
}>()

const createdLabel = computed(() =>
  new Date(props.ticket.createdAt).toLocaleString())
</script>

<template>
  <article class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {{ $t('support.list.ticket_label', { id: ticket.id }) }}
        </p>
        <h3 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
          {{ ticket.subject }}
        </h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {{ createdLabel }} · {{ ticket.email }}
        </p>
      </div>
    </div>
    <p class="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      {{ ticket.message }}
    </p>
  </article>
</template>
