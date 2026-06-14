import { ref } from 'vue'
import { useI18n } from '#imports'
import { getHistoryService } from '~/services/historyService'

export type TransactionActionType = 'confirm_reception' | 'confirm_shipping' | 'dispute' | 'cancel' | 'renew' | null

export const useTransactionActions = () => {
  const { t } = useI18n()
  const activeModal = ref<TransactionActionType>(null)
  const selectedTransactionId = ref<string | null>(null)
  const disputeReason = ref<string>('')
  const disputeDescription = ref<string>('')
  const isProcessing = ref(false)
  const actionError = ref<string | null>(null)

  // Ouvre la modale pour une action spécifique
  const promptAction = (action: TransactionActionType, transactionId: string) => {
    activeModal.value = action
    selectedTransactionId.value = transactionId
    disputeReason.value = ''
    disputeDescription.value = ''
    actionError.value = null
  }

  const closeModal = () => {
    activeModal.value = null
    selectedTransactionId.value = null
    disputeReason.value = ''
    disputeDescription.value = ''
    actionError.value = null
    isProcessing.value = false
  }

  // Exécute l'action vers l'API
  const executeAction = async (onSuccess?: () => void) => {
    if (!activeModal.value || !selectedTransactionId.value) return

    isProcessing.value = true
    actionError.value = null

    try {
      const historyService = getHistoryService()

      switch (activeModal.value) {
        case 'confirm_reception':
          await historyService.confirmReception(selectedTransactionId.value)
          break
        case 'confirm_shipping':
          await historyService.confirmShipping(selectedTransactionId.value)
          break
        case 'dispute':
          if (!disputeReason.value || !disputeDescription.value.trim()) {
            throw new Error(t('me.purchases.alerts.error', { message: 'Raison requise' }))
          }
          await historyService.disputePurchase(selectedTransactionId.value, disputeReason.value, disputeDescription.value.trim())
          break
        case 'cancel':
          await historyService.cancelPurchase(selectedTransactionId.value)
          break
        case 'renew':
          await historyService.renewAdvert(selectedTransactionId.value)
          break
      }

      closeModal()

      // On success alerts or refreshes
      if (onSuccess) {
        onSuccess()
      }
    } catch (e: unknown) {
      actionError.value = e instanceof Error ? e.message : String(e)
    } finally {
      isProcessing.value = false
    }
  }

  return {
    activeModal,
    selectedTransactionId,
    disputeReason,
    disputeDescription,
    isProcessing,
    actionError,
    promptAction,
    closeModal,
    executeAction
  }
}
