<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  page: number
  pageCount: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
const emit = defineEmits<{ 'update:page': [number] }>()

type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right'

const visiblePages = computed<PaginationItem[]>(() => {
  if (props.pageCount <= 7)
    return Array.from({ length: props.pageCount }, (_, index) => index + 1)

  const pages = new Set<number>([
    1,
    props.pageCount,
    props.page - 1,
    props.page,
    props.page + 1
  ])

  const boundedPages = [...pages]
    .filter(page => page >= 1 && page <= props.pageCount)
    .sort((a, b) => a - b)

  const items: PaginationItem[] = []
  for (const page of boundedPages) {
    const previous = items[items.length - 1]
    if (typeof previous === 'number' && page - previous > 1) {
      items.push(previous === 1 ? 'ellipsis-left' : 'ellipsis-right')
    }
    items.push(page)
  }

  return items
})

function updatePage(page: number) {
  if (props.disabled || page === props.page || page < 1 || page > props.pageCount)
    return

  emit('update:page', page)
}
</script>

<template>
  <nav
    v-if="pageCount > 1"
    class="mt-12 flex flex-wrap justify-center gap-2"
    :aria-label="$t('catalog.pagination.label')"
  >
    <button
      type="button"
      class="flex h-11 min-w-11 items-center justify-center rounded-full border border-transparent px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-45 dark:text-slate-300 dark:hover:bg-slate-800"
      :disabled="disabled || page <= 1"
      :aria-label="$t('catalog.pagination.previous')"
      @click="updatePage(page - 1)"
    >
      {{ $t('catalog.pagination.previous_short') }}
    </button>

    <template
      v-for="item in visiblePages"
      :key="item"
    >
      <span
        v-if="typeof item === 'string'"
        class="flex size-11 items-center justify-center text-sm font-semibold text-slate-400"
        aria-hidden="true"
      >
        ...
      </span>
      <button
        v-else
        type="button"
        class="flex size-11 items-center justify-center rounded-full border text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-60"
        :class="item === page
          ? 'border-emerald-800 bg-emerald-900 text-white dark:border-emerald-500 dark:bg-emerald-700'
          : 'border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
        :disabled="disabled || item === page"
        :aria-current="item === page ? 'page' : undefined"
        @click="updatePage(item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      class="flex h-11 min-w-11 items-center justify-center rounded-full border border-transparent px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-45 dark:text-slate-300 dark:hover:bg-slate-800"
      :disabled="disabled || page >= pageCount"
      :aria-label="$t('catalog.pagination.next')"
      @click="updatePage(page + 1)"
    >
      {{ $t('catalog.pagination.next_short') }}
    </button>
  </nav>
</template>
