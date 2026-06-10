<script setup lang="ts">
import { ref } from 'vue'
import type { SpokenLanguage } from '~/types/user'

interface Props {
  traductionBasePath: string
}

const props = defineProps<Props>()

const usersStore = useUsersStore()

const spokenLanguages = ref<SpokenLanguage[]>([])

// Reactive form data for the profile, initialized with the current user's information if available
const profileForm = ref({
  nickname: usersStore.user?.nickname || '',
  firstName: usersStore.user?.firstName || '',
  lastName: usersStore.user?.lastName || '',
  postalCode: usersStore.user?.location?.postalCode || '',
  birthdayDate: usersStore.user?.birthdayDate || ''
})

if (usersStore.user?.isOnboarded) {
  spokenLanguages.value = usersStore.user?.languages || []
}

const languageOptions = [
  { value: 'fr', text: 'fr' },
  { value: 'de', text: 'de' },
  { value: 'it', text: 'it' }
]

const levelOptions = ['maternelle', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

/**
 * Add a new language to the list
 */
const addLanguage = () => {
  spokenLanguages.value.push({
    label: '',
    languageLevel: ''
  })
}

/**
 * Remove a language from the list
 * @param index language index to remove
 */
const removeLanguage = (index: number) => {
  spokenLanguages.value.splice(index, 1)
}

/**
 * Get available language options for a specific dropdown
 * @param currentIndex index of the current dropdown
 */
const getAvailableLanguages = (currentIndex: number) => {
  const selectedValues = spokenLanguages.value
    .map((lang, i) => i !== currentIndex ? lang.label : null)
    .filter(Boolean)

  return languageOptions.filter(opt => !selectedValues.includes(opt.value))
}

/**
 * Handle form submission
 */
const handleSubmit = () => {
  const formData = {
    ...profileForm.value,
    languages: spokenLanguages.value.filter(l => l.label && l.languageLevel)
  }

  usersStore.updateProfile(formData)
}

const { globalErrors } = useFormErrors(() => usersStore.errors, `${props.traductionBasePath}.errors`)
</script>

<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    {{ globalErrors }}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <label
          for="profile-nickname"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t(`${props.traductionBasePath}.nickname_label`) }}
        </label>
        <input
          id="profile-nickname"
          v-model="profileForm.nickname"
          type="text"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="profile-firstName"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t(`${props.traductionBasePath}.firstName_label`) }}
        </label>
        <input
          id="profile-firstName"
          v-model="profileForm.firstName"
          type="text"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="profile-lastName"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t(`${props.traductionBasePath}.lastName_label`) }}
        </label>
        <input
          id="profile-lastName"
          v-model="profileForm.lastName"
          type="text"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="profile-pc"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t(`${props.traductionBasePath}.pc_label`) }}
        </label>
        <input
          id="profile-pc"
          v-model="profileForm.postalCode"
          type="text"
          pattern="[1-9][0-9]{3}"
          :placeholder="$t(`${props.traductionBasePath}.pc_placeholder`)"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2 md:col-span-2">
        <label
          for="profile-dob"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t(`${props.traductionBasePath}.dob_label`) }}
        </label>
        <input
          id="profile-dob"
          v-model="profileForm.birthdayDate"
          type="date"
          required
          class="form-input"
        >
      </div>
    </div>

    <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">
        {{ $t(`${props.traductionBasePath}.languages_title`) }}
      </h3>

      <div
        v-if="spokenLanguages.length === 0"
        class="text-sm text-slate-500"
      >
        {{ $t(`${props.traductionBasePath}.languages_empty`) }}
      </div>

      <div
        v-for="(lang, index) in spokenLanguages"
        :key="'lang-' + lang.label"
        class="flex items-end gap-4"
      >
        <div class="flex-1">
          <label
            :for="`lang-select-${index}`"
            class="sr-only"
          >
            {{ $t(`${props.traductionBasePath}.language_label`) }}
          </label>
          <select
            :id="`lang-select-${index}`"
            v-model="lang.label"
            required
            class="form-input"
          >
            <option
              value=""
              disabled
            >
              {{ $t(`${props.traductionBasePath}.language_placeholder`) }}
            </option>
            <option
              v-for="opt in getAvailableLanguages(index)"
              :key="opt.value"
              :value="opt.value"
            >
              {{ $t(opt.text) }}
            </option>
          </select>
        </div>

        <div class="flex-1">
          <label
            :for="`level-select-${index}`"
            class="sr-only"
          >
            {{ $t(`${props.traductionBasePath}.level_label`) }}
          </label>
          <select
            :id="`level-select-${index}`"
            v-model="lang.languageLevel"
            required
            class="form-input"
          >
            <option
              value=""
              disabled
            >
              {{ $t(`${props.traductionBasePath}.level_placeholder`) }}
            </option>
            <option
              v-for="lvl in levelOptions"
              :key="lvl"
              :value="lvl"
            >
              {{ lvl === 'maternelle' ? $t(`${props.traductionBasePath}.level_native`) : lvl }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md"
          :aria-label="$t(`${props.traductionBasePath}.remove_language_aria`, { index: index + 1 })"
          @click="removeLanguage(index)"
        >
          &times;
        </button>
      </div>

      <button
        type="button"
        class="text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
        @click="addLanguage"
      >
        + {{ $t(`${props.traductionBasePath}.add_language`) }}
      </button>
    </div>

    <button
      type="submit"
      class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none"
    >
      {{ $t(`${props.traductionBasePath}.submit_button`) }}
    </button>
  </form>
</template>
