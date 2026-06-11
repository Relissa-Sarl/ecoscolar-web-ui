<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { AdvertCondition } from '~/utils/enum/advertCondition'
import { AdvertType } from '~/utils/enum/advertType'
import { getAdvertDetailsService } from '~/services/advertDetailsService'
import FormInput from '~/components/advert/FormInput.vue'
import FormSelect from '~/components/advert/FormSelect.vue'
import FormTextArea from '~/components/advert/FormTextArea.vue'
import { useI18n, useLocalePath } from '#imports'

import type { ModifyAdvertForm, ProductReadApiItem, BookReadApiItem, ServiceReadApiItem } from '~/types/advert'
import type { Subject, SchoolGrade, ProductCategory, Language, BookCategory } from '~/types/advertDetail'

type DetailedAdvert = ModifyAdvertForm | ProductReadApiItem | BookReadApiItem | ServiceReadApiItem

interface Props {
  mode: 'create' | 'modify'
  initialData?: DetailedAdvert | null
  isSubmitting?: boolean
  errorMessage?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [formData: Partial<ModifyAdvertForm>, category: AdvertType]
  cancel: []
}>()

const { locale } = useI18n()
const localePath = useLocalePath()
const detailsService = getAdvertDetailsService()

// Dropdown raw data
const rawSubjects = ref<Subject[]>([])
const rawSchoolGrades = ref<SchoolGrade[]>([])
const rawLanguages = ref<Language[]>([])
const rawProductCategories = ref<ProductCategory[]>([])
const rawBookCategories = ref<BookCategory[]>([])

interface LocalizableItem {
  [key: string]: unknown
}

// Localized computed dropdown lists
const localizeOptions = (items: LocalizableItem[], idKey: string, nameKey: string = 'name') => {
  return items.map((item) => {
    let label = String(item[nameKey] ?? '')
    const frVal = item[`${nameKey}Fr`]
    const itVal = item[`${nameKey}It`]
    const deVal = item[`${nameKey}De`]
    if (locale.value === 'fr' && typeof frVal === 'string') {
      label = frVal
    } else if (locale.value === 'it' && typeof itVal === 'string') {
      label = itVal
    } else if (locale.value === 'de' && typeof deVal === 'string') {
      label = deVal
    }
    return {
      value: item[idKey] as string | number,
      labelKey: label
    }
  })
}

const subjects = computed(() => localizeOptions(rawSubjects.value as unknown as LocalizableItem[], 'subjectId'))
const schoolGrades = computed(() => localizeOptions(rawSchoolGrades.value as unknown as LocalizableItem[], 'schoolGradeId'))
const advertLanguages = computed(() => localizeOptions(rawLanguages.value as unknown as LocalizableItem[], 'label'))
const productCategories = computed(() => localizeOptions(rawProductCategories.value as unknown as LocalizableItem[], 'productCategoryId'))
const bookCategories = computed(() => localizeOptions(rawBookCategories.value as unknown as LocalizableItem[], 'bookCategoryId'))

// Fetch dropdown options in parallel on mount
onMounted(async () => {
  try {
    const [subjectsData, gradesData, languagesData, prodCatData, bookCatData] = await Promise.all([
      detailsService.getSubjects(),
      detailsService.getSchoolGrades(),
      detailsService.getLanguages(),
      detailsService.getProductCategories(),
      detailsService.getBookCategories()
    ])
    rawSubjects.value = subjectsData
    rawSchoolGrades.value = gradesData
    rawLanguages.value = languagesData
    rawProductCategories.value = prodCatData
    rawBookCategories.value = bookCatData
  } catch (error) {
    console.error('Error fetching dropdown options:', error)
  }
})

// Form state
const category = ref(AdvertType.PRODUCT)
const errors = ref<{ [key: string]: string }>({})
const form = ref({
  title: '',
  description: '',
  price: 0,

  subjectId: 1,
  schoolGradeId: 1,
  teachingLanguage: 'FR',
  studyLevel: '',

  condition: AdvertCondition.NEW,
  productCategoryId: 1,
  weight: 0,

  author: '',
  publisher: '',
  edition: '',
  isbn: '',
  bookCategoryId: 1,
  writtenLanguage: 'FR'
})

// Commented-out files state as requested
// const uploadedFiles = ref<File[]>([])
// const handleImageUpload = (event: Event) => {
//   const input = event.target as HTMLInputElement
//   if (input.files) {
//     uploadedFiles.value = Array.from(input.files)
//     form.value.pictures = uploadedFiles.value
//     errors.value.images = ''
//   }
// }

