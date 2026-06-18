<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useSeoMeta } from '#imports'
import { useCartStore } from '~/stores/cartStore'
import { getPaymentService } from '~/services/paymentService'
import SuccessIcon from '../components/paymentState/SuccessIcon.vue'
import SuccessMainMessage from '../components/paymentState/SuccessMainMessage.vue'
import SuccessInfos from '../components/paymentState/SuccessInfos.vue'
import PaymentStateButton from '../components/paymentState/PaymentStateButton.vue'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const route = useRoute()
const cartStore = useCartStore()

useSeoMeta({
  title: () => t('cart.success.title')
})

const totalAmount = ref<number | null>(null)

const stripeSessionId = computed(() => {
  const value = route.query.stripeSessionId ?? route.query.orderId
  if (!value) return null
  const sessionId = Array.isArray(value) ? value[0] : value
  return sessionId || null
})

const displayedOrderNumber = ref<string | null>(null)

// Clear the cart when the user lands on the success page and retrive the price information
onMounted(async () => {
  sessionStorage.removeItem('pending_checkout_ids')

  if (stripeSessionId.value) {
    try {
      const paymentService = getPaymentService()
      const session = await paymentService.getSession(stripeSessionId.value)
      if (session && session.amountTotal !== null) {
        totalAmount.value = session.amountTotal / 100
      }
    } catch (err) {
      console.error('Failed to retrieve checkout session details:', err)
    }
  }

  if (route.query.orderId) {
    const val = route.query.orderId
    displayedOrderNumber.value = (Array.isArray(val) ? val[0] : val) ?? null
  }

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
      <SuccessMainMessage :order-number="displayedOrderNumber" />

      <!-- Success Paiment Informations -->
      <div class="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/70 backdrop-blur-md shadow-sm space-y-4 text-left">
        <SuccessInfos
          :total-amount="totalAmount"
          :order-number="displayedOrderNumber"
        />
      </div>

      <!-- Action Buttons -->
      <PaymentStateButton />
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
