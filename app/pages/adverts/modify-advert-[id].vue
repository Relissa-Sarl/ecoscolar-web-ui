<script setup lang="ts">
import { ref, onMounted as vueOnMounted } from 'vue'

import type { ModifyAdvertForm } from '~/types/advert'
import { AdvertCondition } from '~/utils/enum/advertCondition'
import { AdvertType } from '~/utils/enum/advertType'
import { AdvertLanguage } from '~/utils/enum/advertLanguage'
import { getAdvertService } from '~/services/advertService'

const route = useRoute()
const localePath = useLocalePath()
const userStore = useUsersStore()

definePageMeta({
  middleware: 'auth'
})

const id = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

const advert = ref()
const advertLoading = ref(true)
const advertIsGet = ref(true)
// const uploadedFiles = ref<File[]>([])
const category = ref()
const errors = ref<{ [key: string]: string }>({})

const form = ref({
  title: advert.value?.title,
  description: advert.value?.description,
  price: advert.value?.price,

  subjectId: advert.value?.subjectId || null,
  schoolLevelId: advert.value?.schoolGradeId || null,
  teachingLanguage: advert.value?.teachingLanguage || null,
  specificStudyLevel: advert.value?.studyLevel || null,

  condition: advert.value?.condition || null,

  author: advert.value?.author || null,
  publisher: advert.value?.publisher || null,
  edition: advert.value?.edition || null,
  isbn: advert.value?.isbn || null,
  bookCategoryId: advert.value?.bookCategoryId || null,
  writtenLanguage: advert.value?.writtenLanguage || null
})

