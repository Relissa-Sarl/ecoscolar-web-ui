<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocalePath, navigateTo, useI18n } from '#imports'
import { useSearchAlertsStore } from '~/stores/searchAlertsStore'
import {
  buildShopSearchQuery,
  hasSearchCriteria,
  type CreateSearchAlertInput,
  type SearchAlert
} from '~/types/searchAlert'
import { AdvertType } from '~/utils/enum/advertType'
import { localizedRefLabel } from '~/utils/catalogFilterUtils'
import { useCatalogReferenceData } from '~/composables/useCatalogReferenceData'

const localePath = useLocalePath()
const { t, locale } = useI18n()
const toast = useToast()
const searchAlertsStore = useSearchAlertsStore()
const deletingId = ref<number | null>(null)
const isCreating = ref(false)

const {
  bookCategories,
  productCategories,
  schoolGrades,
  subjects,
  isLoading: referencesLoading,
  loadError: referencesError,
  load: loadCatalogReferences
} = useCatalogReferenceData()

const form = ref({
  advertType: AdvertType.PRODUCT,
  q: '',
  maxPrice: null as number | null,
  isbn: '',
  bookCategoryId: null as number | null,
  productCategoryId: null as number | null,
  subjectId: null as number | null,
  schoolGradeId: null as number | null
})

await Promise.all([
  searchAlertsStore.loadAlerts().catch(() => undefined),
  loadCatalogReferences()
])

const alerts = computed(() => searchAlertsStore.alerts)

const advertTypeOptions = computed(() => [
  { value: AdvertType.PRODUCT, label: t('searchAlerts.form.types.product') },
  { value: AdvertType.BOOK, label: t('searchAlerts.form.types.book') },
  { value: AdvertType.SERVICE, label: t('searchAlerts.form.types.service') }
])

const bookCategoryOptions = computed(() =>
  bookCategories.value.map(category => ({
    value: category.bookCategoryId,
    label: localizedRefLabel(category, locale.value)
  })))

const productCategoryOptions = computed(() =>
  productCategories.value.map(category => ({
    value: category.productCategoryId,
    label: localizedRefLabel(category, locale.value)
  })))

const subjectOptions = computed(() =>
  subjects.value.map(subject => ({
    value: subject.subjectId,
    label: localizedRefLabel(subject, locale.value)
  })))

const schoolGradeOptions = computed(() =>
  schoolGrades.value.map(grade => ({
    value: grade.schoolGradeId,
    label: localizedRefLabel(grade, locale.value)
  })))

const alertPayload = computed<CreateSearchAlertInput>(() => {
  const maxPrice = typeof form.value.maxPrice === 'number' && Number.isFinite(form.value.maxPrice)
    ? form.value.maxPrice
    : null

  const base = {
    advertType: form.value.advertType,
    q: form.value.q.trim() || null,
    maxPrice
  }

  if (form.value.advertType === AdvertType.BOOK) {
    return {
      ...base,
      isbn: form.value.isbn.trim() || null,
      bookCategoryId: form.value.bookCategoryId
    }
  }

  if (form.value.advertType === AdvertType.SERVICE) {
    return {
      ...base,
      subjectId: form.value.subjectId,
      schoolGradeId: form.value.schoolGradeId
    }
  }

  return {
    ...base,
    productCategoryId: form.value.productCategoryId
  }
})

const canCreateAlert = computed(() =>
  hasSearchCriteria(alertPayload.value) && !isCreating.value)

watch(() => form.value.advertType, () => {
  form.value.isbn = ''
  form.value.bookCategoryId = null
  form.value.productCategoryId = null
  form.value.subjectId = null
  form.value.schoolGradeId = null
})

function resetForm() {
  form.value = {
    advertType: AdvertType.PRODUCT,
    q: '',
    maxPrice: null,
    isbn: '',
    bookCategoryId: null,
    productCategoryId: null,
    subjectId: null,
    schoolGradeId: null
  }
}

async function handleCreateAlert() {
  if (!canCreateAlert.value) return

  isCreating.value = true
  try {
    await searchAlertsStore.createAlert(alertPayload.value)
    toast.add({ title: t('searchAlerts.saved'), color: 'success' })
    resetForm()
  } catch {
    toast.add({ title: t('searchAlerts.save_error'), color: 'error' })
  } finally {
    isCreating.value = false
  }
}

async function handleDelete(id: number) {
  deletingId.value = id
  try {
    await searchAlertsStore.deleteAlert(id)
  } finally {
    deletingId.value = null
  }
}

