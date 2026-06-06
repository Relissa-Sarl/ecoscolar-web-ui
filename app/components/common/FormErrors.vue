<script setup lang="ts">
interface Props {
  errors: string[] | null
}

defineProps<Props>()
</script>

<template>
  <div v-if="errors && errors.length > 0">
    <ul class="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
      <li
        v-for="(error, index) in errors"
        :key="index"
      >
        {{ error }}
      </li>
    </ul>
  </div>
</template>
