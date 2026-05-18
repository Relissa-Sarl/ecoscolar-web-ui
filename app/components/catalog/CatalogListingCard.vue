<script setup lang="ts">
import { useLocalePath } from '#imports'
import type { CatalogListing } from '@/types/catalog'

const localePath = useLocalePath()

const props = defineProps<{
  listing: CatalogListing
}>()

const detailLink = computed(() => localePath(`/annonce/${props.listing.id}`))

defineEmits<{
  favoriteToggle: []
  cartAdd: []
  bookLesson: []
}>()

const badgeClass = (): string => {
  switch (props.listing.badge) {
    case 'NEW':
      return 'bg-emerald-600 text-white'
    case 'USED':
      return 'bg-amber-400 text-emerald-950'
    case 'GOOD':
      return 'bg-sky-400 text-emerald-950'
    default:
      return 'bg-emerald-800 text-white'
  }
}

const badgeLabel = (): string => {
  switch (props.listing.badge) {
    case 'NEW':
      return 'NEW'
    case 'USED':
      return 'USED'
    case 'GOOD':
      return 'GOOD'
    case 'VERIFIED_TUTOR':
      return 'VERIFIED'
    default:
      return ''
  }
}
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
        class="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm sm:text-[11px]"
        :class="badgeClass()"
      >
        {{ badgeLabel() }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
      <p class="line-clamp-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
        {{ listing.metaLine }}
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
        <span aria-hidden="true">📍</span>
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
            ♡
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
            🛒
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
