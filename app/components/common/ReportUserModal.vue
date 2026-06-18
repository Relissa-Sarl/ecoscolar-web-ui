<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show: boolean
  isSubmitting?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emits = defineEmits<{
  submit: [message: string]
  close: []
}>()

const message = ref('')

// Clear text when opening or closing modal
watch(() => props.show, (newVal) => {
  if (newVal) {
    message.value = ''
  }
})

const handleCancel = () => {
  emits('close')
}

const handleSubmit = () => {
  if (message.value.trim().length >= 5) {
    emits('submit', message.value.trim())
  }
}
</script>

<template>
  <div
    v-show="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white transition-all transform scale-100">
      <h3 class="mb-2 text-lg font-bold text-slate-900 dark:text-white">
        {{ $t('report.title_comment') ? $t('report.message_label').replace('(obligatoire)', '') : 'Signaler cet utilisateur' }}
      </h3>
      <p class="mb-4 text-xs text-slate-500 dark:text-slate-400">
        {{ $t('profile.public.report.description') }}
      </p>

      <div class="mb-4">
        <label
          for="report-reason"
          class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          {{ $t('report.message_label') }}
        </label>
        <textarea
          id="report-reason"
          v-model="message"
          rows="4"
          :placeholder="$t('report.message_placeholder')"
          class="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          :disabled="isSubmitting"
        />
        <p
          v-if="message.trim().length < 5 && message.length > 0"
          class="mt-1 text-xs text-red-500"
        >
          {{ $t('report.error_min_length') }}
        </p>
        <p
          v-if="error"
          class="mt-2 text-xs text-red-500 font-medium"
        >
          {{ error }}
        </p>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          class="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors disabled:opacity-50"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          {{ $t('report.cancel') }}
        </button>
        <button
          type="button"
          class="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 cursor-pointer transition-colors flex items-center gap-2 disabled:opacity-50"
          :disabled="isSubmitting || message.trim().length < 5"
          @click="handleSubmit"
        >
          <div
            v-if="isSubmitting"
            class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          />
          {{ $t('report.submit') }}
        </button>
      </div>
    </div>
  </div>
</template>
