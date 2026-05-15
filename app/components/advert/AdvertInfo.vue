<script setup lang="ts">
interface Props {
  condition: string
  featured: boolean
  title: string
  authors: string
  price: number
  oldPrice: number
}

defineProps<Props>()
</script>

<template>
  <div>
    <!-- Tags -->
    <div class="flex gap-2 mb-4">
      <UBadge
        color="primary"
        variant="soft"
      >
        {{ condition }}
      </UBadge>
      <UBadge
        v-if="featured"
        color="success"
        variant="soft"
      >
        FEATURED
      </UBadge>
    </div>

    <!-- Title -->
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h1>

    <!-- Authors -->
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      {{ authors }}
    </p>

    <!-- Price -->
    <div class="mb-6">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
        Current Price
      </p>
      <div class="flex items-baseline gap-3">
        <span class="text-4xl font-bold text-gray-900 dark:text-white">${{ price.toFixed(2) }}</span>
        <span class="text-lg text-gray-500 line-through">${{ oldPrice.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>
