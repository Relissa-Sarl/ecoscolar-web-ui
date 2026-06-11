<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n, useLocalePath, refreshNuxtData } from '#imports'
import type { MySaleAdvert } from '~/services/historyService'
import { AdvertStatus } from '~/utils/enum/advertStatus'
import Stars from '~/components/profile/Stars.vue'
import ReviewModal from '~/components/me/ReviewModal.vue'

const props = defineProps<{
  sale: MySaleAdvert
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()

const emit = defineEmits<{
  (e: 'confirm-shipping', id: number): void
}>()

const isOpen = ref(false)
const localReview = ref(props.sale.review)

watch(() => props.sale.review, (newReview) => {
  localReview.value = newReview
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

const getStatusText = (status: AdvertStatus) => {
  if (status === AdvertStatus.ACTIVE) return t('me.sales.status.active')
  if (status === AdvertStatus.SOLD) return t('me.sales.status.sold')
  if (status === AdvertStatus.PAUSED) return t('me.sales.status.paused')
  if (status === AdvertStatus.EXPIRED) return t('me.sales.status.expired')
  return status
}

const getStatusBadgeClass = (status: AdvertStatus) => {
  if (status === AdvertStatus.ACTIVE) {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
  }
  if (status === AdvertStatus.SOLD) {
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  }
  if (status === AdvertStatus.PAUSED) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
  }
  if (status === AdvertStatus.EXPIRED) {
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
  }
  return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800'
}
const handleReviewSuccess = (review: { rating: number, comment: string | null }) => {
  localReview.value = review
  refreshNuxtData('user-sales')
}
</script>

<template>
  <article class="flex gap-3 p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md">
    <!-- Thumbnail -->
    <div class="h-20 w-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0 border border-slate-100 dark:border-slate-800">
      <img
        v-if="props.sale.primaryImage"
        :src="props.sale.primaryImage"
        :alt="props.sale.title"
        class="h-full w-full object-cover"
      >
      <div
        v-else
        class="h-full w-full flex items-center justify-center text-slate-300 dark:text-slate-700 bg-slate-50 dark:bg-slate-900"
      >
        <UIcon
          name="i-heroicons-book-open"
          class="w-6 h-6"
        />
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col min-w-0 flex-1 justify-between">
      <div>
        <div class="flex items-start justify-between gap-2">
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
            :class="getStatusBadgeClass(props.sale.status)"
          >
            {{ getStatusText(props.sale.status) }}
          </span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            {{ formatDate(props.sale.publicationDate) }}
          </span>
        </div>

        <h3 class="mt-1 text-sm font-bold text-slate-900 dark:text-white leading-snug truncate">
          {{ props.sale.title }}
        </h3>

        <!-- Buyer details if SOLD -->
        <div
          v-if="props.sale.status === AdvertStatus.SOLD && props.sale.buyerName"
          class="flex items-center gap-2 mt-0.5 flex-wrap"
        >
          <p
            class="text-[10px] flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md w-max"
          >
            <UIcon
              name="i-heroicons-user"
              class="w-3 h-3"
            />
            <span>{{ t('me.sales.buyer_label') }} :</span>
            <span class="font-bold">{{ props.sale.buyerName }}</span>
          </p>
          <Stars
            v-if="localReview"
            :rating="localReview.rating"
            :show-text="false"
            class="scale-75 origin-left"
          />
        </div>
      </div>

      <div class="mt-2 flex items-center justify-between gap-4">
        <span class="text-base font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
          {{ props.sale.price }} CHF<span
            v-if="props.sale.type === 'SERVICE'"
            class="text-[10px] font-semibold text-slate-400"
          >/H</span>
        </span>

        <div class="flex items-center gap-1.5">
          <!-- Actions -->
          <button
            v-if="props.sale.status === AdvertStatus.SOLD && !localReview"
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 py-1 px-2 text-[10px] font-bold transition-colors cursor-pointer"
            @click="isOpen = true"
          >
            {{ t('me.purchases.leave_review') }}
          </button>
          <NuxtLink
            :to="localePath(`/adverts/${props.sale.id}`)"
            class="inline-flex items-center justify-center rounded-lg border border-slate-100 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 py-1 px-2 text-[10px] font-bold transition-colors"
          >
            {{ t('me.sales.view') }}
          </NuxtLink>

          <button
            v-if="props.sale.transactionStatus === 'PAID_WAITING_SHIPPING'"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('confirm-shipping', props.sale.transactionId!)"
          >
            {{ t('me.sales.actions.confirm_shipping') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <ReviewModal
      v-model:open="isOpen"
      :transaction-id="props.sale.id.toString()"
      :name="props.sale.buyerName"
      @success="handleReviewSuccess"
    />
  </article>
</template>
