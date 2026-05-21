import { describe, expect, it } from 'vitest'
import { mapCatalogApiToListings } from '../../app/utils/catalogMappers'
import { AdvertType } from '../../app/utils/enum/advertType'

describe('catalogMappers · intégration API .NET', () => {
  it('mappe le type Books renvoyé par CatalogAdvertTypeCodes', () => {
    const listings = mapCatalogApiToListings([
      {
        id: '3f8e5c9b-2a7e-4f1a-9c3d-5b6e7f8a9c03',
        title: 'Exemple annonce 3',
        price: 15,
        type: 'Books' as unknown as typeof AdvertType.BOOK
      }
    ])

    expect(listings).toHaveLength(1)
    expect(listings[0].categoryTab).toBe('textbooks')
    expect(listings[0].title).toBe('Exemple annonce 3')
  })
})
