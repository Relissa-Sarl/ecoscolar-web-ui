<script setup lang="ts">
import type { Condition } from '@/types/advert'

interface Props {
  conditions: Condition[]
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
    <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
      {{ title || 'Condition Details' }}
    </h2>
    <div class="space-y-3">
      <div
        v-for="(condition, idx) in conditions"
        :key="idx"
        class="flex items-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-green-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ condition.text }}</span>
      </div>
    </div>
  </div>
</template>
