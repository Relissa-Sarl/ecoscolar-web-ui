<script setup lang="ts">
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

const conditionLabel = computed(() => {
  const normalized = props.condition.trim().toUpperCase().replace(/_/g, ' ')
  switch (normalized) {
    case 'NEW':
      return t('advertConditions.new')
    case 'LIKE NEW':
      return t('advertConditions.likeNew')
    case 'USED':
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
