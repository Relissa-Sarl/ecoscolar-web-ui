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
  const currentSellerId = ref<string | null>(null)
  const currentCommentId = ref<number | null>(null)

  const openReportModal = (sellerId: string, commentId?: number) => {
    currentSellerId.value = sellerId
    currentCommentId.value = commentId ?? null
    isReportModalOpen.value = true
    reportError.value = null
  }

  const closeReportModal = () => {
    isReportModalOpen.value = false
    currentSellerId.value = null
    currentCommentId.value = null
    reportError.value = null
  }

  const submitReport = async (payload: { message: string }) => {
    if (!currentSellerId.value) return

    isReporting.value = true
    reportError.value = null

    const reason = currentCommentId.value ? ReportReason.INAPPROPRIATE_COMMENT : ReportReason.INAPPROPRIATE_ADVERT

    try {
      await reportService.submitReport({
        targetSellerId: currentSellerId.value,
        targetCommentId: currentCommentId.value ?? undefined,
        reason,
        message: payload.message
      })

      closeReportModal()
      toast.add({
        title: t('report.success'),
        color: 'success'
      })
    } catch (e: unknown) {
      reportError.value = e instanceof Error ? e.message : t('report.error')
    } finally {
      isReporting.value = false
    }
  }

  return {
    isReportModalOpen,
    isReporting,
    reportError,
    currentAdvertId: currentSellerId,
    currentCommentId,
    openReportModal,
    closeReportModal,
    submitReport
  }
}
