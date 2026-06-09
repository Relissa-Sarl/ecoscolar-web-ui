<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useSeoMeta } from '#imports'
import { useCartStore } from '~/stores/cartStore'
import { getAdvertService } from '~/services/advertService'
import SuccessIcon from '~/components/paimentState/SuccessIcon.vue'
import SuccessMainMessage from '~/components/paimentState/SuccessMainMessage.vue'
import SuccessInfos from '~/components/paimentState/SuccessInfos.vue'
import SuccessButton from '~/components/paimentState/PaimentStateButton.vue'

const { t } = useI18n()
const route = useRoute()
const cartStore = useCartStore()

useSeoMeta({
  title: () => t('cart.success.title')
})

const totalAmount = ref<number | null>(null)

const productId = computed(() => {
  const pParam = route.query.productId
  if (!pParam) return null
  const val = Array.isArray(pParam) ? pParam[0] : pParam
  return val ? Number(val) : null
})

const productIds = computed<number[]>(() => {
  const pParam = route.query.productIds
  if (!pParam) return []
  const val = Array.isArray(pParam) ? pParam[0] : pParam
  if (!val) return []
  return val.split(',').map(Number).filter(n => !isNaN(n))
})

const orderId = computed(() => {
  const oParam = route.query.orderId
  if (!oParam) return null
  const val = Array.isArray(oParam) ? oParam[0] : oParam
  return val || null
})

const productId = computed(() => {
  const pParam = route.query.productId
  if (!pParam) return null
  const val = Array.isArray(pParam) ? pParam[0] : pParam
  return val ? Number(val) : null
})

// Clear the cart when the user lands on the success page and retrive the price information
onMounted(async () => {
  const storedTotal = sessionStorage.getItem('last_payment_total')
  if (storedTotal) {
    totalAmount.value = parseFloat(storedTotal)
    sessionStorage.removeItem('last_payment_total')
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
      <SuccessMainMessage :order-id="orderId" />

      <!-- Success Paiment Informations -->
      <div class="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/70 backdrop-blur-md shadow-sm space-y-4 text-left">
        <SuccessInfos
          :total-amount="totalAmount"
          :order-id="orderId"
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
