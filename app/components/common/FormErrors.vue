<script setup lang="ts">
interface Props {
  errors: string[] | null
  hasErrors: boolean
}

defineProps<Props>()
</script>

<template>
  <div v-if="hasErrors">
    <ul class="list-inside space-y-1 text-sm text-red-700 dark:text-red-400 list-none">
      <li
        v-for="(error, index) in errors"
        :key="index"
      >
        * {{ error }}
      </li>
    </ul>
  </div>
</template>
