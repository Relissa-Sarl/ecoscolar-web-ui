<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SupportTicketAdminDetail, SupportTicketMessage } from '~/types/support'

const props = defineProps<{
  ticket: SupportTicketAdminDetail
  messages: SupportTicketMessage[]
  sending?: boolean
  email?: string
}>()

const emit = defineEmits<{
  send: [message: string]
}>()

const draft = ref('')

const thread = computed(() => {
  const initial = {
    id: 0,
    body: props.ticket.message,
    isFromSupport: false,
    createdAt: props.ticket.createdAt,
    isInitial: true as const
  }
  return [initial, ...props.messages.map(m => ({ ...m, isInitial: false as const }))]
})

const formatTime = (iso: string) => new Date(iso).toLocaleString()

const submit = () => {
  const text = draft.value.trim()
  if (!text || props.sending) return
  emit('send', text)
  draft.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <section
      class="max-h-112 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner dark:border-slate-700 dark:bg-slate-900/60"
      aria-label="Conversation"
    >
      <div
        v-for="entry in thread"
        :key="entry.isInitial ? 'initial' : entry.id"
        class="flex"
        :class="entry.isFromSupport ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
          :class="entry.isFromSupport
            ? 'rounded-br-md bg-emerald-800 text-white shadow-sm'
            : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'"
        >
          <p class="mb-1 text-xs font-semibold opacity-80">
            {{
              entry.isInitial
                ? props.email
                : entry.isFromSupport
                  ? "You"
                  : props.email
            }}
          </p>
          <p class="whitespace-pre-wrap">
            {{ entry.body }}
          </p>
          <p
            class="mt-2 text-xs opacity-70"
          >
            {{ formatTime(entry.createdAt) }}
          </p>
        </div>
      </div>
    </section>

    <form
      class="flex flex-col gap-3 sm:flex-row sm:items-end"
      @submit.prevent="submit"
    >
      <label class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
          Your Reply
        </span>
        <textarea
          v-model="draft"
          rows="3"
          class="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          :placeholder="'Answer to ' + props.email + '\'s issue...'"
          :disabled="sending"
        />
      </label>
      <button
        type="submit"
        class="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        :disabled="sending || !draft.trim()"
      >
        {{ sending ? "sending" : "send" }}
      </button>
    </form>
  </div>
</template>