async function handleRunSearch(alert: SearchAlert) {
  await navigateTo({
    path: localePath('/shop'),
    query: buildShopSearchQuery(alert)
  })
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {{ $t('searchAlerts.subtitle') }}
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {{ $t('searchAlerts.title') }}
          </h1>
        </div>
        <NuxtLink
          :to="localePath('/shop')"
          class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          {{ $t('searchAlerts.actions.back_to_shop') }}
        </NuxtLink>
      </div>

      <form
        class="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="handleCreateAlert"
      >
        <div class="mb-6">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ $t('searchAlerts.form.title') }}
          </h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {{ $t('searchAlerts.form.description') }}
          </p>
        </div>

        <p
          v-if="referencesError"
          class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {{ $t('searchAlerts.form.references_error') }}
        </p>

        <div class="grid gap-5 md:grid-cols-2">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ $t('searchAlerts.form.advert_type') }}
            </span>
            <select
              v-model="form.advertType"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option
                v-for="option in advertTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ $t('searchAlerts.form.keyword') }}
            </span>
            <input
              v-model="form.q"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              type="text"
              :placeholder="$t('searchAlerts.form.keyword_placeholder')"
            >
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ $t('searchAlerts.form.max_price') }}
            </span>
            <input
              v-model.number="form.maxPrice"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              type="number"
              min="0"
              step="0.05"
              :placeholder="$t('searchAlerts.form.max_price_placeholder')"
            >
          </label>

          <label
            v-if="form.advertType === AdvertType.PRODUCT"
            class="block"
          >
            <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ $t('searchAlerts.form.product_category') }}
            </span>
            <select
              v-model="form.productCategoryId"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              :disabled="referencesLoading"
            >
              <option :value="null">
                {{ $t('searchAlerts.form.any_product_category') }}
              </option>
              <option
                v-for="option in productCategoryOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <template v-if="form.advertType === AdvertType.BOOK">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {{ $t('searchAlerts.form.isbn') }}
              </span>
              <input
                v-model="form.isbn"
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                type="text"
                :placeholder="$t('searchAlerts.form.isbn_placeholder')"
              >
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {{ $t('searchAlerts.form.book_category') }}
              </span>
              <select
                v-model="form.bookCategoryId"
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                :disabled="referencesLoading"
              >
                <option :value="null">
                  {{ $t('searchAlerts.form.any_book_category') }}
                </option>
                <option
                  v-for="option in bookCategoryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>
          </template>

          <template v-if="form.advertType === AdvertType.SERVICE">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {{ $t('searchAlerts.form.subject') }}
              </span>
              <select
                v-model="form.subjectId"
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                :disabled="referencesLoading"
              >
                <option :value="null">
                  {{ $t('searchAlerts.form.any_subject') }}
                </option>
                <option
                  v-for="option in subjectOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {{ $t('searchAlerts.form.grade') }}
              </span>
              <select
                v-model="form.schoolGradeId"
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                :disabled="referencesLoading"
              >
                <option :value="null">
                  {{ $t('searchAlerts.form.any_grade') }}
                </option>
                <option
                  v-for="option in schoolGradeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>
          </template>
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ $t('searchAlerts.form.helper') }}
          </p>
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            :disabled="!canCreateAlert"
          >
            {{ isCreating ? $t('searchAlerts.saving') : $t('searchAlerts.form.submit') }}
          </button>
        </div>
      </form>

      <!-- Loading -->
      <div
        v-if="searchAlertsStore.isLoading"
        class="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        {{ $t('searchAlerts.status.loading') }}
      </div>

      <!-- Error -->
      <div
        v-else-if="searchAlertsStore.error"
        class="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
      >
        {{ $t('searchAlerts.status.error') }}
      </div>

      <!-- Empty -->
      <div
        v-else-if="alerts.length === 0"
        class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900"
      >
        <p class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ $t('searchAlerts.empty.title') }}
        </p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {{ $t('searchAlerts.empty.message') }}
        </p>
        <NuxtLink
          :to="localePath('/shop')"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          {{ $t('searchAlerts.actions.browse_shop') }}
        </NuxtLink>
      </div>

      <!-- List -->
      <div
        v-else
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <SearchAlertCard
          v-for="item in alerts"
          :key="item.id"
          :alert="item"
          :deleting="deletingId === item.id"
          @delete="handleDelete"
          @run-search="handleRunSearch"
        />
      </div>
    </section>
  </div>
</template>
