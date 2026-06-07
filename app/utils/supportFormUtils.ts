export const SUPPORT_REASON_CODES = ['account', 'order', 'bug', 'other'] as const
export type SupportReasonCode = typeof SUPPORT_REASON_CODES[number]

export const SUPPORT_SUBJECT_MIN_LENGTH = 5
export const SUPPORT_MESSAGE_MIN_LENGTH = 10

const DEFAULT_REASON_LABELS: Record<SupportReasonCode, string> = {
  account: 'Problème de compte',
  order: 'Suivi de commande',
  bug: 'Signaler un bug',
  other: 'Autre demande'
}

export function resolveSupportSubject(
  reason: string,
  translate: (key: string) => string
): string {
  if (!reason.trim()) return ''

  const i18nKey = `support.reasons.${reason}`
  const translated = translate(i18nKey).trim()

  if (translated && translated !== i18nKey && translated.length >= SUPPORT_SUBJECT_MIN_LENGTH) {
    return translated
  }

  const fallback = DEFAULT_REASON_LABELS[reason as SupportReasonCode]
  if (fallback) return fallback

  return translated || reason.trim()
}

export function validateSupportForm(input: {
  email: string
  reason: string
  message: string
  subject: string
}): 'email' | 'reason' | 'subject' | 'message' | null {
  if (!input.email.trim()) return 'email'
  if (!input.reason.trim()) return 'reason'
  if (input.subject.trim().length < SUPPORT_SUBJECT_MIN_LENGTH) return 'subject'
  if (input.message.trim().length < SUPPORT_MESSAGE_MIN_LENGTH) return 'message'
  return null
}
