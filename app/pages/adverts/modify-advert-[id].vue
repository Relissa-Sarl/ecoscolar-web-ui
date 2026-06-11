<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ModifyAdvertForm, ProductReadApiItem, BookReadApiItem, ServiceReadApiItem } from '~/types/advert'
import { AdvertType } from '~/utils/enum/advertType'
import { getAdvertService } from '~/services/advertService'
import AdvertForm from '~/components/advert/AdvertForm.vue'
import { useRoute, useLocalePath } from '#imports'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const localePath = useLocalePath()
const userStore = useUsersStore()
const advertService = getAdvertService()

const id = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

type DetailedAdvert = ModifyAdvertForm | ProductReadApiItem | BookReadApiItem | ServiceReadApiItem

const advert = ref<DetailedAdvert | null>(null)
const advertLoading = ref(true)
const advertIsGet = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  if (!route.params.id || Number.isNaN(id) || id < 1) {
    advertIsGet.value = false
    advertLoading.value = false
    return
  }

  try {
    const fetchedAdvert = await advertService.getAdvert(id)

    if (fetchedAdvert && fetchedAdvert.userId !== userStore.user?.id) {
      advertIsGet.value = false
      advertLoading.value = false
      return
    }

    let detailedAdvert: DetailedAdvert = fetchedAdvert
    switch (fetchedAdvert.type) {
      case AdvertType.PRODUCT:
        detailedAdvert = await advertService.getProduct(id)
        break
      case AdvertType.BOOK:
        detailedAdvert = await advertService.getBook(id)
        break
      case AdvertType.SERVICE:
        detailedAdvert = await advertService.getService(id)
        break
    }

    advert.value = { ...detailedAdvert, type: fetchedAdvert.type } as DetailedAdvert
  } catch (error) {
    console.error('Error fetching advert:', error)
    advertIsGet.value = false
  } finally {
    advertLoading.value = false
  }
})

const handleUpdate = async (formData: Partial<ModifyAdvertForm>, category: AdvertType) => {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    switch (category) {
      case AdvertType.PRODUCT: {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          userId: userStore.user?.id,
          condition: formData.condition,
          weight: formData.weight,
          productCategoryId: formData.productCategoryId
        }
        await advertService.updateProductAdvert(id, payload as Partial<ModifyAdvertForm>)
        break
      }
      case AdvertType.BOOK: {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          userId: userStore.user?.id,
          condition: formData.condition,
          weight: formData.weight,
          author: formData.author,
          publisher: formData.publisher,
          isbn: formData.isbn,
          categoryId: formData.bookCategoryId,
          writtenLanguage: formData.writtenLanguage,
          edition: formData.edition
        }
        await advertService.updateBookAdvert(id, payload as Partial<ModifyAdvertForm>)
        break
      }
      case AdvertType.SERVICE: {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          userId: userStore.user?.id,
          subjectId: formData.subjectId,
          schoolGradeId: formData.schoolGradeId,
          teachingLanguage: formData.teachingLanguage,
          studyLevel: formData.studyLevel
        }
        await advertService.updateServiceAdvert(id, payload as Partial<ModifyAdvertForm>)
        break
      }
    }

    await navigateTo(localePath('/me/adverts')) // Redirect to adverts list after successful update
  } catch (error) {
    console.error('Error updating advert:', error)
    errorMessage.value = $t('modifyAdvert.error.modificationFailed')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    v-if="advertIsGet && advertLoading === false"
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
            {{ $t('modifyAdvert.modifyAdvert') }}{{ advert?.title ? `: ${advert.title}` : '' }}
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-500">
            {{ $t('modifyAdvert.description') }}
          </p>
        </header>

        <AdvertForm
          mode="modify"
          :initial-data="advert"
          :is-submitting="isSubmitting"
          :error-message="errorMessage"
          @submit="handleUpdate"
        />
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
          v-show="advertIsGet === false"
          class="text-center text-red-500"
        >
          {{ $t('modifyAdvert.error.invalidId') }}
        </p>
        <div
          v-show="advertLoading === true"
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
