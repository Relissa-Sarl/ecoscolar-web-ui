<script setup lang="ts">
interface Props {
  isbn: string
  subject: string
  grade: string
  school: string
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        ISBN-13
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ isbn }}
      </p>
    </div>
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        Subject
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ subject }}
      </p>
    </div>
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        Grade
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ grade }}
      </p>
    </div>
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
        School
      </p>
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ school }}
      </p>
    </div>
  </div>
</template>
