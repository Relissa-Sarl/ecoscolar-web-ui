import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '~/composables/useApi'

// Test simple du composable useApi
describe('useApi composable', () => {
  // Réinitialise les mocks avant chaque test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test 1 : Vérifie que useApi est bien exportée et est une fonction
  it('is exported as a function', () => {
    expect(typeof useApi).toBe('function')
  })

  // Test 2 : Vérifie que useApi agit comme un composable Nuxt
  it('has the right signature for a composable', () => {
    // Un composable doit accepter au moins le request
    const signature = useApi.toString()
    expect(signature).toContain('request')
  })
})



