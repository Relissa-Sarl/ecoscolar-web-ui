<script setup lang="ts">
defineProps<{
  itemsCount: number
  hasItems: boolean
}>()

defineEmits<{
  (e: 'clear'): void
}>()
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
    <div>
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
        {{ $t('cart.title') }}
      </h1>
    </div>
    <div
      v-if="hasItems"
      class="mt-4 sm:mt-0 flex items-center gap-3"
    >
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
        {{ itemsCount }} {{ itemsCount > 1 ? $t('cart.many_adverts') : $t('cart.one_advert') }}
      </span>
      <button
        class="text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 cursor-pointer"
        @click="$emit('clear')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        {{ $t('cart.clear') }}
      </button>
    </div>
  </div>
</template>
