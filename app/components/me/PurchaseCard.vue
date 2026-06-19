<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n, useLocalePath, refreshNuxtData, useToast } from '#imports'
import type { Purchase, TutorContact } from '~/services/historyService'
import { getHistoryService } from '~/services/historyService'
import { formatPrice } from '~/utils/formatPrice'
import Stars from '~/components/profile/Stars.vue'
import ReviewModal from '~/components/me/ReviewModal.vue'

const props = defineProps<{
  purchase: Purchase
}>()

const { locale, t, te } = useI18n()
const localePath = useLocalePath()
const toast = useToast()

const statusLabel = (status: string) => {
  const key = `profile.history.status.${status.toLowerCase()}`
  return te(key) ? t(key) : status
}

const emit = defineEmits<{
  'confirm-reception': [id: string]
  'confirm-service': [id: string]
  'dispute': [id: string]
  'cancel': [id: string]
}>()

const isOpen = ref(false)
const localReview = ref(props.purchase.review)
const tutorContact = ref<TutorContact | null>(null)
const isLoadingContact = ref(false)

watch(() => props.purchase.review, (newReview) => {
  localReview.value = newReview
})

const isCompleted = computed(() => {
  const normalized = props.purchase.status.toLowerCase()
  return normalized === 'completed' || normalized === 'succ\u00e8s' || normalized === 'pay\u00e9'
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
  if (normalized === 'completed' || normalized === 'succ\u00e8s' || normalized === 'pay\u00e9') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
  }
  if (normalized === 'paid_waiting_acceptance' || normalized === 'paid_waiting_completion' || normalized === 'pending' || normalized === 'en cours') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
  }
  if (normalized === 'cancelled') {
    return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/50'
  }
  return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800'
}

const showDetails = ref(false)

const handleReviewSuccess = (review: { rating: number, comment: string | null }) => {
  localReview.value = review
  refreshNuxtData('user-purchases')
}

const loadTutorContact = async () => {
  if (tutorContact.value) return
  isLoadingContact.value = true
  try {
    tutorContact.value = await getHistoryService().getTutorContact(props.purchase.id)
  } catch (e: unknown) {
    toast.add({
      title: t('me.purchases.alerts.error', { message: e instanceof Error ? e.message : String(e) }),
      color: 'error'
    })
  } finally {
    isLoadingContact.value = false
  }
}
</script>

