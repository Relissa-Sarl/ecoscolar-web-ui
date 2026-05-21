import { describe, expect, it } from 'vitest'
import { tryParseCatalogAdvertId } from '../../app/utils/catalogGuid'
import { encodeCatalogAdvertGuid } from '../helpers/catalogGuid'

describe('tryParseCatalogAdvertId', () => {
  it('decodes a catalog guid encoded from a DB advert id', () => {
    expect(tryParseCatalogAdvertId(encodeCatalogAdvertGuid(1))).toBe(1)
    expect(tryParseCatalogAdvertId(encodeCatalogAdvertGuid(42))).toBe(42)
    expect(tryParseCatalogAdvertId(encodeCatalogAdvertGuid(999))).toBe(999)
  })

  it('returns null for mock demo guids', () => {
    expect(tryParseCatalogAdvertId('6d4b9d4a-1dd1-4a38-8d68-7af4d9cb3c01')).toBeNull()
  })

  it('returns null for invalid guid strings', () => {
    expect(tryParseCatalogAdvertId('not-a-guid')).toBeNull()
    expect(tryParseCatalogAdvertId('')).toBeNull()
    expect(tryParseCatalogAdvertId('11111111-1111-1111-1111-111111111111')).toBeNull()
  })

  it('returns null when trailing bytes are non-zero', () => {
    expect(tryParseCatalogAdvertId('00000001-0000-0000-0001-000000000000')).toBeNull()
  })

  it('returns null for non-positive ids', () => {
    expect(tryParseCatalogAdvertId(encodeCatalogAdvertGuid(0))).toBeNull()
  })
})
