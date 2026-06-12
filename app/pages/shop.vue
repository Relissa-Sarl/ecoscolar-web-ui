<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useLocalePath } from '#imports'
import type {
  AdvertCatalogApiItem,
  CatalogCategoryTab,
  CatalogFetchResult,
  CatalogListing
} from '@/types/catalog'

import catalogFallbackJson from '@/mocks/catalogSummaries.json'
import { getCatalogService, type CatalogSearchParams } from '~/services/catalogService'
import { mapCatalogApiToListings } from '~/utils/catalogMappers'
import { AdvertType } from '~/utils/enum/advertType'

const route = useRoute()

definePageMeta({ layout: 'catalog' })

const catalogFallback = catalogFallbackJson as AdvertCatalogApiItem[]
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('catalog.seo_title')
})

const catalogService = getCatalogService()

const activeCategory = ref<CatalogCategoryTab>('all')
const sortKey = ref<'recent' | 'price_asc' | 'price_desc'>('recent')
const draftSearch = ref('')
const appliedSearch = ref('')

const pageSize = ref(9)
const currentPage = ref(1)

const {
  bookCategories: bookCategoriesRef,
  schoolGrades: schoolGradesRef,
  subjects: subjectsRef,
  isLoading: referencesLoading,
  loadError: referencesError,
  load: loadCatalogReferences
} = useCatalogReferenceData()

const bookCategoryIds = ref<number[]>([])
const schoolGradeIds = ref<number[]>([])
const subjectIds = ref<number[]>([])

const selectedBookCategoryNames = computed(() =>
  selectedNames(bookCategoriesRef.value, bookCategoryIds.value, item => item.bookCategoryId))
const selectedSchoolGradeNames = computed(() =>
  selectedNames(schoolGradesRef.value, schoolGradeIds.value, item => item.schoolGradeId))
const selectedSubjectNames = computed(() =>
  selectedNames(subjectsRef.value, subjectIds.value, item => item.subjectId))

const catalogQueryParams = computed<CatalogSearchParams>(() => {
  const params: CatalogSearchParams = {
    page: currentPage.value,
    pageSize: pageSize.value,
    sort: sortKey.value
  }

  const q = appliedSearch.value.trim()
  if (q)
    params.q = q

  const type = categoryToApiType(activeCategory.value)
  if (type)
    params.type = type

  const category = toCsv(selectedBookCategoryNames.value)
  if (category)
    params.category = category

  const grade = toCsv(selectedSchoolGradeNames.value)
  if (grade)
    params.grade = grade

  const subjects = toCsv(selectedSubjectNames.value)
  if (subjects)
    params.subjects = subjects

  return params
})

const { data: rawItems, pending } = await useAsyncData(
  'catalog-adverts',
  async (): Promise<CatalogFetchResult> => {
    const params = catalogQueryParams.value

    try {
      const page = await catalogService.listSummaries(params)
      return { ...page, fromFallback: false, hadError: false }
    } catch {
      return buildFallbackPage(params)
    }
  },
  { watch: [catalogQueryParams] }
)

const hadApiError = computed(() => rawItems.value?.hadError === true)
const fromFallbackOnly = computed(() =>
  rawItems.value?.fromFallback === true && !hadApiError.value)

const listings = computed((): CatalogListing[] =>
  mapCatalogApiToListings(rawItems.value?.items ?? []))

const totalItems = computed(() => rawItems.value?.totalItems ?? 0)
const pageCount = computed(() => Math.max(1, rawItems.value?.totalPages ?? 1))
const pagedRows = computed(() => listings.value)
const searchLoading = computed(() => pending.value)

const canResetFilters = computed(() =>
  activeCategory.value !== 'all'
  || draftSearch.value.trim() !== ''
  || appliedSearch.value.trim() !== ''
  || bookCategoryIds.value.length > 0
  || schoolGradeIds.value.length > 0
  || subjectIds.value.length > 0
  || sortKey.value !== 'recent')

onMounted(async () => {
  applySearchFromRouteQuery()
  await loadCatalogReferences()
})

function applySearchFromBanner() {
  appliedSearch.value = draftSearch.value.trim()
}

