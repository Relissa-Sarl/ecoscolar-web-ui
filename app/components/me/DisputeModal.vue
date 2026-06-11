<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'
import { SUPPORT_MESSAGE_MIN_LENGTH } from '~/utils/supportFormUtils'

const props = defineProps<{
  open: boolean
  transactionId: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'submit', reason: string): void
}>()

const { t } = useI18n()

const reason = ref('')
const isSubmitting = ref(false)

const handleClose = () => {
  if (isSubmitting.value) return
  emit('update:open', false)
  reason.value = ''
}

const handleSubmit = () => {
  if (reason.value.trim().length < SUPPORT_MESSAGE_MIN_LENGTH) return
  emit('submit', reason.value.trim())
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="t('me.purchases.dispute_modal_title')"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <form
        id="dispute-form"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <div class="flex flex-col gap-2">
          <label
            for="dispute-reason"
            class="text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            {{ t('me.purchases.dispute_reason_label') }} <span
              class="text-red-600"
              aria-hidden="true"
            >*</span>
          </label>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ t('support.fields.message_hint', { min: SUPPORT_MESSAGE_MIN_LENGTH }) }}
          </p>
          <textarea
            id="dispute-reason"
            v-model="reason"
            rows="5"
            required
            aria-required="true"
            :minlength="SUPPORT_MESSAGE_MIN_LENGTH"
            :placeholder="t('support.fields.message_placeholder')"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
          />
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="outline"
          :disabled="isSubmitting"
          @click="handleClose"
        >
          {{ t('me.purchases.cancel_dispute') }}
        </UButton>
        <UButton
          color="primary"
          type="submit"
          form="dispute-form"
          :disabled="reason.trim().length < SUPPORT_MESSAGE_MIN_LENGTH || isSubmitting"
        >
          {{ t('me.purchases.submit_dispute') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
