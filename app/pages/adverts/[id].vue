<script setup lang="ts">
import Breadcrumb from '~/components/common/Breadcrumb.vue'
import { AdvertType } from '@/utils/enum/advertType'
import type { QuestionResponse, ServiceRead } from '~/types/advert'
import { getAdvertService } from '~/services/advertService'
import { useUsersStore } from '~/stores/usersStore'
import { useAbuseReport } from '~/composables/useAbuseReport'
import ReportAbuseModal from '~/components/report/ReportAbuseModal.vue'
import BookingModal from '~/components/booking/BookingModal.vue'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { isReportModalOpen, isReporting, reportError, currentCommentId, openReportModal, closeReportModal, submitReport } = useAbuseReport()

function goBack() {
  const previous = router.options.history.state.back
  if (previous) {
    router.back()
  } else {
    navigateTo(localePath('/shop'))
  }
}
const { t } = useI18n()
const usersStore = useUsersStore()
const { data: advert } = await useAdvert(String(route.params.id))
const { data: advertQuestions, refresh: refreshQuestions } = await useAsyncData(
  `advert-questions:${String(route.params.id)}`,
  async () => {
    if (!usersStore.isAuthenticated) {
      return [] as QuestionResponse[]
    }
    return await getAdvertService().getQuestions(Number(route.params.id))
  }
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

const isOwnAdvert = computed(() => {
  const sellerUsername = advert.value?.seller?.username?.trim().toLowerCase()
  const currentNickname = usersStore.user?.nickname?.trim().toLowerCase()

  return !!sellerUsername
    && !!currentNickname
    && sellerUsername === currentNickname
})

const toast = useToast()
const isBookingModalOpen = ref(false)
const answeringQuestionId = ref<number | null>(null)

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

const handleAnswerQuestion = async ({ questionId, text }: { questionId: number, text: string }) => {
  if (!isOwnAdvert.value)
    return

  answeringQuestionId.value = questionId

  try {
    await getAdvertService().postAnswer(Number(route.params.id), questionId, text)
    await refreshQuestions()
    toast.add({ title: t('advert.detail.answer_success'), color: 'success' })
  } catch {
    toast.add({ title: t('advert.detail.answer_error'), color: 'error' })
  } finally {
    answeringQuestionId.value = null
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
    image: advert.value.image || advert.value.images?.[0] || '',
    seller: advert.value.seller?.username
  }
})

const handleReserve = () => {
  if (!usersStore.isAuthenticated) {
    navigateTo(localePath(`/login?redirect=${encodeURIComponent(route.fullPath)}`))
    return
  }
  isBookingModalOpen.value = true
}
</script>

<template>
  <div class="min-h-screen">
    <Breadcrumb :items="breadcrumbItems" />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="mb-8">
        <button
          type="button"
          class="group inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium no-underline focus:ring-2 focus:ring-emerald-500 outline-none rounded cursor-pointer bg-transparent border-0 p-0"
          @click="goBack"
        >
          <span aria-hidden="true">←</span>
          <span class="border-b border-transparent pb-px group-hover:border-current">{{ $t('common.back') }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <AdvertGallery
            :images="advert?.images || []"
            :title="advert?.title || ''"
          />
        </div>

        <div class="lg:col-span-1 space-y-4">
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
            @view-profile="() => {
              if (advert?.seller?.id) {
                navigateTo(localePath(`/users/${advert.seller.id}`))
              }
            }"
          />
          <AdvertActionButtons
            v-if="advert?.seller.id !== usersStore.user?.id"
            :advert="advertSummary"
            @reserve="handleReserve"
          />

          <!-- Bouton Signaler -->
          <div
            v-if="usersStore.isAuthenticated && advert?.seller.id !== usersStore.user?.id"
            class="pt-4 border-t border-slate-200 dark:border-slate-800"
          >
            <button
              type="button"
              class="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors bg-transparent border-0 p-0 cursor-pointer outline-none focus:ring-2 focus:ring-red-500 rounded"
              @click="advert && openReportModal(Number(advert.id))"
            >
              <UIcon
                name="i-heroicons-flag"
                class="w-4 h-4"
                aria-hidden="true"
              />
              <span>{{ $t('report.action') }}</span>
            </button>
          </div>
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
        v-if="advert"
        class="mt-12"
      >
        <AdvertPublicQuestions
          :seller="advert.seller"
          :is-authenticated="usersStore.isAuthenticated"
          :can-ask="usersStore.isAuthenticated && !isOwnAdvert"
          :can-answer="isOwnAdvert"
          :answering-question-id="answeringQuestionId"
          :questions="advertQuestions || []"
          @ask-question="handleAskQuestion"
          @answer-question="handleAnswerQuestion"
          @report-comment="(commentId: number) => openReportModal(Number(advert!.id), commentId)"
        />
      </div>
    </div>

    <ReportAbuseModal
      :is-open="isReportModalOpen"
      :is-processing="isReporting"
      :error="reportError"
      :target-type="currentCommentId ? 'comment' : 'advert'"
      @close="closeReportModal"
      @submit="submitReport"
    />

    <BookingModal
      v-if="advert?.type === AdvertType.SERVICE"
      :is-open="isBookingModalOpen"
      :advert="advert as ServiceRead ?? null"
      @close="isBookingModalOpen = false"
    />
  </div>
</template>
