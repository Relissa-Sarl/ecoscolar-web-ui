<script setup lang="ts">
const route = useRoute()
const { product } = useProduct(String(route.params.id))

const breadcrumbItems = computed(() => [
  { label: 'Shop', to: '/' },
  { label: product.value?.category || '', to: undefined },
  { label: product.value?.title || '', to: undefined }
])

const handleAskQuestion = (text: string) => {
  console.log('Question asked:', text)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Image Gallery -->
        <div class="lg:col-span-2">
          <ProductGallery
            :images="product?.images || []"
            :title="product?.title || ''"
          />
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
      <div class="mt-12">
        <PublicQuestions
          v-if="product"
          :seller="product.seller"
          :questions="product.questions || []"
          :answers="product.answers || []"
          @ask-question="handleAskQuestion"
        />
      </div>
    </div>
  </div>
</template>
