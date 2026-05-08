<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
  productTitle: string
  category: string
}

defineProps<Props>()
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3">
    <nav class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink to="/" class="hover:text-gray-900 dark:hover:text-gray-300">Shop</NuxtLink>
      <span>/</span>
      <span>{{ category }}</span>
      <span>/</span>
      <span class="text-gray-900 dark:text-gray-100 font-medium">{{ productTitle }}</span>
    </nav>
  </div>
</template>
