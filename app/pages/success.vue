<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useSeoMeta } from '#imports'
import { useCartStore } from '~/stores/cartStore'
import { getAdvertService } from '~/services/advertService'
import { getHistoryService } from '~/services/historyService'
import SuccessIcon from '../components/paymentState/SuccessIcon.vue'
import SuccessMainMessage from '../components/paymentState/SuccessMainMessage.vue'
import SuccessInfos from '../components/paymentState/SuccessInfos.vue'
import SuccessButton from '../components/paymentState/PaimentStateButton.vue'

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

const productIds = computed<number[]>(() => {
  const pParam = route.query.productIds
  if (!pParam) return []
  const val = Array.isArray(pParam) ? pParam[0] : pParam
  if (!val) return []
  return val.split(',').map(Number).filter(n => !isNaN(n))
})

// Clear the cart when the user lands on the success page and retrive the price information
onMounted(async () => {
  const storedTotal = sessionStorage.getItem('last_payment_total')
  if (storedTotal) {
    totalAmount.value = parseFloat(storedTotal)
    sessionStorage.removeItem('last_payment_total')
  }

  // Create transactions and update status to SOLD
  const ids = productIds.value.length > 0
    ? productIds.value
    : (() => {
        const pParam = route.query.productId
        const val = Array.isArray(pParam) ? pParam[0] : pParam
        const singleId = val ? Number(val) : null
        return singleId ? [singleId] : []
      })()

  if (ids.length > 0) {
    try {
      const historyService = getHistoryService()
      const created = await historyService.createTransactions(ids, stripeSessionId.value)
      displayedOrderNumber.value = created?.[0]?.orderNumber ?? null
    } catch (err) {
      console.error('Failed to create transactions, falling back to manual status update:', err)
      // Fallback: update status to SOLD manually
      const advertService = getAdvertService()
      for (const id of ids) {
        try {
          await advertService.updateAdvertStatus(id, 'SOLD')
        } catch (updateErr) {
          console.error(`Failed to update status to SOLD for advert ${id}:`, updateErr)
        }
      }
    }
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
