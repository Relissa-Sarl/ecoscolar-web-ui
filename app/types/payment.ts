export interface CheckoutRequest {
  productId: number
  productPrice: string
}

export interface CheckoutResponse {
  url: string
}
