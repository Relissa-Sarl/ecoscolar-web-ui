<script setup lang="ts">
import { ref } from 'vue'
import { AdvertType } from '~/utils/enum/advertType'
import { getAdvertService } from '~/services/advertService'
import type { ModifyAdvertForm } from '~/types/advert'
import AdvertForm from '~/components/advert/AdvertForm.vue'
import { useLocalePath } from '#imports'

definePageMeta({
  middleware: 'auth'
})

const userStore = useUsersStore()
const advertService = getAdvertService()
const localePath = useLocalePath()

const isSubmitting = ref(false)
const errorMessage = ref('')

const handleCreate = async (formData: Partial<ModifyAdvertForm>, category: AdvertType) => {
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
          // pictures: formData.pictures
        }
        await advertService.createProductAdvert(payload)
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
          // pictures: formData.pictures,
          author: formData.author,
          publisher: formData.publisher,
          isbn: formData.isbn,
          categoryId: formData.bookCategoryId,
          writtenLanguage: formData.writtenLanguage,
          edition: formData.edition
        }
        await advertService.createBookAdvert(payload)
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
        await advertService.createServiceAdvert(payload)
        break
      }
    }

    await navigateTo(localePath('/me/adverts')) // Redirect to adverts list after successful creation
  } catch (error) {
    console.error('Error creating advert:', error)
    errorMessage.value = $t('createAdvert.error.creationFailed')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen px-4 py-6 text-gray-900 dark:text-gray-50 md:px-6 lg:px-8">
    <div class="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
      <!-- <AppFilter/> -->
      <div class="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-8">
        <header class="mb-8">
          <p class="mb-2 text-sm font-medium uppercase tracking-wide text-primary">
            {{ $t('createAdvert.newAdvert') }}
          </p>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
            {{ $t('createAdvert.createAdvert') }}
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-500">
            {{ $t('createAdvert.description') }}
          </p>
        </header>

        <AdvertForm
          mode="create"
          :is-submitting="isSubmitting"
          :error-message="errorMessage"
          @submit="handleCreate"
        />
      </div>
    </div>
  </div>
</template>
