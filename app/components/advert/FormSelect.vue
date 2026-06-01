<script setup lang="ts">
interface Props {
  modelValue?: string | number
  error?: string
  label: string
  labelKey: string
  options: Array<{ value: string | number, labelKey: string }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = computed(() => `input-${props.labelKey}`)
</script>

<template>
  <div class="form-group">
    <label
      v-if="props.label"
      class="mb-2 block text-sm font-medium text-gray-600"
      :for="inputId"
    >
      {{ $t(`advertForm.form.${props.labelKey}`) }}
    </label>
    <select
      :id="inputId"
      :value="props.modelValue"
      class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
      :class="{ 'border-red-500': props.error }"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.labelKey }}
      </option>
    </select>
    <p
      v-show="props.error"
      class="mt-1 min-h-5 text-sm text-red-500"
    >
      {{ props.error }}
    </p>
  </div>
</template>
