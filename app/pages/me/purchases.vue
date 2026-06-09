<script setup lang="ts">
import { useI18n, useAsyncData, useLocalePath, useRouter } from '#imports'
import { useHistory } from '~/composables/useHistory'
import PurchaseCard from '~/components/me/PurchaseCard.vue'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()

const { t } = useI18n()
const localePath = useLocalePath()
const { getPurchases } = useHistory()

const { data: purchases, pending, error, refresh } = await useAsyncData(
  'user-purchases',
  () => getPurchases()
)

const activeTab = ref<'ongoing' | 'past'>('ongoing')

const filteredPurchases = computed(() => {
  if (!purchases.value) return []
  if (activeTab.value === 'ongoing') {
    return purchases.value.filter(p => p.status !== 'COMPLETED' && p.status !== 'CANCELLED')
  } else {
    return purchases.value.filter(p => p.status === 'COMPLETED' || p.status === 'CANCELLED')
  }
})

const handleConfirmReception = async (id: string) => {
  if (!confirm(t('me.purchases.alerts.confirm_reception_prompt'))) return
  try {
    const { getHistoryService } = await import('~/services/historyService')
    await getHistoryService().confirmReception(id)
    alert(t('me.purchases.alerts.reception_success'))
    refresh()
  } catch (e: unknown) {
    alert(t('me.purchases.alerts.error', { message: e instanceof Error ? e.message : String(e) }))
  }
}

const handleDispute = async (id: string) => {
  if (!confirm(t('me.purchases.alerts.dispute_prompt'))) return
  try {
    const { getHistoryService } = await import('~/services/historyService')
    await getHistoryService().disputePurchase(id)
    alert(t('me.purchases.alerts.dispute_success'))
    refresh()
  } catch (e: unknown) {
    alert(t('me.purchases.alerts.error', { message: e instanceof Error ? e.message : String(e) }))
  }
}

const handleCancel = async (id: string) => {
  if (!confirm(t('me.purchases.alerts.cancel_prompt'))) return
  try {
    const { getHistoryService } = await import('~/services/historyService')
    await getHistoryService().cancelPurchase(id)
    alert(t('me.purchases.alerts.cancel_success'))
    refresh()
  } catch (e: unknown) {
    alert(t('me.purchases.alerts.error', { message: e instanceof Error ? e.message : String(e) }))
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Back Navigation -->
      <button
        class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mb-6 group"
        @click="router.back()"
      >
        <UIcon
          name="i-mdi-arrow-left"
          class="w-4 h-4 transition-transform group-hover:-translate-x-1"
        />
        {{ t('common.back_previous') }}
      </button>

      <!-- Page Header -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {{ t('me.purchases.title') }}
        </h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {{ t('me.purchases.subtitle') }}
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          class="pb-2 text-sm font-semibold transition-colors relative"
          :class="activeTab === 'ongoing' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'"
          @click="activeTab = 'ongoing'"
        >
          {{ t('me.purchases.tabs.ongoing') }}
          <span
            v-if="activeTab === 'ongoing'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full"
          />
        </button>
        <button
          class="pb-2 text-sm font-semibold transition-colors relative"
          :class="activeTab === 'past' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'"
          @click="activeTab = 'past'"
        >
          {{ t('me.purchases.tabs.past') }}
          <span
            v-if="activeTab === 'past'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full"
          />
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="pending"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mb-4" />
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {{ t('me.purchases.loading') }}
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-16 px-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl"
      >
        <UIcon
          name="i-mdi-alert-circle-outline"
          class="w-12 h-12 text-red-500 mx-auto mb-4"
        />
        <p class="text-red-800 dark:text-red-300 font-semibold text-lg">
          {{ t('me.purchases.error') }}
        </p>
        <p class="text-red-600 dark:text-red-400 text-sm mt-1">
          {{ t('me.purchases.error_detail') }}
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredPurchases.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 px-6 text-center"
      >
        <div class="p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4">
          <UIcon
            name="i-mdi-cart-outline"
            class="w-10 h-10"
          />
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ t('me.purchases.empty_title') }}
        </h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          {{ t('me.purchases.empty_placeholder') }}
        </p>
        <NuxtLink
          :to="localePath('/shop')"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          {{ t('me.purchases.explore_cta') }}
        </NuxtLink>
      </div>

      <!-- Purchases List -->
      <div
        v-else
        class="grid gap-6 sm:grid-cols-1 md:grid-cols-2"
      >
        <PurchaseCard
          v-for="purchase in filteredPurchases"
          :key="purchase.id"
          :purchase="purchase"
          @confirm-reception="handleConfirmReception"
          @dispute="handleDispute"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
