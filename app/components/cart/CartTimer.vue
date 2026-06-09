<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '#imports'

const { t } = useI18n()

const props = defineProps<{
  targetDate: string
}>()

const timeLeft = ref('')
const isExpired = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const calculateTimeLeft = () => {
  const target = new Date(props.targetDate).getTime()
  const now = new Date().getTime()
  const diff = target - now

  if (diff <= 0) {
    timeLeft.value = 'Expiré'
    isExpired.value = true
    if (interval) clearInterval(interval)
    return
  }

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  timeLeft.value = `${minutes}m ${seconds}s`
}

onMounted(() => {
  calculateTimeLeft()
  interval = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div
    class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide"
    :class="isExpired ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'"
  >
    <UIcon
      name="i-mdi-clock-outline"
      class="h-3.5 w-3.5"
    />
    <span>
      <template v-if="isExpired">
        {{ t('cart.timer.expired') }}
      </template>
      <template v-else>
        {{ t('cart.timer.reserved', { time: timeLeft }) }}
      </template>
    </span>
  </div>
</template>
