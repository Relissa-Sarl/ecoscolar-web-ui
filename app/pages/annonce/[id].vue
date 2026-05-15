<script setup lang="ts">
const route = useRoute()
const { data: advert } = await useAdvert(String(route.params.id))

const breadcrumbItems = computed(() => [
  { label: 'Shop', to: '/' },
  { label: advert.value?.category || '', to: undefined },
  { label: advert.value?.title || '', to: undefined }
])

const handleAskQuestion = (_text: string) => {
  // TODO: send question to API
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
            :images="advert?.images || []"
            :title="advert?.title || ''"
          />
        </div>

        <!-- Right: Advert Details -->
        <div class="lg:col-span-1">
          <ProductInfo
            v-if="advert"
            :condition="advert.condition"
            :featured="advert.featured"
            :title="advert.title"
            :authors="advert.authors"
            :price="advert.price"
            :old-price="advert.oldPrice"
          />
          <ProductMetadata
            v-if="advert"
            :isbn="advert.isbn"
            :subject="advert.subject"
            :grade="advert.grade"
            :school="advert.school"
          />
          <SellerCard
            v-if="advert"
            :seller="advert.seller"
            @view-profile="() => {}"
          />
          <ProductActionButtons :product-id="advert?.id" />
        </div>
      </div>

      <!-- Description Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div class="lg:col-span-2">
          <ProductDescription :description="advert?.description || ''" />
        </div>

        <!-- Condition Details -->
        <ProductConditionDetails :conditions="advert?.conditions || []" />
      </div>

      <!-- Public Questions Section -->
      <div class="mt-12">
        <PublicQuestions
          v-if="advert"
          :seller="advert.seller"
          :questions="advert.questions || []"
          :answers="advert.answers || []"
          @ask-question="handleAskQuestion"
        />
      </div>
    </div>
  </div>
</template>
