<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n, useLocalePath, refreshNuxtData } from '#imports'
import type { Purchase } from '~/services/historyService'
import Stars from '~/components/profile/Stars.vue'
import ReviewModal from '~/components/me/ReviewModal.vue'

const props = defineProps<{
  purchase: Purchase
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()

const emit = defineEmits<{
  'confirm-reception': [id: string]
  'dispute': [id: string]
  'cancel': [id: string]
}>()

const isOpen = ref(false)
const localReview = ref(props.purchase.review)

watch(() => props.purchase.review, (newReview) => {
  localReview.value = newReview
})

const isCompleted = computed(() => {
  const normalized = props.purchase.status.toLowerCase()
  return normalized === 'completed' || normalized === 'succès' || normalized === 'payé'
})

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

const getStatusBadgeClass = (status: string) => {
  const normalized = status.toLowerCase()
  if (normalized === 'completed' || normalized === 'succès' || normalized === 'payé') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
  }
  if (normalized === 'pending' || normalized === 'en cours') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
  }
  return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800'
}

const showDetails = ref(false)

const handleReviewSuccess = (review: { rating: number, comment: string | null }) => {
  localReview.value = review
  refreshNuxtData('user-purchases')
}
</script>

<template>
  <article class="flex gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <!-- Thumbnail -->
    <div class="h-28 w-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50 dark:border-slate-800/50">
      <img
        v-if="props.purchase.imageUrl"
        :src="props.purchase.imageUrl"
        :alt="props.purchase.advertTitle"
        class="h-full w-full object-cover"
      >
      <div
        v-else
        class="h-full w-full flex items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800"
      >
        <UIcon
          name="i-heroicons-book-open"
          class="w-8 h-8 text-slate-400 dark:text-slate-600"
        />
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col min-w-0 flex-1 justify-between">
      <div>
        <div class="flex items-start justify-between gap-2">
          <span
            class="px-2 py-0.5 rounded-full text-xs font-semibold border"
            :class="getStatusBadgeClass(props.purchase.status)"
          >
            {{ props.purchase.status }}
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            {{ formatDate(props.purchase.purchaseDate) }}
          </span>
        </div>
        <h3 class="mt-2 text-base font-bold text-slate-950 dark:text-white leading-snug truncate">
          {{ props.purchase.advertTitle }}
        </h3>
        <div class="flex items-center gap-2 mt-1 flex-wrap">
          <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>{{ t('me.purchases.seller_label') }} :</span>
            <span class="font-semibold text-slate-700 dark:text-slate-300">{{ props.purchase.sellerName }}</span>
          </p>
          <Stars
            v-if="localReview"
            :rating="localReview.rating"
            :show-text="true"
            class="scale-90 origin-left"
          />
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <span class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
          {{ props.purchase.price }} CHF
        </span>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="props.purchase.status === 'PAID_WAITING_SHIPPING'"
            class="inline-flex items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 py-1.5 px-3 text-xs font-semibold transition-colors"
            @click="emit('cancel', props.purchase.id)"
          >
            {{ t('me.purchases.actions.cancel') }}
          </button>

          <button
            v-if="props.purchase.status === 'SHIPPED'"
            class="inline-flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 py-1.5 px-3 text-xs font-semibold transition-colors"
            @click="emit('dispute', props.purchase.id)"
          >
            {{ t('me.purchases.actions.dispute') }}
          </button>

          <button
            v-if="props.purchase.status === 'SHIPPED'"
            class="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-semibold transition-colors"
            @click="emit('confirm-reception', props.purchase.id)"
          >
            {{ t('me.purchases.actions.confirm_reception') }}
          </button>

          <button
            v-if="isCompleted && !localReview"
            type="button"
            class="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 px-3 text-xs font-semibold transition-colors cursor-pointer"
            @click="isOpen = true"
          >
            {{ t('me.purchases.leave_review') }}
          </button>

          <button
            v-if="props.purchase.status === 'COMPLETED' || props.purchase.status === 'CANCELLED'"
            class="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 py-1.5 px-3 text-xs font-semibold transition-colors"
            @click="showDetails = !showDetails"
          >
            {{ t('me.purchases.actions.details') }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-3 h-3 ml-1 transition-transform"
              :class="showDetails ? 'rotate-180' : ''"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          <NuxtLink
            v-else
            :to="localePath(`/adverts/${props.purchase.advertId}`)"
            class="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 py-1.5 px-3 text-xs font-semibold transition-colors"
          >
            {{ t('me.purchases.view_advert') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Expanded Details Section -->
      <div
        v-if="showDetails"
        class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
          {{ t('me.purchases.details.title') }}
        </h4>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div class="text-slate-500 dark:text-slate-400">
            {{ t('me.purchases.details.item') }}
          </div>
          <div class="font-medium text-slate-900 dark:text-white text-right">
            {{ props.purchase.advertTitle }}
          </div>

          <div class="text-slate-500 dark:text-slate-400">
            {{ t('me.purchases.details.price') }}
          </div>
          <div class="font-medium text-slate-900 dark:text-white text-right">
            {{ props.purchase.price }} CHF
          </div>

          <div class="text-slate-500 dark:text-slate-400">
            {{ t('me.purchases.details.date') }}
          </div>
          <div class="font-medium text-slate-900 dark:text-white text-right">
            {{ formatDate(props.purchase.purchaseDate) }}
          </div>

          <div class="text-slate-500 dark:text-slate-400">
            {{ t('me.purchases.details.status') }}
          </div>
          <div class="font-medium text-slate-900 dark:text-white text-right">
            {{ props.purchase.status }}
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <ReviewModal
      v-model:open="isOpen"
      :transaction-id="props.purchase.id"
      :name="props.purchase.sellerName"
      @success="handleReviewSuccess"
    />
  </article>
</template>
