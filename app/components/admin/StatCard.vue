<script setup lang="ts">
defineProps<{
  title: string
  value: string
  icon?: string
  trend?: string
  trendColor?: 'green' | 'red'
}>()
</script>

<template>
  <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm px-4 py-10 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100">
    <p class="text-xs text-gray-500 uppercase font-semibold">
      {{ title }}
    </p>
    <div class="flex items-end justify-between mt-2">
      <h2 class="text-3xl font-bold">
        {{ value }}
      </h2>
      <Icon
        v-if="icon"
        :name="icon"
        class="text-gray-400 text-xl"
      />
    </div>
    <p
      v-if="trend"
      :class="`text-${trendColor === 'green' ? 'emerald' : 'red'}-600 text-sm mt-2 font-medium`"
    >
      {{ trend }}
    </p>
  </div>
</template>
