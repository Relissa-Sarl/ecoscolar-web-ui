<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>
      <template v-if="isExpired">
        Réservation expirée
      </template>
      <template v-else>
        Réservé ({{ timeLeft }})
      </template>
    </span>
  </div>
</template>
