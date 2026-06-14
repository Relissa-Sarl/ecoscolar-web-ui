<script setup lang="ts">
import { computed } from 'vue'
import { useLocalePath } from '#imports'
import type { FavoriteAdvert } from '@/types/favorite'
import { getFavoriteAdvertId } from '@/types/favorite'

interface Props {
  item: FavoriteAdvert
  removing?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  toggleFavorite: [advertId: string]
}>()
const localePath = useLocalePath()
const advertId = computed(() => getFavoriteAdvertId(props.item))
const openAdvertLink = computed(() => localePath(`/adverts/${advertId.value}`))
</script>

<template>
  <article class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div class="flex gap-4">
      <img
        :src="item.primaryImage"
        :alt="item.title"
        class="h-24 w-20 rounded-2xl object-cover"
      >
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {{ item.type }}
        </p>
        <h3 class="mt-1 truncate text-lg font-semibold text-slate-900 dark:text-white">
          {{ item.title }}
        </h3>
        <p
          v-if="item.sellerPseudo"
          class="mt-1 text-sm text-slate-600 dark:text-slate-300"
        >
          {{ item.sellerPseudo }}
        </p>
        <p class="mt-2 text-base font-bold text-slate-900 dark:text-white">
          {{ formatPrice(item.price) }} CHF
        </p>
      </div>
    </div>
    <div class="flex flex-wrap gap-3">
      <NuxtLink
        :to="openAdvertLink"
        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        {{ $t('favorites.actions.view_advert') }}
      </NuxtLink>
      <button
        class="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
        :disabled="removing"
        @click="emit('toggleFavorite', advertId)"
      >
        {{ removing ? $t('favorites.actions.removing') : $t('favorites.actions.remove') }}
      </button>
    </div>
  </article>
</template>
