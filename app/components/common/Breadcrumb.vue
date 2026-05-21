<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
}

const props = defineProps<Props>()

const visibleItems = computed(() =>
  props.items.filter(item => item.label.trim().length > 0))
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3">
    <nav :aria-label="$t('common.breadcrumb_label')">
      <ol class="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <li
          v-for="(item, idx) in visibleItems"
          :key="idx"
          class="flex items-center gap-2"
        >
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="hover:text-gray-900 dark:hover:text-gray-300"
          >
            {{ item.label }}
          </NuxtLink>
          <span
            v-else
            :aria-current="idx === visibleItems.length - 1 ? 'page' : undefined"
            class="text-gray-900 dark:text-gray-100 font-medium"
          >
            {{ item.label }}
          </span>
          <span
            v-if="idx < visibleItems.length - 1"
            aria-hidden="true"
            class="text-gray-400"
          >/</span>
        </li>
      </ol>
    </nav>
  </div>
</template>
