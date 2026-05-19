<script setup lang="ts">
interface Props {
  page: number
  pageCount: number
}

defineProps<Props>()
const emit = defineEmits<{ 'update:page': [number] }>()
</script>

<template>
  <nav
    v-if="pageCount > 1"
    class="mt-12 flex flex-wrap justify-center gap-2"
    :aria-label="$t('catalog.pagination.label')"
  >
    <button
      v-for="n in pageCount"
      :key="n"
      type="button"
      class="flex size-11 items-center justify-center rounded-full border text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      :class="n === page
        ? 'border-emerald-800 bg-emerald-900 text-white dark:border-emerald-500 dark:bg-emerald-700'
        : 'border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
      @click="emit('update:page', n)"
    >
      {{ n }}
    </button>
  </nav>
</template>
