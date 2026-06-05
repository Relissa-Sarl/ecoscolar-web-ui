import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadAdvertData } from '../../app/services/advertLoader'
import { AdvertCondition } from '../../app/utils/enum/advertCondition'
import { AdvertLanguage } from '../../app/utils/enum/advertLanguage'
import { AdvertStatus } from '../../app/utils/enum/advertStatus'
import { AdvertType } from '../../app/utils/enum/advertType'

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

  it('loads summary only when route id is not a plain digit string', async () => {
    const advertId = 'not-an-id'
    mockGetDetail.mockResolvedValueOnce({
      id: 1,
      type: AdvertType.BOOK,
      ...baseSummary,
      isbn: '978-mock'
    })

    const advert = await loadAdvertData(advertId, deps)

    expect(mockGetDetail).toHaveBeenCalledWith(advertId)
    expect(mockGetBook).not.toHaveBeenCalled()
    expect(advert.title).toBe('Annonce test')
    expect(advert.seller.username).toBe('')
  })

  it('loads summary only for scientific-notation-like ids', async () => {
    const advertId = '1e3'
    mockGetDetail.mockResolvedValueOnce({
      id: 1,
      type: AdvertType.BOOK,
      ...baseSummary
    })

    const advert = await loadAdvertData(advertId, deps)

    expect(mockGetBook).not.toHaveBeenCalled()
    expect(advert.title).toBe('Annonce test')
  })

  it('loads typed book detail when id is numeric', async () => {
    const advertId = '1'
    mockGetDetail.mockResolvedValueOnce({
      id: 1,
      type: AdvertType.BOOK,
      ...baseSummary
    })
    mockGetBook.mockResolvedValueOnce(baseBook)

    const advert = await loadAdvertData(advertId, deps)

    expect(mockGetBook).toHaveBeenCalledWith(1)
    expect(advert.title).toBe('Livre complet')
    expect(advert.authors).toBe('Auteur')
  })

  it('falls back to summary on typed endpoint 404', async () => {
    const advertId = '2'
    mockGetDetail.mockResolvedValueOnce({
      id: 2,
      type: AdvertType.PRODUCT,
      ...baseSummary
    })
    mockGetProduct.mockRejectedValueOnce({ statusCode: 404 })

    const advert = await loadAdvertData(advertId, deps)

    expect(mockGetProduct).toHaveBeenCalledWith(2)
    expect(advert.title).toBe('Annonce test')
  })

  it('falls back to summary on typed endpoint response.status 404', async () => {
    const advertId = '7'
    mockGetDetail.mockResolvedValueOnce({
      id: 7,
      type: AdvertType.BOOK,
      ...baseSummary
    })
    mockGetBook.mockRejectedValueOnce({ response: { status: 404 } })

    const advert = await loadAdvertData(advertId, deps)

    expect(advert.title).toBe('Annonce test')
  })

  it('rethrows non-404 errors from typed endpoints', async () => {
    const advertId = '3'
    mockGetDetail.mockResolvedValueOnce({
      id: 3,
      type: AdvertType.SERVICE,
      ...baseSummary
    })
    mockGetService.mockRejectedValueOnce({ statusCode: 500 })

    await expect(loadAdvertData(advertId, deps)).rejects.toMatchObject({ statusCode: 500 })
  })

  it('loads product and service endpoints based on summary type', async () => {
    const productId = '4'
    mockGetDetail.mockResolvedValueOnce({
      id: 4,
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

    const productAdvert = await loadAdvertData(productId, deps)
    expect(productAdvert.title).toBe('Produit complet')

    const serviceId = '5'
    mockGetDetail.mockResolvedValueOnce({
      id: 5,
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

    const serviceAdvert = await loadAdvertData(serviceId, deps)
    expect(serviceAdvert.title).toBe('Service complet')
    expect(serviceAdvert.subject).toBe('Maths')
  })
})
