<script setup lang="ts">
import { AdvertCondition } from '@/utils/enum/advertCondition'

interface Props {
  condition: string
  featured: boolean
  title: string
  authors: string
  price: number
  oldPrice: number
}

const props = defineProps<Props>()
const { t } = useI18n()

function parseAdvertCondition(value: string): AdvertCondition | null {
  const normalized = value.trim().toUpperCase().replace(/ /g, '_')
  if ((Object.values(AdvertCondition) as string[]).includes(normalized))
    return normalized as AdvertCondition
  return null
}

const conditionLabel = computed(() => {
  switch (parseAdvertCondition(props.condition)) {
    case AdvertCondition.NEW:
      return t('advertConditions.new')
    case AdvertCondition.LIKE_NEW:
      return t('advertConditions.likeNew')
    case AdvertCondition.USED:
      return t('advertConditions.used')
    default:
      return props.condition
  }
})
</script>

<template>
  <div>
    <div
      v-if="condition || featured"
      class="flex gap-2 mb-4"
    >
      <UBadge
        v-if="condition"
        color="primary"
        variant="soft"
      >
        {{ conditionLabel }}
      </UBadge>
      <UBadge
        v-if="featured"
        color="success"
        variant="soft"
      >
        {{ $t('advert.detail.featured') }}
      </UBadge>
    </div>

    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h1>

    <p
      v-if="authors"
      class="text-gray-600 dark:text-gray-400 mb-6"
    >
      {{ authors }}
    </p>

    <div class="mb-6">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {{ $t('advert.detail.current_price') }}
      </p>
      <div class="flex items-baseline gap-3">
        <span class="text-4xl font-bold text-gray-900 dark:text-white">CHF {{ price.toFixed(2) }}</span>
        <span
          v-if="oldPrice > price"
          class="text-lg text-gray-500 line-through"
        >CHF {{ oldPrice.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>
