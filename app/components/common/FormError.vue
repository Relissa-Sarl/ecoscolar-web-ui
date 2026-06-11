<script setup lang="ts">
interface Props {
  error: string | undefined
}

defineProps<Props>()
</script>

<template>
  <div
    v-if="error"
    class="text-sm text-red-700 dark:text-red-400"
  >
    {{ error }}
  </div>
</template>
