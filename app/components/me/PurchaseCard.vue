<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports'
import type { Purchase } from '~/services/historyService'

const props = defineProps<{
  purchase: Purchase
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()

const emit = defineEmits<{
  (e: 'confirm-reception', id: string): void
  (e: 'dispute', id: string): void
  (e: 'cancel', id: string): void
}>()

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.2"
          stroke="currentColor"
          class="w-8 h-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
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
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
          <span>{{ t('me.purchases.seller_label') }} :</span>
          <span class="font-semibold text-slate-700 dark:text-slate-300">{{ props.purchase.sellerName }}</span>
        </p>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <span class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
          {{ props.purchase.price }} CHF
        </span>
        <div class="flex gap-2">
          <button
            v-if="props.purchase.status === 'PAID_WAITING_SHIPPING'"
            @click="emit('cancel', props.purchase.id)"
            class="inline-flex items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 py-1.5 px-3 text-xs font-semibold transition-colors"
          >
            Annuler la commande
          </button>
          
          <button
            v-if="props.purchase.status === 'SHIPPED'"
            @click="emit('dispute', props.purchase.id)"
            class="inline-flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 py-1.5 px-3 text-xs font-semibold transition-colors"
          >
            Signaler un problème
          </button>
          
          <button
            v-if="props.purchase.status === 'SHIPPED'"
            @click="emit('confirm-reception', props.purchase.id)"
            class="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-semibold transition-colors"
          >
            Confirmer la réception
          </button>

          <NuxtLink
            :to="localePath(`/adverts/${props.purchase.advertId}`)"
            class="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 py-1.5 px-3 text-xs font-semibold transition-colors"
          >
            {{ t('me.purchases.view_advert') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
