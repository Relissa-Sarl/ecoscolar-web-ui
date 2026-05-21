import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogService } from '../../app/services/catalogService'
import { mapCatalogApiToListings } from '../../app/utils/catalogMappers'
import { AdvertType } from '../../app/utils/enum/advertType'

/** Jeu de données aligné sur FakeAdvertSearchService / T8-4. */
const CATALOG_FIXTURE = [
  { id: '6d4b9d4a-1dd1-4a38-8d68-7af4d9cb3c01', title: 'Exemple annonce 1', price: 12.5, type: AdvertType.BOOK },
  { id: '9a2d7d6e-8b4c-4d55-a901-2ec6f6c4d202', title: 'Exemple annonce 2', price: 7, type: AdvertType.BOOK },
  {
    id: '3f8e5c9b-2a7e-4f1a-9c3d-5b6e7f8a9c03',
    title: 'Exemple annonce 3',
    price: 15,
    type: AdvertType.BOOK,
    isbn: '978-3-16-148410-0'
  },
  {
    id: 'c4d8f2a1-6e9b-4c7d-a5f3-1e2d3c4b5a01',
    title: 'Calculatrice scientifique Casio',
    price: 42.99,
    type: AdvertType.PRODUCT
  }
] as const

function filterCatalog(q?: string) {
  if (!q)
    return [...CATALOG_FIXTURE]
  const probe = q.toLowerCase()
  return CATALOG_FIXTURE.filter(
    item => item.title.toLowerCase().includes(probe)
      || ('isbn' in item && item.isbn?.replace(/-/g, '').includes(probe.replace(/-/g, '')))
  )
}

describe('T8-4 · intégration recherche livre (catalogService → API → mappers)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envoie q= à l’API et mappe un seul livre pour une recherche ISBN', async () => {
    const isbn = '978-3-16-148410-0'
    const apiClient = vi.fn(async (_path: string, opts?: { query?: { q?: string } }) =>
      filterCatalog(opts?.query?.q))
    const service = createCatalogService({ apiClient })

    const rows = await service.listSummaries({ q: isbn })
    const listings = mapCatalogApiToListings(rows)

    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', { query: { q: isbn } })
    expect(listings).toHaveLength(1)
    expect(listings[0].title).toBe('Exemple annonce 3')
    expect(listings[0].categoryTab).toBe('textbooks')
  })

  it('filtre par mot-clé livre sans inclure les produits', async () => {
    const apiClient = vi.fn(async (_path: string, opts?: { query?: { q?: string } }) =>
      filterCatalog(opts?.query?.q))
    const service = createCatalogService({ apiClient })

    const rows = await service.listSummaries({ q: 'Exemple annonce 3' })
    const listings = mapCatalogApiToListings(rows)

    expect(listings).toHaveLength(1)
    expect(listings[0].title).toBe('Exemple annonce 3')
    expect(listings.every(l => l.categoryTab === 'textbooks')).toBe(true)
  })

  it('retourne une liste vide quand l’API ne trouve rien', async () => {
    const apiClient = vi.fn(async () => [] as typeof CATALOG_FIXTURE)
    const service = createCatalogService({ apiClient })

    const rows = await service.listSummaries({ q: 'zzzz-inexistant' })
    const listings = mapCatalogApiToListings(rows)

    expect(listings).toHaveLength(0)
  })

  it('charge tout le catalogue sans filtre q', async () => {
    const apiClient = vi.fn(async () => [...CATALOG_FIXTURE])
    const service = createCatalogService({ apiClient })

    const rows = await service.listSummaries()
    const listings = mapCatalogApiToListings(rows)

    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', { query: undefined })
    expect(listings).toHaveLength(4)
    expect(listings.filter(l => l.categoryTab === 'textbooks')).toHaveLength(3)
  })
})
