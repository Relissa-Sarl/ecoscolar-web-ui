<script setup lang="ts">
// To adapt depending on how we'll manage in the backend (just URLs or actual file uploads)

interface Props {
  modelValue?: File[]
  label: string
  labelKey: string
  error?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: File[]]
}>()

const uploadedFiles = ref<File[]>(props.modelValue || [])
const previewUrls = new WeakMap<File, string>()

const getPreviewUrl = (file: File) => {
  const existing = previewUrls.get(file)
  if (existing) return existing

  const url = URL.createObjectURL(file)
  previewUrls.set(file, url)
  return url
}

watch(() => props.modelValue, (files) => {
  uploadedFiles.value = files ? [...files] : []
})

const revokePreviewUrl = (file: File) => {
  const url = previewUrls.get(file)
  if (!url) return
  URL.revokeObjectURL(url)
  previewUrls.delete(file)
}

onBeforeUnmount(() => {
  for (const file of uploadedFiles.value) revokePreviewUrl(file)
})

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    uploadedFiles.value = Array.from(input.files)
    emit('update:modelValue', uploadedFiles.value)
  }
}

const removeFile = (index: number) => {
  const [removed] = uploadedFiles.value.splice(index, 1)
  if (removed) revokePreviewUrl(removed)
  emit('update:modelValue', uploadedFiles.value)
}
</script>

<template>
  <section
    class="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5"
  >
    <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6 text-primary"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
        />
      </svg>
      {{ $t('advertForm.form.images') }}
    </h2>
    <label class="mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center cursor-pointer dark:bg-gray-800 dark:border-gray-400">
      <input
        id="images"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
      >
      <div class="rounded-full bg-primary/10 p-4 text-primary">
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
            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
          />
        </svg>
      </div>
      <div v-if="uploadedFiles.length == 0">
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-300">
          {{ $t('advertForm.form.uploadImages') }}
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ $t('advertForm.form.dragDrop') }}
        </p>
      </div>
      <div
        v-else
        class="grid grid-cols-4 gap-4 mt-4"
      >
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="relative group"
        >
          <img
            :src="getPreviewUrl(file)"
            class="h-20 w-20 rounded-lg object-cover border"
          >
          <button
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            @click.prevent="removeFile(index)"
          >
            <svg
              class="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            /></svg>
          </button>
        </div>
      </div>
    </label>
    <p
      v-show="props.error"
      class="mt-2 min-h-5 text-sm text-red-500"
    >
      {{ props.error }}
    </p>
  </section>
</template>
