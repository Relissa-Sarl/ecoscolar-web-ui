import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUsersStore } from '../../app/stores/usersStore'
import { useCartStore } from '../../app/stores/cartStore'
import type { CatalogListing } from '../../app/types/catalog'
import type { User } from '../../app/types/user'

// Setup global mocks for localStorage and process.client
let mockStore: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => mockStore[key] || null,
  setItem: (key: string, value: string) => {
    mockStore[key] = String(value)
  },
  removeItem: (key: string) => {
    const { [key]: _, ...rest } = mockStore
    mockStore = rest
  },
  clear: () => {
    mockStore = {}
  }
}

const mockGetCartItemsFn = vi.fn().mockResolvedValue([])
const mockAddToCartFn = vi.fn().mockResolvedValue({})
const mockRemoveFromCartFn = vi.fn().mockResolvedValue(undefined)

vi.mock('../../app/services/cartService', () => ({
  getCartService: () => ({
    getCartItems: mockGetCartItemsFn,
    addToCart: mockAddToCartFn,
    removeFromCart: mockRemoveFromCartFn
  })
}))

vi.stubGlobal('localStorage', localStorageMock)
vi.stubGlobal('process', {
  ...process,
  client: true
})
vi.stubGlobal('useLocalePath', () => (path: string) => path)

// Helper to build a fully typed mock user
const mockUser = (id: string): User => ({
  id,
  nickname: 'TestUser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@ecoscolar.ch',
  postalCode: '1000',
  birthdayDate: '2010-01-01',
  isOnboarded: true,
  location: { postalCode: '1000', city: 'Lausanne', region: 'Vaud' },
  spokenLanguages: []
})

// Helper to build a mock catalog item
const buildListing = (id: string, price = 10, title = 'Math book'): CatalogListing => ({
  id,
  title,
  price,
  categoryTab: 'textbooks',
  location: 'Lausanne',
  imageUrl: 'https://example.com/math.jpg',
  hourly: false
})

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    mockGetCartItemsFn.mockReset().mockResolvedValue([])
    mockAddToCartFn.mockReset().mockResolvedValue({})
    mockRemoveFromCartFn.mockReset().mockResolvedValue(undefined)
    vi.clearAllMocks()
  })

  it('starts with an empty cart and handles item addition', async () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalItems).toBe(0)
    expect(cartStore.totalPrice).toBe(0)

    const listing = buildListing('list-1', 25)
    await cartStore.addToCart(listing)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].listing.id).toBe('list-1')
    expect(cartStore.items[0].quantity).toBe(1)
    expect(cartStore.totalItems).toBe(1)
    expect(cartStore.totalPrice).toBe(25)
  })

  it('does not increment quantity when adding the same item multiple times', async () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing = buildListing('list-1', 25)

    await cartStore.addToCart(listing)
    await cartStore.addToCart(listing)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(1)
    expect(cartStore.totalItems).toBe(1)
    expect(cartStore.totalPrice).toBe(25)
  })

  it('removes items correctly', async () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing1 = buildListing('list-1', 20)
    const listing2 = buildListing('list-2', 15)

    await cartStore.addToCart(listing1)
    await cartStore.addToCart(listing2)

    expect(cartStore.items).toHaveLength(2)
    expect(cartStore.totalPrice).toBe(35)

    await cartStore.removeFromCart('list-1')
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].listing.id).toBe('list-2')
    expect(cartStore.totalPrice).toBe(15)
  })

  it('updates quantity and removes item if quantity becomes <= 0', async () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing = buildListing('list-1', 10)

    await cartStore.addToCart(listing)
    await cartStore.updateQuantity('list-1', 5)
    expect(cartStore.items[0].quantity).toBe(5)
    expect(cartStore.totalPrice).toBe(50)

    await cartStore.updateQuantity('list-1', 0)
    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalPrice).toBe(0)
  })

  it('clears all items successfully', async () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing = buildListing('list-1', 10)

    await cartStore.addToCart(listing)
    expect(cartStore.items).toHaveLength(1)

    await cartStore.clearCart()
    expect(cartStore.items).toHaveLength(0)
  })

  it('saves and loads cart data from localStorage', async () => {
    const usersStore = useUsersStore()
    usersStore.user = null

    const cartStore = useCartStore()
    const listing = buildListing('list-99', 100)
    await cartStore.addToCart(listing)

    // Check saved in localStorage under correct key
    expect(mockStore['ecoscolar_cart']).toBeDefined()
    expect(JSON.parse(mockStore['ecoscolar_cart'])[0].listing.id).toBe('list-99')

    // Reloading cart should restore items
    cartStore.items = []
    expect(cartStore.items).toHaveLength(0)
    await cartStore.loadCart(true)
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].listing.id).toBe('list-99')
  })

  it('syncs guest cart to API when user logs in', async () => {
    const usersStore = useUsersStore()
    usersStore.user = null // start unauthenticated

    const cartStore = useCartStore()
    const listing = buildListing('99', 100)
    await cartStore.addToCart(listing)

    // Verify it is saved locally
    expect(mockStore['ecoscolar_cart']).toBeDefined()

    // Configure backend mock API responses BEFORE authenticating to catch spied calls from watcher
    mockGetCartItemsFn.mockResolvedValue([
      {
        advertId: 99,
        type: 'BOOK',
        title: 'Math book',
        price: 100,
        sellerPseudo: 'Seller',
        primaryImage: 'https://example.com/math.jpg'
      }
    ])
    mockAddToCartFn.mockResolvedValue({
      advertId: 99,
      type: 'BOOK',
      title: 'Math book',
      price: 100,
      sellerPseudo: 'Seller',
      primaryImage: 'https://example.com/math.jpg'
    })

    // Now login (authenticate) which triggers the watch (manually call loadCart(true) in test to bypass scheduler differences)
    usersStore.user = mockUser('user-456')
    await cartStore.loadCart(true)

    // Verify API methods were called
    expect(mockAddToCartFn).toHaveBeenCalledWith({ advertId: 99 })
    expect(mockGetCartItemsFn).toHaveBeenCalled()

    // Verify localStorage guest cart was cleared
    expect(mockStore['ecoscolar_cart']).toBeUndefined()

    // Verify items in store
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].listing.id).toBe('99')
  })
})
