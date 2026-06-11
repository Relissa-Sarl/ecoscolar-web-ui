import { describe, it, expect } from 'vitest'
import formatErrors from '~/utils/formatErrors'
import type ApiError from '~/types/apiError'

describe('formatErrors', () => {
  it('should return the array directly if errors is an array', () => {
    const apiError: ApiError = {
      data: {
        errors: ['Invalid postal code']
      }
    }
    const result = formatErrors(apiError)
    expect(result).toEqual(['Invalid postal code'])
  })

  it('should return error keys if errors is an object', () => {
    const apiError: ApiError = {
      data: {
        errors: {
          PasswordTooShort: ['too short'],
          PasswordRequiresDigit: ['needs digit']
        }
      }
    }
    const result = formatErrors(apiError)
    expect(result).toEqual(['PasswordTooShort', 'PasswordRequiresDigit'])
  })

  it('should return ["Default"] if no errors are present', () => {
    const apiError: ApiError = {
      data: {}
    }
    const result = formatErrors(apiError)
    expect(result).toEqual(['Default'])
  })
})
