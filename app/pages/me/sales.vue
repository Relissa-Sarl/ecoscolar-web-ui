<script setup lang="ts">
import { useI18n, useAsyncData, useLocalePath } from '#imports'
import { useHistory } from '~/composables/useHistory'
import SaleCard from '~/components/me/SaleCard.vue'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const { getSales } = useHistory()

const { data: sales, pending, error, refresh } = await useAsyncData(
  'user-sales',
  () => getSales()
)

const handleConfirmShipping = async (transactionId: number) => {
  if (!confirm("Avez-vous vraiment expédié l'article ?")) return
  try {
    const { getHistoryService } = await import('~/services/historyService')
    await getHistoryService().confirmShipping(transactionId.toString())
    alert("Le statut a été mis à jour : Expédié.")
    refresh()
  } catch (e: any) {
    alert("Erreur: " + e.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Back Navigation -->
      <NuxtLink
        :to="localePath('/me/profile')"
        class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mb-6 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-4 h-4 transition-transform group-hover:-translate-x-1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        {{ t('common.back_to_home') }}
      </NuxtLink>

      <!-- Page Header -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {{ t('me.sales.title') }}
        </h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {{ t('me.sales.subtitle') }}
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="pending"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mb-4" />
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {{ t('me.sales.loading') }}
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-16 px-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 text-red-500 mx-auto mb-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <p class="text-red-800 dark:text-red-300 font-semibold text-lg">
          {{ t('me.sales.error') }}
        </p>
        <p class="text-red-600 dark:text-red-400 text-sm mt-1">
          {{ t('me.sales.error_detail') }}
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!sales || sales.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 px-6 text-center"
      >
        <div class="p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-10 h-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ t('me.sales.empty_title') }}
        </h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          {{ t('me.sales.empty_placeholder') }}
        </p>
        <NuxtLink
          :to="localePath('/sell')"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          {{ t('me.sales.sell_cta') }}
        </NuxtLink>
      </div>

      <!-- Sales List -->
      <div
        v-else
        class="grid gap-6 sm:grid-cols-1 md:grid-cols-2"
      >
        <SaleCard
          v-for="sale in sales"
          :key="sale.id"
          :sale="sale"
          @confirm-shipping="handleConfirmShipping"
        />
      </div>
    </div>
  </div>
</template>
