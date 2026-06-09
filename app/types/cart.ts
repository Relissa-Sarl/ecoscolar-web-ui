export interface CartItemDto {
  advertId: number
  type: string
  title: string
  price: number
  sellerPseudo: string
  primaryImage: string | null
  reservedUntil: string | null
  shippingCost: number
}

export interface AddToCartDto {
  advertId: number
}