interface DetailedAdvertData {
  type?: AdvertType
  category?: AdvertType
  title?: string
  description?: string
  price?: number
  subjectId?: number | null
  schoolGradeId?: number | null
  teachingLanguage?: string | null
  studyLevel?: string | null
  condition?: AdvertCondition | null
  productCategoryId?: number | null
  weight?: number | null
  author?: string | null
  publisher?: string | null
  edition?: string | null
  isbn?: string | null
  bookCategoryId?: number | null
  writtenLanguage?: string | null
}

// Sync form data if initialData is provided (in modify mode)
watch(() => props.initialData, (newData) => {
  if (newData) {
    const data = newData as unknown as DetailedAdvertData
    if (data.type) {
      category.value = data.type
    } else if (data.category) {
      category.value = data.category
    }

    form.value = {
      title: data.title ?? '',
      description: data.description ?? '',
      price: data.price ?? 0,

      subjectId: data.subjectId ?? 1,
      schoolGradeId: data.schoolGradeId ?? 1,
      teachingLanguage: data.teachingLanguage ?? 'FR',
      studyLevel: data.studyLevel ?? '',

      condition: data.condition ?? AdvertCondition.NEW,
      productCategoryId: data.productCategoryId ?? 1,
      weight: data.weight ?? 0,

      author: data.author ?? '',
      publisher: data.publisher ?? '',
      edition: data.edition ?? '',
      isbn: data.isbn ?? '',
      bookCategoryId: data.bookCategoryId ?? 1,
      writtenLanguage: data.writtenLanguage ?? 'FR'
    }
  }
}, { immediate: true })

