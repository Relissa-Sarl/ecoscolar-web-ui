<script setup lang="ts">
import type { CatalogCategoryTab, GradeFilterState, SubjectFilterState } from '@/types/catalog'

const grades = defineModel<GradeFilterState>('grades', { required: true })
const subjects = defineModel<SubjectFilterState>('subjects', { required: true })
const activeCategory = defineModel<CatalogCategoryTab>('activeCategory', { required: true })

defineEmits<{
  reset: []
}>()
</script>

<template>
  <aside class="sticky top-4 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <header>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">
        {{ $t('catalog.filters.title') }}
      </h2>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {{ $t('catalog.filters.subtitle') }}
      </p>
    </header>

    <fieldset class="space-y-3">
      <legend class="sr-only">
        {{ $t('catalog.filters.category_legend') }}
      </legend>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        :class="activeCategory === 'supplies'
          ? 'border-emerald-700 bg-emerald-800 text-white shadow-md dark:border-emerald-500'
          : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white'"
        @click="activeCategory = 'supplies'"
      >
        <span aria-hidden="true">📦</span>
        {{ $t('catalog.filters.category_supplies') }}
      </button>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        :class="activeCategory === 'textbooks'
          ? 'border-emerald-700 bg-emerald-800 text-white shadow-md dark:border-emerald-500'
          : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white'"
        @click="activeCategory = 'textbooks'"
      >
        <span aria-hidden="true">📚</span>
        {{ $t('catalog.filters.category_textbooks') }}
      </button>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        :class="activeCategory === 'tutoring'
          ? 'border-emerald-700 bg-emerald-800 text-white shadow-md dark:border-emerald-500'
          : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white'"
        @click="activeCategory = 'tutoring'"
      >
        <span aria-hidden="true">🎓</span>
        {{ $t('catalog.filters.category_tutoring') }}
      </button>
      <button
        type="button"
        class="mt-2 w-full rounded-xl border border-dashed border-emerald-300 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
        @click="activeCategory = 'all'"
      >
        {{ $t('catalog.filters.show_all') }}
      </button>
    </fieldset>

    <div class="border-t border-slate-100 pt-4 dark:border-slate-800">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {{ $t('catalog.filters.grade_heading') }}
      </p>
      <ul class="mt-3 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <li>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="grades.primary"
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            >
            {{ $t('catalog.filters.grade_primary') }}
          </label>
        </li>
        <li>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="grades.secondary"
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            >
            {{ $t('catalog.filters.grade_secondary') }}
          </label>
        </li>
        <li>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="grades.maturite"
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            >
            {{ $t('catalog.filters.grade_maturity') }}
          </label>
        </li>
        <li>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="grades.superieur"
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            >
            {{ $t('catalog.filters.grade_university') }}
          </label>
        </li>
      </ul>
    </div>

    <div class="border-t border-slate-100 pt-4 dark:border-slate-800">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {{ $t('catalog.filters.subject_heading') }}
      </p>
      <ul class="mt-3 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <li>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="subjects.math"
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            >
            {{ $t('catalog.filters.subject_math') }}
          </label>
        </li>
        <li>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="subjects.french"
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            >
            {{ $t('catalog.filters.subject_french') }}
          </label>
        </li>
        <li>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="subjects.german"
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            >
            {{ $t('catalog.filters.subject_german') }}
          </label>
        </li>
      </ul>
    </div>

    <button
      type="button"
      class="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
      @click="$emit('reset')"
    >
      {{ $t('catalog.filters.reset') }}
    </button>
  </aside>
</template>
