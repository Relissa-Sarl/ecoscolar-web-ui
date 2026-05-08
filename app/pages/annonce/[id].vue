<script setup lang="ts">
const route = useRoute()
const { product } = useProduct(String(route.params.id))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Breadcrumb :category="product?.category || ''" :product-title="product?.title || ''" :items="[]" />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Image Gallery -->
        <div class="lg:col-span-2">
          <ProductGallery :images="product?.images || []" :title="product?.title || ''" />
        </div>

        <!-- Right: Product Details -->
        <div class="lg:col-span-1">
          <ProductInfo
            v-if="product"
            :condition="product.condition"
            :featured="product.featured"
            :title="product.title"
            :authors="product.authors"
            :price="product.price"
            :old-price="product.oldPrice"
          />
          <ProductMetadata
            v-if="product"
            :isbn="product.isbn"
            :subject="product.subject"
            :grade="product.grade"
            :school="product.school"
          />
          <SellerCard
            v-if="product"
            :seller="product.seller"
            @view-profile="() => {}"
          />
          <ProductActionButtons :product-id="product?.id" />
        </div>
      </div>

      <!-- Description Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div class="lg:col-span-2">
          <ProductDescription :description="product?.description || ''" />
        </div>

        <!-- Condition Details -->
        <ProductConditionDetails :conditions="product?.conditions || []" />
      </div>

      <!-- Public Questions Section -->
      <div class="mt-12 bg-white dark:bg-gray-950 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Public Questions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ product?.questions?.length || 0 }} Questions asked</p>
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
        <div class="space-y-6" v-if="product?.questions?.length">
          <div v-for="question in product.questions" :key="question.id">
            <!-- Question -->
            <div class="border-b border-gray-200 dark:border-gray-800 pb-6">
              <div class="flex items-start gap-3 mb-3">
                <UAvatar :src="question.avatar" :alt="question.asker" size="sm" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ question.asker }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ question.timestamp }}</p>
                </div>
              </div>
              <p class="text-gray-700 dark:text-gray-300 ml-12 mb-4">{{ question.content }}</p>
            </div>

            <!-- Answers -->
            <div v-for="answer in product.answers?.filter(a => a.questionId === question.id)" :key="answer.id" class="ml-8 mb-6">
              <div class="flex items-start gap-3 mb-3">
                <UAvatar :src="answer.avatar" :alt="answer.answerer" size="sm" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ answer.answerer }}
                    <span v-if="answer.isSeller" class="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded ml-2">SELLER</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ answer.timestamp }}</p>
                </div>
              </div>
              <p class="text-gray-700 dark:text-gray-300 ml-12">{{ answer.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
