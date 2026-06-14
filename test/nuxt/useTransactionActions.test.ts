import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTransactionActions } from '~/composables/useTransactionActions'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const mockHistoryService = {
  confirmReception: vi.fn(),
  confirmShipping: vi.fn(),
  disputePurchase: vi.fn(),
  cancelPurchase: vi.fn()
}

vi.mock('~/services/historyService', () => ({
  getHistoryService: () => mockHistoryService
}))

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key
}))

describe('useTransactionActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default values', () => {
    const { activeModal, selectedTransactionId, disputeReason, isProcessing, actionError } = useTransactionActions()
    expect(activeModal.value).toBeNull()
    expect(selectedTransactionId.value).toBeNull()
    expect(disputeReason.value).toBe('')
    expect(isProcessing.value).toBe(false)
    expect(actionError.value).toBeNull()
  })

  it('promptAction sets state correctly', () => {
    const { promptAction, activeModal, selectedTransactionId, actionError, disputeReason } = useTransactionActions()
    promptAction('confirm_reception', 't1')
    expect(activeModal.value).toBe('confirm_reception')
    expect(selectedTransactionId.value).toBe('t1')
    expect(actionError.value).toBeNull()
    expect(disputeReason.value).toBe('')
  })

  it('closeModal resets state correctly', () => {
    const { promptAction, closeModal, activeModal, selectedTransactionId, isProcessing } = useTransactionActions()
    promptAction('confirm_reception', 't1')
    closeModal()
    expect(activeModal.value).toBeNull()
    expect(selectedTransactionId.value).toBeNull()
    expect(isProcessing.value).toBe(false)
  })

  it('executeAction returns early if no modal or transaction', async () => {
    const { executeAction } = useTransactionActions()
    await executeAction()
    expect(mockHistoryService.confirmReception).not.toHaveBeenCalled()
  })

  it('executeAction confirm_reception calls historyService', async () => {
    const { promptAction, executeAction } = useTransactionActions()
    mockHistoryService.confirmReception.mockResolvedValueOnce(undefined)

    promptAction('confirm_reception', 't1')
    await executeAction()

    expect(mockHistoryService.confirmReception).toHaveBeenCalledWith('t1')
  })

  it('executeAction confirm_shipping calls historyService', async () => {
    const { promptAction, executeAction } = useTransactionActions()
    mockHistoryService.confirmShipping.mockResolvedValueOnce(undefined)

    promptAction('confirm_shipping', 't1')
    await executeAction()

    expect(mockHistoryService.confirmShipping).toHaveBeenCalledWith('t1')
  })

  it('executeAction cancel calls historyService', async () => {
    const { promptAction, executeAction } = useTransactionActions()
    mockHistoryService.cancelPurchase.mockResolvedValueOnce(undefined)

    promptAction('cancel', 't1')
    await executeAction()

    expect(mockHistoryService.cancelPurchase).toHaveBeenCalledWith('t1')
  })

  it('executeAction dispute requires reason', async () => {
    const { promptAction, executeAction, actionError } = useTransactionActions()

    promptAction('dispute', 't1')
    await executeAction()

    expect(actionError.value).toBe('me.purchases.alerts.error')
    expect(mockHistoryService.disputePurchase).not.toHaveBeenCalled()
  })

  it('executeAction dispute calls historyService when reason is provided', async () => {
    const { promptAction, executeAction, disputeReason } = useTransactionActions()
    mockHistoryService.disputePurchase.mockResolvedValueOnce(undefined)

    promptAction('dispute', 't1')
    disputeReason.value = 'Damaged item'
    await executeAction()

    expect(mockHistoryService.disputePurchase).toHaveBeenCalledWith('t1', 'Damaged item')
  })

  it('executeAction handles service errors', async () => {
    const { promptAction, executeAction, actionError } = useTransactionActions()
    mockHistoryService.confirmReception.mockRejectedValueOnce(new Error('API Error'))

    promptAction('confirm_reception', 't1')
    await executeAction()

    expect(actionError.value).toBe('API Error')
  })

  it('executeAction handles string errors', async () => {
    const { promptAction, executeAction, actionError } = useTransactionActions()
    mockHistoryService.confirmReception.mockRejectedValueOnce('Simple string error')

    promptAction('confirm_reception', 't1')
    await executeAction()

    expect(actionError.value).toBe('Simple string error')
  })

  it('executeAction calls onSuccess callback', async () => {
    const { promptAction, executeAction } = useTransactionActions()
    const onSuccess = vi.fn()
    mockHistoryService.confirmReception.mockResolvedValueOnce(undefined)

    promptAction('confirm_reception', 't1')
    await executeAction(onSuccess)

    expect(onSuccess).toHaveBeenCalled()
  })
})
