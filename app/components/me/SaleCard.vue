<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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
  (e: 'confirm-shipping' | 'renew' | 'accept-service' | 'refuse-service' | 'mark-rendered', id: number): void
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

const daysLeft = computed(() => {
  if (props.sale.status !== AdvertStatus.ACTIVE) return null
  return props.sale.expiresInDays ?? null
})
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

        <!-- Expiration Timer -->
        <div
          v-if="daysLeft !== null && daysLeft <= 7"
          class="flex items-center gap-1 mt-1 text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md w-max border border-orange-100 dark:border-orange-800/50"
        >
          <UIcon
            name="i-heroicons-clock"
            class="w-3 h-3"
          />
          <span v-if="daysLeft > 0">{{ t('me.sales.timer.expires_in', daysLeft) }}</span>
          <span v-else>{{ t('me.sales.timer.expires_today') }}</span>
        </div>

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

      <div
        v-if="props.sale.type === 'SERVICE' && props.sale.transactionStatus === 'PAID_WAITING_ACCEPTANCE'"
        class="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium"
      >
        <UIcon
          name="i-heroicons-clock"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.sales.alerts.service_waiting_acceptance') }}
        </p>
      </div>
      <div
        v-if="props.sale.transactionStatus === 'DISPUTED'"
        class="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-400 font-medium"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.sales.alerts.dispute_ongoing') }}
        </p>
      </div>

      <div class="mt-2 flex items-center justify-between gap-4">
        <span class="text-base font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
          {{ formatPrice(props.sale.price) }} CHF<span
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
            v-if="props.sale.type === 'SERVICE' && props.sale.transactionStatus === 'PAID_WAITING_ACCEPTANCE'"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('accept-service', props.sale.transactionId!)"
          >
            {{ t('me.sales.actions.accept_service') }}
          </button>
          <button
            v-if="props.sale.type === 'SERVICE' && props.sale.transactionStatus === 'PAID_WAITING_ACCEPTANCE'"
            class="inline-flex items-center justify-center rounded-lg border border-red-200 dark:border-red-800 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('refuse-service', props.sale.transactionId!)"
          >
            {{ t('me.sales.actions.refuse_service') }}
          </button>
          <button
            v-if="props.sale.type === 'SERVICE' && props.sale.transactionStatus === 'PAID_WAITING_COMPLETION'"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('mark-rendered', props.sale.transactionId!)"
          >
            {{ t('me.sales.actions.mark_rendered') }}
          </button>
          <button
            v-if="props.sale.transactionStatus === 'PAID_WAITING_SHIPPING'"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('confirm-shipping', props.sale.transactionId!)"
          >
            {{ t('me.sales.actions.confirm_shipping') }}
          </button>

          <button
            v-if="props.sale.status === AdvertStatus.EXPIRED || props.sale.status === AdvertStatus.ACTIVE"
            class="inline-flex items-center justify-center rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('renew', props.sale.id)"
          >
            {{ t('me.sales.actions.renew') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <ReviewModal
      v-model:open="isOpen"
      :transaction-id="props.sale.transactionId?.toString() ?? ''"
      :name="props.sale.buyerName"
      @success="handleReviewSuccess"
    />
  </article>
</template>
