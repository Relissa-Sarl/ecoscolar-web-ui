<script setup lang="ts">
interface Props {
  description: string
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ title || 'Book Description' }}</h2>
    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>
