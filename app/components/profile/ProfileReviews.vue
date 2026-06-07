<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '#imports'
import type { UserReview } from '~/types/user'
import Stars from './Stars.vue'

const props = defineProps<{
  reviews: UserReview[]
}>()

const { t, locale } = useI18n()

// Filters and Sorting State
const activeFilter = ref<'ALL' | 'BUYER' | 'SELLER'>('ALL')
const activeSort = ref<'date_desc' | 'date_asc' | 'rating_desc' | 'rating_asc'>('date_desc')

// Average rating computation
const averageRating = computed(() => {
  if (props.reviews.length === 0) return 0
  const sum = props.reviews.reduce((acc, r) => acc + r.rating, 0)
  return sum / props.reviews.length
})

// Star rating distribution computation (5 stars down to 1 star)
const ratingDistribution = computed(() => {
  const counts = [0, 0, 0, 0, 0] // index 0=1 star, 1=2 stars, etc.
  props.reviews.forEach((r) => {
    const roundedRating = Math.min(Math.max(Math.round(r.rating), 1), 5)
    const index = roundedRating - 1
    const current = counts[index]
    if (current !== undefined) {
      counts[index] = current + 1
    }
  })
  return [5, 4, 3, 2, 1].map((ratingVal) => {
    const count = counts[ratingVal - 1] ?? 0
    const percentage = props.reviews.length ? (count / props.reviews.length) * 100 : 0
    return { ratingVal, count, percentage }
  })
})

// Count by roles
const buyerReviewsCount = computed(() => {
  return props.reviews.filter(r => r.reviewedRole === 'BUYER').length
})

const sellerReviewsCount = computed(() => {
  return props.reviews.filter(r => r.reviewedRole === 'SELLER').length
})

// Filtered and sorted reviews
const filteredAndSortedReviews = computed(() => {
  let list = [...props.reviews]

  // Filter
  if (activeFilter.value === 'BUYER') {
    list = list.filter(r => r.reviewedRole === 'BUYER')
  } else if (activeFilter.value === 'SELLER') {
    list = list.filter(r => r.reviewedRole === 'SELLER')
  }

  // Sort
  list.sort((a, b) => {
    if (activeSort.value === 'date_desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (activeSort.value === 'date_asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    if (activeSort.value === 'rating_desc') {
      return b.rating - a.rating
    }
    if (activeSort.value === 'rating_asc') {
      return a.rating - b.rating
    }
    return 0
  })

  return list
})

// Formats ISO date dynamically based on active locale
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header: Reviews Summary Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">
        {{ t('profile.reviews.title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <!-- Average Rating Section -->
        <div class="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
          <div
            class="text-5xl font-black text-slate-900 dark:text-white mb-2"
            data-test="average-rating"
          >
            {{ averageRating > 0 ? averageRating.toFixed(1) : '0.0' }}
          </div>
          <Stars
            :rating="averageRating"
            :show-text="false"
            class="mb-2"
            data-test="average-stars"
          />
          <div
            class="text-sm font-medium text-slate-500 dark:text-slate-400"
            data-test="reviews-count"
          >
            {{ props.reviews.length === 1 ? t('profile.reviews.one_review') : t('profile.reviews.count', { count: props.reviews.length }) }}
          </div>
        </div>

        <!-- Rating Distribution Section -->
        <div class="md:col-span-8 space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            {{ t('profile.reviews.star_distribution') }}
          </h3>
          <div
            v-for="dist in ratingDistribution"
            :key="dist.ratingVal"
            class="flex items-center text-sm"
            :data-test="`distribution-${dist.ratingVal}`"
          >
            <!-- Star count label -->
            <div class="w-8 flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium shrink-0">
              <span>{{ dist.ratingVal }}</span>
              <UIcon
                name="i-material-symbols-star"
                class="w-4 h-4 text-amber-500 shrink-0"
              />
            </div>
            <!-- Progress Bar -->
            <div class="flex-1 mx-4 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-emerald-600 dark:bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                :style="{ width: `${dist.percentage}%` }"
              />
            </div>
            <!-- Reviews Count -->
            <span
              class="w-8 text-right text-slate-500 dark:text-slate-400 font-medium shrink-0"
              data-test="count"
            >
              {{ dist.count }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Role Tabs -->
      <div class="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-max border border-slate-200/50 dark:border-slate-800/40">
        <button
          class="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          :class="activeFilter === 'ALL'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          data-test="filter-all"
          @click="activeFilter = 'ALL'"
        >
          {{ t('profile.reviews.filter_all') }} ({{ props.reviews.length }})
        </button>
        <button
          class="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          :class="activeFilter === 'BUYER'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          data-test="filter-buyer"
          @click="activeFilter = 'BUYER'"
        >
          {{ t('profile.reviews.filter_buyer') }} ({{ buyerReviewsCount }})
        </button>
        <button
          class="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          :class="activeFilter === 'SELLER'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          data-test="filter-seller"
          @click="activeFilter = 'SELLER'"
        >
          {{ t('profile.reviews.filter_seller') }} ({{ sellerReviewsCount }})
        </button>
      </div>

      <!-- Sorting Select -->
      <div class="flex items-center gap-2">
        <label
          for="review-sort"
          class="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0"
        >
          {{ t('catalog.sort.label') }}
        </label>
        <select
          id="review-sort"
          v-model="activeSort"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          data-test="review-sort"
        >
          <option value="date_desc">
            {{ t('catalog.sort.recent') }}
          </option>
          <option value="date_asc">
            Anciens
          </option>
          <option value="rating_desc">
            Mieux notés
          </option>
          <option value="rating_asc">
            Moins bien notés
          </option>
        </select>
      </div>
    </div>

    <!-- Review Items List -->
    <div
      v-if="filteredAndSortedReviews.length > 0"
      class="space-y-4"
    >
      <div
        v-for="review in filteredAndSortedReviews"
        :key="review.reviewId"
        class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4"
        data-test="review-item"
      >
        <!-- Item Header: Stars, Role Badge and Meta -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-800/50 pb-3">
          <div class="flex items-center gap-3">
            <Stars
              :rating="review.rating"
              :show-text="false"
              data-test="review-stars"
            />
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors"
              :class="review.reviewedRole === 'BUYER'
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'"
              data-test="review-role"
            >
              {{ review.reviewedRole === 'BUYER' ? t('profile.reviews.buyer') : t('profile.reviews.seller') }}
            </span>
          </div>
          <div
            class="text-xs text-slate-400 dark:text-slate-500 font-medium"
            data-test="review-date"
          >
            {{ formatDate(review.date) }}
          </div>
        </div>

        <!-- Reviewer Information -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300">
            {{ review.reviewerNickname.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div
              class="text-sm font-bold text-slate-800 dark:text-slate-100"
              data-test="reviewer-nickname"
            >
              {{ review.reviewerNickname }}
            </div>
          </div>
        </div>

        <!-- Comment Text -->
        <p
          class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line italic"
          data-test="review-comment"
        >
          &ldquo;{{ review.comment }}&rdquo;
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-16 px-6 bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
      data-test="empty-state"
    >
      <UIcon
        name="i-material-symbols-chat-bubble-outline"
        class="w-12 h-12 text-slate-400 mx-auto mb-4 shrink-0"
      />
      <p class="text-slate-500 dark:text-slate-400 font-medium">
        {{ t('profile.reviews.empty') }}
      </p>
    </div>
  </div>
</template>
