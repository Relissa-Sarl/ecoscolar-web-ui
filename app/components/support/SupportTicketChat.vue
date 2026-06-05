<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SupportTicketDetail, SupportTicketMessage } from '~/types/support'

const props = withDefaults(
  defineProps<{
    ticket: SupportTicketDetail
    messages: SupportTicketMessage[]
    sending?: boolean
    replyEnabled?: boolean
  }>(),
  { replyEnabled: true }
)

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
  if (!text || props.sending || !props.replyEnabled) return
  emit('send', text)
  draft.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <section
      class="max-h-[28rem] space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner dark:border-slate-700 dark:bg-slate-900/60"
      aria-label="Conversation"
    >
      <div
        v-for="entry in thread"
        :key="entry.isInitial ? 'initial' : entry.id"
        class="flex"
        :class="entry.isFromSupport ? 'justify-start' : 'justify-end'"
      >
        <div
          class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
          :class="entry.isFromSupport
            ? 'rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
            : 'rounded-br-md bg-emerald-800 text-white shadow-sm'"
        >
          <p class="mb-1 text-xs font-semibold opacity-80">
            {{
              entry.isInitial
                ? $t('support.detail.you')
                : entry.isFromSupport
                  ? $t('support.detail.support_team')
                  : $t('support.detail.you')
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
      v-if="replyEnabled"
      class="flex flex-col gap-3 sm:flex-row sm:items-end"
      @submit.prevent="submit"
    >
      <label class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ $t('support.detail.reply_label') }}
        </span>
        <textarea
          v-model="draft"
          rows="3"
          class="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          :placeholder="$t('support.detail.reply_placeholder')"
          :disabled="sending"
        />
      </label>
      <button
        type="submit"
        class="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        :disabled="sending || !draft.trim()"
      >
        {{ sending ? $t('support.detail.sending') : $t('support.detail.send') }}
      </button>
    </form>
  </div>
</template>
