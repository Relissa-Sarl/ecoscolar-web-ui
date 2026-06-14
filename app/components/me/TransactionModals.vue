<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import type { TransactionActionType } from '~/composables/useTransactionActions'

const props = defineProps<{
  activeModal: TransactionActionType
  isProcessing: boolean
  actionError: string | null
  disputeReason?: string
  disputeDescription?: string
}>()

const emits = defineEmits<{
  'update:disputeReason': [value: string]
  'update:disputeDescription': [value: string]
  'cancel': []
  'confirm': []
}>()

const { t } = useI18n()

// Propriété calculée pour modeler le motif du litige via v-model
const disputeReasonModel = computed({
  get: () => props.disputeReason || '',
  set: value => emits('update:disputeReason', value)
})

const disputeDescriptionModel = computed({
  get: () => props.disputeDescription || '',
  set: value => emits('update:disputeDescription', value)
})

const isOpen = computed(() => props.activeModal !== null)

const modalDetails = computed(() => {
  switch (props.activeModal) {
    case 'confirm_reception':
      return {
        title: t('me.purchases.actions.confirm_reception'),
        description: t('me.purchases.alerts.confirm_reception_prompt'),
        confirmText: t('me.purchases.actions.confirm_reception'),
        confirmClass: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
      }
    case 'confirm_shipping':
      return {
        title: t('me.sales.actions.confirm_shipping'),
        description: t('me.sales.alerts.confirm_shipping_prompt'),
        confirmText: t('me.sales.actions.confirm_shipping'),
        confirmClass: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
      }
    case 'cancel':
      return {
        title: t('me.purchases.actions.cancel'),
        description: t('me.purchases.alerts.cancel_prompt'),
        confirmText: t('me.purchases.actions.cancel'),
        confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      }
    case 'dispute':
      return {
        title: t('me.purchases.dispute_modal_title'),
        description: t('me.purchases.alerts.dispute_prompt'),
        confirmText: t('me.purchases.submit_dispute'),
        confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      }
    case 'renew':
      return {
        title: t('me.sales.actions.renew'),
        description: t('me.sales.alerts.renew_prompt'),
        confirmText: t('me.sales.actions.renew'),
        confirmClass: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
      }
    default:
      return null
  }
})

const isConfirmDisabled = computed(() => {
  if (props.isProcessing) return true
  if (props.activeModal === 'dispute') {
    if (!disputeReasonModel.value) return true
    if (!disputeDescriptionModel.value.trim()) return true
  }
  return false
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen && modalDetails"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-0"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all scale-100 opacity-100">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {{ modalDetails.title }}
          </h3>

          <p class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {{ modalDetails.description }}
          </p>

          <div
            v-if="activeModal === 'dispute'"
            class="mb-6"
          >
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Motif <span class="text-red-500">*</span>
            </label>
            <select
              v-model="disputeReasonModel"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all mb-4"
            >
              <option
                value=""
                disabled
              >
                Sélectionner un motif
              </option>
              <option value="ItemNotReceived">
                Objet non reçu
              </option>
              <option value="NotAsDescribed">
                Non conforme
              </option>
              <option value="Damaged">
                Endommagé
              </option>
            </select>

            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 mt-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="disputeDescriptionModel"
              rows="4"
              required
              class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-colors resize-none text-slate-900 dark:text-slate-100"
              placeholder="Veuillez décrire le problème rencontré avec cet article..."
            />
          </div>

          <!-- Affichage d'erreur éventuelle -->
          <div
            v-if="actionError"
            class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm"
          >
            {{ actionError }}
          </div>

          <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
            <button
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              :disabled="isProcessing"
              @click="emits('cancel')"
            >
              {{ t('common.deletePopup.cancel') }}
            </button>
            <button
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm focus:ring-4 focus:outline-none flex items-center justify-center gap-2"
              :class="modalDetails.confirmClass"
              :disabled="isConfirmDisabled"
              @click="emits('confirm')"
            >
              <svg
                v-if="isProcessing"
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
              <span>{{ modalDetails.confirmText }}</span>
            </button>
          </div>
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
