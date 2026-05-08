<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

// Mock data - à remplacer par l'API
const product = {
  id: route.params.id,
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
  }
}

const selectedImage = ref(product.image)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Breadcrumb -->
    <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3">
      <nav class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
        <NuxtLink to="/" class="hover:text-gray-900 dark:hover:text-gray-300">Shop</NuxtLink>
        <span>/</span>
        <span>Textbooks</span>
        <span>/</span>
        <span class="text-gray-900 dark:text-gray-100 font-medium">{{ product.title }}</span>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Image Gallery -->
        <div class="lg:col-span-2">
          <!-- Main Image -->
          <div class="bg-red-700 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
            <NuxtImg
              :src="selectedImage"
              :alt="product.title"
              class="w-full h-full object-cover"
              width="600"
              height="800"
            />
          </div>

          <!-- Thumbnail Gallery -->
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(img, idx) in product.images"
              :key="idx"
              @click="selectedImage = img"
              class="cursor-pointer rounded overflow-hidden border-2 transition-all"
              :class="selectedImage === img ? 'border-gray-900 dark:border-gray-100' : 'border-gray-300 dark:border-gray-700'"
            >
              <NuxtImg
                :src="img"
                :alt="`Image ${idx + 1}`"
                class="w-full h-20 object-cover"
                width="100"
                height="100"
              />
            </div>
            <div class="rounded overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer">
              <span class="text-sm text-gray-500">📷</span>
            </div>
            <div class="rounded overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer">
              <span class="text-sm text-gray-500">🎥</span>
            </div>
          </div>
        </div>

        <!-- Right: Product Details -->
        <div class="lg:col-span-1">
          <!-- Tags -->
          <div class="flex gap-2 mb-4">
            <UBadge color="primary" variant="soft">{{ product.condition }}</UBadge>
            <UBadge color="success" variant="soft" v-if="product.featured">FEATURED</UBadge>
          </div>

          <!-- Title -->
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ product.title }}
          </h1>

          <!-- Authors -->
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ product.authors }}</p>

          <!-- Price -->
          <div class="mb-6">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">${{ product.price.toFixed(2) }}</span>
              <span class="text-lg text-gray-500 line-through">${{ product.oldPrice.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Metadata Grid -->
          <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">ISBN-13</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ product.isbn }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">Subject</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ product.subject }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">Grade</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ product.grade }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">School</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ product.school }}</p>
            </div>
          </div>

          <!-- Seller Info -->
          <div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
            <UAvatar
              :src="product.seller.avatar"
              :alt="product.seller.username"
              size="lg"
            />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ product.seller.username }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">📍 {{ product.seller.zip }}</p>
            </div>
            <UButton color="neutral" variant="outline">View Profile</UButton>
          </div>

          <!-- Action Buttons -->
          <ProductActionButtons :product-id="product.id" />
        </div>
      </div>

      <!-- Description Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div class="lg:col-span-2">
          <ProductDescription :description="product.description" />
        </div>

        <!-- Condition Details -->
        <ProductConditionDetails :conditions="product.conditions" />
      </div>

      <!-- Public Questions Section -->
      <div class="mt-12 bg-white dark:bg-gray-950 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Public Questions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">3 Questions asked</p>
        </div>

        <!-- Question Input -->
        <div class="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Ask the seller a question..."
            class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <UButton size="lg" class="bg-green-700 hover:bg-green-800">
            →
          </UButton>
        </div>

        <!-- Questions List -->
        <div class="space-y-6">
          <!-- Question 1 -->
          <div class="border-b border-gray-200 dark:border-gray-800 pb-6">
            <div class="flex items-start gap-3 mb-3">
              <UAvatar
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=EJ"
                alt="EL"
                size="sm"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">@edu_learner</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 ml-12 mb-4">
              Are there many markings in the genetics section?
            </p>
          </div>

          <!-- Answer 1 -->
          <div class="ml-8 mb-6">
            <div class="flex items-start gap-3 mb-3">
              <UAvatar
                :src="product.seller.avatar"
                :alt="product.seller.username"
                size="sm"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ product.seller.username }} <span class="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded ml-2">SELLER</span></p>
                <p class="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 ml-12">
              Mostly clean! Only a few pencil underlines on page 245 and 247. Can be erased.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
