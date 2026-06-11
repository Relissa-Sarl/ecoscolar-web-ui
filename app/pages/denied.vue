<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useSeoMeta } from '#imports'
import { getAdvertService } from '~/services/advertService'
import ErrorIcon from '~/components/paimentState/ErrorIcon.vue'
import ErrorMainMessage from '~/components/paimentState/ErrorMainMessage.vue'
import PaimentStateButton from '~/components/paimentState/PaimentStateButton.vue'

const { t } = useI18n()
const route = useRoute()

useSeoMeta({
  title: () => t('cart.denied.title')
})

const productIds = computed<number[]>(() => {
  const pParam = route.query.productIds
  if (!pParam) return []
  const val = Array.isArray(pParam) ? pParam[0] : pParam
  if (!val) return []
  return val.split(',').map(Number).filter(n => !isNaN(n))
})

onMounted(async () => {
  const ids = productIds.value
  if (ids.length > 0) {
    const advertService = getAdvertService()
    for (const id of ids) {
      try {
        await advertService.updateAdvertStatus(id, 'ACTIVE')
      } catch (err) {
        console.error(`Failed to revert status for advert ${id}:`, err)
      }
    }
  } else {
    // Fallback to single productId
    const pParam = route.query.productId
    const val = Array.isArray(pParam) ? pParam[0] : pParam
    const singleId = val ? Number(val) : null
    if (singleId) {
      try {
        const advertService = getAdvertService()
        await advertService.updateAdvertStatus(singleId, 'ACTIVE')
      } catch (err) {
        console.error(`Failed to revert status for advert ${singleId}:`, err)
      }
    }
  }
})
</script>

<template>
  <div class="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex items-center justify-center">
    <div class="max-w-md w-full text-center space-y-8">
      <!-- Error Icon Animation -->
      <ErrorIcon />

      <!-- Main Messages -->
      <ErrorMainMessage />

      <!-- Action Buttons -->
      <PaimentStateButton />
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
