<script setup lang="ts">
interface Props {
  modelValue?: string | number
  error?: string
  label: string
  labelKey: string
  type?: 'text' | 'number'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

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
    <input
      :id="inputId"
      :value="props.modelValue"
      class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
      :placeholder="$t(`advertForm.form.${props.labelKey}Placeholder`)"
      :type="props.type"
      :class="{ 'border-red-500': props.error }"
      :step="props.labelKey === 'price' ? '0.01' : undefined"
      :min="props.labelKey === 'price' ? '0' : undefined"
      @input="emit('update:modelValue', props.type === 'number'
        ? ((($event.target as HTMLInputElement).value === '') ? '' : ($event.target as HTMLInputElement).valueAsNumber)
        : ($event.target as HTMLInputElement).value)"
    <p
      v-show="props.error"
      class="mt-1 min-h-5 text-sm text-red-500"
    >
      {{ props.error }}
    </p>
  </div>
</template>
