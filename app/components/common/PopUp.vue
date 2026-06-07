<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  popUpType: 'info' | 'success' | 'warning' | 'error'
  show: boolean
  title: string
  description?: string
  duration?: number
}>()
const emit = defineEmits(['close'])
const typeClasses = computed(() => {
  switch (props.popUpType) {
    case 'info': return 'border-blue-400 bg-blue-50'
    case 'success': return 'border-green-400 bg-green-50'
    case 'warning': return 'border-yellow-400 bg-yellow-50'
    case 'error': return 'border-red-400 bg-red-50'
    default: return 'border-gray-400'
  }
})

watch(() => props.show, (newVal) => {
  if (newVal && props.duration) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-start justify-center p-4 pointer-events-none"
    >
      <div
        class="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border-t-4"
        :class="typeClasses"
      >
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ title }}
          </h3>
          <p
            v-if="description"
            class="text-gray-600 dark:text-gray-400 text-sm"
          >
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