// const handleImageUpload = (event: Event) => {
//   const input = event.target as HTMLInputElement
//   if (input.files) {
//     uploadedFiles.value = Array.from(input.files)
//     form.value.pictures = uploadedFiles.value
//     errors.value.images = ''
//   }
// }

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.title || !form.value.title.trim()) {
    errors.value.title = $t('advertForm.error.empty.title')
  }

  if (!form.value.description || !form.value.description.trim()) {
    errors.value.description = $t('advertForm.error.empty.description')
  }

  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = $t('advertForm.error.empty.price')
  }

  switch (category.value) {
    case AdvertType.SERVICE:
      if (!form.value.subjectId) {
        errors.value.subjectId = $t('advertForm.error.empty.subjectId')
      }
      if (!form.value.schoolLevelId) {
        errors.value.schoolLevelId = $t('advertForm.error.empty.schoolGradeId')
      }
      if (!form.value.teachingLanguage) {
        errors.value.teachingLanguage = $t('advertForm.error.empty.teachingLanguage')
      }
      if (!form.value.specificStudyLevel?.trim()) {
        errors.value.specificStudyLevel = $t('advertForm.error.empty.studyLevel')
      }
      break
    case AdvertType.PRODUCT:
      if (!form.value.condition) {
        errors.value.condition = $t('advertForm.error.empty.condition')
      }
      // if (uploadedFiles.value.length === 0) {
      //   errors.value.images = $t('advertForm.error.empty.images')
      // }
      break
    case AdvertType.BOOK:
      if (!form.value.condition) {
        errors.value.condition = $t('advertForm.error.empty.condition')
      }
      if (!form.value.publisher || !form.value.publisher.trim()) {
        errors.value.publisher = $t('advertForm.error.empty.publisher')
      }
      if (!form.value.edition || !form.value.edition.trim()) {
        errors.value.edition = $t('advertForm.error.empty.edition')
      }
      if (!form.value.isbn || !form.value.isbn.trim()) {
        errors.value.isbn = $t('advertForm.error.empty.isbn')
      }
      if (form.value.bookCategoryId === null || form.value.bookCategoryId < 0) {
        errors.value.bookCategoryId = $t('advertForm.error.empty.bookCategoryId')
      }
      if (!form.value.writtenLanguage) {
        errors.value.writtenLanguage = $t('advertForm.error.empty.writtenLanguage')
      }
      if (!form.value.author || !form.value.author.trim()) {
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
  if (form.value.title && form.value.title.length < 3) {
    errors.value.title = $t('advertForm.error.invalid.titleLengthMin')
  }
  if (form.value.title && form.value.title.length > 200) {
    errors.value.title = $t('advertForm.error.invalid.titleLengthMax')
  }

  // Description length validation
  if (form.value.description && form.value.description.length < 10) {
    errors.value.description = $t('advertForm.error.invalid.descriptionLengthMin')
  }
  if (form.value.description && form.value.description.length > 2000) {
    errors.value.description = $t('advertForm.error.invalid.descriptionLengthMax')
  }

  // SQL injection prevention - check for suspicious patterns
  const sqlInjectionPattern = /('|(--)|;|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union)/i
  const title = form.value.title ?? ''
  const description = form.value.description ?? ''
  const author = form.value.author ?? ''
  const publisher = form.value.publisher ?? ''
  const edition = form.value.edition ?? ''
  const isbn = form.value.isbn ?? ''
  const specificStudyLevel = form.value.specificStudyLevel ?? ''

  if ((title || description || author || publisher || edition || isbn || specificStudyLevel) && (sqlInjectionPattern.test(title) || sqlInjectionPattern.test(description) || sqlInjectionPattern.test(author) || sqlInjectionPattern.test(publisher) || sqlInjectionPattern.test(edition) || sqlInjectionPattern.test(isbn) || sqlInjectionPattern.test(specificStudyLevel))) {
    errors.value.content = $t('advertForm.error.invalid.sqlInjection')
  }

  // Price validation
  if (form.value.price && form.value.price < 0) {
    errors.value.price = $t('advertForm.error.invalid.priceNegative')
  }
  if (form.value.price && form.value.price > 500) {
    errors.value.price = $t('advertForm.error.invalid.priceMax')
  }
  if (form.value.price && !/^\d+(\.\d{1,2})?$/.test(form.value.price.toString())) {
    errors.value.price = $t('advertForm.error.invalid.priceFormat')
  }

  // const maxFileSize = 5 * 1024 * 1024 // 5MB
  switch (category.value) {
    case AdvertType.SERVICE:
      if (form.value.subjectId && form.value.subjectId < 1) {
        errors.value.subjectId = $t('advertForm.error.invalid.subjectId')
      }
      if (form.value.schoolLevelId && form.value.schoolLevelId < 1) {
        errors.value.schoolLevelId = $t('advertForm.error.invalid.schoolGradeId')
      }
      if (!form.value.teachingLanguage) {
        errors.value.teachingLanguage = $t('advertForm.error.invalid.teachingLanguage')
      }
      if (form.value.specificStudyLevel && form.value.specificStudyLevel.length > 50) {
        errors.value.specificStudyLevel = $t('advertForm.error.invalid.studyLevelLength')
      }
      break
    case AdvertType.BOOK:
      if (form.value.bookCategoryId && form.value.bookCategoryId < 0) {
        errors.value.bookCategoryId = $t('advertForm.error.invalid.bookCategoryId')
      }
      if (!form.value.writtenLanguage) {
        errors.value.writtenLanguage = $t('advertForm.error.invalid.writtenLanguage')
      }
      // ISBN validation (books only)
      if (form.value.isbn && !/^(?:\d-\d{4}-\d{4}-\d|97[89]-\d-\d{4}-\d{4}-\d)$/.test(form.value.isbn)) {
        errors.value.isbn = $t('advertForm.error.invalid.isbnFormat')
      }
      // Author and Publisher length validation (books only)
      if (form.value.author && form.value.author.length > 150) {
        errors.value.author = $t('advertForm.error.invalid.authorLength')
      }
      if (form.value.publisher && form.value.publisher.length > 150) {
        errors.value.publisher = $t('advertForm.error.invalid.publisherLength')
      }
      // Edition length validation (books only)
      if (form.value.edition && form.value.edition.length > 150) {
        errors.value.edition = $t('advertForm.error.invalid.editionLength')
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

      // Maximum number of files validation
      // if (uploadedFiles.value.length > 10) {
      //   errors.value.images = $t('advertForm.error.invalid.imageCount')
      // }
      break
    case AdvertType.PRODUCT:
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

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  let formData = new Object()

  try {
    switch (category.value) {
      case AdvertType.PRODUCT:
        formData = {
          title: form.value.title,
          description: form.value.description,
          price: form.value.price,
          userId: userStore.user?.id,
          condition: form.value.condition
        }

        await getAdvertService().updateProductAdvert(id, formData as Partial<ModifyAdvertForm>)
        break
      case AdvertType.BOOK:
        formData = {
          title: form.value.title,
          description: form.value.description,
          price: form.value.price,
          userId: userStore.user?.id,
          condition: form.value.condition,
          author: form.value.author,
          publisher: form.value.publisher,
          isbn: form.value.isbn,
          categoryId: form.value.bookCategoryId,
          writtenLanguage: form.value.writtenLanguage,
          edition: form.value.edition
        }

        await getAdvertService().updateBookAdvert(id, formData as Partial<ModifyAdvertForm>)
        break
      case AdvertType.SERVICE:
        formData = {
          title: form.value.title,
          description: form.value.description,
          price: form.value.price,
          userId: userStore.user?.id,
          subjectId: form.value.subjectId,
          schoolLevelId: form.value.schoolLevelId,
          teachingLanguage: form.value.teachingLanguage,
          specificStudyLevel: form.value.specificStudyLevel
        }

        await getAdvertService().updateServiceAdvert(id, formData as Partial<ModifyAdvertForm>)
        break
    }
    await navigateTo(localePath('/me/adverts')) // Redirect to adverts list after successful creation
  } catch (error) {
    console.error('Error creating advert:', error)
    errors.value.content = $t('modifyAdvert.error.modificationFailed')
  }
}

// adverts/id en get
// adverts/products/id ou adverts/services/id ou adverts/books/id en put

vueOnMounted(async () => {
  if (!route.params.id || Number.isNaN(id) || id < 1) {
    advertIsGet.value = false
    advertLoading.value = false
    return
  }

  try {
    const advertService = getAdvertService()
    const fetchedAdvert = await advertService.getAdvert(id)

    if (fetchedAdvert && fetchedAdvert.userId !== userStore.user?.id) {
      advertIsGet.value = false
      advertLoading.value = false
      return
    }

    advert.value = fetchedAdvert
    category.value = advert.value?.type
    switch (advert.value?.type) {
      case AdvertType.PRODUCT:
        advert.value = await advertService.getProduct(id)
        break
      case AdvertType.BOOK:
        advert.value = await advertService.getBook(id)
        break
      case AdvertType.SERVICE:
        advert.value = await advertService.getService(id)
        break
    }

    form.value = {
      title: advert.value?.title,
      description: advert.value?.description,
      price: advert.value?.price,

      subjectId: advert.value?.subjectId,
      schoolLevelId: advert.value?.schoolGradeId,
      teachingLanguage: advert.value?.teachingLanguage,
      specificStudyLevel: advert.value?.studyLevel,

      condition: advert.value?.condition,

      author: advert.value?.author,
      publisher: advert.value?.publisher,
      edition: advert.value?.edition,
      isbn: advert.value?.isbn,
      bookCategoryId: advert.value?.bookCategoryId,
      writtenLanguage: advert.value?.writtenLanguage
    }
  } catch (error) {
    console.error('Error fetching advert from backend:', error)
    advertIsGet.value = false
  } finally {
    advertLoading.value = false
  }
})
</script>

<template>
  <div
    v-if="advertIsGet && advertLoading == false"
    class="min-h-screen px-4 py-6 text-gray-900 dark:text-gray-50 md:px-6 lg:px-8"
  >
    <div class="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
      <!-- <AppFilter/> -->
      <div class="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-8">
        <header class="mb-8">
          <p class="mb-2 text-sm font-medium uppercase tracking-wide text-primary">
            {{ $t('modifyAdvert.existingAdvert') }}
          </p>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
            {{ $t('modifyAdvert.modifyAdvert') }} {{ advert?.title ? `: ${advert.title}` : '' }}
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-500">
            {{ $t('modifyAdvert.description') }}
          </p>
        </header>

        <form
          class="space-y-8"
          @submit.prevent="handleSubmit"
        >
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
              <div class="col-span-2">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="title"
                >
                  {{ $t('advertForm.form.title') }}
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                  :placeholder="$t('advertForm.form.titlePlaceholder')"
                  type="text"
                >
                <p class="mt-1 min-h-5 text-sm text-red-500">
                  {{ errors.title || ' ' }}
                </p>
              </div>
              <div v-show="category == AdvertType.PRODUCT || category == AdvertType.BOOK">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="condition"
                >
                  {{ $t('advertForm.form.condition') }}
                </label>
                <select
                  id="condition"
                  v-model="form.condition"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                >
                  <option :value="AdvertCondition.NEW">
                    {{ $t('advertConditions.new') }}
                  </option>
                  <option :value="AdvertCondition.LIKE_NEW">
                    {{ $t('advertConditions.likeNew') }}
                  </option>
                  <option :value="AdvertCondition.USED">
                    {{ $t('advertConditions.used') }}
                  </option>
                </select>
                <p
                  v-show="errors.condition != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.condition }}
                </p>
              </div>
              <div v-show="category == AdvertType.BOOK">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="author"
                >
                  {{ $t('advertForm.form.author') }}
                </label>
                <input
                  id="author"
                  v-model="form.author"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                  :placeholder="$t('advertForm.form.authorPlaceholder')"
                  type="text"
                >
                <p
                  v-show="errors.author != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.author }}
                </p>
              </div>
              <div v-show="category == AdvertType.BOOK">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="publisher"
                >
                  {{ $t('advertForm.form.publisher') }}
                </label>
                <input
                  id="publisher"
                  v-model="form.publisher"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                  :placeholder="$t('advertForm.form.publisherPlaceholder')"
                  type="text"
                >
                <p
                  v-show="errors.publisher != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.publisher }}
                </p>
              </div>
              <div v-show="category == AdvertType.BOOK">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="edition"
                >
                  {{ $t('advertForm.form.edition') }}
                </label>
                <input
                  id="edition"
                  v-model="form.edition"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                  :placeholder="$t('advertForm.form.editionPlaceholder')"
                  type="text"
                >
                <p
                  v-show="errors.edition != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.edition }}
                </p>
              </div>
              <div v-show="category == AdvertType.BOOK">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="isbn"
                >
                  {{ $t('advertForm.form.isbn') }}
                </label>
                <div class="relative">
                  <input
                    id="isbn"
                    v-model="form.isbn"
                    class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                    :placeholder="$t('advertForm.form.isbnPlaceholder')"
                    type="text"
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                    />
                  </svg>
                </div>
                <p
                  v-show="errors.isbn != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.isbn }}
                </p>
              </div>
              <div v-show="category == AdvertType.BOOK">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="bookCategoryId"
                >
                  {{ $t('advertForm.form.bookCategoryId') }}
                </label>
                <select
                  id="bookCategoryId"
                  v-model="form.bookCategoryId"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                >
                  <option :value="1">
                    {{ $t('advertCategories.none') }}
                  </option>
                  <option :value="2">
                    {{ $t('advertCategories.math') }}
                  </option>
                  <option :value="3">
                    {{ $t('advertCategories.french') }}
                  </option>
                  <option :value="4">
                    {{ $t('advertCategories.german') }}
                  </option>
                  <option :value="5">
                    {{ $t('advertCategories.italian') }}
                  </option>
                  <option :value="6">
                    {{ $t('advertCategories.history') }}
                  </option>
                  <option :value="7">
                    {{ $t('advertCategories.physics') }}
                  </option>
                  <option :value="8">
                    {{ $t('advertCategories.languages') }}
                  </option>
                </select>
                <p
                  v-show="errors.bookCategoryId != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.bookCategoryId }}
                </p>
              </div>
              <div v-show="category == AdvertType.BOOK">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="writtenLanguage"
                >
                  {{ $t('advertForm.form.writtenLanguage') }}
                </label>
                <select
                  id="writtenLanguage"
                  v-model="form.writtenLanguage"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                >
                  <option :value="AdvertLanguage.FR">
                    {{ $t('fr') }}
                  </option>
                  <option :value="AdvertLanguage.DE">
                    {{ $t('de') }}
                  </option>
                  <option :value="AdvertLanguage.IT">
                    {{ $t('it') }}
                  </option>
                </select>
                <p
                  v-show="errors.writtenLanguage != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.writtenLanguage }}
                </p>
              </div>
              <div v-show="category == AdvertType.SERVICE">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="subjectId"
                >
                  {{ $t('advertForm.form.subjectId') }}
                </label>
                <select
                  id="subjectId"
                  v-model="form.subjectId"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                >
                  <option :value="1">
                    {{ $t('advertCategories.none') }}
                  </option>
                  <option :value="2">
                    {{ $t('advertCategories.math') }}
                  </option>
                  <option :value="3">
                    {{ $t('advertCategories.french') }}
                  </option>
                  <option :value="4">
                    {{ $t('advertCategories.german') }}
                  </option>
                  <option :value="5">
                    {{ $t('advertCategories.italian') }}
                  </option>
                  <option :value="6">
                    {{ $t('advertCategories.history') }}
                  </option>
                  <option :value="7">
                    {{ $t('advertCategories.physics') }}
                  </option>
                  <option :value="8">
                    {{ $t('advertCategories.languages') }}
                  </option>
                </select>
                <p
                  v-show="errors.subjectId != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.subjectId }}
                </p>
              </div>
              <div v-show="category == AdvertType.SERVICE">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="schoolLevelId"
                >
                  {{ $t('advertForm.form.schoolGradeId') }}
                </label>
                <select
                  id="schoolLevelId"
                  v-model="form.schoolLevelId"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                >
                  <option :value="1">
                    {{ $t('advertSchoolGrade.primary') }}
                  </option>
                  <option :value="2">
                    {{ $t('advertSchoolGrade.middle') }}
                  </option>
                  <option :value="3">
                    {{ $t('advertSchoolGrade.high') }}
                  </option>
                  <option :value="4">
                    {{ $t('advertSchoolGrade.higher') }}
                  </option>
                </select>
                <p
                  v-show="errors.schoolLevelId != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.schoolLevelId }}
                </p>
              </div>
              <div v-show="category == AdvertType.SERVICE">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="teachingLanguage"
                >
                  {{ $t('advertForm.form.teachingLanguage') }}
                </label>
                <select
                  id="teachingLanguage"
                  v-model="form.teachingLanguage"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                >
                  <option :value="AdvertLanguage.FR">
                    {{ $t('fr') }}
                  </option>
                  <option :value="AdvertLanguage.DE">
                    {{ $t('de') }}
                  </option>
                  <option :value="AdvertLanguage.IT">
                    {{ $t('it') }}
                  </option>
                </select>
                <p
                  v-show="errors.teachingLanguage != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.teachingLanguage }}
                </p>
              </div>
              <div v-show="category == AdvertType.SERVICE">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="studyLevel"
                >
                  {{ $t('advertForm.form.studyLevel') }}
                </label>
                <div class="relative">
                  <input
                    id="studyLevel"
                    v-model="form.specificStudyLevel"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                    :placeholder="$t('advertForm.form.studyLevelPlaceholder')"
                    type="text"
                  >
                </div>
                <p
                  v-show="errors.specificStudyLevel != null"
                  class="mt-1 min-h-5 text-sm text-red-500"
                >
                  {{ errors.specificStudyLevel }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label
                  class="mb-2 block text-sm font-medium text-gray-600"
                  for="description"
                >
                  {{ $t('advertForm.form.description') }}
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  class="min-h-32 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300"
                  :placeholder="$t('advertForm.form.descriptionPlaceholder')"
                  rows="4"
                />
                <p class="mt-1 min-h-5 text-sm text-red-500">
                  {{ errors.description || ' ' }}
                </p>
              </div>
            </div>
          </section>

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
                  class="mb-2 block text-sm font-medium text-gray-600"
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
                    step="0.01"
                    min="0"
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

          <p
            v-show="errors.content != null"
            class="mt-2 min-h-5 text-sm flex justify-center text-red-500"
          >
            {{ errors.content }}
          </p>
          <div class="flex justify-between">
            <NuxtLink
              :to="localePath('/me/adverts')"
              class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {{ $t('advertForm.form.cancel') }}
            </NuxtLink>
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              type="submit"
            >
              {{ $t('advertForm.form.modify') }}
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
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
    v-else
    class="min-h-screen px-4 py-6 text-gray-900 dark:text-gray-50 md:px-6 lg:px-8"
  >
    <div class="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
      <div class="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-8">
        <p
          v-show="advertIsGet == false"
          class="text-center text-red-500"
        >
          {{ $t('modifyAdvert.error.invalidId') }}
        </p>
        <div
          v-show="advertLoading == true"
          class="flex flex-col items-center justify-center gap-4"
        >
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary dark:border-gray-600 dark:border-t-primary" />
          <span class="text-center text-gray-500">
            {{ $t('modifyAdvert.loading') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