function runSearchFromBanner() {
  applySearchFromBanner()
  currentPage.value = 1
}

function resetSidebar() {
  activeCategory.value = 'all'
  draftSearch.value = ''
  appliedSearch.value = ''
  bookCategoryIds.value = []
  schoolGradeIds.value = []
  subjectIds.value = []
  sortKey.value = 'recent'
  currentPage.value = 1
}

function applySearchFromRouteQuery() {
  const q = route.query.q
  if (typeof q === 'string' && q.trim()) {
    draftSearch.value = q.trim()
    appliedSearch.value = q.trim()
    currentPage.value = 1
  }
}

function categoryToApiType(tab: CatalogCategoryTab): AdvertType | undefined {
  switch (tab) {
    case 'textbooks':
      return AdvertType.BOOK
    case 'supplies':
      return AdvertType.PRODUCT
    case 'tutoring':
      return AdvertType.SERVICE
    default:
      return undefined
  }
}

function selectedNames<T extends { name: string }>(
  items: T[],
  selectedIds: number[],
  getId: (item: T) => number
): string[] {
  return selectedIds
    .map(id => items.find(item => getId(item) === id)?.name)
    .filter((name): name is string => Boolean(name))
}

function toCsv(values: string[]): string | undefined {
  return values.length > 0 ? values.join(',') : undefined
}

function splitCsv(value?: string): string[] {
  return value
    ?.split(',')
    .map(term => term.trim().toLowerCase())
    .filter(Boolean) ?? []
}

function buildFallbackPage(params: CatalogSearchParams): CatalogFetchResult {
  let rows = [...catalogFallback]

  const q = params.q?.trim().toLowerCase()
  if (q) {
    const normalizedIsbnQuery = q.replace(/-/g, '')
    rows = rows.filter(row =>
      row.title.toLowerCase().includes(q)
      || (row.isbn?.toLowerCase().replace(/-/g, '').includes(normalizedIsbnQuery) ?? false))
  }

  if (params.type)
    rows = rows.filter(row => row.type === params.type)

  const categories = splitCsv(params.category)
  if (categories.length > 0)
    rows = rows.filter(row => row.category != null && categories.includes(row.category.toLowerCase()))

  const grades = splitCsv(params.grade)
  if (grades.length > 0)
    rows = rows.filter(row => row.grade != null && grades.includes(row.grade.toLowerCase()))

  const subjects = splitCsv(params.subjects)
  if (subjects.length > 0)
    rows = rows.filter(row => row.subjects != null && subjects.includes(row.subjects.toLowerCase()))

  if (params.sort === 'price_asc')
    rows.sort((a, b) => a.price - b.price)
  else if (params.sort === 'price_desc')
    rows.sort((a, b) => b.price - a.price)

  const size = Math.max(1, params.pageSize ?? pageSize.value)
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / size))
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages)
  const start = (page - 1) * size

  return {
    items: rows.slice(start, start + size),
    page,
    pageSize: size,
    totalItems: total,
    totalPages,
    fromFallback: true,
    hadError: true
  }
}

watch(
  () => rawItems.value?.page,
  (page) => {
    if (page != null && page !== currentPage.value)
      currentPage.value = page
  }
)

watch(activeCategory, (tab) => {
  currentPage.value = 1
  if (tab !== 'textbooks')
    bookCategoryIds.value = []
  if (tab !== 'tutoring') {
    schoolGradeIds.value = []
    subjectIds.value = []
  }
})

watch(bookCategoryIds, () => {
  currentPage.value = 1
}, { deep: true })
watch(schoolGradeIds, () => {
  currentPage.value = 1
}, { deep: true })
watch(subjectIds, () => {
  currentPage.value = 1
}, { deep: true })
watch(sortKey, () => {
  currentPage.value = 1
})

watch(
  () => route.query.q,
  () => {
    applySearchFromRouteQuery()
  }
)
</script>

