<script setup lang="ts">
const props = withDefaults(defineProps<{
  rating: number
  maxRating?: number
  count?: number
  showText?: boolean
}>(), {
  maxRating: 5,
  showText: true
})
</script>

<template>
  <div class="flex items-center gap-1">
    <div class="flex items-center text-amber-500">
      <UIcon
        v-for="i in props.maxRating"
        :key="i"
        :name="i <= Math.round(props.rating) ? 'i-material-symbols-star' : 'i-material-symbols-star-outline'"
        class="w-5 h-5 shrink-0"
      />
    </div>
    <span
      v-if="props.showText"
      class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-2"
    >
      {{ props.rating.toFixed(1) }} <span
        v-if="props.count !== undefined"
        class="text-slate-400"
      >({{ props.count }})</span>
    </span>
  </div>
</template>
