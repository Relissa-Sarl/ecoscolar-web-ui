<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useLocalePath } from '#imports'
import {
  bookCategoryMatches,
  tutoringGradeMatches,
  tutoringSubjectMatches
} from '~/utils/catalogFilterUtils'
import type {
  AdvertCatalogApiItem,
  CatalogCategoryTab,
  CatalogFetchResult,
  CatalogListing
} from '@/types/catalog'

import catalogFallbackJson from '@/mocks/catalogSummaries.json'
import { getCatalogService } from '~/services/catalogService'
import { mapCatalogApiToListings } from '~/utils/catalogMappers'
import { useSearchAlertsStore } from '~/stores/searchAlertsStore'
import { hasSearchCriteria } from '~/types/searchAlert'

const route = useRoute()

definePageMeta({ layout: 'catalog' })

const toast = useToast()
const searchAlertsStore = useSearchAlertsStore()
const isSavingAlert = ref(false)

const catalogFallback = catalogFallbackJson as AdvertCatalogApiItem[]
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('catalog.seo_title')
})

const catalogService = getCatalogService()
const appliedSearch = ref('')

const currentSearchCriteria = computed(() => ({
  q: appliedSearch.value.trim() || undefined
}))

const canSaveSearchAlert = computed(() =>
  hasSearchCriteria(currentSearchCriteria.value))

async function saveSearchAlert() {
  if (!canSaveSearchAlert.value || isSavingAlert.value) return
  isSavingAlert.value = true
  try {
    await searchAlertsStore.createAlert(currentSearchCriteria.value)
    toast.add({ title: t('searchAlerts.saved'), color: 'success' })
  } catch {
    toast.add({ title: t('searchAlerts.save_error'), color: 'error' })
  } finally {
    isSavingAlert.value = false
  }
}

const { data: rawItems, pending } = await useAsyncData(
  'catalog-adverts',
  async (): Promise<CatalogFetchResult> => {
    const params = appliedSearch.value
      ? { q: appliedSearch.value }
      : undefined

    try {
      const rows = await catalogService.listSummaries(params)
      return { items: rows, fromFallback: false, hadError: false }
    } catch {
      return { items: catalogFallback, fromFallback: true, hadError: true }
    }
  },
  { watch: [appliedSearch] }
)

const hadApiError = computed(() => rawItems.value?.hadError === true)
const fromFallbackOnly = computed(() =>
  rawItems.value?.fromFallback === true && !hadApiError.value)

const listings = computed((): CatalogListing[] =>
  mapCatalogApiToListings(rawItems.value?.items ?? []))

const activeCategory = ref<CatalogCategoryTab>('all')

const sortKey = ref<'recent' | 'price_asc' | 'price_desc'>('recent')
const draftSearch = ref('')
const searchLoading = computed(() => pending.value)

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

const pageSize = ref(9)
const currentPage = ref(1)

function applySearchFromRouteQuery() {
  const q = route.query.q
  if (typeof q === 'string' && q.trim()) {
    draftSearch.value = q.trim()
    appliedSearch.value = q.trim()
    currentPage.value = 1
  }
}

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

onMounted(async () => {
  applySearchFromRouteQuery()
  await loadCatalogReferences()
})

const filtered = computed(() => {
  let rows = [...listings.value]

  const shouldApplyLocalSearch
    = rawItems.value?.fromFallback === true || hadApiError.value
  const normalizedSearch = appliedSearch.value.trim().toLowerCase()
  if (shouldApplyLocalSearch && normalizedSearch) {
    rows = rows.filter(row => row.title.toLowerCase().includes(normalizedSearch))
  }

  if (activeCategory.value !== 'all') {
    rows = rows.filter(row => row.categoryTab === activeCategory.value)
  }

  rows = rows.filter(row => bookCategoryMatches(bookCategoryIds.value, bookCategoriesRef.value, row))
  rows = rows.filter(row => tutoringGradeMatches(schoolGradeIds.value, schoolGradesRef.value, row))
  rows = rows.filter(row => tutoringSubjectMatches(subjectIds.value, subjectsRef.value, row))

  if (sortKey.value === 'price_asc')
    rows.sort((a, b) => a.price - b.price)
  else if (sortKey.value === 'price_desc')
    rows.sort((a, b) => b.price - a.price)

  return rows
})

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch(filtered, () => {
  if (currentPage.value > pageCount.value)
    currentPage.value = pageCount.value
})

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
            v-if="canSaveSearchAlert"
            class="flex justify-end"
          >
            <button
              type="button"
              class="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
              :disabled="isSavingAlert"
              @click="saveSearchAlert"
            >
              {{ isSavingAlert ? $t('searchAlerts.saving') : $t('searchAlerts.save') }}
            </button>
          </div>

          <div class="rounded-3xl border border-emerald-200/60 bg-emerald-50 px-5 py-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
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
            <template v-else>
              {{ $t('catalog.banner.online') }}
            </template>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
                {{ $t('catalog.list.title') }}
              </h1>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ $t('catalog.list.subtitle_near', { count: filtered.length, zip: '1001' }) }}
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