<template>
  <div class="relative min-h-screen w-full max-w-none bg-transparent pb-28">
    <section class="w-full max-w-none py-2 md:py-4">
      <div
        class="grid w-full gap-8 lg:grid-cols-[minmax(240px,18rem)_1fr] lg:gap-10 xl:gap-12"
      >
        <CatalogFiltersPanel
          v-model:active-category="activeCategory"
          v-model:book-category-ids="bookCategoryIds"
          v-model:school-grade-ids="schoolGradeIds"
          v-model:subject-ids="subjectIds"
          :book-categories="bookCategoriesRef"
          :school-grades="schoolGradesRef"
          :subjects="subjectsRef"
          :can-reset-filters="canResetFilters"
          :references-loading="referencesLoading"
          :references-error="referencesError"
          class="hidden lg:block"
          @reset="resetSidebar()"
        />

        <div class="min-w-0 space-y-8">
          <div class="lg:hidden">
            <details class="group rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <summary class="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">
                {{ $t('catalog.filters.mobile_toggle') }}
              </summary>
              <div class="mt-4 pt-2">
                <CatalogFiltersPanel
                  v-model:active-category="activeCategory"
                  v-model:book-category-ids="bookCategoryIds"
                  v-model:school-grade-ids="schoolGradeIds"
                  v-model:subject-ids="subjectIds"
                  :book-categories="bookCategoriesRef"
                  :school-grades="schoolGradesRef"
                  :subjects="subjectsRef"
                  :can-reset-filters="canResetFilters"
                  :references-loading="referencesLoading"
                  :references-error="referencesError"
                  @reset="resetSidebar()"
                />
              </div>
            </details>
          </div>

          <CatalogSearchBanner
            v-model="draftSearch"
            :loading="searchLoading"
            @search="runSearchFromBanner()"
          />

          <div
            v-if="hadApiError || pending || fromFallbackOnly"
            class="rounded-3xl border border-emerald-200/60 bg-emerald-50 px-5 py-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/30"
          >
            <p
              v-if="hadApiError"
              class="font-medium text-amber-900 dark:text-amber-200"
            >
              {{ $t('catalog.banner.api_error_retry') }}
            </p>
            <p
              v-else-if="pending"
              class="text-emerald-900 dark:text-emerald-200"
            >
              {{ $t('catalog.banner.loading') }}
            </p>
            <p
              v-else-if="fromFallbackOnly"
              class="text-emerald-900 dark:text-emerald-200"
            >
              {{ $t('catalog.banner.fallback_demo') }}
            </p>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
                {{ $t('catalog.list.title') }}
              </h1>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ $t('catalog.list.subtitle_near', { count: totalItems }) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <label
                for="catalog-sort"
                class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
              >{{ $t('catalog.sort.label') }}</label>
              <select
                id="catalog-sort"
                v-model="sortKey"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="recent">
                  {{ $t('catalog.sort.recent') }}
                </option>
                <option value="price_asc">
                  {{ $t('catalog.sort.price_asc') }}
                </option>
                <option value="price_desc">
                  {{ $t('catalog.sort.price_desc') }}
                </option>
              </select>
            </div>
          </div>

          <div
            v-if="!pending && pagedRows.length === 0"
            class="rounded-3xl border border-dashed border-slate-300 bg-white px-10 py-16 text-center dark:border-slate-700 dark:bg-slate-900"
          >
            <p class="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {{ $t('catalog.empty.title') }}
            </p>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {{ $t('catalog.empty.hint') }}
            </p>
            <button
              type="button"
              class="mt-8 inline-flex rounded-full bg-emerald-800 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              @click="resetSidebar()"
            >
              {{ $t('catalog.empty.reset_filters') }}
            </button>
          </div>

          <div class="grid w-full gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))]">
            <CatalogListingCard
              v-for="row in pagedRows"
              :key="row.id"
              :listing="row"
            />
          </div>

          <CatalogPagination
            v-model:page="currentPage"
            :page-count="pageCount"
          />
        </div>
      </div>
    </section>

    <NuxtLink
      :to="localePath('/adverts/create-advert')"
      class="fixed bottom-8 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-emerald-900 text-2xl text-white shadow-xl ring-2 ring-white/30 transition hover:scale-[1.06] hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 md:right-10"
      :aria-label="$t('catalog.fab.place_advert')"
    >
      +
    </NuxtLink>
  </div>
</template>
