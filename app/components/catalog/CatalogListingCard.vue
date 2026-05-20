<script setup lang="ts">
import { useLocalePath } from '#imports'
import {
  CATALOG_CONDITION_BADGE_CLASS,
  CATALOG_SERVICE_BADGE_CLASS,
  type CatalogListing
} from '@/types/catalog'

const localePath = useLocalePath()

const props = defineProps<{
  listing: CatalogListing
}>()

const detailLink = computed(() => localePath(`/adverts/${props.listing.id}`))

defineEmits<{
  favoriteToggle: []
  cartAdd: []
  bookLesson: []
}>()
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
    <div class="relative aspect-[520/440] bg-slate-100 dark:bg-slate-900">
      <img
        :src="listing.imageUrl"
        :alt="$t('catalog.card.alt_image')"
        loading="lazy"
        class="h-full w-full object-cover"
      >
      <span
        v-if="listing.itemCondition"
        class="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm sm:text-[11px]"
        :class="CATALOG_CONDITION_BADGE_CLASS[listing.itemCondition]"
      >
        {{ $t(`catalog.badges.condition.${listing.itemCondition}`) }}
      </span>
      <span
        v-else-if="listing.serviceBadge"
        class="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm sm:text-[11px]"
        :class="CATALOG_SERVICE_BADGE_CLASS[listing.serviceBadge]"
      >
        {{ $t(`catalog.badges.service.${listing.serviceBadge}`) }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
      <p class="line-clamp-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
        {{ $t(listing.metaLineKey) }}
      </p>
      <h3 class="text-lg font-bold leading-snug text-slate-900 dark:text-white">
        <NuxtLink
          :to="detailLink"
          class="underline-offset-4 hover:text-emerald-700 hover:underline dark:hover:text-emerald-400"
        >
          {{ listing.title }}
        </NuxtLink>
      </h3>

      <p class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <svg
          class="size-4 shrink-0"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        {{ listing.location }}
      </p>

      <div class="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div class="leading-tight">
          <template v-if="listing.hourly">
            <span class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{{ $t('catalog.card.hourly') }}</span>
            <span class="text-xl font-black text-emerald-800 dark:text-emerald-400">CHF {{ listing.price.toFixed(2) }}/h</span>
            <span class="ml-2 text-sm font-semibold text-amber-600 dark:text-amber-400">{{ $t('catalog.card.demo_rating') }}</span>
          </template>
          <template v-else>
            <span class="block text-xl font-black text-emerald-800 dark:text-emerald-400">CHF {{ listing.price.toFixed(2) }}</span>
          </template>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-200 p-2.5 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
            :aria-label="$t('advert.actions.favorite_add')"
            @click="$emit('favoriteToggle')"
          >
            <svg
              class="size-5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>

          <button
            v-if="listing.hourly"
            type="button"
            class="rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            @click="$emit('bookLesson')"
          >
            {{ $t('catalog.card.book_lesson') }}
          </button>
          <button
            v-else
            type="button"
            class="rounded-full bg-emerald-800 p-2.5 text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            :aria-label="$t('advert.actions.buy_now')"
            @click="$emit('cartAdd')"
          >
            <svg
              class="size-5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
