import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadAdvertData } from '../../app/utils/advertLoader'
import { AdvertCondition } from '../../app/utils/enum/advertCondition'
import { AdvertLanguage } from '../../app/utils/enum/advertLanguage'
import { AdvertStatus } from '../../app/utils/enum/advertStatus'
import { AdvertType } from '../../app/utils/enum/advertType'
import { encodeCatalogAdvertGuid } from '../helpers/catalogGuid'

const mockGetDetail = vi.fn()
const mockGetBook = vi.fn()
const mockGetProduct = vi.fn()
const mockGetService = vi.fn()

const deps = {
  catalogService: {
    listSummaries: vi.fn(),
    getDetail: mockGetDetail
  },
  advertService: {
    getBook: mockGetBook,
    getProduct: mockGetProduct,
    getService: mockGetService
  }
}

const baseSummary = {
  title: 'Annonce test',
  price: 15,
  description: 'Description test'
}

const baseBook = {
  id: 1,
  title: 'Livre complet',
  description: 'Description livre',
  price: 15,
  publicationDate: '2026-01-01T00:00:00Z',
  notificationDate: '2026-06-01T00:00:00Z',
  status: AdvertStatus.ACTIVE,
  userId: 'user-1',
  sellerPseudo: 'seller',
  pictures: ['https://example.com/book.jpg'],
  condition: AdvertCondition.NEW,
  bookCategoryId: 1,
  bookCategoryLabel: 'Manuels',
  isbn: '978-0',
  author: 'Auteur',
  publisher: 'Editeur',
  edition: '1',
  writtenLanguage: AdvertLanguage.FR
}

describe('loadAdvertData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads summary only for mock catalog guids', async () => {
    const mockGuid = '6d4b9d4a-1dd1-4a38-8d68-7af4d9cb3c01'
    mockGetDetail.mockResolvedValueOnce({
      id: mockGuid,
      type: AdvertType.BOOK,
      ...baseSummary,
      isbn: '978-mock'
    })

    const advert = await loadAdvertData(mockGuid, deps)

    expect(mockGetDetail).toHaveBeenCalledWith(mockGuid)
    expect(mockGetBook).not.toHaveBeenCalled()
    expect(advert.title).toBe('Annonce test')
    expect(advert.seller.username).toBe('')
  })

  it('loads typed book detail when guid decodes to a DB id', async () => {
    const catalogGuid = encodeCatalogAdvertGuid(1)
    mockGetDetail.mockResolvedValueOnce({
      id: catalogGuid,
      type: AdvertType.BOOK,
      ...baseSummary
    })
    mockGetBook.mockResolvedValueOnce(baseBook)

    const advert = await loadAdvertData(catalogGuid, deps)

    expect(mockGetBook).toHaveBeenCalledWith(1)
    expect(advert.title).toBe('Livre complet')
    expect(advert.authors).toBe('Auteur')
  })

  it('falls back to summary on typed endpoint 404', async () => {
    const catalogGuid = encodeCatalogAdvertGuid(2)
    mockGetDetail.mockResolvedValueOnce({
      id: catalogGuid,
      type: AdvertType.PRODUCT,
      ...baseSummary
    })
    mockGetProduct.mockRejectedValueOnce({ statusCode: 404 })

    const advert = await loadAdvertData(catalogGuid, deps)

    expect(mockGetProduct).toHaveBeenCalledWith(2)
    expect(advert.title).toBe('Annonce test')
  })

  it('falls back to summary on typed endpoint response.status 404', async () => {
    const catalogGuid = encodeCatalogAdvertGuid(7)
    mockGetDetail.mockResolvedValueOnce({
      id: catalogGuid,
      type: AdvertType.BOOK,
      ...baseSummary
    })
    mockGetBook.mockRejectedValueOnce({ response: { status: 404 } })

    const advert = await loadAdvertData(catalogGuid, deps)

    expect(advert.title).toBe('Annonce test')
  })

  it('rethrows non-404 errors from typed endpoints', async () => {
    const catalogGuid = encodeCatalogAdvertGuid(3)
    mockGetDetail.mockResolvedValueOnce({
      id: catalogGuid,
      type: AdvertType.SERVICE,
      ...baseSummary
    })
    mockGetService.mockRejectedValueOnce({ statusCode: 500 })

    await expect(loadAdvertData(catalogGuid, deps)).rejects.toMatchObject({ statusCode: 500 })
  })

  it('loads product and service endpoints based on summary type', async () => {
    const productGuid = encodeCatalogAdvertGuid(4)
    mockGetDetail.mockResolvedValueOnce({
      id: productGuid,
      type: AdvertType.PRODUCT,
      ...baseSummary
    })
    mockGetProduct.mockResolvedValueOnce({
      id: 4,
      title: 'Produit complet',
      description: 'Description produit',
      price: 15,
      publicationDate: '2026-01-01T00:00:00Z',
      notificationDate: '2026-06-01T00:00:00Z',
      status: AdvertStatus.ACTIVE,
      userId: 'user-1',
      sellerPseudo: 'seller',
      pictures: [],
      condition: AdvertCondition.USED,
      productCategoryId: 1,
      productCategoryLabel: 'Fournitures'
    })

    const productAdvert = await loadAdvertData(productGuid, deps)
    expect(productAdvert.title).toBe('Produit complet')

    const serviceGuid = encodeCatalogAdvertGuid(5)
    mockGetDetail.mockResolvedValueOnce({
      id: serviceGuid,
      type: AdvertType.SERVICE,
      ...baseSummary
    })
    mockGetService.mockResolvedValueOnce({
      id: 5,
      title: 'Service complet',
      description: 'Description service',
      price: 15,
      publicationDate: '2026-01-01T00:00:00Z',
      notificationDate: '2026-06-01T00:00:00Z',
      status: AdvertStatus.ACTIVE,
      userId: 'user-1',
      sellerPseudo: 'seller',
      subjectId: 1,
      subjectLabel: 'Maths',
      schoolGradeId: 2,
      schoolGradeLabel: 'Collège',
      teachingLanguage: AdvertLanguage.FR,
      studyLevel: 'Cycle 1'
    })

    const serviceAdvert = await loadAdvertData(serviceGuid, deps)
    expect(serviceAdvert.title).toBe('Service complet')
    expect(serviceAdvert.subject).toBe('Maths')
  })
})
