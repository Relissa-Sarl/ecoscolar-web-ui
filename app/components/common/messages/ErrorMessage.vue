<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
  >
    {{ message || $t('common.messages.error') }}
  </div>
</template>
