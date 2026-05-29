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
  clear: () => {
    mockStore = {}
  }
}

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
  metaLineKey: 'catalog.card.meta_textbooks',
  location: 'Lausanne',
  imageUrl: 'https://example.com/math.jpg',
  hourly: false
})

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('starts with an empty cart and handles item addition', () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalItems).toBe(0)
    expect(cartStore.totalPrice).toBe(0)

    const listing = buildListing('list-1', 25)
    cartStore.addToCart(listing)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].listing.id).toBe('list-1')
    expect(cartStore.items[0].quantity).toBe(1)
    expect(cartStore.totalItems).toBe(1)
    expect(cartStore.totalPrice).toBe(25)
  })

  it('increments quantity when adding the same item multiple times', () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing = buildListing('list-1', 25)

    cartStore.addToCart(listing)
    cartStore.addToCart(listing)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(2)
    expect(cartStore.totalItems).toBe(2)
    expect(cartStore.totalPrice).toBe(50)
  })

  it('removes items correctly', () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing1 = buildListing('list-1', 20)
    const listing2 = buildListing('list-2', 15)

    cartStore.addToCart(listing1)
    cartStore.addToCart(listing2)

    expect(cartStore.items).toHaveLength(2)
    expect(cartStore.totalPrice).toBe(35)

    cartStore.removeFromCart('list-1')
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].listing.id).toBe('list-2')
    expect(cartStore.totalPrice).toBe(15)
  })

  it('updates quantity and removes item if quantity becomes <= 0', () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing = buildListing('list-1', 10)

    cartStore.addToCart(listing)
    cartStore.updateQuantity('list-1', 5)
    expect(cartStore.items[0].quantity).toBe(5)
    expect(cartStore.totalPrice).toBe(50)

    cartStore.updateQuantity('list-1', 0)
    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalPrice).toBe(0)
  })

  it('clears all items successfully', () => {
    const usersStore = useUsersStore()
    usersStore.user = mockUser('user-456')

    const cartStore = useCartStore()
    const listing = buildListing('list-1', 10)

    cartStore.addToCart(listing)
    expect(cartStore.items).toHaveLength(1)

    cartStore.clearCart()
    expect(cartStore.items).toHaveLength(0)
  })

  it('saves and loads cart data from localStorage scoped to user', () => {
    const usersStore = useUsersStore()
    // Setup first user
    usersStore.user = mockUser('user-alpha')

    const cartStoreA = useCartStore()
    const listing = buildListing('list-99', 100)
    cartStoreA.addToCart(listing)

    // Check saved in localStorage under correct key
    expect(mockStore['ecoscolar_cart_user-alpha']).toBeDefined()
    expect(JSON.parse(mockStore['ecoscolar_cart_user-alpha'])[0].listing.id).toBe('list-99')

    // Switch to another user
    usersStore.user = mockUser('user-beta')
    const cartStoreB = useCartStore()
    cartStoreB.loadCart()
    // Cart beta should be empty initially
    expect(cartStoreB.items).toHaveLength(0)

    // Add item for user-beta
    cartStoreB.addToCart(buildListing('list-100', 50))
    expect(mockStore['ecoscolar_cart_user-beta']).toBeDefined()

    // Switch back to user-alpha
    usersStore.user = mockUser('user-alpha')
    cartStoreA.loadCart()
    expect(cartStoreA.items).toHaveLength(1)
    expect(cartStoreA.items[0].listing.id).toBe('list-99')
  })
})
