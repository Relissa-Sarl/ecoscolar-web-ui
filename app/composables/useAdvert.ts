import type { Advert } from '@/types/advert'
import { getCatalogService } from '~/services/catalogService'
import { getAdvertService } from '~/services/advertService'
import { loadAdvertData } from '~/services/advertLoader'

export const useAdvert = (advertId: string) => {
  const catalogService = getCatalogService()
  const advertService = getAdvertService()

  return useAsyncData<Advert>(
    `advert:${advertId}`,
    () => loadAdvertData(advertId, { catalogService, advertService })
  )
}
