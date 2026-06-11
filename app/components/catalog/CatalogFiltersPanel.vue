<script setup lang="ts">
import { computed } from 'vue'
import type { CatalogCategoryTab } from '@/types/catalog'
import type { BookCategory, SchoolGrade, Subject } from '@/types/advertDetail'
import { localizedRefLabel, toggleSelectedId } from '~/utils/catalogFilterUtils'

interface Props {
  bookCategories: BookCategory[]
  schoolGrades: SchoolGrade[]
  subjects: Subject[]
  canResetFilters?: boolean
  referencesLoading?: boolean
  referencesError?: boolean
}

withDefaults(defineProps<Props>(), {
  canResetFilters: false,
  referencesLoading: false,
  referencesError: false
})

const activeCategory = defineModel<CatalogCategoryTab>('activeCategory', { required: true })
const bookCategoryIds = defineModel<number[]>('bookCategoryIds', { required: true })
const schoolGradeIds = defineModel<number[]>('schoolGradeIds', { required: true })
const subjectIds = defineModel<number[]>('subjectIds', { required: true })

defineEmits<{ reset: [] }>()

const { locale } = useI18n()

const showBookCategories = computed(() => activeCategory.value === 'textbooks')
const showTutoringFilters = computed(() => activeCategory.value === 'tutoring')
const showSuppliesHint = computed(() => activeCategory.value === 'supplies')
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

    <fieldset
      class="space-y-3"
      role="radiogroup"
    >
      <legend class="sr-only">
        {{ $t('catalog.filters.category_legend') }}
      </legend>
      <button
        type="button"
        role="radio"
        :aria-checked="activeCategory === 'supplies'"
        class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        :class="activeCategory === 'supplies'
          ? 'border-emerald-700 bg-emerald-800 text-white shadow-md dark:border-emerald-500'
          : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white'"
        @click="activeCategory = 'supplies'"
      >
        <svg
          class="size-5 shrink-0"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        {{ $t('catalog.filters.category_supplies') }}
      </button>
      <button
        type="button"
        role="radio"
        :aria-checked="activeCategory === 'textbooks'"
        class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        :class="activeCategory === 'textbooks'
          ? 'border-emerald-700 bg-emerald-800 text-white shadow-md dark:border-emerald-500'
          : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white'"
        @click="activeCategory = 'textbooks'"
      >
        <svg
          class="size-5 shrink-0"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
        {{ $t('catalog.filters.category_textbooks') }}
      </button>
      <button
        type="button"
        role="radio"
        :aria-checked="activeCategory === 'tutoring'"
        class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        :class="activeCategory === 'tutoring'
          ? 'border-emerald-700 bg-emerald-800 text-white shadow-md dark:border-emerald-500'
          : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white'"
        @click="activeCategory = 'tutoring'"
      >
        <svg
          class="size-5 shrink-0"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
          />
        </svg>
        {{ $t('catalog.filters.category_tutoring') }}
      </button>
      <button
        v-if="canResetFilters"
        type="button"
        class="mt-2 w-full rounded-xl border border-dashed border-emerald-300 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
        @click="$emit('reset')"
      >
        {{ $t('catalog.filters.reset') }}
      </button>
    </fieldset>

    <p
      v-if="referencesError"
      class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
    >
      {{ $t('catalog.filters.references_load_error') }}
    </p>

    <p
      v-else-if="referencesLoading"
      class="text-sm text-slate-500 dark:text-slate-400"
    >
      {{ $t('catalog.filters.references_loading') }}
    </p>

    <div
      v-if="showBookCategories && !referencesLoading && !referencesError"
      class="border-t border-slate-100 pt-4 dark:border-slate-800"
    >
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {{ $t('catalog.filters.book_category_heading') }}
      </p>
      <ul class="mt-3 max-h-56 space-y-2 overflow-y-auto text-sm font-medium text-slate-700 dark:text-slate-300">
        <li
          v-for="cat in bookCategories"
          :key="cat.bookCategoryId"
        >
          <label class="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              :checked="bookCategoryIds.includes(cat.bookCategoryId)"
              @change="bookCategoryIds = toggleSelectedId(
                bookCategoryIds,
                cat.bookCategoryId,
                ($event.target as HTMLInputElement).checked
              )"
            >
            {{ localizedRefLabel(cat, locale) }}
          </label>
        </li>
      </ul>
    </div>

    <template v-if="showTutoringFilters && !referencesLoading && !referencesError">
      <div class="border-t border-slate-100 pt-4 dark:border-slate-800">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ $t('catalog.filters.grade_heading') }}
        </p>
        <ul class="mt-3 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <li
            v-for="grade in schoolGrades"
            :key="grade.schoolGradeId"
          >
            <label class="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                :checked="schoolGradeIds.includes(grade.schoolGradeId)"
                @change="schoolGradeIds = toggleSelectedId(
                  schoolGradeIds,
                  grade.schoolGradeId,
                  ($event.target as HTMLInputElement).checked
                )"
              >
              {{ localizedRefLabel(grade, locale) }}
            </label>
          </li>
        </ul>
      </div>

      <div class="border-t border-slate-100 pt-4 dark:border-slate-800">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ $t('catalog.filters.subject_heading') }}
        </p>
        <ul class="mt-3 max-h-56 space-y-2 overflow-y-auto text-sm font-medium text-slate-700 dark:text-slate-300">
          <li
            v-for="subject in subjects"
            :key="subject.subjectId"
          >
            <label class="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                class="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                :checked="subjectIds.includes(subject.subjectId)"
                @change="subjectIds = toggleSelectedId(
                  subjectIds,
                  subject.subjectId,
                  ($event.target as HTMLInputElement).checked
                )"
              >
              {{ localizedRefLabel(subject, locale) }}
            </label>
          </li>
        </ul>
      </div>
    </template>

    <p
      v-if="showSuppliesHint"
      class="border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400"
    >
      {{ $t('catalog.filters.supplies_no_subfilters') }}
    </p>
  </aside>
</template>
