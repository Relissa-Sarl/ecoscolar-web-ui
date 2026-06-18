import { ref } from 'vue'
import { useI18n, useToast } from '#imports'
import { reportService } from '~/services/reportService'
import { ReportReason } from '~/types/report'

export const useAbuseReport = () => {
  const { t } = useI18n()
  const toast = useToast()

  const isReportModalOpen = ref(false)
  const isReporting = ref(false)
  const reportError = ref<string | null>(null)
  const currentAdvertId = ref<number | null>(null)
  const currentCommentId = ref<number | null>(null)
  const reportedItems = useCookie<string[]> ('ecoscolar_reported_items', { default: () => [] })

  const hasReportedComment = (commentId: number) => {
    return reportedItems.value?.includes(`comment:${commentId}`) || false
  }

  const hasReportedAdvert = (advertId: number) => {
    return reportedItems.value?.includes(`advert:${advertId}`) || false
  }

  const openReportModal = (advertId: number, commentId?: number) => {
    currentAdvertId.value = advertId
    currentCommentId.value = commentId ?? null
    isReportModalOpen.value = true
    reportError.value = null
  }

  const closeReportModal = () => {
    isReportModalOpen.value = false
    currentAdvertId.value = null
    currentCommentId.value = null
    reportError.value = null
  }

  const submitReport = async (payload: { message: string }) => {
    if (!currentAdvertId.value) return

    isReporting.value = true
    reportError.value = null

    const reason = currentCommentId.value ? ReportReason.INAPPROPRIATE_COMMENT : ReportReason.INAPPROPRIATE_ADVERT

    try {
      await reportService.submitReport({
        targetAdvertId: currentAdvertId.value,
        targetCommentId: currentCommentId.value ?? undefined,
        reason,
        message: payload.message
      })
      const newItem = currentCommentId.value
        ? `comment:${currentCommentId.value}`
        : `advert:${currentAdvertId.value}`

      reportedItems.value = [...(reportedItems.value || []), newItem]

      closeReportModal()
      toast.add({
        title: t('report.success'),
        color: 'success'
      })
    } catch (e: unknown) {
      const apiError = e as { data?: { errors?: { Message?: string[] } }, message?: string }
      if (apiError?.data?.errors?.Message) {
        reportError.value = t('report.error_min_length')
      } else {
        reportError.value = t('report.error')
      }
    } finally {
      isReporting.value = false
    }
  }

  return {
    isReportModalOpen,
    isReporting,
    reportError,
    currentAdvertId,
    currentCommentId,
    openReportModal,
    closeReportModal,
    submitReport,
    hasReportedComment,
    hasReportedAdvert
  }
}
