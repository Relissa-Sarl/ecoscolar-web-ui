import type { CartItem } from '@/types/cart'

export const useCart = () => {
  // useState garde la donnée en mémoire à travers toute l'application
  const cartItems = useState<CartItem[]>('cart', () => [])

  // Fonction pour ajouter un article
  const addToCart = (item: CartItem) => {
    // On vérifie si l'article est déjà dans le panier pour éviter les doublons
    const exists = cartItems.value.find(i => i.id === item.id)
    if (!exists) {
      cartItems.value.push(item)
      return true
    }
    else {
      return false
    }
  }

  // Fonction pour retirer un article
  const removeFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart
  }
}