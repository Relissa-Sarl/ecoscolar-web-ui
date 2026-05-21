<script setup lang="ts">
interface Props {
  isbn?: string
  category?: string
  subject?: string
  grade?: string
  school?: string
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
    <div v-if="isbn">
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        {{ $t('advert.detail.isbn') }}
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ isbn }}
      </p>
    </div>
    <div v-if="category">
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        {{ $t('advert.detail.category') }}
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ category }}
      </p>
    </div>
    <div v-if="subject">
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        {{ $t('advert.detail.subject') }}
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ subject }}
      </p>
    </div>
    <div v-if="grade">
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        {{ $t('advert.detail.grade') }}
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ grade }}
      </p>
    </div>
    <div v-if="school">
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        {{ $t('advert.detail.study_level') }}
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ school }}
      </p>
    </div>
  </div>
</template>
