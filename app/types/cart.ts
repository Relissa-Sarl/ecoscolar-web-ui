export interface CartItemDto {
  advertId: number
  type: string
  title: string
  price: number
  sellerPseudo: string
  primaryImage: string | null
  shippingCost: number
  status: string
}

export interface AddToCartDto {
  advertId: number
}
