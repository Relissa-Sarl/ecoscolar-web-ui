import type { Advert } from '@/types/advert'
import mockAdvert from '@/mocks/advert.json'

// Mock data - to be replaced by a real API call (see app/mocks/README.md)
const MOCK_ADVERT = mockAdvert as Omit<Advert, 'id'>

export const useAdvert = (advertId: string) => {
  return useAsyncData<Advert>(
    `advert:${advertId}`,
    () => Promise.resolve({ id: advertId, ...MOCK_ADVERT })
  )
}
