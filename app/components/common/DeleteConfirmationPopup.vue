<script setup lang="ts">
interface Props {
  show: boolean
}

defineProps<Props>()

const emits = defineEmits<{
  'confirm-delete': []
  'cancel-delete': []
}>()

const confirmDeletion = () => {
  emits('confirm-delete')
}
</script>

<template>
  <div
    v-show="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 class="mb-4 text-lg font-semibold">
        {{ $t('me.adverts.deleteConfirmTitle') }}
      </h3>
      <p class="mb-6 text-sm text-gray-600 dark:text-gray-400">
        {{ $t('me.adverts.deleteConfirmMessage') }}
      </p>
      <div class="flex justify-end gap-4">
        <button
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="() => emits('cancel-delete')"
        >
          {{ $t('me.adverts.cancel') }}
        </button>
        <button
          class="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          @click="() => confirmDeletion()"
        >
          {{ $t('me.adverts.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>
