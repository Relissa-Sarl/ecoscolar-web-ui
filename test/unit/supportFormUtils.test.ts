import { describe, expect, it } from 'vitest'
import {
  resolveSupportSubject,
  validateSupportForm
} from '../../app/utils/supportFormUtils'

describe('supportFormUtils', () => {
  describe('resolveSupportSubject', () => {
    it('returns the translated label when i18n resolves it', () => {
      const subject = resolveSupportSubject('bug', key =>
        key === 'support.reasons.bug' ? 'Signaler un bug' : key)

      expect(subject).toBe('Signaler un bug')
    })

    it('falls back to a safe label when i18n returns the missing key', () => {
      const subject = resolveSupportSubject('bug', key => key)

      expect(subject).toBe('Signaler un bug')
      expect(subject.length).toBeGreaterThanOrEqual(5)
    })

    it('returns the trimmed reason as fallback when it is not a default reason and has no translation', () => {
      const subject = resolveSupportSubject('unknown-reason', () => '')
      expect(subject).toBe('unknown-reason')
    })
  })

  describe('validateSupportForm', () => {
    it('rejects a message shorter than 10 characters', () => {
      expect(validateSupportForm({
        email: 'user@example.com',
        reason: 'bug',
        subject: 'Signaler un bug',
        message: 'court'
      })).toBe('message')
    })

    it('accepts a valid payload', () => {
      expect(validateSupportForm({
        email: 'user@example.com',
        reason: 'bug',
        subject: 'Signaler un bug',
        message: 'Message suffisamment long.'
      })).toBeNull()
    })
  })
})
