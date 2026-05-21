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
})
</script>

<template>
  <div>
    <!-- Main Image -->
    <div class="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
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
      <button
        v-for="(img, idx) in images"
        :key="img"
        type="button"
        class="block w-full bg-transparent p-0 cursor-pointer rounded overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
        :class="selectedImage === img ? 'border-gray-900 dark:border-gray-100' : 'border-gray-300 dark:border-gray-700'"
        :aria-label="`View image ${idx + 1}`"
        :aria-pressed="selectedImage === img"
        @click="selectedImage = img"
      >
        <NuxtImg
          :src="img"
          :alt="`Image ${idx + 1}`"
          class="w-full h-20 object-cover"
          width="100"
          height="100"
        />
      </button>
    </div>
  </div>
</template>
