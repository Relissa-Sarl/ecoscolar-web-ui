<script setup lang="ts">
defineProps<{
  subtotal: number
  shippingCost: number
  total: number
  loading?: boolean
}>()

defineEmits<{
  (e: 'checkout'): void
}>()

const shippingMethod = defineModel<'post' | 'handToHand'>({ default: 'post' })
</script>

<template>
  <div class="lg:col-span-1">
    <!-- Glassmorphism side card -->
    <div class="sticky top-6 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/70 backdrop-blur-md shadow-sm space-y-6">
      <h2 class="text-xl font-bold text-slate-850 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
        {{ $t('cart.checkout.title') }}
      </h2>

      <!-- Order breakdown list -->
      <div class="space-y-3.5 border-b border-slate-100 dark:border-slate-800 pb-5 text-sm">
        <div class="flex justify-between text-slate-500 dark:text-slate-400">
          <span>{{ $t('cart.checkout.subtotal') }}</span>
          <span class="font-semibold text-slate-800 dark:text-slate-200">{{ subtotal.toFixed(2) }} CHF</span>
        </div>

        <div class="flex justify-between text-slate-500 dark:text-slate-400">
          <span>{{ $t('cart.checkout.shipping') }}</span>
          <select
            v-model="shippingMethod"
            class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg px-2 py-1 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="post">
              {{ $t('cart.checkout.post') }}
            </option>
            <option value="handToHand">
              {{ $t('cart.checkout.hand-to-hand') }}
            </option>
          </select>
        </div>

        <div class="flex justify-between text-slate-500 dark:text-slate-400">
          <span>{{ $t('cart.checkout.shipping_fee') }}</span>
          <span
            v-if="shippingCost > 0"
            class="font-semibold text-slate-800 dark:text-slate-200"
          >
            {{ shippingCost.toFixed(2) }} CHF
          </span>
          <span
            v-else
            class="font-bold text-emerald-600 dark:text-emerald-400"
          >
            {{ $t('cart.checkout.free') }}
          </span>
        </div>
      </div>

      <!-- Grand Total -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-855">
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-base font-bold text-slate-850 dark:text-slate-100">{{ $t('cart.checkout.total') }}</span>
          <div class="text-right">
            <span class="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              {{ total.toFixed(2) }} CHF
            </span>
          </div>
        </div>
        <p class="text-[10px] text-slate-400 dark:text-slate-500 text-right">
          {{ $t('cart.tva') }}
        </p>
      </div>

      <!-- Checkout Button -->
      <button
        :disabled="loading"
        class="w-full bg-emerald-800 hover:bg-emerald-700 disabled:bg-emerald-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none flex items-center justify-center gap-2"
        @click="$emit('checkout')"
      >
        <span
          v-if="loading"
          class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
        {{ loading ? $t('cart.checkout.loading') : $t('cart.checkout.confirm') }}
      </button>

      <!-- Secure check banner -->
      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div class="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <span><strong>{{ $t('cart.text_under_resume.circular_trade') }}</strong> {{ $t('cart.text_under_resume.circular_text') }}</span>
        </div>
        <div class="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4.5 w-4.5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span><strong>{{ $t('cart.text_under_resume.payment_note') }}</strong> {{ $t('cart.text_under_resume.payment_text') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
