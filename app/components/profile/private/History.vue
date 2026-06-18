<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHistory } from '~/composables/useHistory'
import type { Purchase, MySaleAdvert } from '~/services/historyService'
import PurchaseCard from '~/components/me/PurchaseCard.vue'
import SaleCard from '~/components/me/SaleCard.vue'
import TransactionModals from '~/components/me/TransactionModals.vue'
import { useTransactionActions } from '~/composables/useTransactionActions'

const { getPurchases, getSales } = useHistory()
const {
  activeModal,
  disputeReason,
  isProcessing,
  actionError,
  promptAction,
  closeModal,
  executeAction
} = useTransactionActions()

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

const refreshData = async () => {
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
}

const promptTransactionAction = (
  action: 'confirm_shipping' | 'accept_service' | 'refuse_service' | 'mark_rendered',
  transactionId?: number
) => {
  if (transactionId == null) return
  promptAction(action, String(transactionId))
}

onMounted(refreshData)
</script>

<template>
  <div class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">
        {{ $t('profile.history.title') }}
      </h2>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-slate-200 dark:border-slate-800 mb-4">
      <button
        type="button"
        class="px-4 py-2 text-xs font-bold transition-colors duration-200 border-b-2 -mb-px uppercase tracking-wider"
        :class="activeTab === 'purchases'
          ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
          : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'"
        @click="activeTab = 'purchases'"
      >
        {{ $t('profile.history.purchases') }}
      </button>
      <button
        type="button"
        class="px-4 py-2 text-xs font-bold transition-colors duration-200 border-b-2 -mb-px uppercase tracking-wider"
        :class="activeTab === 'sales'
          ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
          : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'"
        @click="activeTab = 'sales'"
      >
        {{ $t('profile.history.sales') }}
      </button>
    </div>

    <!-- Content -->
    <div
      v-if="isLoading"
      class="flex justify-center py-8"
    >
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <div v-if="activeTab === 'purchases'">
        <div
          v-if="lastPurchases.length > 0"
          class="grid gap-3"
        >
          <PurchaseCard
            v-for="purchase in lastPurchases"
            :key="purchase.id"
            :purchase="purchase"
            @confirm-reception="promptAction('confirm_reception', $event)"
            @dispute="promptAction('dispute', $event)"
            @cancel="promptAction('cancel', $event)"
          />
        </div>
        <div
          v-else
          class="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800"
        >
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ $t('profile.history.no_purchases') }}
          </p>
        </div>
      </div>

      <div v-else-if="activeTab === 'sales'">
        <div
          v-if="lastSales.length > 0"
          class="grid gap-3"
        >
          <SaleCard
            v-for="sale in lastSales"
            :key="`${sale.id}-${sale.transactionId ?? 0}`"
            :sale="sale"
            @confirm-shipping="promptTransactionAction('confirm_shipping', $event)"
            @accept-service="promptTransactionAction('accept_service', $event)"
            @refuse-service="promptTransactionAction('refuse_service', $event)"
            @mark-rendered="promptTransactionAction('mark_rendered', $event)"
            @renew="promptAction('renew', String($event))"
          />
        </div>
        <div
          v-else
          class="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800"
        >
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ $t('profile.history.no_sales') }}
          </p>
        </div>
      </div>
    </div>

    <TransactionModals
      v-model:dispute-reason="disputeReason"
      :active-modal="activeModal"
      :is-processing="isProcessing"
      :action-error="actionError"
      @cancel="closeModal"
      @confirm="() => executeAction(refreshData)"
    />
  </div>
</template>
