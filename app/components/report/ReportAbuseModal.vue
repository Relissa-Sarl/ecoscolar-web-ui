<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '#imports'

const props = defineProps<{
  isOpen: boolean
  isProcessing: boolean
  error: string | null
  targetType: 'advert' | 'comment'
}>()

const emits = defineEmits<{
  close: []
  submit: [payload: { message: string }]
}>()

const { t } = useI18n()

const message = ref('')

const isFormValid = computed(() => {
  return message.value.trim().length > 0
})

const isSubmitDisabled = computed(() => {
  return props.isProcessing || !isFormValid.value
})

const title = computed(() => {
  return props.targetType === 'comment'
    ? t('report.title_comment')
    : t('report.title_advert')
})

const description = computed(() => {
  return props.targetType === 'comment'
    ? t('report.description_comment')
    : t('report.description_advert')
})

watch(() => props.isOpen, (newIsOpen) => {
  if (newIsOpen) {
    message.value = ''
  }
})

const handleClose = () => {
  if (!props.isProcessing) {
    emits('close')
  }
}

const handleSubmit = () => {
  if (isFormValid.value && !props.isProcessing) {
    emits('submit', {
      message: message.value.trim()
    })
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        aria-describedby="report-modal-description"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all scale-100 opacity-100">
          <h3
            id="report-modal-title"
            class="text-2xl font-bold text-slate-900 dark:text-white mb-3"
          >
            {{ title }}
          </h3>

          <p
            id="report-modal-description"
            class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed"
          >
            {{ description }}
          </p>

          <form @submit.prevent="handleSubmit">
            <!-- Détails -->
            <div class="mb-6">
              <label
                for="report-message"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                {{ t('report.message_label') }} <span
                  class="text-red-500"
                  aria-hidden="true"
                >*</span>
              </label>
              <textarea
                id="report-message"
                v-model="message"
                rows="4"
                required
                aria-required="true"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-colors resize-none text-slate-900 dark:text-slate-100"
                :placeholder="t('report.message_placeholder')"
              />
            </div>

            <!-- Affichage d'erreur éventuelle -->
            <div
              v-if="error"
              class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {{ error }}
            </div>

            <!-- Boutons -->
            <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
              <button
                type="button"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :disabled="isProcessing"
                @click="handleClose"
              >
                {{ t('report.cancel') }}
              </button>
              <button
                type="submit"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm focus:ring-4 focus:outline-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                :disabled="isSubmitDisabled"
                aria-live="polite"
              >
                <svg
                  v-if="isProcessing"
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{{ t('report.submit') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
