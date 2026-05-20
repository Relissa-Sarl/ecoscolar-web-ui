import type { Advert } from '@/types/advert'
import { AdvertType } from '@/utils/enum/advertType'
import { getCatalogService } from '~/services/catalogService'
import { getAdvertService } from '~/services/advertService'
import { tryParseCatalogAdvertId } from '~/utils/catalogGuid'
import {
  mapBookToAdvert,
  mapCatalogSummaryToAdvert,
  mapProductToAdvert,
  mapServiceToAdvert
} from '~/utils/enum/advertDetailMappers'

async function loadAdvertFromTypedEndpoint(
  advertService: ReturnType<typeof getAdvertService>,
  summary: Awaited<ReturnType<ReturnType<typeof getCatalogService>['getDetail']>>,
  advertId: string,
  numericId: number
): Promise<Advert> {
  switch (summary.type) {
    case AdvertType.BOOK:
      return mapBookToAdvert(await advertService.getBook(numericId), advertId)
    case AdvertType.PRODUCT:
      return mapProductToAdvert(await advertService.getProduct(numericId), advertId)
    case AdvertType.SERVICE:
      return mapServiceToAdvert(await advertService.getService(numericId), advertId)
    default:
      throw createError({
        statusCode: 404,
        statusMessage: 'Type d\'annonce inconnu'
      })
  }
}

export const useAdvert = (advertId: string) => {
  const catalogService = getCatalogService()
  const advertService = getAdvertService()

  return useAsyncData<Advert>(
    `advert:${advertId}`,
    async () => {
      const summary = await catalogService.getDetail(advertId)

      const numericId = tryParseCatalogAdvertId(advertId)
      if (numericId === null)
        return mapCatalogSummaryToAdvert(summary)

      try {
        return await loadAdvertFromTypedEndpoint(
          advertService,
          summary,
          advertId,
          numericId
        )
      } catch {
        return mapCatalogSummaryToAdvert(summary)
      }
    }
  )
}
