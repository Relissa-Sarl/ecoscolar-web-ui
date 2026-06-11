<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHistory } from '~/composables/useHistory'
import type { Purchase, MySaleAdvert } from '~/services/historyService'
import PurchaseCard from '~/components/me/PurchaseCard.vue'
import SaleCard from '~/components/me/SaleCard.vue'

const { getPurchases, getSales } = useHistory()

const activeTab = ref<'purchases' | 'sales'>('purchases')
const purchases = ref<Purchase[]>([])
const sales = ref<MySaleAdvert[]>([])
const isLoading = ref(true)

const lastPurchases = computed(() => {
  return [...purchases.value]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 3)
})

const lastSales = computed(() => {
  return [...sales.value]
    .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime())
    .slice(0, 3)
})

onMounted(async () => {
  isLoading.value = true
  try {
    const [purchasesData, salesData] = await Promise.all([
      getPurchases(),
      getSales()
    ])
    purchases.value = purchasesData
    sales.value = salesData
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
        {{ $t('profile.history.title') }}
      </h2>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-slate-200 dark:border-slate-800">
      <button
        type="button"
        class="px-6 py-3 text-sm font-semibold transition-colors duration-200 border-b-2"
        :class="activeTab === 'purchases'
          ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'"
        @click="activeTab = 'purchases'"
      >
        {{ $t('profile.history.purchases') }}
      </button>
      <button
        type="button"
        class="px-6 py-3 text-sm font-semibold transition-colors duration-200 border-b-2"
        :class="activeTab === 'sales'
          ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'"
        @click="activeTab = 'sales'"
      >
        {{ $t('profile.history.sales') }}
      </button>
    </div>

    <!-- Content -->
    <div
      v-if="isLoading"
      class="flex justify-center py-12"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <div v-if="activeTab === 'purchases'">
        <div
          v-if="lastPurchases.length > 0"
          class="grid gap-4"
        >
          <PurchaseCard
            v-for="purchase in lastPurchases"
            :key="purchase.id"
            :purchase="purchase"
          />
        </div>
        <div
          v-else
          class="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800"
        >
          <p class="text-slate-500 dark:text-slate-400">
            {{ $t('profile.history.no_purchases') }}
          </p>
        </div>
      </div>

      <div v-else-if="activeTab === 'sales'">
        <div
          v-if="lastSales.length > 0"
          class="grid gap-4"
        >
          <SaleCard
            v-for="sale in lastSales"
            :key="sale.id"
            :sale="sale"
          />
        </div>
        <div
          v-else
          class="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800"
        >
          <p class="text-slate-500 dark:text-slate-400">
            {{ $t('profile.history.no_sales') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
