<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import type { FavoriteAdvertSummary } from '~/types/favorite'

interface Props {
  advert: FavoriteAdvertSummary | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  buy: []
  favorite: [value: boolean]
}>()

const favoritesStore = useFavoritesStore()
const isSubmittingFavorite = ref(false)

const resolvedAdvertId = computed(() => props.advert?.id ?? null)

// Extraction des champs pour pinia
const favoriteInput = computed(() => {
  if (!props.advert) {
    return null
  }

  return {
    advertId: props.advert.id,
    advert: props.advert
  }
})

const isFavorite = computed(() => {
  if (!resolvedAdvertId.value) {
    return false
  }
  return favoritesStore.isFavorite(resolvedAdvertId.value)
})

const favoriteLabel = computed(() =>
  isFavorite.value ? 'advert.actions.favorite_remove' : 'advert.actions.favorite_add'
)

const handleBuy = () => {
  emit('buy')
}

const toggleFavorite = async () => {
  if (!favoriteInput.value || isSubmittingFavorite.value) {
    return
  }
  isSubmittingFavorite.value = true

  try {
    const result = await favoritesStore.toggleFavorite(favoriteInput.value)
    emit('favorite', result.isFavorite)
  } finally {
    isSubmittingFavorite.value = false
  }
}

onBeforeMount(() => {
  if (!favoritesStore.hasLoaded && !favoritesStore.isLoading) {
    void favoritesStore.loadFavorites().catch(() => undefined)
  }
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex gap-4">
      <button
        class="flex-1 px-4 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors"
        @click="handleBuy"
      >
        {{ $t('advert.actions.buy_now') }}
      </button>

      <button
        type="button"
        class="w-12 h-12 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center text-lg"
        :aria-label="$t(favoriteLabel)"
        :aria-pressed="isFavorite"
        :disabled="isSubmittingFavorite || !favoriteInput"
        @click="toggleFavorite"
      >
        <span v-if="!isFavorite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </span>
        <span v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-red-500"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>
