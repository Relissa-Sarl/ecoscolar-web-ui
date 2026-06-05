<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports'
import type { MySaleAdvert } from '~/services/historyService'
import { AdvertStatus } from '~/utils/enum/advertStatus'

const props = defineProps<{
  sale: MySaleAdvert
}>()

const { locale } = useI18n()
const localePath = useLocalePath()

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
  if (status === AdvertStatus.ACTIVE) return 'En vente'
  if (status === AdvertStatus.SOLD) return 'Vendu'
  if (status === AdvertStatus.PAUSED) return 'En pause'
  if (status === AdvertStatus.EXPIRED) return 'Expiré'
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

const canModify = (status: AdvertStatus) => {
  return status === AdvertStatus.ACTIVE || status === AdvertStatus.PAUSED
}
</script>

<template>
  <article class="flex gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <!-- Thumbnail -->
    <div class="h-28 w-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50 dark:border-slate-800/50">
      <img
        v-if="props.sale.primaryImage"
        :src="props.sale.primaryImage"
        :alt="props.sale.title"
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
            :class="getStatusBadgeClass(props.sale.status)"
          >
            {{ getStatusText(props.sale.status) }}
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            {{ formatDate(props.sale.publicationDate) }}
          </span>
        </div>

        <h3 class="mt-2 text-base font-bold text-slate-950 dark:text-white leading-snug truncate">
          {{ props.sale.title }}
        </h3>

        <!-- Buyer details if SOLD -->
        <p
          v-if="props.sale.status === AdvertStatus.SOLD && props.sale.buyerName"
          class="text-xs mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg w-max"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-3.5 h-3.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span>Acheté par :</span>
          <span class="font-bold">{{ props.sale.buyerName }}</span>
        </p>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <span class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
          {{ props.sale.price }} CHF<span
            v-if="props.sale.type === 'SERVICE'"
            class="text-xs font-semibold text-slate-400"
          >/H</span>
        </span>

        <div class="flex gap-2">
          <!-- Actions -->
          <NuxtLink
            :to="localePath(`/adverts/${props.sale.id}`)"
            class="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 px-3 text-xs font-semibold transition-colors"
          >
            Voir
          </NuxtLink>
          <NuxtLink
            v-if="canModify(props.sale.status)"
            :to="localePath(`/adverts/modify-advert-${props.sale.id}`)"
            class="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 py-1.5 px-3 text-xs font-semibold transition-colors"
          >
            Modifier
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
