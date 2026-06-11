<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { LocationResult } from '~/types/location'
import { getLocationsService } from '~/services/locationsService'

type SelectedLocation = Pick<LocationResult, 'postalCode' | 'city' | 'region'>

// 1. Types des props avec valeurs par défaut modernes via withDefaults
interface Props {
  id: string
  modelValue: string
  placeholder?: string
  pattern?: string
  required?: boolean
  noResultsText?: string
  invalidText?: string
  initialLocation?: SelectedLocation | null
}
const props = withDefaults(defineProps<Props>(), {
  initialLocation: null,
  invalidText: ' '
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const locationsService = getLocationsService()
const MIN_QUERY_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 300

const formatLocation = (loc: SelectedLocation) => `${loc.postalCode} ${loc.city} (${loc.region})`

// États du composant
const inputRef = ref<HTMLInputElement | null>(null)
const results = ref<LocationResult[]>([])
const isOpen = ref(false)
const hasSearched = ref(false)
const highlightedIndex = ref(-1)

// 2. Initialisation simplifiée de la localisation sélectionnée
const selectedLocation = ref<SelectedLocation | null>(
  props.initialLocation?.postalCode === props.modelValue ? props.initialLocation : null
)

const displayValue = ref(selectedLocation.value ? formatLocation(selectedLocation.value) : props.modelValue)

// 3. Regex calculée automatiquement
const patternRegex = computed(() => props.pattern ? new RegExp(`^(?:${props.pattern})$`) : null)

const updateValidity = () => {
  if (!inputRef.value) return
  const value = displayValue.value.trim()

  const isValid = selectedLocation.value !== null
    || value === ''
    || !patternRegex.value
    || patternRegex.value.test(value)

  inputRef.value.setCustomValidity(isValid ? '' : props.invalidText)
}

onMounted(updateValidity)

const search = async (query: string) => {
  try {
    results.value = await locationsService.searchLocations(query)
  } catch {
    results.value = []
  }
  hasSearched.value = true
  highlightedIndex.value = -1
  isOpen.value = true
}

const debouncedSearch = useDebounceFn(search, SEARCH_DEBOUNCE_MS)

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  displayValue.value = value
  selectedLocation.value = null
  emit('update:modelValue', value)
  updateValidity()

  const trimmed = value.trim()
  if (trimmed.length >= MIN_QUERY_LENGTH) {
    debouncedSearch(trimmed)
  } else {
    results.value = []
    hasSearched.value = false
    closeDropdown()
  }
}

const selectLocation = (location: LocationResult) => {
  selectedLocation.value = location
  displayValue.value = formatLocation(location)
  emit('update:modelValue', location.postalCode)
  updateValidity()
  closeDropdown()
}

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1
}

const onFocus = () => {
  if (hasSearched.value) isOpen.value = true
}

const onKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  const maxIndex = results.value.length

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = (highlightedIndex.value + 1) % maxIndex
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = (highlightedIndex.value - 1 + maxIndex) % maxIndex
      break
    case 'Enter': {
      const location = results.value[highlightedIndex.value]
      if (location) {
        event.preventDefault()
        selectLocation(location)
      }
      break
    }
    case 'Escape':
      closeDropdown()
      break
  }
}
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      ref="inputRef"
      :value="displayValue"
      type="text"
      autocomplete="off"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-listbox`"
      :placeholder="placeholder"
      :required="required"
      class="form-input w-full"
      @input="onInput"
      @focus="onFocus"
      @keydown="onKeydown"
      @blur="closeDropdown"
    >

    <ul
      v-if="isOpen && results.length > 0"
      :id="`${id}-listbox`"
      role="listbox"
      class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
    >
      <li
        v-for="(location, index) in results"
        :key="location.locationId"
        role="option"
        :aria-selected="index === highlightedIndex"
        class="px-4 py-2 text-sm cursor-pointer text-slate-700 dark:text-slate-300"
        :class="{ 'bg-emerald-50 dark:bg-emerald-900/40': index === highlightedIndex }"
        @mousedown.prevent="selectLocation(location)"
        @mousemove="highlightedIndex = index"
      >
        {{ formatLocation(location) }}
      </li>
    </ul>

    <div
      v-else-if="isOpen && hasSearched && noResultsText"
      class="absolute z-10 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg px-4 py-2 text-sm text-slate-500"
    >
      {{ noResultsText }}
    </div>
  </div>
</template>
