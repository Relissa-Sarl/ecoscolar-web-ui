import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogService } from '../../app/services/catalogService'
import { mapCatalogApiToListings } from '../../app/utils/catalogMappers'
import { AdvertType } from '../../app/utils/enum/advertType'

/** Jeu de données aligné sur FakeAdvertSearchService / T8-4. */
const CATALOG_FIXTURE = [
  { id: 1, title: 'Exemple annonce 1', price: 12.5, type: AdvertType.BOOK },
  { id: 2, title: 'Exemple annonce 2', price: 7, type: AdvertType.BOOK },
  {
    id: 3,
    title: 'Exemple annonce 3',
    price: 15,
    type: AdvertType.BOOK,
    isbn: '978-3-16-148410-0'
  },
  {
    id: 4,
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

function toPage(items: typeof CATALOG_FIXTURE[number][]) {
  return {
    items,
    page: 1,
    pageSize: 9,
    totalItems: items.length,
    totalPages: 1
  }
}

describe('T8-4 · intégration recherche livre (catalogService → API → mappers)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envoie q= à l’API et mappe un seul livre pour une recherche ISBN', async () => {
    const isbn = '978-3-16-148410-0'
    const apiClient = vi.fn(async (_path: string, opts?: { query?: { q?: string } }) =>
      toPage(filterCatalog(opts?.query?.q)))
    const service = createCatalogService({ apiClient })

    const page = await service.listSummaries({ q: isbn })
    const listings = mapCatalogApiToListings(page.items)

    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', { query: { q: isbn } })
    expect(listings).toHaveLength(1)
    expect(listings[0].title).toBe('Exemple annonce 3')
    expect(listings[0].categoryTab).toBe('textbooks')
    expect(listings[0].metaLine).toBe('978-3-16-148410-0')
  })

  it('filtre par mot-clé livre sans inclure les produits', async () => {
    const apiClient = vi.fn(async (_path: string, opts?: { query?: { q?: string } }) =>
      toPage(filterCatalog(opts?.query?.q)))
    const service = createCatalogService({ apiClient })

    const page = await service.listSummaries({ q: 'Exemple annonce 3' })
    const listings = mapCatalogApiToListings(page.items)

    expect(listings).toHaveLength(1)
    expect(listings[0].title).toBe('Exemple annonce 3')
    expect(listings.every(l => l.categoryTab === 'textbooks')).toBe(true)
  })

  it('retourne une liste vide quand l’API ne trouve rien', async () => {
    const apiClient = vi.fn(async () => toPage([]))
    const service = createCatalogService({ apiClient })

    const page = await service.listSummaries({ q: 'zzzz-inexistant' })
    const listings = mapCatalogApiToListings(page.items)

    expect(listings).toHaveLength(0)
  })

  it('charge tout le catalogue sans filtre q', async () => {
    const apiClient = vi.fn(async () => toPage([...CATALOG_FIXTURE]))
    const service = createCatalogService({ apiClient })

    const page = await service.listSummaries()
    const listings = mapCatalogApiToListings(page.items)

    expect(apiClient).toHaveBeenCalledWith('/adverts/summary', { query: undefined })
    expect(listings).toHaveLength(4)
    expect(listings.filter(l => l.categoryTab === 'textbooks')).toHaveLength(3)
  })
})
