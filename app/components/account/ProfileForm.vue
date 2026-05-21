<script setup lang="ts">
import { ref } from 'vue'
import type { SpokenLanguage } from '~/types/user'

const { t } = useI18n()

const usersStore = useUsersStore()

// --- Références pour les champs du formulaire ---
const nickname = ref('')
const lastName = ref('')
const firstName = ref('')
const postalCode = ref('')
const birthdayDate = ref('')

const spokenLanguages = ref<SpokenLanguage[]>([])

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
    language: '',
    level: ''
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
 * Manage language selection
 * @param lang selected language
 */
const onLanguageChange = (index: number) => {
  // If the same language is selected more than once, remove the duplicate and alert the user
  const selectedLang = spokenLanguages.value[index]?.language
  const duplicateIndex = spokenLanguages.value.findIndex((l, i) => l.language === selectedLang && i !== index)
  if (duplicateIndex !== -1 && selectedLang) {
    spokenLanguages.value.splice(duplicateIndex, 1)
    alert(t('register.profile.language_duplicate', { language: t(selectedLang) }))
  }
}

/**
 * Handle form submission
 */
const handleSubmit = () => {
  const formData = {
    nickname: nickname.value,
    postalCode: postalCode.value,
    firstName: firstName.value,
    lastName: lastName.value,
    birthdayDate: birthdayDate.value,
    spokenLanguages: spokenLanguages.value.filter(l => l.language && l.level)
  }

  usersStore.updateProfile(formData)
}
</script>

<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <label
          for="profile-pseudo"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t('register.profile.pseudo_label') }}
        </label>
        <input
          id="profile-pseudo"
          v-model="nickname"
          type="text"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="profile-prenom"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t('register.profile.prenom_label') }}
        </label>
        <input
          id="profile-prenom"
          v-model="firstName"
          type="text"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="profile-nom"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t('register.profile.nom_label') }}
        </label>
        <input
          id="profile-nom"
          v-model="lastName"
          type="text"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="profile-cp"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t('register.profile.cp_label') }}
        </label>
        <input
          id="profile-cp"
          v-model="postalCode"
          type="text"
          pattern="[1-9][0-9]{3}"
          :placeholder="$t('register.profile.cp_placeholder')"
          required
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2 md:col-span-2">
        <label
          for="profile-dob"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t('register.profile.dob_label') }}
        </label>
        <input
          id="profile-dob"
          v-model="birthdayDate"
          type="date"
          required
          class="form-input"
        >
      </div>
    </div>

    <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">
        {{ $t('register.profile.languages_title') }}
      </h3>

      <div
        v-if="spokenLanguages.length === 0"
        class="text-sm text-slate-500"
      >
        {{ $t('register.profile.languages_empty') }}
      </div>

      <div
        v-for="(lang, index) in spokenLanguages"
        :key="'lang-' + lang.language"
        class="flex items-end gap-4"
      >
        <div class="flex-1">
          <label
            :for="`lang-select-${index}`"
            class="sr-only"
          >
            {{ $t('register.profile.language_label') }}
          </label>
          <select
            :id="`lang-select-${index}`"
            v-model="lang.language"
            required
            class="form-input"
            @change="onLanguageChange(index)"
          >
            <option
              value=""
              disabled
            >
              {{ $t('register.profile.language_placeholder') }}
            </option>
            <option
              v-for="opt in languageOptions"
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
            {{ $t('register.profile.level_label') }}
          </label>
          <select
            :id="`level-select-${index}`"
            v-model="lang.level"
            required
            class="form-input"
          >
            <option
              value=""
              disabled
            >
              {{ $t('register.profile.level_placeholder') }}
            </option>
            <option
              v-for="lvl in levelOptions"
              :key="lvl"
              :value="lvl"
            >
              {{ lvl === 'maternelle' ? $t('register.profile.level_native') : lvl }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md"
          :aria-label="$t('register.profile.remove_language_aria', { index: index + 1 })"
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
        + {{ $t('register.profile.add_language') }}
      </button>
    </div>

    <button
      type="submit"
      class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none"
    >
      {{ $t('register.profile.submit_button') }}
    </button>
  </form>
</template>
