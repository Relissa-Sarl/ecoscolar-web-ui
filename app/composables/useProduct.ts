import type { Product } from '@/types/product'

// Mock data - to be replaced by a real API call
const MOCK_PRODUCT: Omit<Product, 'id'> = {
  title: 'Biology: A Global Approach, 12th Edition',
  authors: 'By Campbell, Urry, Cain, Wasserman',
  category: 'Textbooks',
  condition: 'NEW CONDITION',
  featured: true,
  price: 84.50,
  oldPrice: 115.00,
  image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=800&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1507842072343-583f20270319?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1495446815901-a7297e45aaaf?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=800&fit=crop'
  ],
  isbn: '978-1292341637',
  subject: 'Life Sciences',
  grade: 'Undergraduate',
  school: 'Westfield University',
  description: 'This twelfth edition of the world\'s most successful biology textbook building on the Campbell hallmark standards of accuracy, currency, and the passion for teaching and learning. The authors have synthesized the latest research and most relevant concepts for students. Includes highlight notes from previous owner in Chapter 4 and 7.',
  conditions: [
    { icon: '✓', text: 'No missing pages', color: 'text-green-600' },
    { icon: '✓', text: 'Minimal highlighting', color: 'text-green-600' },
    { icon: '✓', text: 'Smoke-free home', color: 'text-green-600' }
  ],
  seller: {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=J1',
    username: 'j_smith92',
    zip: 'ZIP: 10001',
    rating: 4.8,
    reviews: 142
  },
  questions: [
    {
      id: '1',
      asker: '@edu_learner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EJ',
      timestamp: '3 days ago',
      content: 'Are there many markings in the genetics section?'
    }
  ],
  answers: [
    {
      id: 'a1',
      questionId: '1',
      answerer: 'j_smith92',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=J1',
      timestamp: '1 day ago',
      content: 'Mostly clean! Only a few pencil underlines on page 245 and 247. Can be erased.',
      isSeller: true
    }
  ]
}

export const useProduct = (productId: string) => {
  return useAsyncData<Product>(
    `product:${productId}`,
    () => Promise.resolve({ id: productId, ...MOCK_PRODUCT })
  )
}
