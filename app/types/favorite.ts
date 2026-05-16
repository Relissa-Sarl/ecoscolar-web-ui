import type { Advert } from '@/types/advert'

// Annonce en version courte (ajouté aux favoris)
export type FavoriteAdvertSummary = Pick<
  Advert,
  'id' | 'title' | 'category' | 'condition' | 'price' | 'image'
>

// Rélation entre une annonce et un "favori"
export interface FavoriteAdvert {
  id: string
  advertId: string
  createdAt: string
  advert: FavoriteAdvertSummary
}

// Donnés pour ajouter ou retirer une annonce des favoris
export interface FavoriteAdvertInput {
  advertId: string
  advert?: FavoriteAdvertSummary
}
