<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  images?: string[]
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  images: () => []
})

const selectedImage = ref<string>(props.images[0] || '')

watch(() => props.images, (newImages) => {
  selectedImage.value = newImages?.[0] ?? ''
}, { deep: true })
</script>

<template>
  <div>
    <!-- Main Image -->
    <div class="bg-red-700 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
      <NuxtImg
        :src="selectedImage"
        :alt="title"
        class="w-full h-full object-cover"
        width="600"
        height="800"
      />
    </div>

    <!-- Thumbnail Gallery -->
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="(img, idx) in images"
        :key="idx"
        class="cursor-pointer rounded overflow-hidden border-2 transition-all"
        :class="selectedImage === img ? 'border-gray-900 dark:border-gray-100' : 'border-gray-300 dark:border-gray-700'"
        @click="selectedImage = img"
      >
        <NuxtImg
          :src="img"
          :alt="`Image ${idx + 1}`"
          class="w-full h-20 object-cover"
          width="100"
          height="100"
        />
      </div>
      <div class="rounded overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer">
        <span class="text-sm text-gray-500">📷</span>
      </div>
      <div class="rounded overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer">
        <span class="text-sm text-gray-500">🎥</span>
      </div>
    </div>
  </div>
</template>
