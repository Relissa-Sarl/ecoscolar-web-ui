import type { Advert } from '@/types/advert'
import type { AdvertCatalogDetailApiItem } from '@/types/catalog'
import type { AdvertService } from '@/services/advertService'
import type { CatalogService } from '@/services/catalogService'
import { AdvertType } from '@/utils/enum/advertType'
import {
  mapBookToAdvert,
  mapCatalogSummaryToAdvert,
  mapProductToAdvert,
  mapServiceToAdvert
} from '@/utils/advertDetailMappers'

export function isNotFoundError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null)
    return false

  const fetchError = error as { statusCode?: number, response?: { status?: number } }
  return fetchError.statusCode === 404 || fetchError.response?.status === 404
}

function parseAdvertId(advertId: string): number | null {
  if (!/^\d+$/.test(advertId))
    return null
  const numericId = Number(advertId)
  if (numericId <= 0 || numericId > Number.MAX_SAFE_INTEGER)
    return null
  return numericId
}

async function loadAdvertFromTypedEndpoint(
  advertService: AdvertService,
  summary: AdvertCatalogDetailApiItem,
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
      throw Object.assign(new Error('Type d\'annonce inconnu'), { statusCode: 404 })
  }
}

export interface AdvertLoaderDependencies {
  catalogService: Pick<CatalogService, 'getDetail'>
  advertService: AdvertService
}

export async function loadAdvertData(
  advertId: string,
  { catalogService, advertService }: AdvertLoaderDependencies
): Promise<Advert> {
  const summary = await catalogService.getDetail(advertId)

  const numericId = parseAdvertId(advertId)
  if (numericId === null)
    return mapCatalogSummaryToAdvert(summary)

  try {
    return await loadAdvertFromTypedEndpoint(
      advertService,
      summary,
      advertId,
      numericId
    )
  } catch (error) {
    if (isNotFoundError(error))
      return mapCatalogSummaryToAdvert(summary)
    throw error
  }
}
