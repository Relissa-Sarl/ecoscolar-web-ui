import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import useFormErrors from '~/composables/useFormErrors'

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => `translated:${key}`
}))

describe('useFormErrors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty errors when errorsRef returns null', () => {
    const { errors, globalErrors, hasErrors } = useFormErrors(() => null)

    expect(errors.value).toEqual({})
    expect(globalErrors.value).toEqual([])
    expect(hasErrors.value).toBe(false)
  })

  it('returns empty errors when errorsRef returns undefined', () => {
    const { errors, globalErrors, hasErrors } = useFormErrors(() => undefined)

    expect(errors.value).toEqual({})
    expect(globalErrors.value).toEqual([])
    expect(hasErrors.value).toBe(false)
  })

  it('returns empty errors when errorsRef returns empty array', () => {
    const { errors, globalErrors, hasErrors } = useFormErrors(() => [])

    expect(errors.value).toEqual({})
    expect(globalErrors.value).toEqual([])
    expect(hasErrors.value).toBe(false)
  })

  it('translates error keys with default prefix', () => {
    const { errors } = useFormErrors(() => ['FieldRequired', 'TooShort'])

    // Access through proxy to see translated values
    expect(errors.value['FieldRequired']).toBe('translated:errors.FieldRequired')
    expect(errors.value['TooShort']).toBe('translated:errors.TooShort')
  })

  it('translates error keys with custom prefix', () => {
    const { errors } = useFormErrors(() => ['InvalidEmail'], 'register.errors')

    expect(errors.value['InvalidEmail']).toBe('translated:register.errors.InvalidEmail')
  })

  it('tracks handled keys via proxy access — globalErrors excludes accessed errors', () => {
    const { errors, globalErrors, hasErrors } = useFormErrors(() => ['FieldA', 'FieldB', 'FieldC'])

    // Before accessing, all errors are global (unhandled)
    expect(globalErrors.value).toHaveLength(3)
    expect(hasErrors.value).toBe(true)

    // Access FieldA — it should be marked as handled
    const _accessed = errors.value['FieldA']

    // Now globalErrors should exclude FieldA
    expect(globalErrors.value).toHaveLength(2)
    expect(globalErrors.value).not.toContain('translated:errors.FieldA')
    expect(globalErrors.value).toContain('translated:errors.FieldB')
    expect(globalErrors.value).toContain('translated:errors.FieldC')
  })

  it('clears handledKeys when errors become empty', () => {
    // Use a reactive ref so computed re-evaluates when we change the value
    const errorsSource = ref<string[] | null>(['FieldA'])
    const { errors, globalErrors } = useFormErrors(() => errorsSource.value)

    // Access FieldA to mark it as handled
    const _accessed = errors.value['FieldA']
    expect(globalErrors.value).toHaveLength(0)

    // Clear errors — this triggers computed re-evaluation, which clears handledKeys
    errorsSource.value = null
    expect(errors.value).toEqual({})

    // Set new errors — handledKeys should be cleared so FieldA appears again as global
    errorsSource.value = ['FieldA']
    expect(globalErrors.value).toHaveLength(1)
    expect(globalErrors.value).toContain('translated:errors.FieldA')
  })

  it('hasErrors reflects whether there are unhandled errors', () => {
    const { errors, hasErrors } = useFormErrors(() => ['OnlyField'])

    expect(hasErrors.value).toBe(true)

    // Access the only field — all errors are now handled
    const _accessed = errors.value['OnlyField']
    expect(hasErrors.value).toBe(false)
  })

  it('returns undefined for non-existent error keys without adding them to handled set', () => {
    const { errors, globalErrors } = useFormErrors(() => ['ExistingField'])

    // Access a key that does not exist
    const result = errors.value['NonExistentField' as string]
    expect(result).toBeUndefined()

    // ExistingField should still be in globalErrors since only NonExistentField was accessed
    expect(globalErrors.value).toHaveLength(1)
    expect(globalErrors.value).toContain('translated:errors.ExistingField')
  })
})
