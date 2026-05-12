type DummyJsonProduct = {
  id: number
  title: string
  price: number
}

type DummyJsonProductsResponse = {
  products: DummyJsonProduct[]
}

type DummyJsonProductsParams = {
  q?: string
}

export async function getDummyjsonProducts(params?: DummyJsonProductsParams) {
  const query = params?.q?.trim()

  return useApi<DummyJsonProductsResponse>(query ? '/products/search' : '/products', {
    skipAuth: true,
    query: query ? { q: query } : undefined
  })
}

export type { DummyJsonProduct, DummyJsonProductsResponse }
