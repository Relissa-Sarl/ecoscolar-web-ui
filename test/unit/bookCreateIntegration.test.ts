import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdvertService } from '../../app/services/advertService'
import { AdvertCondition } from '../../app/utils/enum/advertCondition'
import { AdvertLanguage } from '../../app/utils/enum/advertLanguage'

describe('T8-3 · intégration création annonce livre (advertService → API)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envoie POST /adverts/books avec le payload livre', async () => {
    const apiClient = vi.fn().mockResolvedValue(undefined)
    const service = createAdvertService({ apiClient })

    const payload = {
      title: 'Manuel de biologie',
      description: 'Livre en bon état pour le gymnase.',
      price: 25,
      author: 'A. Dupont',
      publisher: 'Helbing',
      edition: '3e',
      isbn: '978-3-16-148410-0',
      bookCategoryId: 1,
      writtenLanguage: AdvertLanguage.FR,
      condition: AdvertCondition.NEW
    }

    await service.createBookAdvert(payload)

    expect(apiClient).toHaveBeenCalledWith('/adverts/books', {
      method: 'POST',
      body: payload
    })
  })

  it('accepte un payload minimal pour POST /adverts/books', async () => {
    const apiClient = vi.fn().mockResolvedValue(undefined)
    const service = createAdvertService({ apiClient })

    await service.createBookAdvert({ title: 'Brouillon' })

    expect(apiClient).toHaveBeenCalledWith('/adverts/books', {
      method: 'POST',
      body: { title: 'Brouillon' }
    })
  })
})
