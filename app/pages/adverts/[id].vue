<script setup lang="ts">
import Breadcrumb from '~/components/common/Breadcrumb.vue'
import { AdvertType } from '@/utils/enum/advertType'
import type { QuestionResponse } from '~/types/advert'
import { getAdvertService } from '~/services/advertService'
import { useUsersStore } from '~/stores/usersStore'

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const usersStore = useUsersStore()
const { data: advert } = await useAdvert(String(route.params.id))
const { data: advertQuestions, refresh: refreshQuestions } = await useAsyncData<QuestionResponse[]>(
  `advert-questions:${String(route.params.id)}`,
  () => getAdvertService().getQuestions(Number(route.params.id))
)

const breadcrumbItems = computed(() => {
  const items: Array<{ label: string, to?: string }> = [
    { label: t('header.nav_shop'), to: localePath('/shop') }
  ]

  const category = advert.value?.category?.trim()
  if (category)
    items.push({ label: category })

  const title = advert.value?.title?.trim()
  if (title)
    items.push({ label: title })

  return items
})

const showAuthors = computed(() =>
  advert.value?.type === AdvertType.BOOK && !!advert.value.authors)

const showCondition = computed(() =>
  advert.value != null
  && advert.value.type !== AdvertType.SERVICE
  && !!advert.value.condition)

const showMetadata = computed(() => {
  if (!advert.value)
    return false

  const { type, isbn, subject, grade, school, category } = advert.value

  if (type === AdvertType.BOOK)
    return !!isbn
  if (type === AdvertType.PRODUCT)
    return !!category
  if (type === AdvertType.SERVICE)
    return !!(subject || grade || school)

  return false
})

const showConditionDetails = computed(() =>
  (advert.value?.conditions?.length ?? 0) > 0)

const showPublicQuestions = computed(() =>
  (advertQuestions.value?.length ?? 0) > 0)

const isOwnAdvert = computed(() => {
  const sellerUsername = advert.value?.seller?.username?.trim().toLowerCase()
  const currentNickname = usersStore.user?.nickname?.trim().toLowerCase()
  console.log('sellerUsername:', sellerUsername)
  console.log('currentNickname:', currentNickname)
  return !!sellerUsername
    && !!currentNickname
    && sellerUsername === currentNickname
})

const toast = useToast()

const handleAskQuestion = async (text: string) => {
  if (isOwnAdvert.value)
    return

  try {
    await getAdvertService().postQuestion(Number(route.params.id), text)
    await refreshQuestions()
    toast.add({ title: t('advert.detail.ask_success'), color: 'success' })
  } catch {
    toast.add({ title: t('advert.detail.ask_error'), color: 'error' })
  }
}

const advertSummary = computed(() => {
  if (!advert.value) return null

  return {
    id: advert.value.id,
    title: advert.value.title,
    type: advert.value.type,
    condition: advert.value.condition,
    price: advert.value.price,
    image: advert.value.image || advert.value.images?.[0] || ''
  }
})
</script>

<template>
  <div class="min-h-screen">
    <Breadcrumb :items="breadcrumbItems" />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="mb-8">
        <NuxtLink
          :to="localePath('/shop')"
          class="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline font-medium focus:ring-2 focus:ring-emerald-500 outline-none rounded"
        >
          <span aria-hidden="true">←</span> {{ $t('common.back_to_catalog') }}
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <AdvertGallery
            :images="advert?.images || []"
            :title="advert?.title || ''"
          />
        </div>

        <div class="lg:col-span-1">
          <AdvertInfo
            v-if="advert"
            :condition="showCondition ? advert.condition : ''"
            :featured="advert.featured"
            :title="advert.title"
            :authors="showAuthors ? advert.authors : ''"
            :price="advert.price"
            :old-price="advert.oldPrice"
          />
          <AdvertMetadata
            v-if="advert && showMetadata"
            :isbn="advert.type === AdvertType.BOOK ? advert.isbn : ''"
            :category="advert.type === AdvertType.PRODUCT ? advert.category : ''"
            :subject="advert.type === AdvertType.SERVICE ? advert.subject : ''"
            :grade="advert.type === AdvertType.SERVICE ? advert.grade : ''"
            :school="advert.type === AdvertType.SERVICE ? advert.school : ''"
          />
          <AdvertSellerCard
            v-if="advert && advert.seller.username"
            :seller="advert.seller"
            @view-profile="() => {}"
          />
          <AdvertActionButtons
            :advert="advertSummary"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div class="lg:col-span-2">
          <AdvertDescription :description="advert?.description || ''" />
        </div>

        <AdvertConditionDetails
          v-if="showConditionDetails"
          :conditions="advert?.conditions || []"
        />
      </div>

      <div
        v-if="showPublicQuestions"
        class="mt-12"
      >
        <AdvertPublicQuestions
          v-if="advert"
          :seller="advert.seller"
          :can-ask="!isOwnAdvert"
          :questions="advertQuestions || []"
          @ask-question="handleAskQuestion"
        />
      </div>
    </div>
  </div>
</template>
