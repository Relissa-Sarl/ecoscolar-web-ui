<script setup lang="ts">
import { ref, onMounted as vueOnMounted } from 'vue'
import type { ModifyAdvertForm } from '~/types/advert'
import { AdvertCondition } from '~/utils/enum/advertCondition'
import { AdvertType } from '~/utils/enum/advertType'
import { getAdvertService } from '~/services/advertService'
import { getAdvertDetailsService } from '~/services/advertDetailsService'
import FormInput from '~/components/advert/FormInput.vue'
import FormSelect from '~/components/advert/FormSelect.vue'
import FormTextArea from '~/components/advert/FormTextArea.vue'
import { useI18n } from '#imports'

const { locale } = useI18n()

const route = useRoute()
const localePath = useLocalePath()
const detailsService = getAdvertDetailsService()
const userStore = useUsersStore()

const subjects = ref<{ value: number, labelKey: string }[]>([])
const schoolGrades = ref<{ value: number, labelKey: string }[]>([])
const productCategories = ref<{ value: number, labelKey: string }[]>([])
const advertLanguages = ref<{ value: string, labelKey: string }[]>([])
const bookCategories = ref<{ value: number, labelKey: string }[]>([])

detailsService.getSubjects().then((subjectsData) => {
  switch (locale.value) {
    case 'fr':
      subjects.value = subjectsData.map(subject => ({
        value: subject.subjectId,
        labelKey: subject.nameFr
      }))
      break
    case 'it':
      subjects.value = subjectsData.map(subject => ({
        value: subject.subjectId,
        labelKey: subject.nameIt
      }))
      break
    case 'de':
      subjects.value = subjectsData.map(subject => ({
        value: subject.subjectId,
        labelKey: subject.nameDe
      }))
      break
    default:
      subjects.value = subjectsData.map(subject => ({
        value: subject.subjectId,
        labelKey: subject.name
      }))
  }
})
detailsService.getSchoolGrades().then((grades) => {
  switch (locale.value) {
    case 'fr':
      schoolGrades.value = grades.map(grade => ({
        value: grade.schoolGradeId,
        labelKey: grade.nameFr
      }))
      break
    case 'it':
      schoolGrades.value = grades.map(grade => ({
        value: grade.schoolGradeId,
        labelKey: grade.nameIt
      }))
      break
    case 'de':
      schoolGrades.value = grades.map(grade => ({
        value: grade.schoolGradeId,
        labelKey: grade.nameDe
      }))
      break
    default:
      schoolGrades.value = grades.map(grade => ({
        value: grade.schoolGradeId,
        labelKey: grade.name
      }))
  }
})
detailsService.getLanguages().then((languages) => {
  switch (locale.value) {
    case 'fr':
      advertLanguages.value = languages.map(lang => ({
        value: lang.label,
        labelKey: lang.nameFr
      }))
      break
    case 'it':
      advertLanguages.value = languages.map(lang => ({
        value: lang.label,
        labelKey: lang.nameIt
      }))
      break
    case 'de':
      advertLanguages.value = languages.map(lang => ({
        value: lang.label,
        labelKey: lang.nameDe
      }))
      break
    default:
      advertLanguages.value = languages.map(lang => ({
        value: lang.label,
        labelKey: lang.name
      }))
  }
})
detailsService.getProductCategories().then((categories) => {
  switch (locale.value) {
    case 'fr':
      productCategories.value = categories.map(cat => ({
        value: cat.productCategoryId,
        labelKey: cat.nameFr
      }))
      break
    case 'it':
      productCategories.value = categories.map(cat => ({
        value: cat.productCategoryId,
        labelKey: cat.nameIt
      }))
      break
    case 'de':
      productCategories.value = categories.map(cat => ({
        value: cat.productCategoryId,
        labelKey: cat.nameDe
      }))
      break
    default:
      productCategories.value = categories.map(cat => ({
        value: cat.productCategoryId,
        labelKey: cat.name
      }))
  }
})
detailsService.getBookCategories().then((categories) => {
  switch (locale.value) {
    case 'fr':
      bookCategories.value = categories.map(cat => ({
        value: cat.bookCategoryId,
        labelKey: cat.nameFr
      }))
      break
    case 'it':
      bookCategories.value = categories.map(cat => ({
        value: cat.bookCategoryId,
        labelKey: cat.nameIt
      }))
      break
    case 'de':
      bookCategories.value = categories.map(cat => ({
        value: cat.bookCategoryId,
        labelKey: cat.nameDe
      }))
      break
    default:
      bookCategories.value = categories.map(cat => ({
        value: cat.bookCategoryId,
        labelKey: cat.name
      }))
  }
})

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
  schoolGradeId: advert.value?.schoolGradeId || null,
  teachingLanguage: advert.value?.teachingLanguage || null,
  studyLevel: advert.value?.studyLevel || null,

  condition: advert.value?.condition || null,
  productCategoryId: advert.value?.productCategoryId || null,
  weight: advert.value?.weight || null,

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
      if (!form.value.schoolGradeId) {
        errors.value.schoolGradeId = $t('advertForm.error.empty.schoolGradeId')
      }
      if (!form.value.teachingLanguage) {
        errors.value.teachingLanguage = $t('advertForm.error.empty.teachingLanguage')
      }
      if (!form.value.studyLevel?.trim()) {
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
  const studyLevel = form.value.studyLevel ?? ''

  if ((title || description || author || publisher || edition || isbn || studyLevel) && (sqlInjectionPattern.test(title) || sqlInjectionPattern.test(description) || sqlInjectionPattern.test(author) || sqlInjectionPattern.test(publisher) || sqlInjectionPattern.test(edition) || sqlInjectionPattern.test(isbn) || sqlInjectionPattern.test(studyLevel))) {
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
      if (form.value.schoolGradeId && form.value.schoolGradeId < 1) {
        errors.value.schoolGradeId = $t('advertForm.error.invalid.schoolGradeId')
      }
      if (!form.value.teachingLanguage) {
        errors.value.teachingLanguage = $t('advertForm.error.invalid.teachingLanguage')
      }
      if (form.value.studyLevel && form.value.studyLevel.length > 50) {
        errors.value.studyLevel = $t('advertForm.error.invalid.studyLevelLength')
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

      // Maximum number of files validation
      // if (uploadedFiles.value.length > 10) {
      //   errors.value.images = $t('advertForm.error.invalid.imageCount')
      // }
      break
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
          condition: form.value.condition,
          weight: form.value.weight,
          productCategoryId: form.value.productCategoryId
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
          weight: form.value.weight,
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
          schoolGradeId: form.value.schoolGradeId,
          teachingLanguage: form.value.teachingLanguage,
          studyLevel: form.value.studyLevel
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
      schoolGradeId: advert.value?.schoolGradeId,
      teachingLanguage: advert.value?.teachingLanguage,
      studyLevel: advert.value?.studyLevel,

      condition: advert.value?.condition,
      productCategoryId: advert.value?.productCategoryId,
      weight: advert.value?.weight,

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
                  class="mb-2 block text-sm font-medium text-gray-600"
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
