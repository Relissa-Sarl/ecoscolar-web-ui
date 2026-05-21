import type { Advert } from '@/types/advert'

// Annonce en version courte (ajouté aux favoris)
export type FavoriteAdvertSummary = Pick<
  Advert,
  'id' | 'title' | 'type' | 'condition' | 'price' | 'image'
>

/** Identifiant annonce côté UI (comparaisons, routes) — l'API renvoie `id` en number. */
export const getFavoriteAdvertId = (favorite: FavoriteAdvert): string => String(favorite.id)

// Rélation entre une annonce et un "favori"
export interface FavoriteAdvert {
  id: number
  type: string
  title: string
  price: number
  publicationDate: string
  notificationDate: string
  status: string
  userId: string
  sellerPseudo: string
  primaryImage: string
}

// Donnés pour ajouter ou retirer une annonce des favoris
export interface FavoriteAdvertInput {
  advertId: string | number
  advert?: FavoriteAdvertSummary
}