const validateForm = (): boolean => {
  errors.value = {}

  // Validation for empty fields
  if (!category.value) {
    errors.value.category = $t('advertForm.error.empty.category')
    return false
  }

  const title = form.value.title ?? ''
  const description = form.value.description ?? ''
  const publisher = form.value.publisher ?? ''
  const edition = form.value.edition ?? ''
  const isbn = form.value.isbn ?? ''
  const author = form.value.author ?? ''
  const studyLevel = form.value.studyLevel ?? ''

  if (!title.trim()) {
    errors.value.title = $t('advertForm.error.empty.title')
  }

  if (!description.trim()) {
    errors.value.description = $t('advertForm.error.empty.description')
  }

  if (form.value.price === null || form.value.price === undefined || form.value.price <= 0) {
    errors.value.price = $t('advertForm.error.empty.price')
  }

  switch (category.value) {
    case AdvertType.SERVICE:
      if (!form.value.subjectId) {
        errors.value.subjectId = $t('advertForm.error.empty.subjectId')
      }
      if (!form.value.schoolGradeId) {
        errors.value.schoolGradeId = $t('advertForm.error.empty.schoolGradeId')
      }
      if (!form.value.teachingLanguage) {
        errors.value.teachingLanguage = $t('advertForm.error.empty.teachingLanguage')
      }
      if (!studyLevel.trim()) {
        errors.value.studyLevel = $t('advertForm.error.empty.studyLevel')
      }
      break
    case AdvertType.PRODUCT:
      if (!form.value.condition) {
        errors.value.condition = $t('advertForm.error.empty.condition')
      }
      if (!form.value.productCategoryId) {
        errors.value.productCategoryId = $t('advertForm.error.empty.productCategoryId')
      }
      // if (uploadedFiles.value.length === 0) {
      //   errors.value.images = $t('advertForm.error.empty.images')
      // }
      break
    case AdvertType.BOOK:
      if (!form.value.condition) {
        errors.value.condition = $t('advertForm.error.empty.condition')
      }
      if (!publisher.trim()) {
        errors.value.publisher = $t('advertForm.error.empty.publisher')
      }
      if (!edition.trim()) {
        errors.value.edition = $t('advertForm.error.empty.edition')
      }
      if (!isbn.trim()) {
        errors.value.isbn = $t('advertForm.error.empty.isbn')
      }
      if (form.value.bookCategoryId === null || form.value.bookCategoryId === undefined || form.value.bookCategoryId < 0) {
        errors.value.bookCategoryId = $t('advertForm.error.empty.bookCategoryId')
      }
      if (!form.value.writtenLanguage) {
        errors.value.writtenLanguage = $t('advertForm.error.empty.writtenLanguage')
      }
      if (!author.trim()) {
        errors.value.author = $t('advertForm.error.empty.author')
      }
      // if (uploadedFiles.value.length === 0) {
      //   errors.value.images = $t('advertForm.error.empty.images')
      // }
      break
  }

  if (Object.keys(errors.value).length > 0) {
    return false
  }

  // Additional validations (size, SQL injection, regex format, etc.)

  // Title length validation
  if (title.length < 3) {
    errors.value.title = $t('advertForm.error.invalid.titleLengthMin')
  }
  if (title.length > 200) {
    errors.value.title = $t('advertForm.error.invalid.titleLengthMax')
  }

  // Description length validation
  if (description.length < 10) {
    errors.value.description = $t('advertForm.error.invalid.descriptionLengthMin')
  }
  if (description.length > 2000) {
    errors.value.description = $t('advertForm.error.invalid.descriptionLengthMax')
  }

  // SQL injection prevention - check for suspicious patterns
  const sqlInjectionPattern = /('|(--)|;|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union)/i
  if (
    (title || description || author || publisher || edition || isbn || studyLevel)
    && (sqlInjectionPattern.test(title)
      || sqlInjectionPattern.test(description)
      || sqlInjectionPattern.test(author)
      || sqlInjectionPattern.test(publisher)
      || sqlInjectionPattern.test(edition)
      || sqlInjectionPattern.test(isbn)
      || sqlInjectionPattern.test(studyLevel))
  ) {
    errors.value.content = $t('advertForm.error.invalid.sqlInjection')
  }

  // Price validation
  if (form.value.price < 0) {
    errors.value.price = $t('advertForm.error.invalid.priceNegative')
  }
  if (form.value.price > 500) {
    errors.value.price = $t('advertForm.error.invalid.priceMax')
  }
  if (!/^\d+(\.\d{1,2})?$/.test(form.value.price.toString())) {
    errors.value.price = $t('advertForm.error.invalid.priceFormat')
  }

  // const maxFileSize = 5 * 1024 * 1024 // 5MB
  switch (category.value) {
    case AdvertType.SERVICE:
      if (form.value.subjectId < 1) {
        errors.value.subjectId = $t('advertForm.error.invalid.subjectId')
      }
      if (form.value.schoolGradeId < 1) {
        errors.value.schoolGradeId = $t('advertForm.error.invalid.schoolGradeId')
      }
      if (!form.value.teachingLanguage) {
        errors.value.teachingLanguage = $t('advertForm.error.invalid.teachingLanguage')
      }
      if (studyLevel.length > 50) {
        errors.value.studyLevel = $t('advertForm.error.invalid.studyLevelLength')
      }
      break
    case AdvertType.BOOK: {
      if (form.value.bookCategoryId < 0) {
        errors.value.bookCategoryId = $t('advertForm.error.invalid.bookCategoryId')
      }
      if (!form.value.writtenLanguage) {
        errors.value.writtenLanguage = $t('advertForm.error.invalid.writtenLanguage')
      }
      // ISBN validation (books only)
      const cleanIsbn = isbn.replace(/[\s-]/g, '')
      const isValidIsbn10 = /^\d{9}[\dX]$/i.test(cleanIsbn)
      const isValidIsbn13 = /^97[89]\d{10}$/.test(cleanIsbn)
      if (!isValidIsbn10 && !isValidIsbn13) {
        errors.value.isbn = $t('advertForm.error.invalid.isbnFormat')
      }
      // Author and Publisher length validation (books only)
      if (author.length > 150) {
        errors.value.author = $t('advertForm.error.invalid.authorLength')
      }
      if (publisher.length > 150) {
        errors.value.publisher = $t('advertForm.error.invalid.publisherLength')
      }
      // Edition length validation (books only)
      if (edition.length > 150) {
        errors.value.edition = $t('advertForm.error.invalid.editionLength')
      }
      if (form.value.weight < 0) {
        errors.value.weight = $t('advertForm.error.invalid.weightNegative')
      }
      // File size validation
      // uploadedFiles.value.forEach((file) => {
      //   if (file.size > maxFileSize) {
      //     errors.value.images = $t('advertForm.error.invalid.imageSize')
      //   }
      //   // Validate file type
      //   if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      //     errors.value.images = $t('advertForm.error.invalid.imageType')
      //   }
      // })

      // // Maximum number of files validation
      // if (uploadedFiles.value.length > 10) {
      //   errors.value.images = $t('advertForm.error.invalid.imageCount')
      // }
      break
    }
    case AdvertType.PRODUCT:
      if (form.value.weight < 0) {
        errors.value.weight = $t('advertForm.error.invalid.weightNegative')
      }
      // File size validation
      // uploadedFiles.value.forEach((file) => {
      //   if (file.size > maxFileSize) {
      //     errors.value.images = $t('advertForm.error.invalid.imageSize')
      //   }
      //   // Validate file type
      //   if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      //     errors.value.images = $t('advertForm.error.invalid.imageType')
      //   }
      // })

      // // Maximum number of files validation
      // if (uploadedFiles.value.length > 10) {
      //   errors.value.images = $t('advertForm.error.invalid.imageCount')
      // }
      break
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }
  emit('submit', form.value, category.value)
}
</script>

<template>
  <form
    class="space-y-8"
    @submit.prevent="handleSubmit"
  >
    <!-- Category type selector (only shown in create mode) -->
    <section
      v-if="props.mode === 'create'"
      class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5"
    >
      <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-primary"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        {{ $t('advertForm.form.information') }}
      </h2>
      <div class="mt-4">
        <label class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Type de catégorie</label>
        <div class="grid gap-3 sm:grid-cols-3">
          <label class="cursor-pointer">
            <input
              id="cat-supply"
              v-model="category"
              class="peer sr-only"
              name="category"
              type="radio"
              :value="AdvertType.PRODUCT"
            >
            <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
              <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('advertTypes.product') }}</span>
            </div>
          </label>
          <label class="cursor-pointer">
            <input
              id="cat-books"
              v-model="category"
              class="peer sr-only"
              name="category"
              type="radio"
              :value="AdvertType.BOOK"
            >
            <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
              <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('advertTypes.book') }}</span>
            </div>
          </label>
          <label class="cursor-pointer">
            <input
              id="cat-tutoring"
              v-model="category"
              class="peer sr-only"
              name="category"
              type="radio"
              :value="AdvertType.SERVICE"
            >
            <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
              <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('advertTypes.service') }}</span>
            </div>
          </label>
        </div>
      </div>
      <p
        v-show="errors.category != null"
        class="mt-1 min-h-5 text-sm text-red-500"
      >
        {{ errors.category }}
      </p>
    </section>

    <!-- Detailed Information Section -->
    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-primary"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
        {{ $t('advertForm.form.detailedInformation') }}
      </h2>
      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <FormInput
          v-model="form.title"
          class="col-span-2"
          :error="errors.title"
          label="title"
          label-key="title"
          type="text"
        />
        <FormSelect
          v-show="category == AdvertType.PRODUCT || category == AdvertType.BOOK"
          v-model="form.condition"
          :error="errors.condition"
          label="condition"
          label-key="condition"
          :options="[
            { value: AdvertCondition.NEW, labelKey: $t('advertConditions.new') },
            { value: AdvertCondition.LIKE_NEW, labelKey: $t('advertConditions.likeNew') },
            { value: AdvertCondition.USED, labelKey: $t('advertConditions.used') }
          ]"
        />
        <FormSelect
          v-show="category == AdvertType.PRODUCT"
          v-model="form.productCategoryId"
          :error="errors.productCategoryId"
          label="productCategoryId"
          label-key="productCategoryId"
          :options="productCategories"
        />
        <FormInput
          v-show="category == AdvertType.BOOK"
          v-model="form.author"
          :error="errors.author"
          label="author"
          label-key="author"
          type="text"
        />
        <FormInput
          v-show="category == AdvertType.BOOK"
          v-model="form.publisher"
          :error="errors.publisher"
          label="publisher"
          label-key="publisher"
          type="text"
        />
        <FormInput
          v-show="category == AdvertType.BOOK"
          v-model="form.edition"
          :error="errors.edition"
          label="edition"
          label-key="edition"
          type="text"
        />
        <FormInput
          v-show="category == AdvertType.BOOK"
          v-model="form.isbn"
          :error="errors.isbn"
          label="isbn"
          label-key="isbn"
          type="text"
        />
        <FormSelect
          v-show="category == AdvertType.BOOK"
          v-model="form.bookCategoryId"
          :error="errors.bookCategoryId"
          label="bookCategoryId"
          label-key="bookCategoryId"
          :options="bookCategories"
        />
        <FormSelect
          v-show="category == AdvertType.BOOK"
          v-model="form.writtenLanguage"
          :error="errors.writtenLanguage"
          label="writtenLanguage"
          label-key="writtenLanguage"
          :options="advertLanguages"
        />
        <div v-show="category == AdvertType.PRODUCT || category == AdvertType.BOOK">
          <label
            class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400"
            for="weight"
          >
            {{ $t('advertForm.form.weight') }}
          </label>
          <div class="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:bg-gray-800 dark:border-gray-400">
            <input
              id="weight"
              v-model.number="form.weight"
              class="w-full bg-transparent px-4 py-3 text-sm outline-none dark:text-gray-300"
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
            >
          </div>
          <p class="mt-1 min-h-5 text-sm text-red-500">
            {{ errors.weight || ' ' }}
          </p>
        </div>
        <FormSelect
          v-show="category == AdvertType.SERVICE"
          v-model="form.subjectId"
          :error="errors.subjectId"
          label="subjectId"
          label-key="subjectId"
          :options="subjects"
        />
        <FormSelect
          v-show="category == AdvertType.SERVICE"
          v-model="form.schoolGradeId"
          :error="errors.schoolGradeId"
          label="schoolGradeId"
          label-key="schoolGradeId"
          :options="schoolGrades"
        />
        <FormSelect
          v-show="category == AdvertType.SERVICE"
          v-model="form.teachingLanguage"
          :error="errors.teachingLanguage"
          label="teachingLanguage"
          label-key="teachingLanguage"
          :options="advertLanguages"
        />
        <FormInput
          v-show="category == AdvertType.SERVICE"
          v-model="form.studyLevel"
          :error="errors.studyLevel"
          label="studyLevel"
          label-key="studyLevel"
          type="text"
        />
        <FormTextArea
          v-model="form.description"
          :error="errors.description"
          label="description"
          label-key="description"
          class="col-span-2"
        />
      </div>
    </section>

    <!-- Sales Section -->
    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-primary"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
        {{ $t('advertForm.form.sales') }}
      </h2>
      <div class="mt-5 grid gap-5 md:grid-cols-3">
        <div>
          <label
            class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400"
            for="price"
          >
            {{ $t('advertForm.form.price') }}
          </label>
          <div class="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:bg-gray-800 dark:border-gray-400">
            <input
              id="price"
              v-model.number="form.price"
              class="w-full bg-transparent px-4 py-3 text-sm outline-none dark:text-gray-300"
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
            >
            <span class="px-4 text-sm font-medium text-gray-500">
              CHF
            </span>
          </div>
          <p class="mt-1 min-h-5 text-sm text-red-500">
            {{ errors.price || ' ' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Commented out Image Upload sections to be implemented after, as requested -->
    <!--
    <FormImageUploader
      v-show="category == AdvertType.PRODUCT || category == AdvertType.BOOK"
      v-model="uploadedFiles"
      :error="errors.images"
    />
    <section
      v-show="category == AdvertType.PRODUCT || category == AdvertType.BOOK"
      class="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5"
    >
      <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-primary"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
          />
        </svg>
        {{ $t('advertForm.form.images') }}
      </h2>
      <label class="mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center cursor-pointer dark:bg-gray-800 dark:border-gray-400">
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        >
        <div class="rounded-full bg-primary/10 p-4 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
        </div>
        <div v-if="uploadedFiles.length == 0">
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-300">
            {{ $t('advertForm.form.uploadImages') }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ $t('advertForm.form.dragDrop') }}
          </p>
        </div>
        <div
          v-else
          class="space-y-2"
        >
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-300">
            {{ uploadedFiles.length }} {{ $t('advertForm.form.uploadedImages') }}
          </p>
          <ul class="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
            <li
              v-for="file in uploadedFiles"
              :key="file.name"
            >{{ file.name }}</li>
          </ul>
        </div>
      </label>
      <p
        v-show="errors.images != null"
        class="mt-2 min-h-5 text-sm text-red-500"
      >
        {{ errors.images }}
      </p>
    </section>
    -->

    <p
      v-show="errors.content != null || props.errorMessage"
      class="mt-2 min-h-5 text-sm flex justify-center text-red-500"
    >
      {{ errors.content || props.errorMessage }}
    </p>

    <!-- Action buttons -->
    <div class="flex justify-between">
      <NuxtLink
        :to="localePath('/me/adverts')"
        class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        {{ $t('advertForm.form.cancel') }}
      </NuxtLink>
      <button
        class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
        type="submit"
        :disabled="props.isSubmitting"
      >
        <template v-if="props.isSubmitting">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </template>
        {{ props.mode === 'create' ? $t('advertForm.form.publish') : $t('advertForm.form.modify') }}
        <svg
          v-if="!props.isSubmitting"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
  </form>
</template>
