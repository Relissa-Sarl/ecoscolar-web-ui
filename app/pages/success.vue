<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useLocalePath, useSeoMeta } from '#imports'
import { useCartStore } from '~/stores/cartStore'
import SuccessIcon from '~/components/success/SuccessIcon.vue'
import SuccessMainMessage from '~/components/success/SuccessMainMessage.vue'
import SuccessInfos from '~/components/success/SuccessInfos.vue'
import SuccessButton from '~/components/success/SuccessButton.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const cartStore = useCartStore()

useSeoMeta({
  title: () => t('cart.success.title')
})

// Extract query parameters from Stripe redirect
const totalAmount = computed(() => {
  const tParam = route.query.total
  if (!tParam) return null
  const val = Array.isArray(tParam) ? tParam[0] : tParam
  if (!val) return null
  const num = parseFloat(val)
  return isNaN(num) ? null : num
})

const orderId = computed(() => {
  const oParam = route.query.orderId
  if (!oParam) return null
  const val = Array.isArray(oParam) ? oParam[0] : oParam
  return val || null
})

// Clear the cart when the user lands on the success page
onMounted(async () => {
  try {
    await cartStore.clearCart()
  } catch (err) {
    console.error('Failed to clear cart after successful payment:', err)
  }
})
</script>

<template>
  <div class="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex items-center justify-center">
    <div class="max-w-md w-full text-center space-y-8">
      
      <!-- Success Icon Animation -->
      <SuccessIcon />

      <!-- Main Messages -->
      <SuccessMainMessage />

      <!-- Success Paiment Informations -->
      <div class="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/70 backdrop-blur-md shadow-sm space-y-4 text-left">
        <SuccessInfos :totalAmount="totalAmount" :orderId="orderId" />
      </div>
      
        <!-- Action Buttons -->
        <SuccessButton />
    </div>
  </div>
</template>

<style scoped>
.stroke-dash-draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.2s;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
