export interface CartItemDto {
  advertId: number
  type: string
  title: string
  price: number
  sellerPseudo: string
  primaryImage: string | null
}

export interface AddToCartDto {
  advertId: number
}
