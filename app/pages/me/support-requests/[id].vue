<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSupportTicketsStore } from '~/stores/supportTicketsStore'
import { useUsersStore } from '~/stores/usersStore'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const usersStore = useUsersStore()
const supportTicketsStore = useSupportTicketsStore()

const ticketId = computed(() => Number(route.params.id))

const isValidId = computed(
  () => Number.isFinite(ticketId.value) && ticketId.value > 0
)

const loadDetailOnClient = async (id: number) => {
  if (!Number.isFinite(id) || id <= 0) return
  supportTicketsStore.clearError()
  await usersStore.fetchProfile().catch(() => undefined)
  await supportTicketsStore.loadTicketDetail(id).catch(() => undefined)
}

watch(ticketId, (id) => {
  void loadDetailOnClient(id)
}, { immediate: true })

const ticket = computed(() => supportTicketsStore.currentTicket)
const messages = computed(() => supportTicketsStore.messages)

const showLoadError = computed(
  () => !supportTicketsStore.isLoading && !!supportTicketsStore.error
)

const showNotFound = computed(
  () =>
    !supportTicketsStore.isLoading
    && !supportTicketsStore.error
    && (!isValidId.value || !ticket.value)
)

const breadcrumbItems = computed(() => [
  { label: t('common.home'), to: localePath('/') },
  { label: t('support.list.title'), to: localePath('/me/support-requests') },
  {
    label: ticket.value
      ? t('support.list.ticket_label', { id: ticket.value.id })
      : t('support.detail.title')
  }
])

const onSend = async (message: string) => {
  await supportTicketsStore.sendMessage(ticketId.value, message)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        class="mb-8"
        :items="breadcrumbItems"
      />

      <div class="mb-8">
        <NuxtLink
          :to="localePath('/me/support-requests')"
          class="group inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium no-underline focus:ring-2 focus:ring-emerald-500 outline-none rounded"
        >
          <span aria-hidden="true">←</span>
          <span class="border-b border-transparent pb-px group-hover:border-current">{{ $t('support.detail.back_to_list') }}</span>
        </NuxtLink>
      </div>

      <div
        v-if="supportTicketsStore.isLoading && !ticket"
        class="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900"
      >
        {{ $t('support.list.status.loading') }}
      </div>

      <div
        v-else-if="showLoadError"
        class="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30"
      >
        <p class="text-red-700 dark:text-red-200">
          {{ $t('support.detail.load_error') }}
        </p>
        <button
          type="button"
          class="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
          @click="loadDetailOnClient(ticketId)"
        >
          {{ $t('support.list.status.retry') }}
        </button>
      </div>

      <div
        v-else-if="showNotFound"
        class="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30"
      >
        <p class="text-red-700 dark:text-red-200">
          {{ $t('support.detail.not_found') }}
        </p>
        <NuxtLink
          :to="localePath('/me/support-requests')"
          class="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
        >
          {{ $t('support.detail.back_to_list') }}
        </NuxtLink>
      </div>

      <template v-else-if="ticket">
        <header class="mb-8">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {{ $t('support.list.ticket_label', { id: ticket.id }) }}
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {{ ticket.subject }}
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ new Date(ticket.createdAt).toLocaleString() }} · {{ ticket.email }}
          </p>
        </header>

        <p
          v-if="!supportTicketsStore.conversationEnabled"
          class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
        >
          {{ $t('support.detail.conversation_unavailable') }}
        </p>

        <SupportTicketChat
          :ticket="ticket"
          :messages="messages"
          :sending="supportTicketsStore.isSending"
          :reply-enabled="supportTicketsStore.conversationEnabled"
          @send="onSend"
        />
      </template>
    </section>
  </div>
</template>
