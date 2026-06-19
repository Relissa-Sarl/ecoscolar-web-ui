<script setup lang="ts">
import { formatPrice } from '~/utils/formatPrice'

defineProps<{
  orderNumber: string | null
  totalAmount: number | null
}>()
</script>

<template>
  <!-- Order ID -->
  <div
    v-if="orderNumber"
    class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800"
  >
    <span class="flex justify-between text-slate-500 dark:text-slate-400">{{ $t('cart.success.order_number') }}</span>
    <span
      class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate max-w-[180px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
      :title="orderNumber"
    >
      {{ orderNumber }}
    </span>
  </div>

  <!-- Total Price -->
  <div
    v-if="totalAmount !== null"
    class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800"
  >
    <span class="flex justify-between text-slate-500 dark:text-slate-400">{{ $t('cart.success.amount_paid') }}</span>
    <span class="text-sm font-bold text-slate-800 dark:text-slate-200">
      {{ formatPrice(totalAmount) }} CHF
    </span>
  </div>

  <!-- Status -->
  <div class="flex justify-between text-slate-500 dark:text-slate-400">
    <span>{{ $t('cart.success.status') }}</span>
    <span class="font-bold text-emerald-600 dark:text-emerald-400">
      {{ $t('cart.success.confirmed') }}
    </span>
  </div>
</template>
