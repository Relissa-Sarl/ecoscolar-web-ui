import { describe, expect, it } from 'vitest'
import { formatPrice } from '../../app/utils/formatPrice'

describe('formatPrice', () => {
  it('formats a normal integer price', () => {
    expect(formatPrice(10)).toBe('10.00')
  })

  it('formats a decimal price with two digits', () => {
    expect(formatPrice(19.99)).toBe('19.99')
  })

  it('formats a single-decimal price to two digits', () => {
    expect(formatPrice(5.5)).toBe('5.50')
  })

  it('returns "0.00" for null', () => {
    expect(formatPrice(null)).toBe('0.00')
  })

  it('returns "0.00" for undefined', () => {
    expect(formatPrice(undefined)).toBe('0.00')
  })

  it('returns "0.00" for NaN', () => {
    expect(formatPrice(NaN)).toBe('0.00')
  })

  it('formats 0 as "0.00"', () => {
    expect(formatPrice(0)).toBe('0.00')
  })

  it('formats negative numbers', () => {
    const result = formatPrice(-15.5)
    expect(result).toContain('15.50')
  })

  it('formats large numbers with grouping separators', () => {
    // de-CH uses apostrophe or thin-space as thousands separator
    const result = formatPrice(1234567.89)
    expect(result).toContain('1')
    expect(result).toContain('234')
    expect(result).toContain('567.89')
  })

  it('formats a string numeric value', () => {
    expect(formatPrice('25.50')).toBe('25.50')
  })

  it('returns "0.00" for non-numeric strings', () => {
    expect(formatPrice('abc')).toBe('0.00')
  })

  it('returns "0.00" for empty string', () => {
    expect(formatPrice('')).toBe('0.00')
  })

  it('rounds to two decimal places', () => {
    expect(formatPrice(9.999)).toBe('10.00')
  })

  it('handles very small decimal values', () => {
    expect(formatPrice(0.01)).toBe('0.01')
  })

  it('formats a string integer value', () => {
    expect(formatPrice('100')).toBe('100.00')
  })
})
