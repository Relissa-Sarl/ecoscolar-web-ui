<script setup lang="ts">
import { ref } from 'vue'
import { useI18n, useToast } from '#imports'
import { useHistory } from '~/composables/useHistory'

const props = defineProps<{
  open: boolean
  transactionId: string
  name: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'success', review: { rating: number, comment: string | null }): void
}>()

const { t } = useI18n()
const { createReview } = useHistory()
const toast = useToast()

const rating = ref(0)
const hoverRating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)

const handleClose = () => {
  emit('update:open', false)
  rating.value = 0
  comment.value = ''
  error.value = null
}

const handleSubmit = async () => {
  if (rating.value === 0) return
  isSubmitting.value = true
  error.value = null
  try {
    await createReview(props.transactionId, rating.value, comment.value.trim() || undefined)
    toast.add({
      title: t('me.purchases.review_success'),
      color: 'success'
    })

    emit('success', {
      rating: rating.value,
      comment: comment.value.trim() || null
    })

    handleClose()
  } catch (err) {
    console.error('Error submitting review:', err)
    error.value = t('me.purchases.review_error')
    toast.add({
      title: t('me.purchases.review_error'),
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="t('me.purchases.review_modal_title', { name: props.name })"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <form
        id="review-form"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- Stars Selection -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">
            {{ t('me.purchases.rating_label') }} <span
              class="text-red-600"
              aria-hidden="true"
            >*</span>
          </label>
          <div class="flex items-center gap-1.5">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="text-amber-500 focus:outline-none transition-transform duration-100 hover:scale-110 cursor-pointer"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
              @click="rating = star"
            >
              <UIcon
                :name="star <= (hoverRating || rating) ? 'i-material-symbols-star' : 'i-material-symbols-star-outline'"
                class="w-8 h-8 shrink-0"
              />
            </button>
          </div>
        </div>

        <!-- Comment Textarea -->
        <div class="flex flex-col gap-2">
          <label
            for="review-comment"
            class="text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            {{ t('me.purchases.comment_label') }}
          </label>
          <textarea
            id="review-comment"
            v-model="comment"
            rows="4"
            :placeholder="t('me.purchases.comment_placeholder')"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
          />
        </div>

        <!-- Error Message -->
        <p
          v-if="error"
          class="text-sm text-red-600 dark:text-red-400 font-medium"
          role="alert"
        >
          {{ error }}
        </p>
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
          {{ t('me.purchases.cancel_review') }}
        </UButton>
        <UButton
          color="primary"
          type="submit"
          form="review-form"
          :loading="isSubmitting"
          :disabled="rating === 0 || isSubmitting"
        >
          {{ t('me.purchases.submit_review') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
