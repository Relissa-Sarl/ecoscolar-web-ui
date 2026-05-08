<script setup lang="ts">
import type { Seller } from '@/types/product'

interface Props {
  seller: Seller
}

defineProps<Props>()
defineEmits<{
  'view-profile': []
}>()
</script>

<template>
  <div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
    <UAvatar
      :src="seller.avatar"
      :alt="seller.username"
      size="lg"
    />
    <div class="flex-1">
      <p class="font-medium text-gray-900 dark:text-white">{{ seller.username }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">📍 {{ seller.zip }}</p>
    </div>
    <UButton color="neutral" variant="outline" @click="$emit('view-profile')">View Profile</UButton>
  </div>
</template>
