<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useSeoMeta } from '#imports'
import { getAdvertService } from '~/services/advertService'
import ErrorIcon from '../components/paymentState/ErrorIcon.vue'

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
      <div class="space-y-3">
        <h1 class="text-3xl font-black bg-linear-to-r from-red-600 to-rose-500 bg-clip-text text-transparent dark:from-red-400 dark:to-rose-300">
          {{ $t('cart.banned.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-2">
          {{ $t('cart.banned.subtitle') }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          :to="$localePath('/support')"
          class="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all cursor-pointer text-sm"
        >
          {{ $t('cart.banned.support_contact') }}
        </NuxtLink>
      </div>
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
