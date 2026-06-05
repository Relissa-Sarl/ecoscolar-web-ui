<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLocalePath } from '#imports'
import { useSupportTicketsStore } from '~/stores/supportTicketsStore'
import { useUsersStore } from '~/stores/usersStore'

definePageMeta({
  middleware: 'auth'
})

const localePath = useLocalePath()
const usersStore = useUsersStore()
const supportTicketsStore = useSupportTicketsStore()

const tickets = computed(() => supportTicketsStore.tickets)

/** Charge les tickets côté client (cookies de session non disponibles au SSR en dev). */
const loadTicketsOnClient = async () => {
  supportTicketsStore.clearError()
  await usersStore.fetchProfile().catch(() => undefined)
  await supportTicketsStore.loadTickets(true).catch(() => undefined)
}

onMounted(() => {
  void loadTicketsOnClient()
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {{ $t('support.list.subtitle') }}
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {{ $t('support.list.title') }}
          </h1>
          <p class="mt-2 text-slate-600 dark:text-slate-400">
            {{ $t('support.list.description') }}
          </p>
        </div>
        <NuxtLink
          :to="localePath('/support')"
          class="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:self-center"
        >
          {{ $t('support.list.actions.new_request') }}
        </NuxtLink>
      </div>

      <div
        v-if="supportTicketsStore.isLoading"
        class="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        {{ $t('support.list.status.loading') }}
      </div>

      <div
        v-else-if="supportTicketsStore.error"
        class="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
      >
        <p>{{ $t('support.list.status.error') }}</p>
        <button
          type="button"
          class="mt-4 inline-flex items-center justify-center rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
          @click="loadTicketsOnClient"
        >
          {{ $t('support.list.status.retry') }}
        </button>
      </div>

      <div
        v-else-if="tickets.length === 0"
        class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900"
      >
        <p class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ $t('support.list.empty.title') }}
        </p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {{ $t('support.list.empty.message') }}
        </p>
        <NuxtLink
          :to="localePath('/support')"
          class="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {{ $t('support.list.actions.contact') }}
        </NuxtLink>
      </div>

      <ul
        v-else
        class="flex flex-col gap-4"
      >
        <li
          v-for="ticket in tickets"
          :key="ticket.id"
        >
          <SupportTicketCard :ticket="ticket" />
        </li>
      </ul>
    </section>
  </div>
</template>