<template>
  <article class="flex gap-3 p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md">
    <div class="h-20 w-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0 border border-slate-100 dark:border-slate-800">
      <img
        v-if="props.purchase.imageUrl"
        :src="props.purchase.imageUrl"
        :alt="props.purchase.advertTitle"
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

    <div class="flex flex-col min-w-0 flex-1 justify-between">
      <div>
        <div class="flex items-start justify-between gap-2">
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
            :class="getStatusBadgeClass(props.purchase.status)"
          >
            {{ statusLabel(props.purchase.status) }}
          </span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            {{ formatDate(props.purchase.purchaseDate) }}
          </span>
        </div>
        <h3 class="mt-1 text-sm font-bold text-slate-900 dark:text-white leading-snug truncate">
          {{ props.purchase.advertTitle }}
        </h3>
        <div class="mt-1 space-y-0.5">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>{{ t('me.purchases.seller_label') }} :</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300">{{ props.purchase.sellerName }}</span>
            </p>
            <Stars
              v-if="localReview"
              :rating="localReview.rating"
              :show-text="false"
              class="scale-75 origin-left"
            />
          </div>
          <p
            v-if="props.purchase.orderNumber"
            class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1"
          >
            <span>{{ t('me.purchases.order_number_label') }} :</span>
            <span class="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[10px]">{{ props.purchase.orderNumber }}</span>
          </p>
        </div>
      </div>

      <div
        v-if="props.purchase.status === 'PAID_WAITING_ACCEPTANCE'"
        class="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium"
      >
        <UIcon
          name="i-heroicons-clock"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.purchases.alerts.service_waiting_acceptance') }}
        </p>
      </div>

      <div
        v-if="props.purchase.status === 'PAID_WAITING_COMPLETION'"
        class="mt-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-2.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
      >
        <p class="leading-relaxed">
          {{ t('me.purchases.alerts.service_confirmed') }}
        </p>
        <div
          v-if="tutorContact"
          class="mt-2 space-y-1 text-slate-700 dark:text-slate-300"
        >
          <p><span class="font-semibold">{{ tutorContact.name }}</span></p>
          <p v-if="tutorContact.phoneNumber">
            {{ tutorContact.phoneNumber }}
          </p>
          <p v-if="tutorContact.email">
            {{ tutorContact.email }}
          </p>
        </div>
      </div>

      <div
        v-if="props.purchase.status === 'CANCELLED' && props.purchase.type === 'SERVICE'"
        class="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-400 font-medium"
      >
        <UIcon
          name="i-heroicons-x-circle"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.purchases.alerts.service_refused') }}
        </p>
      </div>

      <div
        v-if="props.purchase.status === 'DISPUTED'"
        class="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-400 font-medium"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.purchases.alerts.dispute_ongoing') }}
        </p>
      </div>

      <!-- Bannière statut service réservé -->
      <div
        v-if="props.purchase.type === 'SERVICE' && props.purchase.status === 'SERVICE_RESERVED'"
        class="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium"
      >
        <UIcon
          name="i-heroicons-clock"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.purchases.alerts.service_awaiting_tutor') }}
          <span
            v-if="props.purchase.sessions"
            class="block mt-0.5 font-normal text-amber-600 dark:text-amber-500"
          >{{ t('me.purchases.alerts.service_sessions', { n: props.purchase.sessions }) }}</span>
        </p>
      </div>

      <!-- Bannière service confirmé par le tuteur -->
      <div
        v-if="props.purchase.type === 'SERVICE' && props.purchase.status === 'SERVICE_CONFIRMED'"
        class="mt-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
      >
        <UIcon
          name="i-heroicons-check-circle"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.purchases.alerts.service_confirmed_by_tutor') }}
        </p>
      </div>

      <!-- Bannière service refusé par le tuteur -->
      <div
        v-if="props.purchase.type === 'SERVICE' && props.purchase.status === 'SERVICE_REFUSED'"
        class="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-400 font-medium"
      >
        <UIcon
          name="i-heroicons-x-circle"
          class="w-4 h-4 shrink-0 mt-0.5"
        />
        <p class="leading-relaxed">
          {{ t('me.purchases.alerts.service_refused_by_tutor') }}
        </p>
      </div>

      <div class="mt-2 flex items-center justify-between gap-4">
        <span class="text-base font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
          {{ formatPrice(props.purchase.price) }} CHF
        </span>
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-if="props.purchase.status === 'PAID_WAITING_SHIPPING'"
            class="inline-flex items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('cancel', props.purchase.id)"
          >
            {{ t('me.purchases.actions.cancel') }}
          </button>

          <button
            v-if="props.purchase.status === 'SHIPPED' || props.purchase.status === 'PAID_WAITING_COMPLETION'"
            class="inline-flex items-center justify-center rounded-lg border border-orange-100 text-orange-600 hover:bg-orange-50 py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('dispute', props.purchase.id)"
          >
            {{ t('me.purchases.actions.dispute') }}
          </button>

          <button
            v-if="props.purchase.status === 'SHIPPED'"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('confirm-reception', props.purchase.id)"
          >
            {{ t('me.purchases.actions.confirm_reception') }}
          </button>

          <button
            v-if="props.purchase.status === 'PAID_WAITING_COMPLETION'"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 text-[10px] font-bold transition-colors"
            @click="emit('confirm-service', props.purchase.id)"
          >
            {{ t('me.purchases.actions.confirm_service') }}
          </button>

          <button
            v-if="props.purchase.status === 'PAID_WAITING_COMPLETION'"
            class="inline-flex items-center justify-center rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 py-1 px-2 text-[10px] font-bold transition-colors"
            :disabled="isLoadingContact"
            @click="loadTutorContact"
          >
            {{ t('me.purchases.actions.tutor_contact') }}
          </button>

          <button
            v-if="isCompleted && !localReview"
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 py-1 px-2 text-[10px] font-bold transition-colors cursor-pointer"
            @click="isOpen = true"
          >
            {{ t('me.purchases.leave_review') }}
          </button>

          <button
            v-if="props.purchase.status === 'COMPLETED' || props.purchase.status === 'CANCELLED'"
            class="inline-flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 py-1 px-2 text-[10px] font-bold transition-colors"
            :aria-expanded="showDetails"
            @click="showDetails = !showDetails"
          >
            {{ t('me.purchases.actions.details') }}
          </button>

          <NuxtLink
            v-else-if="props.purchase.status !== 'COMPLETED' && props.purchase.status !== 'CANCELLED'"
            :to="localePath(`/adverts/${props.purchase.advertId}`)"
            class="inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 py-1 px-2 text-[10px] font-bold transition-colors"
          >
            {{ t('me.purchases.view_advert') }}
          </NuxtLink>
        </div>
      </div>

      <div
        v-if="showDetails"
        class="mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3 text-xs space-y-1"
      >
        <h4 class="font-bold text-slate-900 dark:text-white">
          {{ t('me.purchases.details.title') }}
        </h4>
        <p class="text-slate-600 dark:text-slate-400">
          <span class="font-semibold">{{ t('me.purchases.details.item') }} :</span>
          {{ props.purchase.advertTitle }}
        </p>
        <p class="text-slate-600 dark:text-slate-400">
          <span class="font-semibold">{{ t('me.purchases.details.price') }} :</span>
          {{ formatPrice(props.purchase.price) }} CHF
        </p>
        <p class="text-slate-600 dark:text-slate-400">
          <span class="font-semibold">{{ t('me.purchases.details.date') }} :</span>
          {{ formatDate(props.purchase.purchaseDate) }}
        </p>
        <p class="text-slate-600 dark:text-slate-400">
          <span class="font-semibold">{{ t('me.purchases.details.status') }} :</span>
          {{ statusLabel(props.purchase.status) }}
        </p>
      </div>
    </div>

    <ReviewModal
      v-model:open="isOpen"
      :transaction-id="props.purchase.id"
      :name="props.purchase.sellerName"
      @success="handleReviewSuccess"
    />
  </article>
</template>
