<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3">
    <nav class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
      <template
        v-for="(item, idx) in items"
        :key="idx"
      >
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-gray-900 dark:hover:text-gray-300"
        >{{ item.label }}</NuxtLink>
        <span
          v-else
          class="text-gray-900 dark:text-gray-100 font-medium"
        >{{ item.label }}</span>
        <span v-if="idx < items.length - 1">/</span>
      </template>
    </nav>
  </div>
</template>
